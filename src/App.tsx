import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home.tsx';
import { Applications } from './pages/Applications.tsx';
import { ApplicationForm } from './pages/ApplicationForm.tsx';
import { Header } from './components/common/Header/Header.tsx';

/**
 * TODO:
 * 2. Create common components (button, input) probably that's it for now
 * 3. Create product card component
 * 4. Create applications table component
 * 5. Write all tests for these components
 */

function App() {
  return (
    <div className="app">
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationForm />} />
        </Routes>
    </div>
  );
}

export default App;
