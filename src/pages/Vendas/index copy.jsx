import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

const Vendas = () => {
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

  const produtos = [
    { id: 1, cod: "001", nome: "Celular hedmi note 12 s4 na sonic", preco: 1000, imagem: "" },
    { id: 2, cod: "002", nome: "celular", preco: 20, imagem: "" },
    { id: 3, cod: "003", nome: "Camiseta", preco: 40, imagem: "https://lojacoty.vteximg.com.br/arquivos/ids/184175-1000-1000/26811-0-1.jpg" },
    { id: 4, cod: "004", nome: "Camiseta", preco: 40, imagem: "https://lojacoty.vteximg.com.br/arquivos/ids/184175-1000-1000/26811-0-1.jpg" },
    { id: 5, cod: "005", nome: "Camiseta", preco: 40, imagem: "https://lojacoty.vteximg.com.br/arquivos/ids/184175-1000-1000/26811-0-1.jpg" },
    { id: 6, cod: "006", nome: "Arroz 5kg", preco: 25, imagem: "https://lojacoty.vteximg.com.br/arquivos/ids/184175-1000-1000/26811-0-1.jpg" }
  ];

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cod.includes(busca)
  );

  const adicionarCarrinho = (produto) => {
    const jaExiste = carrinho.find(item => item.id === produto.id);
    const quantidade = quantidades[produto.id] || 1;

    if (jaExiste) {
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
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
        item.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item
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

  return (
    <div className="col container-fluid mt-4">
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
                <tr key={produto.id}>
                  <td>{produto.cod}</td>
                  <td><img src={produto.imagem} style={{ width: 60, height: 60, objectFit: "cover" }} /></td>
                  <td>{produto.nome}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ width: 70 }}
                      value={quantidades[produto.id] || 1}
                      onChange={(e) => setQuantidades({ ...quantidades, [produto.id]: parseInt(e.target.value) })}
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
          {/*<h4>Carrinho</h4>*/}

          <div className="mb-3">
            <label>Cliente</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              <Button variant="outline-primary" className="ms-2" onClick={() => setMostrarModalCliente(true)}>+</Button>
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
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removerCarrinho(item.id)}> - </Button>
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
            <Button className="btn btn-success w-100" onClick={() => abrirModalComStatus("Finalizada")} disabled={!cliente || carrinho.length === 0}>
              Finalizar Compra
            </Button>
            <Button className="btn btn-primary w-100" onClick={() => abrirModalComStatus("Aguardando")} disabled={carrinho.length === 0}>
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
          <Button variant="primary" onClick={() => {
            setCliente(novoCliente.nome);
            setMostrarModalCliente(false);
            setNovoCliente({ nome: "", email: "", telefone: "" });
          }}>Salvar Cliente</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Comprovante */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{statusVenda === "Aguardando" ? "Orçamento" : "Comprovante de Venda"}</Modal.Title>
        </Modal.Header>


        {/*Comprovante*/}
        <Modal.Body>
          <p><strong>Cód.:</strong> {codigoVenda}</p>
          <p><strong>Data/Hora:</strong> {dataHoraVenda}</p>
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

          {descricao && (
            <p><strong>Descrição:</strong> {descricao}</p>
          )}

          <h5>Itens da Venda:</h5>
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
                <tr key={item.id}>
                  <td>{item.cod}</td>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>

          <p><strong>Desconto:</strong> R$ {Number(desconto).toFixed(2)}</p>
          <p> <strong>Acréscimo:</strong> R$ {Number(acrescimo).toFixed(2)}</p>

          <p><strong>Total Final:</strong> R$ {total.toFixed(2)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Fechar</Button>
          {statusVenda === "Finalizada" && (
            <Button variant="primary" onClick={() => {
              alert("Venda finalizada com sucesso!");
              setCarrinho([]);
              setCliente("Consumidor Final");
              setFormaPagamento("");
              setMostrarModal(false);
            }}>Confirmar Venda</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div >
  );
};

export default Vendas;
