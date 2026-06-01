import express from "express";
import agendamentoRotas from "./rotas/agendamentoRotas";

const app = express();

// permite receber JSON no body
app.use(express.json());

// rota principal da API
app.use("/api/agendamentos", agendamentoRotas);

// inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});