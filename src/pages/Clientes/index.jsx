import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Table from "../../components/Table";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", endereco: "" });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // ✅ Carrega clientes da API
  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    try {
      const resposta = await axios.get("http://localhost:8000/cliente");
      if (!resposta.data.error) {
        setClientes(resposta.data.clientes); // ou .cliente se for só um
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Envia cliente novo para a API
  const handleAddCliente = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post("http://localhost:8000/cliente", form);
      if (!resposta.data.error) {
        setClientes([...clientes, resposta.data.cliente]);
        setForm({ nome: "", email: "", endereco: "" });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

  const handleOpenInfoModal = (cliente) => {
    setClienteSelecionado(cliente);
    setShowInfoModal(true);
  };

  const handleUpdateCliente = async () => {
    try {
      const resposta = await axios.put(
        `http://localhost:8000/cliente/${clienteSelecionado._id}`,
        clienteSelecionado
      );
      if (!resposta.data.error) {
        setClientes(clientes.map((c) => (c._id === clienteSelecionado._id ? clienteSelecionado : c)));
        setShowInfoModal(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const handleDeleteCliente = async () => {
    try {
      await axios.delete(`http://localhost:8000/cliente/${clienteSelecionado._id}`);
      setClientes(clientes.filter((c) => c._id !== clienteSelecionado._id));
      setShowInfoModal(false);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const colunas = [
    { titulo: "Nome", campo: "nome" },
    { titulo: "Email", campo: "email" },
    { titulo: "Endereço", campo: "endereco" },
  ];

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Clientes</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Cadastrar Cliente
        </Button>
      </div>

      <Table colunas={colunas} dados={clientes} onVerInformacoes={handleOpenInfoModal} />

      {/* Modal de Cadastro */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCliente}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={form.nome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" name="endereco" value={form.endereco} onChange={handleChange} required />
            </Form.Group>
            <Button variant="success" type="submit">Salvar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Informações */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Informações do Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteSelecionado && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={clienteSelecionado.nome}
                  onChange={(e) =>
                    setClienteSelecionado({ ...clienteSelecionado, nome: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={clienteSelecionado.email}
                  onChange={(e) =>
                    setClienteSelecionado({ ...clienteSelecionado, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  value={clienteSelecionado.endereco}
                  onChange={(e) =>
                    setClienteSelecionado({ ...clienteSelecionado, endereco: e.target.value })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteCliente}>Excluir</Button>
          <Button variant="primary" onClick={handleUpdateCliente}>Alterar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clientes;
