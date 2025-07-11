import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LayoutPadrao from './components/LayoutPadrao';

import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Usuarios from './pages/Usuarios';
import Vendas from './pages/Vendas';
import Historico from './pages/Historico'
import Categorias from './pages/Categorias';
import Carnes from './pages/Carnes';
import Login from './pages/Login';
import Orcamento from './pages/Orcamentos';

function AppRoutes() {
  return (
    <Router>

      <Routes>
        {/* Login sem layout */}
        <Route path='/' element={<Login />} />

        {/* Rotas internas com layout padrão */}
        <Route path='/home' element={<LayoutPadrao><Home /></LayoutPadrao>} />
        <Route path='/produtos' element={<LayoutPadrao><Produtos /></LayoutPadrao>} />
        <Route path='/clientes' element={<LayoutPadrao><Clientes /></LayoutPadrao>} />
        <Route path='/usuarios' element={<LayoutPadrao><Usuarios /></LayoutPadrao>} />
        <Route path='/vendas' element={<LayoutPadrao><Vendas /></LayoutPadrao>} />
        <Route path='/categorias' element={<LayoutPadrao><Categorias /></LayoutPadrao>} />
        <Route path='/pendentes' element={<LayoutPadrao><Carnes /></LayoutPadrao>} />
        <Route path='/historico' element={<LayoutPadrao><Historico /></LayoutPadrao>} />
        <Route path='/orcamentos' element={<LayoutPadrao><Orcamento /></LayoutPadrao>} />
      </Routes>
    </Router >
  )
}

export default AppRoutes;
