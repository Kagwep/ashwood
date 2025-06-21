import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ApolloProvider } from '@apollo/client'
import AppRoot from "./AppRoot.tsx";
import { ToastContainer } from 'react-toastify';
import { ApollClient } from './utils/apollo/client.ts';


/**
 * Initializes and bootstraps the Dojo application.
 * Sets up the SDK, burner manager, and renders the root component.
 *
 * @throws {Error} If initialization fails
 */
async function main() {


  createRoot(document.getElementById("root")!).render(
      <StrictMode>
          <ApolloProvider client={ApollClient}>
             <AppRoot />
             <ToastContainer />
          </ApolloProvider>
      </StrictMode>
  );
}

main().catch((error) => {
  console.error("Failed to initialize the application:", error);
});
