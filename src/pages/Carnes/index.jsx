import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";

const Pendentes = () => {
    const [carnes, setCarnes] = useState([]);
    const [busca, setBusca] = useState("");
    const [carneSelecionado, setCarneSelecionado] = useState(null);
    const [parcelaAtual, setParcelaAtual] = useState(null);

    useEffect(() => {
        async function fetchCarnes() {
            try {
                const res = await axios.get("http://localhost:8000/venda/pendentes");
                setCarnes(res.data.vendas);
            } catch (err) {
                console.error("Erro ao buscar carnês:", err);
            }
        }

        fetchCarnes();
    }, []);

    const carnesFiltrados = carnes.filter(c =>
        c.cliente.toLowerCase().includes(busca.toLowerCase())
    );

    const handlePagarParcela = (carne, parcela) => {
        setCarneSelecionado(carne);
        setParcelaAtual(parcela);
    };

    const confirmarPagamento = async () => {
        try {
            const res = await axios.patch(`http://localhost:8000/venda/${carneSelecionado.id}/parcela/${parcelaAtual.numero}/pagar`);
            const vendaAtualizada = res.data.venda;

            const atualizados = carnes.map(c => {
                if (c.id === vendaAtualizada._id) {
                    if (vendaAtualizada.status === "finalizada") {
                        return null; // remove da lista
                    }

                    return {
                        ...c,
                        parcelas: vendaAtualizada.parcelasDetalhes.map(p => ({
                            numero: p.numero,
                            valor: p.valor,
                            vencimento: p.dataVencimento,
                            pago: p.status === "pago"
                        }))
                    };
                }
                return c;
            }).filter(Boolean); // remove os "null" (vendas finalizadas)

            setCarnes(atualizados);
            setCarneSelecionado(null);
            setParcelaAtual(null);
        } catch (err) {
            console.error("Erro ao marcar como pago:", err);
        }
    };


    return (
        <div className="col container-fluid mt-4">
            <h2>Gestão de Carnês</h2>

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
                        <th>Cliente</th>
                        <th>Data da Venda</th>
                        <th>Total</th>
                        <th>Parcelas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {carnesFiltrados.map((carne) => (
                        <tr key={carne.id}>
                            <td>{carne.cliente}</td>
                            <td>{new Date(carne.dataVenda).toLocaleDateString()}</td>
                            <td>R$ {carne.total.toFixed(2)}</td>
                            <td>
                                {carne.parcelas.filter(p => !p.pago).length}/{carne.parcelas.length}
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setCarneSelecionado(carne)}
                                >
                                    Ver Parcelas
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de Parcelas */}
            <Modal show={carneSelecionado} onHide={() => setCarneSelecionado(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Carnê {carneSelecionado?.cliente}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Parcela</th>
                                <th>Valor</th>
                                <th>Vencimento</th>
                                <th>Status</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carneSelecionado?.parcelas.map((parcela) => (
                                <tr key={parcela.numero}>
                                    <td>{parcela.numero}</td>
                                    <td>R$ {parcela.valor.toFixed(2)}</td>
                                    <td>{new Date(parcela.vencimento).toLocaleDateString()}</td>
                                    <td>{parcela.pago ? "Pago" : "Pendente"}</td>
                                    <td>
                                        {!parcela.pago && (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handlePagarParcela(carneSelecionado, parcela)}
                                            >
                                                Pagar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCarneSelecionado(null)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmação de Pagamento */}
            <Modal show={parcelaAtual} onHide={() => setParcelaAtual(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Pagamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deseja registrar o pagamento da parcela {parcelaAtual?.numero}?</p>
                    <p><strong>Valor:</strong> R$ {parcelaAtual?.valor.toFixed(2)}</p>
                    <p><strong>Vencimento:</strong> {new Date(parcelaAtual?.vencimento).toLocaleDateString()}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setParcelaAtual(null)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={confirmarPagamento}>
                        Confirmar Pagamento
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Pendentes;
