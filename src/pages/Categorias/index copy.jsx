import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("categorias")) || [];
    setCategorias(saved);
  }, []);

  const salvarLocalStorage = (lista) => {
    localStorage.setItem("categorias", JSON.stringify(lista));
  };

  const handleSalvar = () => {
    if (nome.trim() === "") return;

    const novaCategoria = { id: Date.now(), nome };
    const atualizadas = [...categorias, novaCategoria];
    setCategorias(atualizadas);
    salvarLocalStorage(atualizadas);
    setNome("");
    setShowModal(false);
  };

  const handleAbrirModalCadastro = () => {
    setCategoriaSelecionada(null);
    setNome("");
    setShowModal(true);
  };

  const handleVerInfo = (categoria) => {
    setCategoriaSelecionada(categoria);
    setNome(categoria.nome);
    setShowModal(true);
  };

  const handleAlterar = () => {
    const atualizadas = categorias.map((c) =>
      c.id === categoriaSelecionada.id ? { ...c, nome } : c
    );
    setCategorias(atualizadas);
    salvarLocalStorage(atualizadas);
    setShowModal(false);
  };

  const handleExcluir = () => {
    const atualizadas = categorias.filter((c) => c.id !== categoriaSelecionada.id);
    setCategorias(atualizadas);
    salvarLocalStorage(atualizadas);
    setShowModal(false);
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lista de Categorias</h3>
        <Button onClick={handleAbrirModalCadastro}>Cadastrar Categoria</Button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.nome}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleVerInfo(cat)}>
                  Ver Informações
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{categoriaSelecionada ? "Informações da Categoria" : "Nova Categoria"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {categoriaSelecionada ? (
            <>
              <Button variant="success" onClick={handleAlterar}>
                Alterar
              </Button>
              <Button variant="danger" onClick={handleExcluir}>
                Excluir
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSalvar}>
              Salvar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categorias;
