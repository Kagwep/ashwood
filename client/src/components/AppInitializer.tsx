import { init, type SDK } from "@dojoengine/sdk";
import { DojoContextProvider } from "../dojo/DojoContext";
import { BurnerManager, setupBurnerManager } from "@dojoengine/create-burner";
import App from "../App";
import Intro from "./Intro";
import { useOnboarding } from "../context/OnboardingContext";
import type { AshwoodSchemaType } from "../dojogen/models.gen";
import { useEffect, useState } from "react";
import { AlertTriangle, Icon, Shield, Trophy,  } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import { NetworkAccountProvider } from "../context/WalletContex";
import { useAshwoodStore } from "../utils/ashwood";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { getNetworkConstants } from "../constants";
import { createDojoConfig } from "@dojoengine/core";
import { useNetwork } from "../context/NetworkContext";
import NetworkSelector from "./NetworkSelector";
import { soccerBall } from '@lucide/lab';
import TacticalCommandHomepage from "../pages/HomePage";

interface AppInitializerProps {
    clientFn: any,
    skipNetworkSelection?: boolean,
}

interface InitializationError {
    code: 'SQUAD_SETUP_FAILED' | 'SERVER_ERROR' | 'AUTHENTICATION_FAILED' | 'UNKNOWN';
    message: string;
    details?: string;
}

const ErrorScreen: React.FC<{ error: InitializationError }> = ({ error }) => (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-green-800/50 backdrop-blur-sm rounded-lg border border-red-500/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <Icon iconNode={soccerBall} />
            </div>
            <h2 className="text-red-500 font-mono text-lg mb-2">
                TOUCHLINE CONNECTION FAILURE
            </h2>
            <div className="space-y-4">
                <p className="text-red-400/80 font-mono text-sm">
                    Error Code: {error.code}
                </p>
                <p className="text-red-400/60 font-mono text-sm">
                    {error.message}
                </p>
                {error.details && (
                    <div className="bg-black/30 rounded p-3 font-mono text-xs">
                        <p className="text-red-500/60">$ {error.details}</p>
                    </div>
                )}
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 
                             font-mono text-sm py-2 rounded transition-colors"
                >
                    RETRY CONNECTION
                </button>
            </div>
        </div>
    </div>
);

