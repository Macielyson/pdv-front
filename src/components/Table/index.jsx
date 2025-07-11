import React from "react";

const Table = ({ colunas, dados, onVerInformacoes }) => (
    <table className="table table-bordered">
        <thead className="table-dark">
            <tr>
                {colunas.map((col, index) => (
                    <th key={index}>{col.titulo}</th>
                ))}
                <th>Ação</th>
            </tr>
        </thead>
        <tbody>
            {dados.map((item) => (
                <tr key={item.id}>
                    {colunas.map((col, i) => (
                        <td key={i}>
                            {col.render ? col.render(item) : item[col.campo]}
                        </td>
                    ))}
                    <td>
                        <button className="btn btn-info btn-sm" onClick={() => onVerInformacoes(item)}>
                            Ver Informações
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


export default Table;