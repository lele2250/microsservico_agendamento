import { Agendamento } from "../models/agendamento";
const HORARIO_INICIO = 8;
const HORARIO_FIM = 19;

export function validarDuracao(duracao: number) {
    return ( 
        duracao >= 30 &&
        duracao <= 180 &&
        duracao % 30 === 0
    );
}

export function validarJanela( 
    inicio: Date,
    fim: Date
) {
    const horaInicio = inicio.getHours();
    const horaFim = fim.getHours();
    
    return (
        horaInicio >= HORARIO_INICIO &&
        horaFim <= HORARIO_FIM
    ); 
}


//import { Agendamento } from "../models/agendamento";

export function temConflito(
  existentes: Agendamento[],
  novoInicio: Date,
  novoFim: Date,
  corretorId: string
) {
    return existentes.some((a)=> {
        if( a.corretorId !== corretorId) 
            return false;

       return existentes.some((a) => {
  if (a.corretorId !== corretorId) return false;

  const inicioExistente = new Date(a.inicio);
  const fimExistente = new Date(a.fim);

  return (
    novoInicio < fimExistente &&
    novoFim > inicioExistente
  );
});
    });
}

export function sugerirHorarios(
  existentes: Agendamento[],
  data: Date,
  duracao: number,
  corretorId: string
): string[] {
  const sugestoes: string[] = [];

  const inicioDia = new Date(data);
  inicioDia.setHours(8, 0, 0, 0);

  const fimDia = new Date(data);
  fimDia.setHours(19, 0, 0, 0);

  let cursor = new Date(inicioDia);

  while (cursor < fimDia && sugestoes.length < 3) {
    const fim = new Date (cursor.getTime() + duracao * 60000);
   
    const conflito = temConflito( 
        existentes,
        cursor,
        fim,
        corretorId
    );
   if (!conflito && validarJanela(cursor,fim)) {
    sugestoes.push(cursor.toISOString());
   }
   cursor = new Date(cursor.getTime() + 30 * 60000); 
  }
  return sugestoes;
}