const AppInitializer: React.FC<AppInitializerProps> = ({clientFn, skipNetworkSelection = false}) => {
    const { isOnboarded, completeOnboarding } = useOnboarding();
    const [burnerManager, setBurnerManager] = useState<BurnerManager | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<InitializationError | null>(null);
    const [initializationStep, setInitializationStep] = useState(0);
    const [showTitleScreen, setShowTitleScreen] = useState(true);
    const [serverSelected, setServerSelected] = useState(skipNetworkSelection);
    
    const { network, dojoConfig } = useNetwork();

    const [sdk, setSdk] = useState<SDK<AshwoodSchemaType>|null>(null);

    useEffect(() => {
        // Sync dojoConfig with CardStore if needed
        if (dojoConfig) {
            useAshwoodStore.getState().setDojoConfig(dojoConfig);
        }
        
        // Sync network with CardStore if needed
        if (network) {
            useAshwoodStore.getState().setNetwork(network);
        }
    }, [dojoConfig, network]);
  
    useEffect(() => {
        // Only start initialization after network is set and user is onboarded
        if (!isOnboarded || !network || !dojoConfig) {
            return;
        }

        const networkConstants = getNetworkConstants(network);

        if (network === "sepolia" && import.meta.env.VITE_SEPOLIA !== 'true') {
            console.error("Server mismatch: Selected Sepolia but VITE_SEPOLIA is not set to true");
            throw new Error("Environment configuration mismatch for Sepolia server");
        }
        
        if (network === "mainnet" && import.meta.env.VITE_MAINNET !== 'true') {
            console.error("Server mismatch: Selected Mainnet but VITE_MAINET is not set to true");
            throw new Error("Environment configuration mismatch for Mainnet server");
        }

        const initializeSDK = async () => {
            const sdk = await init<AshwoodSchemaType>(
                {
                    client: {
                        toriiUrl: networkConstants.TORII_URL,
                        relayUrl: dojoConfig.relayUrl,
                        worldAddress: dojoConfig.manifest.world.address,
                    },
                    domain: {
                        name: "Ashwood",
                        version: "1.0",
                        chainId: "KATANA",
                        revision: "1",
                    },
                },
            );
            
        setSdk(sdk);
        }

        const initializeGame = async () => {
            try {
                setIsLoading(true);
                
                if (network === 'katana') {
                    // Step 1: Setup player wallet
                    setInitializationStep(1);
                    const manager = await setupBurnerManager(dojoConfig);
                    if (!manager) {
                        throw {
                            code: 'SQUAD_SETUP_FAILED',
                            message: 'Failed to initialize your player squad'
                        };
                    }
                    setBurnerManager(manager);

                    // Step 2: Verify server connection
                    setInitializationStep(2);
                    const serverStatus = await checkServerConnection();
                    if (!serverStatus.connected) {
                        throw {
                            code: 'SERVER_ERROR',
                            message: 'Game server connection unstable',
                            details: serverStatus.error
                        };
                    }
                  
                    // Step 3: Authentication
                    setInitializationStep(3);
                    if (!manager.account) {
                        throw {
                            code: 'AUTHENTICATION_FAILED',
                            message: 'Failed to authenticate coach credentials'
                        };
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Game initialization error:", err);
                setError(err as InitializationError || {
                    code: 'UNKNOWN',
                    message: 'Critical game failure',
                    details: err instanceof Error ? err.message : 'Unknown error occurred'
                });
                setIsLoading(false);
            }
        };

        initializeSDK();
        initializeGame();
    }, [isOnboarded, network, dojoConfig?.manifest?.world.address]);

    const getLoadingMessage = () => {
        switch (initializationStep) {
            case 1:
                return "Building your squad roster...";
            case 2:
                return "Connecting to stadium servers...";
            case 3:
                return "Verifying coach credentials...";
            default:
                return "Loading Touchline Soccer Match Attacks...";
        }
    };

    // If skipServerSelection=true, we skip these screens
    if (!skipNetworkSelection) {
        // If showing title screen
        if (showTitleScreen) {
            return <TacticalCommandHomepage onStartGame={() => setShowTitleScreen(false)} />;
        }
        
        // Next, select server if not selected yet
        if (!serverSelected) {
            return <NetworkSelector onNetworkSelected={(selectedServer) => {
                useNetwork().setNetwork(selectedServer);
                setServerSelected(true);
            }} />;
        }
    }
    
    // First, show Intro if not onboarded
    if (!isOnboarded) {
        return <Intro onOnboardComplete={completeOnboarding} />;
    }

    // Then, wait for network to be set
    if (!network) {
        return <LoadingScreen message="Selecting your league server..." />;
    }

    // Then show other states
    if (isLoading) {
        return <LoadingScreen message={getLoadingMessage()} />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    if (!burnerManager && network === 'katana') {
        return <ErrorScreen 
            error={{
                code: 'UNKNOWN',
                message: 'Critical team initialization failure',
                details: 'Unable to set up your player squad'
            }}
        />;
    }

    return (
        <DojoSdkProvider
        sdk={sdk}
        dojoConfig={dojoConfig}
        clientFn={clientFn}
    >
            <DojoContextProvider dojoConfig={dojoConfig} burnerManager={burnerManager}>
                <NetworkAccountProvider>
                    <App />
                </NetworkAccountProvider>
            </DojoContextProvider>
        </DojoSdkProvider>
    );
};

// Utility function to check server connection
const checkServerConnection = async () => {
    try {
        // Add your server checking logic here
        // For example, checking if you can reach the game server
        return { connected: true };
    } catch (error) {
        return { 
            connected: false, 
            error: error instanceof Error ? error.message : 'Unknown server error' 
        };
    }
};

export default AppInitializer;