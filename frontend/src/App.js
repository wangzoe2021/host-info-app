import './App.css';
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
         <div className="App">
            <h1>IP or Domain Lookup</h1>
            <div id='page-body'>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </div>
        </div>
    </BrowserRouter>
  );
}

export default App;