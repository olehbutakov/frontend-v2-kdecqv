import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home/Home.tsx';
import { Applications } from './pages/Applications/Applications.tsx';
import { ApplicationPage } from './pages/ApplicationPage/ApplicationPage.tsx';
import { Header } from './components/common/Header/Header.tsx';

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationPage />} />
      </Routes>
    </div>
  );
}

export default App;
