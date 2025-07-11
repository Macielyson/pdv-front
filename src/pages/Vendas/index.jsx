import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";

const Vendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [desconto, setDesconto] = useState("");
  const [acrescimo, setAcrescimo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cliente, setCliente] = useState("Consumidor Final");
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: "", email: "", telefone: "" });
  const [formaPagamento, setFormaPagamento] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [entrada, setEntrada] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [mostrarDescricao, setMostrarDescricao] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [statusVenda, setStatusVenda] = useState("Finalizada");
  const [codigoVenda, setCodigoVenda] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resProdutos, resClientes] = await Promise.all([
          axios.get("http://localhost:8000/produto"),
          axios.get("http://localhost:8000/cliente/")
        ]);

        if (!resProdutos.data.error) {
          setProdutos(resProdutos.data.produtos);
        }

        if (!resClientes.data.error) {
          setClientes(resClientes.data.clientes);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    buscarDados();
  }, []);

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) || p._id.includes(busca)
  );

  const adicionarCarrinho = (produto) => {
    const quantidade = quantidades[produto._id] || 1;
    const jaExiste = carrinho.find(item => item._id === produto._id);

    if (jaExiste) {
      setCarrinho(carrinho.map(item =>
        item._id === produto._id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade }]);
    }
  };

  const removerCarrinho = (produtoId) => {
    setCarrinho(carrinho
      .map(item =>
        item._id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item
      )
      .filter(item => item.quantidade > 0)
    );
  };

  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const total = subtotal - Number(desconto) + Number(acrescimo);
  const valorRestante = total - Number(entrada);
  const dataHoraVenda = new Date().toLocaleString();

  const gerarCodigoVenda = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const abrirModalComStatus = (status) => {
    setStatusVenda(status);
    setCodigoVenda(gerarCodigoVenda());
    setMostrarModal(true);
  };

  const handleFormaPagamentoChange = (e) => {
    const valor = e.target.value;
    setFormaPagamento(valor);
    if (valor !== "Cred. Loja") {
      setParcelas(1);
      setDataVencimento("");
      setEntrada(0);
    }
  };

  const handleConfirmar = async () => {
    try {
      const payload = {
        clienteId: cliente !== "Consumidor Final"
          ? clientes.find(c => c.nome === cliente)?._id
          : undefined,
        usuarioId: "64b7d4ea5ff8fc3b2fbb9d01", // substitua pelo ID real do usuário
        itens: carrinho.map(item => ({
          produtoId: item._id,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco
        })),
        formaPagamento: formaPagamento.toLowerCase().replace(".", "").replace(" ", "-"),
        entrada: Number(entrada) || 0,
        parcelas: formaPagamento === "Cred. Loja" ? Number(parcelas) : 1,
        dataVencimento: formaPagamento === "Cred. Loja" ? dataVencimento : null,
        desconto: Number(desconto) || 0,
        acrescimo: Number(acrescimo) || 0,
        descricao,
        subtotal,
        total,
        valorRestante: valorRestante > 0 ? valorRestante : 0,
        status: statusVenda.toLowerCase(),
        dataHora: new Date(),
        validoAte: statusVenda === "Aguardando" 
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias para orçamento
          : undefined
      };

      const url = statusVenda === "Aguardando" 
        ? "http://localhost:8000/orcamento" 
        : "http://localhost:8000/venda";

      const res = await axios.post(url, payload);

      if (!res.data.error) {
        alert(statusVenda === "Aguardando" 
          ? "Orçamento criado com sucesso!" 
          : "Venda finalizada com sucesso!");
        
        if (statusVenda !== "Aguardando") {
          // Limpa apenas se for venda finalizada
          setCarrinho([]);
          setCliente("Consumidor Final");
          setFormaPagamento("");
          setDesconto("");
          setAcrescimo("");
          setDescricao("");
        }
        
        setMostrarModal(false);
      } else {
        alert("Erro ao cadastrar: " + res.data.mensagem);
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Produtos */}
        <div className="col-md-8">
          <h4>Venda</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar por código ou nome..."
            onChange={(e) => setBusca(e.target.value)}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Cod.</th>
                <th>Imagem</th>
                <th>Produto</th>
                <th>Preço</th>
                <th>Qtd</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map(produto => (
                <tr key={produto._id}>
                  <td>{produto._id.slice(-4)}</td>
                  <td>
                    <img
                      src={`http://localhost:8000${produto.foto}`}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                      alt={produto.nome}
                    />
                  </td>
                  <td>{produto.nome}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ width: 70 }}
                      value={quantidades[produto._id] || 1}
                      onChange={(e) =>
                        setQuantidades({ ...quantidades, [produto._id]: parseInt(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <button className="btn btn-success w-100" onClick={() => adicionarCarrinho(produto)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Carrinho */}
        <div className="col-md-4 bg-light bg-gradient">
          <div className="mb-3">
            <label>Cliente</label>
            <div className="d-flex">
              <Form.Select
                className="form-control"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              >
                <option value="Consumidor Final">Consumidor Final</option>
                {clientes.map(c => (
                  <option key={c._id} value={c.nome}>{c.nome}</option>
                ))}
              </Form.Select>
              <Button
                variant="outline-primary"
                className="ms-2"
                onClick={() => setMostrarModalCliente(true)}
              >+</Button>
            </div>
          </div>

          <Table size="sm">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Unitário</th>
                <th>Total</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map(item => (
                <tr key={item._id}>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removerCarrinho(item._id)}> - </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
          <div className="d-flex">
            <input
              type="number"
              placeholder="Desconto (R$)"
              className="form-control mb-2"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
            />
            <input
              type="number"
              placeholder="Acréscimo (R$)"
              className="form-control mb-2"
              value={acrescimo}
              onChange={(e) => setAcrescimo(e.target.value)}
            />
          </div>

          <Form.Check
            type="checkbox"
            label="Adicionar descrição"
            checked={mostrarDescricao}
            onChange={(e) => setMostrarDescricao(e.target.checked)}
          />

          {mostrarDescricao && (
            <textarea
              className="form-control mb-2"
              placeholder="Descrição da venda..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          )}

          <Form.Select className="mb-2" value={formaPagamento} onChange={handleFormaPagamentoChange}>
            <option value="">Forma de pagamento</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
            <option value="PIX">PIX</option>
            <option value="Cred. Loja">Cred. Loja</option>
          </Form.Select>

          {formaPagamento === "Cred. Loja" && (
            <div className="d-flex">
              <input
                type="number"
                min="1"
                placeholder="Parcelas"
                className="form-control mb-2"
                value={parcelas}
                onChange={(e) => setParcelas(parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Entrada (R$)"
                className="form-control mb-2"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
              />
              <input
                type="date"
                className="form-control mb-2"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
              />
            </div>
          )}

          <p><strong>Total Final:</strong> R$ {total.toFixed(2)}</p>
          {formaPagamento === "Cred. Loja" && (
            <p><strong>Valor Restante:</strong> R$ {valorRestante.toFixed(2)}</p>
          )}

          <div className="d-flex gap-2">
            <Button
              className="btn btn-success w-100"
              onClick={() => abrirModalComStatus("Finalizada")}
              disabled={!cliente || carrinho.length === 0}
            >
              Finalizar Compra
            </Button>
            <Button 
              className="btn btn-primary w-100" 
              onClick={() => abrirModalComStatus("Aguardando")} 
              disabled={carrinho.length === 0}
            >
              Gerar Orçamento
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Novo Cliente */}
      <Modal show={mostrarModalCliente} onHide={() => setMostrarModalCliente(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" placeholder="Nome" className="form-control mb-2" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
          <input type="email" placeholder="Email" className="form-control mb-2" value={novoCliente.email} onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })} />
          <input type="text" placeholder="Telefone" className="form-control" value={novoCliente.telefone} onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalCliente(false)}>Cancelar</Button>
          <Button variant="primary" onClick={async () => {
            try {
              const res = await axios.post("http://localhost:8000/cliente/", novoCliente);
              if (!res.data.error) {
                setCliente(novoCliente.nome);
                setMostrarModalCliente(false);
                setNovoCliente({ nome: "", email: "", telefone: "" });

                const atualizados = await axios.get("http://localhost:8000/cliente/");
                if (!atualizados.data.error) {
                  setClientes(atualizados.data.clientes);
                }
              }
            } catch (err) {
              console.error("Erro ao salvar cliente:", err);
              alert("Erro ao salvar cliente");
            }
          }}>Salvar Cliente</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Comprovante/Orçamento */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{statusVenda === "Aguardando" ? "Orçamento" : "Comprovante de Venda"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Cód.:</strong> {codigoVenda}</p>
          <p><strong>Data/Hora:</strong> {dataHoraVenda}</p>
          {statusVenda === "Aguardando" && (
            <p><strong>Validade:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          )}
          <p><strong>Vendedor:</strong> Usuário Atual</p>
          <p><strong>Status:</strong> {statusVenda}</p>
          <p><strong>Cliente:</strong> {cliente}</p>
          <p><strong>Forma de Pagamento:</strong> {formaPagamento}</p>

          {formaPagamento === "Cred. Loja" && (
            <>
              <p><strong>Parcelas:</strong> {parcelas}</p>
              <p><strong>Entrada:</strong> R$ {Number(entrada).toFixed(2)}</p>
              <p><strong>Vencimento:</strong> {dataVencimento}</p>
              <p><strong>Valor Restante:</strong> R$ {valorRestante.toFixed(2)}</p>
            </>
          )}

          {descricao && <p><strong>Descrição:</strong> {descricao}</p>}

          <h5>Itens:</h5>
          <Table size="sm">
            <thead>
              <tr>
                <th>Cod.</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map(item => (
                <tr key={item._id}>
                  <td>{item._id.slice(-4)}</td>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="row mt-3">
            <div className="col-md-6">
              <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
              <p><strong>Desconto:</strong> R$ {Number(desconto).toFixed(2)}</p>
              <p><strong>Acréscimo:</strong> R$ {Number(acrescimo).toFixed(2)}</p>
            </div>
            <div className="col-md-6 text-end">
              <h4><strong>Total Final:</strong> R$ {total.toFixed(2)}</h4>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Fechar</Button>
          <Button variant="primary" onClick={handleConfirmar}>
            Confirmar {statusVenda === "Aguardando" ? "Orçamento" : "Venda"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vendas;