import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Table from "../../components/Table";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    descricao: "",
    categoriaId: "",
    imagem: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    buscarProdutos();
    buscarCategorias();
  }, []);

  const buscarProdutos = async () => {
    try {
      const res = await axios.get(`${apiUrl}/produto`);
      if (!res.data.error) setProdutos(res.data.produtos);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const buscarCategorias = async () => {
    try {
      const res = await axios.get(`${apiUrl}/categoria`);
      if (!res.data.error) setCategorias(res.data.categorias);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagem") {
      setForm({ ...form, imagem: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddProduto = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nome", form.nome);
    data.append("preco", form.preco);
    data.append("quantidade", form.quantidade);
    data.append("descricao", form.descricao);
    data.append("categoriaId", form.categoriaId);
    if (form.imagem) data.append("foto", form.imagem);

    try {
      const res = await axios.post(`${apiUrl}/produto`, data);
      if (!res.data.error) {
        setProdutos([...produtos, res.data.produto]);
        setForm({
          nome: "",
          preco: "",
          quantidade: "",
          descricao: "",
          categoriaId: "",
          imagem: null,
        });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
    }
  };

  const handleOpenInfoModal = (produto) => {
    setProdutoSelecionado({ ...produto });
    setShowInfoModal(true);
  };

  const handleUpdateProduto = async () => {
    try {
      const data = new FormData();
      data.append("nome", produtoSelecionado.nome);
      data.append("preco", produtoSelecionado.preco);
      data.append("quantidade", produtoSelecionado.quantidade);
      data.append("descricao", produtoSelecionado.descricao);
      data.append("categoriaId", produtoSelecionado.categoriaId);
      if (produtoSelecionado.imagem instanceof File) {
        data.append("foto", produtoSelecionado.imagem);
      }

      const res = await axios.put(`${apiUrl}/produto/${produtoSelecionado._id}`, data);
      if (!res.data.error) {
        const atualizados = produtos.map((p) =>
          p._id === produtoSelecionado._id ? res.data.produto : p
        );
        setProdutos(atualizados);
        setShowInfoModal(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
    }
  };

  const handleDeleteProduto = async () => {
    try {
      await axios.delete(`${apiUrl}/produto/${produtoSelecionado._id}`);
      const atualizados = produtos.filter(p => p._id !== produtoSelecionado._id);
      setProdutos(atualizados);
      setShowInfoModal(false);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

  const colunas = [
    {
      titulo: "Imagem",
      campo: "foto",
      render: (item) => (
        <img src={`${apiUrl}${item.foto}`} alt="Produto" width={50} />
      ),
    },
    { titulo: "Nome", campo: "nome" },
    {
      titulo: "Categoria",
      campo: "categoriaId",
      render: (item) => item.categoriaId?.nome || "N/A",
    },
    { titulo: "Preço", campo: "preco" },
    { titulo: "Qtd", campo: "quantidade" },
  ];

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Produtos</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Cadastrar Produto
        </Button>
      </div>

      <Table colunas={colunas} dados={produtos} onVerInformacoes={handleOpenInfoModal} />

      {/* Modal Cadastro */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduto}>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control name="nome" value={form.nome} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Preço</Form.Label>
              <Form.Control type="number" name="preco" value={form.preco} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control type="number" name="quantidade" value={form.quantidade} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control name="descricao" value={form.descricao} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Categoria</Form.Label>
              <Form.Select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                <option value="">Selecione</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagem</Form.Label>
              <Form.Control type="file" name="imagem" onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="success">Salvar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Info */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {produtoSelecionado && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={produtoSelecionado.nome}
                  onChange={(e) =>
                    setProdutoSelecionado({ ...produtoSelecionado, nome: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="number"
                  value={produtoSelecionado.preco}
                  onChange={(e) =>
                    setProdutoSelecionado({ ...produtoSelecionado, preco: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  value={produtoSelecionado.quantidade}
                  onChange={(e) =>
                    setProdutoSelecionado({ ...produtoSelecionado, quantidade: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  value={produtoSelecionado.descricao}
                  onChange={(e) =>
                    setProdutoSelecionado({ ...produtoSelecionado, descricao: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  value={produtoSelecionado.categoriaId}
                  onChange={(e) =>
                    setProdutoSelecionado({ ...produtoSelecionado, categoriaId: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  {categorias.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Imagem Atual</Form.Label>
                <img
                  src={`${apiUrl}${produtoSelecionado.foto}`}
                  alt="Atual"
                  width={100}
                  className="d-block mb-2"
                />
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProdutoSelecionado({ ...produtoSelecionado, imagem: file });
                    }
                  }}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteProduto}>Excluir</Button>
          <Button variant="primary" onClick={handleUpdateProduto}>Alterar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Produtos;
