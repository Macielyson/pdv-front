import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  useEffect(() => {
    async function fetchOrcamentos() {
      try {
        const res = await axios.get("http://localhost:8000/orcamento");
        if (!res.data.error) {
          setOrcamentos(res.data.orcamentos);
        }
      } catch (err) {
        console.error("Erro ao buscar orçamentos:", err);
      }
    }

    fetchOrcamentos();
  }, []);

  const filtrados = orcamentos.filter(o =>
    o.clienteId?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Lista de Orçamentos</h2>

      <Form.Control
        type="text"
        placeholder="Buscar por cliente..."
        className="mb-3"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Usuário</th>
            <th>Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((orcamento) => (
            <tr key={orcamento._id}>
              <td>{new Date(orcamento.dataHora).toLocaleDateString()}</td>
              <td>{orcamento.clienteId?.nome || "Consumidor Final"}</td>
              <td>{orcamento.usuarioId || "Desconhecido"}</td>
              <td>R$ {orcamento.total.toFixed(2)}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => setOrcamentoSelecionado(orcamento)}
                >
                  Ver Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Detalhes do Orçamento */}
      <Modal
        show={!!orcamentoSelecionado}
        onHide={() => setOrcamentoSelecionado(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orcamentoSelecionado && (
            <>
              <p><strong>Data:</strong> {new Date(orcamentoSelecionado.dataHora).toLocaleString()}</p>
              <p><strong>Cliente:</strong> {orcamentoSelecionado.clienteId?.nome || "Consumidor Final"}</p>
              <p><strong>Forma de Pagamento:</strong> {orcamentoSelecionado.formaPagamento}</p>
              <p><strong>Entrada:</strong> R$ {orcamentoSelecionado.entrada?.toFixed(2)}</p>
              <p><strong>Parcelas:</strong> {orcamentoSelecionado.parcelas}</p>
              <p><strong>Total:</strong> R$ {orcamentoSelecionado.total.toFixed(2)}</p>
              {orcamentoSelecionado.descricao && (
                <p><strong>Descrição:</strong> {orcamentoSelecionado.descricao}</p>
              )}

              <h5>Itens</h5>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Unitário</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentoSelecionado.itens.map(item => (
                    <tr key={item._id}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {item.preco.toFixed(2)}</td>
                      <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {orcamentoSelecionado.formaPagamento === "cred-loja" && (
                <>
                  <h5>Parcelas</h5>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>Parcela</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orcamentoSelecionado.parcelasDetalhes.map((p, i) => (
                        <tr key={i}>
                          <td>{p.numero}</td>
                          <td>R$ {p.valor.toFixed(2)}</td>
                          <td>{new Date(p.dataVencimento).toLocaleDateString()}</td>
                          <td>{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOrcamentoSelecionado(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orcamentos;
