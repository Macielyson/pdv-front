import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="col-2 bg-light border-end h-100"
    >
      <h5 className="text-primary mb-4">PDV</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/Home" className="nav-link text-dark">
            Home
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/clientes" className="nav-link text-dark">
            Clientes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/usuarios" className="nav-link text-dark">
            Usuários
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/categorias" className="nav-link text-dark">
            Categorias
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/produtos" className="nav-link text-dark">
            Produtos
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/vendas" className="nav-link text-dark">
            Vendas
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/historico" className="nav-link text-dark">
            Historico
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/pendentes" className="nav-link text-dark">
            Pendentes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/orcamentos" className="nav-link text-dark">
            Oramentos
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
