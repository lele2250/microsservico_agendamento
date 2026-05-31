import { Agendamento } from "../models/agendamento";
import { Router, Request, Response } from "express";

import {
  addAgendamento,
  getAgendamentos
} from "../services/agendamentoService";

import {
  validarDuracao,
  validarJanela,
  temConflito,
  sugerirHorarios
} from "../services/regras";

const router = Router();

/* =========================================
   ✅ POST - Criar agendamento
========================================= */
router.post("/", (req: Request, res: Response) => {

  // 📌 pega dados da requisição
  const { corretorId, imovelId, inicio, duracaoMinutos } = req.body;

  // ✅ valida payload
  if (!corretorId || !inicio || !duracaoMinutos) {
    return res.status(400).json({ erro: "Payload inválido" });
  }

  // ✅ valida duração
  if (!validarDuracao(duracaoMinutos)) {
    return res.status(400).json({ erro: "Duração inválida" });
  }

  const inicioDate = new Date(inicio);

  const fimDate = new Date(
    inicioDate.getTime() + duracaoMinutos * 60000
  );

  // ✅ valida janela (08h às 19h)
  if (!validarJanela(inicioDate, fimDate)) {
    return res.status(400).json({
      erro: "Fora do horário permitido"
    });
  }

  const existentes = getAgendamentos();

  // ✅ verifica conflito
  if (temConflito(existentes, inicioDate, fimDate, corretorId)) {

    const sugestoes = sugerirHorarios(
      existentes,
      inicioDate,
      duracaoMinutos,
      corretorId
    );

    return res.status(409).json({
      status: "conflito",
      motivo: "Corretor indisponível no horário solicitado",
      sugestoes
    });
  }

  // ✅ cria agendamento (mantendo timezone correto)
  const agendamento: Agendamento = {
    agendamentoId: `ag-${Date.now()}`,
    corretorId,
    imovelId,

    // ✅ mantém horário exatamente como veio
    inicio: inicio,

    // ✅ calcula fim sem quebrar timezone
    fim: formatarDataLocal(fimDate),

    status: "confirmado"
  };

  // ✅ salva em memória
  addAgendamento(agendamento);

  return res.status(201).json(agendamento);
});

/* =========================================
   ✅ GET - Listar por corretor e dia
========================================= */
router.get("/", (req: Request, res: Response) => {

  const { corretorId, data } = req.query;

  const result = getAgendamentos()

    // ✅ filtro correto (SEM BUG DE TIMEZONE)
    .filter(a => {
      return (
        a.corretorId === corretorId &&
        a.inicio.startsWith(data as string)
      );
    })

    // ✅ ordenação cronológica
    .sort((a, b) => {
      return (
        new Date(a.inicio).getTime() -
        new Date(b.inicio).getTime()
      );
    });

  res.json(result);
});

/* =========================================
   ✅ Função auxiliar - formata data
========================================= */
function formatarDataLocal(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");

  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  // ✅ força timezone Brasil (-03:00)
  return `${ano}-${mes}-${dia}T${horas}:${minutos}:00-03:00`;
}

export default router;