# IGM Labs / NovaTech: prospecção com sites de demonstração

Sempre responda em português.

## Regras absolutas
- Nunca enviar mensagem para ninguém no WhatsApp. Só ler e coletar. Links wa.me só abrem a conversa.
- Links de WhatsApp sempre no formato `https://wa.me/55DDDNUMERO` (só dígitos).
- Nunca usar fotos dos clientes sem autorização. Portfólio = ilustrações/placeholders, com aviso.
- Nunca inventar fatos: depoimentos, números, preços e endereços só de fontes reais.
- Naja Tattoo: não referenciar política.
- Sites novos publicados no GitHub Pages (não Netlify): `demos/<pasta>/index.html` no branch
  `claude/html-formatting-desktop-eefapj` → `https://novatekig-01.github.io/igmlabs/demos/<pasta>/`.

## Equipe de prospecção
Só três pessoas usam o CRM: **Isaac**, **Gouveia** e **Igor**.
Cada lead tem um único responsável. Um não atende lead de outro.

### Quando alguém se identifica ("aqui é o Isaac", "é o Igor", "Gouveia aqui")
1. Esse passa a ser o responsável ativo da conversa: tudo que for prospectado, enviado ou atualizado
   a partir daí vai com o nome dele (coluna Responsável no CRM e no Kaptar).
2. Antes de qualquer outra coisa, ler a aba Geral do CRM e entregar o **relatório do dia** dessa pessoa:
   - Leads com **Follow-up atrasado** (3+ dias sem atualizar o Último contato): nome, dias parado,
     quantos follow-ups já foram feitos, link wa.me e uma **sugestão de mensagem de follow-up**
     curta e personalizada (citar o site de demonstração enviado). A pessoa envia; eu nunca envio.
   - Leads com **3+ follow-ups sem resposta**: sugerir encerrar (Etapa "Sem interesse") ou uma última tentativa.
   - Leads **Sem data: confirmar**: pedir para a pessoa dizer como está a conversa.
   - Leads que vencem o follow-up hoje/amanhã (coluna Próximo follow-up).
   - Resumo: total de leads dela, em dia, atrasados, fechados.
3. Ao escolher o próximo lead novo da planilha Kaptar, pegar só leads com Status "Novo" e
   coluna Responsável (Z) vazia, e já marcar o nome da pessoa na coluna Z.

### Trava anti-duplicidade (Isaac, Gouveia e Igor trabalham em sessões separadas ao mesmo tempo)
- **Registrar ANTES de entregar o lead no chat ("próximo cliente"):** escolher o lead e, antes de
  escrever o nome dele na resposta, gravar o responsável nos dois lugares:
  1. Kaptar: nome da pessoa na coluna Z;
  2. CRM, aba Geral: nova linha com Lead, Responsável = pessoa, Etapa "A abordar" e em Notas
     "dd/mm: reservado para Nome".
  Reler as duas marcações (passo "Confirmar a reserva" abaixo) e só então mostrar o lead para a pessoa.
  Nunca mostrar um lead "provisório" antes da reserva gravada.
- **Reservar antes de trabalhar:** o primeiro passo com qualquer lead é gravar o nome da pessoa na coluna Z
  do Kaptar (e no CRM). Só depois pesquisar, montar site ou sugerir mensagem.
- **Confirmar a reserva:** logo depois de gravar, ler a coluna Z de novo. Se apareceu outro nome
  (outra sessão reservou junto), devolver a minha marcação, avisar e pegar o próximo lead livre.
- **Lead trazido por print ou nome** (fora da lista): antes de qualquer coisa, procurar o lead no Kaptar
  (nome, telefone, Instagram) e na aba Geral do CRM. Se tiver outro responsável, parar e avisar:
  "esse lead é do Gouveia (desde dd/mm), não pode atender". Se não existir, cadastrar no Kaptar já com
  o nome da pessoa na coluna Z antes de trabalhar.
- **Nunca** apagar ou trocar o Responsável de um lead de outra pessoa. Transferência só quando o
  responsável atual pedir; registrar em Notas "dd/mm: transferido de X para Y".
- Editar só as linhas do próprio lead no CRM e no Kaptar, sempre relendo a linha antes de escrever.
- Se o responsável ativo da sessão não estiver claro, perguntar quem está falando antes de reservar.

### Quando a pessoa diz que fez um follow-up
Na aba Geral do CRM, na linha do lead: Último contato = data de hoje, Follow-ups feitos +1,
e registrar em Notas "dd/mm: follow-up N enviado (Nome)". O alerta volta a contar 3 dias a partir daí.

### Quando a pessoa diz que o lead respondeu / fechou / não quer
Atualizar Etapa (Respondeu, Em negociação, Fechado, Sem interesse), Último contato = hoje e Notas.

