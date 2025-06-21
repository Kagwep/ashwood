import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import InitGame from "./InitGame";
import AshwoodAbout from './components/About';




function App() {

 
  return (
    <BrowserRouter>
       
        <Routes>
            <Route path="/" element={<InitGame />} />
            <Route path="/about" element={<AshwoodAbout />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
}

export default App;