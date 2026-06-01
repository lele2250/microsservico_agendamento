
Agendamentos 

Esse projeto é um aplicativo de microsserviço de agendamento, criado em Node.js, TypeScript e Express. Ele gerencia o fluxo de agendamentos dos corretores e garante a consistência das agendas, evitando que um horário sobrescreva o outro. Caso isso aconteça, o sistema informa que o corretor está indisponível no momento e oferece sugestões de até 3 horários disponíveis.

Os agendamentos podem ter no mínimo 30 minutos e no máximo 180 minutos. Caso passe desse limite, o programa informa que a duração é inválida. O horário de início permitido é 08:00 e o horário final é 19:00 (horário local de Brasília - América/São Paulo). Caso o usuário tente marcar fora desse horário, o sistema informa que está fora do horário permitido.

Arquitetura escolhida: 

Projeto está dentro de uma pasta chamada src dentro dela vai ter:

•	Um arquivo modelos -> agendamento.ts (Definir o formato dos dados (tipagem)

• Um arquivo rotas -> agendamentoRotas.ts (Rotas que a API vai fazer)

•	Um arquivo servicos-> AgendamentoServico.ts e regras.ts (Gerenciar os dados e as regras de negócio)  

•	E um campo chamado serviço.ts (subir o servidor)

Estrutura de dados:

Nesse projeto, os dados são armazenados usando um array (lista) de objetos do tipo Agendamento, mantido na memória do servidor.

Os dados ficam armazenados dentro de uma variável enquanto o servidor estiver rodando. Quando o servidor reinicia, todos os dados são apagados e precisam ser inseridos novamente.

Essa estrutura é ideal para esse tipo de programa porque o array permite percorrer todos os registros e detectar conflitos, já que é necessário comparar vários agendamentos existentes.

As operações de inserção são feitas usando push, e as consultas percorrem o array utilizando métodos como some e filter.

Comandos para rodar o servidor:

O comando para rodar o servidor é: npm run dev

O servidor está no arquivo server.ts, onde é criada uma instância do Express armazenada na variável app. Em seguida, as rotas são conectadas ao servidor usando: app.use("/api/agendamentos", agendamentoRoutes);

Isso significa que todas as requisições que chegarem nesse caminho serão encaminhadas para o arquivo de rotas, que trata cada operação (como criar ou listar agendamentos).

Por fim, o servidor é iniciado com: app.listen(3000, ...); definindo a porta em que ele ficará disponível.

Comandos para rodar o programa:

Criar um agendamento (POST) com a URL : http://localhost:3000/api/agendamentos

{ 

"corretorId": "c-101", 

"imovelId": "im-553", 

"inicio": "2026-06-10T14:00:00-03:00",

 "duracaoMinutos": 60

}

Saida: 

{ 

"agendamentoId": "ag-001", 

"corretorId": "c-101",

"imovelId": "im-553", 

"inicio": "2026-06-10T14:00:00-03:00",
 
"fim": "2026-06-10T15:00:00-03:00", 

"status": "confirmado"

}

OBS: lembre que para o programa dá certo o servidor tem que está ligado 

Consultar agendamentos (GET) com a URL: http://localhost:3000/api/agendamentos?corretorId=c-101&data=2026-06-10

Esse endpoint serve para informar quais são os horários agendados de um corretor em uma determinada data.

OBS: Na query vai ter qual vai ser o ID do corretor e a data que marcou, ou seja, é como se fosse um filtro.

Ex: quero saber qual é a agenda do corretor com id 101 com a data 2026-06-10

Saída:
[
 
  {
  
    "agendamentoId": "ag-1780272089268",
    
    "corretorId": "c-101",
    
    "imovelId": "im-553",
    
    "inicio": "2026-06-10T08:00:00-04:00",
    
    "fim": "2026-06-10T10:00:00-03:00",
    
    "status": "confirmado"
  
  },
 
  {
  
    "agendamentoId": "ag-1780269357012",
    
    "corretorId": "c-101",
    
    "imovelId": "im-553",
    
    "inicio": "2026-06-10T14:00:00-03:00",
    
    "fim": "2026-06-10T15:00:00-03:00",
    
    "status": "confirmado"
  
  }

]







