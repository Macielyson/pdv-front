import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Table from "../../components/Table"; // componente reutilizável

const Clientes = () => {
  const [clientes, setClientes] = useState([
    { id: 1, nome: "Maria Silva", telefone: "1199999-9999", endereco: "Rua A, 123" },
    { id: 2, nome: "João Souza", telefone: "2198888-8888", endereco: "Av. B, 456" },
  ]);

  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "" });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCliente = (e) => {
    e.preventDefault();
    const novoCliente = { ...form, id: Date.now() };
    setClientes([...clientes, novoCliente]);
    setForm({ nome: "", telefone: "", endereco: "" });
    setShowModal(false);
  };

  const handleOpenInfoModal = (cliente) => {
    setClienteSelecionado(cliente);
    setShowInfoModal(true);
  };

  const handleUpdateCliente = () => {
    setClientes(clientes.map((c) => (c.id === clienteSelecionado.id ? clienteSelecionado : c)));
    setShowInfoModal(false);
  };

  const handleDeleteCliente = () => {
    setClientes(clientes.filter((c) => c.id !== clienteSelecionado.id));
    setShowInfoModal(false);
  };

  const colunas = [
    { titulo: "Nome", campo: "nome" },
    { titulo: "Telefone", campo: "telefone" },
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
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" name="telefone" value={form.telefone} onChange={handleChange} required />
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
                  onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, nome: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  value={clienteSelecionado.telefone}
                  onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, telefone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  value={clienteSelecionado.endereco}
                  onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, endereco: e.target.value })}
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
