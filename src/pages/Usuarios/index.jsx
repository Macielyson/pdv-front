import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/Table/index";
import { Modal, Button, Form } from "react-bootstrap";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", tipo: "user" });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/usuario");
      if (!res.data.error) {
        setUsuarios(res.data.usuarios);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/usuario", form);
      if (!res.data.error) {
        setUsuarios([...usuarios, res.data.usuario]);
        setForm({ nome: "", email: "", senha: "", tipo: "user" });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
    }
  };

  const handleOpenInfoModal = (usuario) => {
    setUsuarioSelecionado({ ...usuario, senha: "" }); // senha opcional para alteração
    setShowInfoModal(true);
  };

  const handleUpdateUsuario = async () => {
    try {
      const payload = { ...usuarioSelecionado };
      if (!payload.senha) delete payload.senha;

      const res = await axios.put(
        `http://localhost:8000/usuario/${usuarioSelecionado._id}`,
        payload
      );
      if (!res.data.error) {
        const atualizados = usuarios.map((u) =>
          u._id === usuarioSelecionado._id ? res.data.usuario : u
        );
        setUsuarios(atualizados);
        setShowInfoModal(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  const handleDeleteUsuario = async () => {
    try {
      await axios.delete(`http://localhost:8000/usuario/${usuarioSelecionado._id}`);
      const atualizados = usuarios.filter((u) => u._id !== usuarioSelecionado._id);
      setUsuarios(atualizados);
      setShowInfoModal(false);
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
    }
  };

  const colunas = [
    { titulo: "Nome", campo: "nome" },
    { titulo: "Email", campo: "email" },
    { titulo: "Tipo", campo: "tipo" },
  ];

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Usuários</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Cadastrar Usuário
        </Button>
      </div>

      <Table colunas={colunas} dados={usuarios} onVerInformacoes={handleOpenInfoModal} />

      {/* Modal de Cadastro */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUsuario}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={form.nome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" name="senha" value={form.senha} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="user">User</option>
                <option value="adm">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success" type="submit">Salvar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Informações */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioSelecionado && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSelecionado.nome}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, nome: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={usuarioSelecionado.email}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha (preencha para alterar)</Form.Label>
                <Form.Control
                  type="password"
                  value={usuarioSelecionado.senha}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, senha: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={usuarioSelecionado.tipo}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, tipo: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="adm">Admin</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteUsuario}>Excluir</Button>
          <Button variant="primary" onClick={handleUpdateUsuario}>Alterar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Usuarios;
