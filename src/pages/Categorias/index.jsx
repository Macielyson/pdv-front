import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  // ✅ Carrega categorias da API
  useEffect(() => {
    buscarCategorias();
  }, []);

  const buscarCategorias = async () => {
    try {
      const resposta = await axios.get("http://localhost:8000/categoria");
      if (!resposta.data.error) {
        setCategorias(resposta.data.categorias);
      }
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
    }
  };

  // ✅ Salvar nova categoria
  const handleSalvar = async () => {
    if (nome.trim() === "") return;

    try {
      const resposta = await axios.post("http://localhost:8000/categoria", { nome });
      if (!resposta.data.error) {
        setCategorias([...categorias, resposta.data.categoria]);
        setNome("");
        setShowModal(false);
      }
    } catch (erro) {
      console.error("Erro ao salvar categoria:", erro);
    }
  };

  // ✅ Abrir modal em modo edição
  const handleVerInfo = (categoria) => {
    setCategoriaSelecionada(categoria);
    setNome(categoria.nome);
    setShowModal(true);
  };

  // ✅ Atualizar categoria
  const handleAlterar = async () => {
    try {
      const resposta = await axios.put(
        `http://localhost:8000/categoria/${categoriaSelecionada._id}`,
        { nome }
      );
      if (!resposta.data.error) {
        const atualizadas = categorias.map((c) =>
          c._id === categoriaSelecionada._id ? { ...c, nome } : c
        );
        setCategorias(atualizadas);
        setShowModal(false);
      }
    } catch (erro) {
      console.error("Erro ao alterar categoria:", erro);
    }
  };

  // ✅ Excluir categoria
  const handleExcluir = async () => {
    try {
      await axios.delete(`http://localhost:8000/categoria/${categoriaSelecionada._id}`);
      const atualizadas = categorias.filter((c) => c._id !== categoriaSelecionada._id);
      setCategorias(atualizadas);
      setShowModal(false);
    } catch (erro) {
      console.error("Erro ao excluir categoria:", erro);
    }
  };

  // ✅ Abrir modal de novo
  const handleAbrirModalCadastro = () => {
    setCategoriaSelecionada(null);
    setNome("");
    setShowModal(true);
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
            <tr key={cat._id}>
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
          <Modal.Title>{categoriaSelecionada ? "Editar Categoria" : "Nova Categoria"}</Modal.Title>
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
              <Button variant="success" onClick={handleAlterar}>Alterar</Button>
              <Button variant="danger" onClick={handleExcluir}>Excluir</Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categorias;
