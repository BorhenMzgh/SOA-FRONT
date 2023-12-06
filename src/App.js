import './App.css';
import ClientList from './Pages/ClientList';
import FactureList from './Pages/FactureList';
import {Route,Routes,BrowserRouter as Router} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import FactureParClient from './Pages/FactureParClient';

function App() {
  return (
    <>
    <Router>

<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/getFactures/:clientId" element={<FactureParClient />} />
<Route path="/clients" element={<ClientList />} />
<Route path="/factures" element={<FactureList/>} /> 

</Routes>
</Router>
    </>
  );
}

export default App;
