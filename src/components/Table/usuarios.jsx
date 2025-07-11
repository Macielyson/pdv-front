import React, { useState } from "react";
import Table from "./index";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "Admin", email: "admin@email.com", tipo: "adm" },
    { id: 2, nome: "Fulano", email: "fulano@email.com", tipo: "user" },
  ]);

  const handleExcluir = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const colunas = [
    { titulo: "Nome", campo: "nome" },
    { titulo: "Email", campo: "email" },
    { titulo: "Tipo", campo: "tipo" },
  ];

  return (
    <div>
      <h3>Lista de Usuários</h3>
      <Table colunas={colunas} dados={usuarios} onExcluir={handleExcluir} />
    </div>
  );
};

export default Usuarios;