### Procedimento padrão: lead recusou o site → tirar o site do ar
Quando a pessoa disser que o lead não quer o site (Etapa "Sem interesse" por recusa), na mesma hora:
1. Achar onde o site está hospedado (coluna S do Kaptar / Notas do CRM).
2. **GitHub Pages** (`novatekig-01.github.io/igmlabs/demos/<pasta>/`): `git rm -r demos/<pasta>`, tirar
   qualquer link para ele em outros arquivos (ex.: index.html da raiz), commit e push no branch de trabalho.
   Esperar o deploy do Pages terminar e confirmar que o link dá 404.
3. **Netlify** (`*.netlify.app`, sites antigos): apagar o site no Netlify (o código continua em `demos/` no
   histórico do git, então dá para republicar se o lead voltar). Confirmar que o link saiu do ar.
4. Registrar: CRM (Etapa "Sem interesse", Situação do site "Site removido do ar em dd/mm", nota em Notas)
   e Kaptar (Q "Sem interesse", T com "dd/mm: recusou o site; site removido do ar (Nome)", S fica com a URL
   antiga só como histórico).
5. Avisar a pessoa que o link foi desativado.
Se o lead só sumiu (3+ follow-ups sem resposta) mas não recusou, não derrubar o site sem a pessoa pedir.
Lead encerrado por outro motivo (ex.: número sem WhatsApp) e que tenha site: derrubar também.

### Quando a pessoa diz que enviou a 1ª mensagem
Nova linha na aba Geral (Responsável = pessoa ativa, Etapa "Aguardando resposta", 1ª abordagem e
Último contato = hoje, Follow-ups feitos = 0) e Kaptar Status "Mensagem enviada" + data.

### Quando zerar a lista
Os sócios trazem uma planilha nova de leads; ela entra no Kaptar com a coluna Responsável vazia.

## Sessões
- **Administração · Prospecção** (`session_01KK6cGAhoC5RR9jKCzaErEs`): sessão de gerência. Recebe as listas
  novas de leads e importa no Kaptar (Status "Novo", Responsável vazio, sem duplicar nome/telefone/Instagram
  já existentes), mantém as regras deste arquivo, organiza o CRM, acompanha o andamento dos três e avisa as
  sessões de trabalho quando uma regra mudar. Não prospecta lead para si.
- **Prospecção · Isaac** (`session_01KK6cGAiKT5vf9nv4psCf2Q`), **Prospecção · Gouveia**
  (`session_01KK6cG7fjLLRVsRKVzTwsoq`) e **Prospecção · Igor** (`session_01KK6cG6sMZ7YNKMVgkvTjF7`):
  sessões de trabalho, uma por pessoa. Pedem "próximo cliente", montam sites e registram envios.
- Lista nova chega só pela sessão de Administração. Se alguém mandar uma lista numa sessão de trabalho,
  avisar que a importação é feita na Administração.

## CRM (Claude Docs, workbook)
- Link: https://claude.ai/artifact/BAKHWAaqwASLred8gbf5tu
- ref `{"object":"node","id":"95e3c389-2d31"}`, container `{"kind":"project","id":"52485949-306b-4698-abd3-49ed71421282"}`, engine `workbook`.
- Aba **Geral** (todos os leads; cabeçalho na linha 3, dados a partir da 4):
  A Lead · B Responsável · C Etapa · D 1ª abordagem · E Último contato · F Próximo passo · G WhatsApp ·
  H Situação do site · I Região · J Telefone · K Instagram · L Notas / histórico · M Follow-ups feitos ·
  N Próximo follow-up (fórmula) · O Dias sem atualizar (fórmula) · P Alerta (fórmula).
  N, O e P são ARRAYFORMULA na linha 4: nunca escrever nessas colunas.
- Abas **Isaac**, **Gouveia**, **Igor**: só leitura, filtram a Geral pelo responsável e ordenam
  pelos mais parados. Editar sempre na Geral.
- Alerta: "Follow-up atrasado" (≥3 dias), "3+ follow-ups: avaliar encerrar", "Sem data: confirmar",
  "Em dia", "Encerrado" (Fechado / Sem interesse).

## Planilha geral de leads (Kaptar, Google Sheets)
- Id `1fS_aHFycmjKzWxfSplxPHwHjRvHUDyGwjab43tr1KMI`, aba "Leads", linha = ID + 1. Locale pt-BR (fórmulas com `;`).
- Q Status · R Mensagem enviada em · S Site demo (URL) · T Observações · U E-mail · V Instagram ·
  W Tem Instagram · X Fonte · Y Criado em · **Z Responsável**.
