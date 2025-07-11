import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";

const Historico = () => {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState("");
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [filtroData, setFiltroData] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const hoje = new Date();
  const dataHoje = hoje.toISOString().split("T")[0];

  useEffect(() => {
    axios.get("http://localhost:8000/venda")
      .then((response) => {
        const data = response.data;
        if (!data.error && Array.isArray(data.vendas)) {
          const vendasFormatadas = data.vendas
            .filter(v => v.status === "finalizada") // <-- SOMENTE FINALIZADAS
            .map((venda) => ({
              id: venda._id,
              cliente: venda.clienteId?.nome || "Cliente não identificado",
              data: new Date(venda.dataHora).toISOString().split("T")[0],
              total: venda.total,
              formaPagamento: formatarPagamento(venda.formaPagamento),
              itens: venda.itens.map((item) => ({
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco,
              })),
            }));
          setVendas(vendasFormatadas);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar vendas:", error);
      });
  }, []);


  const formatarPagamento = (tipo) => {
    switch (tipo) {
      case "cred-loja":
        return "Crédito na Loja";
      case "pix":
        return "PIX";
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      default:
        return tipo;
    }
  };

  const isDataNoPeriodo = (dataVendaStr) => {
    const dataVenda = new Date(dataVendaStr);

    if (filtroData === "hoje") {
      return dataVenda.toISOString().split("T")[0] === dataHoje;
    }

    if (filtroData === "semana") {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(hoje.getDate() - 7);
      return dataVenda >= seteDiasAtras && dataVenda <= hoje;
    }

    if (filtroData === "mes") {
      return (
        dataVenda.getFullYear() === hoje.getFullYear() &&
        dataVenda.getMonth() === hoje.getMonth()
      );
    }

    if (filtroData === "personalizado") {
      if (!dataInicio || !dataFim) return true;
      return dataVenda >= new Date(dataInicio) && dataVenda <= new Date(dataFim);
    }

    return true; // caso filtroData === "todos"
  };

  const vendasFiltradas = vendas.filter(
    (v) =>
      v.cliente.toLowerCase().includes(busca.toLowerCase()) && isDataNoPeriodo(v.data)
  );

  const totalVendas = vendasFiltradas.length;
  const valorTotal = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="col container-fluid mt-4">
      <h2>Histórico de Vendas</h2>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <Button variant="outline-primary" onClick={() => setFiltroData("hoje")}>
          Hoje
        </Button>
        <Button variant="outline-primary" onClick={() => setFiltroData("semana")}>
          Últimos 7 dias
        </Button>
        <Button variant="outline-primary" onClick={() => setFiltroData("mes")}>
          Este Mês
        </Button>
        <Button variant="outline-secondary" onClick={() => setFiltroData("personalizado")}>
          Personalizado
        </Button>
        <Button variant="outline-dark" onClick={() => setFiltroData("todos")}>
          Todos
        </Button>
      </div>

      {filtroData === "personalizado" && (
        <div className="row mb-3">
          <div className="col-md-3">
            <Form.Label>Data Início</Form.Label>
            <Form.Control
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <Form.Label>Data Fim</Form.Label>
            <Form.Control
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>
      )}

      <Form.Control
        type="text"
        placeholder="Filtrar por cliente..."
        className="mb-3"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendasFiltradas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.data}</td>
              <td>{venda.cliente}</td>
              <td>R$ {venda.total.toFixed(2)}</td>
              <td>{venda.formaPagamento}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => setVendaSelecionada(venda)}
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Resumo */}
      <div className="mt-3">
        <p><strong>Total de Vendas:</strong> {totalVendas}</p>
        <p><strong>Total em Reais:</strong> R$ {valorTotal.toFixed(2)}</p>
      </div>

      {/* Modal Detalhes */}
      <Modal show={vendaSelecionada !== null} onHide={() => setVendaSelecionada(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Venda #{vendaSelecionada?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Cliente:</strong> {vendaSelecionada?.cliente}</p>
          <p><strong>Data:</strong> {vendaSelecionada?.data}</p>
          <p><strong>Total:</strong> R$ {vendaSelecionada?.total.toFixed(2)}</p>

          <h5>Itens:</h5>
          <ul>
            {vendaSelecionada?.itens.map((item, index) => (
              <li key={index}>
                {item.quantidade}x {item.nome} (R$ {item.preco.toFixed(2)})
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVendaSelecionada(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Historico;
