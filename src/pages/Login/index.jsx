import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate(); // ← Hook de navegação

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const resposta = await axios.post("http://localhost:8000/usuario/login", {
                email,
                senha
            });

            if (!resposta.data.error) {

                localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));
                setMensagem("✅ Login realizado com sucesso!");

                // Redirecionar ou chamar rota protegida
                // Exemplo: window.location.href = "/dashboard";
                // ⬅️ Redireciona para /home após login
                navigate("/home");
            } else {
                setMensagem(`❌ ${resposta.data.message}`);
            }
        } catch (erro) {
            setMensagem("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center">
            <div className="card login-card shadow p-4">
                <h2 className="text-center mb-4">Entrar</h2>
                {mensagem && <div className="alert alert-info text-center">{mensagem}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
