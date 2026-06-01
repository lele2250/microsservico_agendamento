import { Agendamento } from "../modelos/agendamento";

const agendamentos: Agendamento[] = [];

export function addAgendamento(agendamento: Agendamento) {
  agendamentos.push(agendamento);
}

export function getAgendamentos() {
  return agendamentos;
}