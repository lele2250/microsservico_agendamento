export type Status = "confirmado";

export interface Agendamento {
  agendamentoId: string;
  corretorId: string;
  imovelId: string;
  inicio: string;
  fim: string;
  status: Status;
}