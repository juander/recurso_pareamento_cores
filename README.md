# Pareamento de Cores

Recurso de apoio à terapia ocupacional para trabalhar **pareamento de cores em sequência**, com baixíssima carga cognitiva: fundo branco, sem textos, sem placar — só as cores.

HTML, CSS e JavaScript puro. Sem build, sem dependências.

## Como funciona

1. Na configuração, escolha:
   - **Cores na sequência** (padrão 3, de 2 a 6);
   - **Rodadas** (padrão 10, de 1 a 30);
   - **Segundos para memorizar** (padrão 5, de 0 a 30).
2. Em cada rodada aparecem, em linhas horizontais: a **sequência modelo** (cores sorteadas, sem repetir), os **espaços vazios** e, abaixo de uma divisória suave, a **paleta** com as 6 cores, sempre na mesma ordem.
3. O paciente pode **tocar** uma cor (ela vai para o próximo espaço, da esquerda para a direita) ou **arrastar** a cor até o espaço.
4. O botão discreto **parar** no canto (ou a tecla **Esc**) encerra a sessão. Ao fim das rodadas aparece "Muito bem!".

### Com memorização (segundos > 0)

1. Só a sequência aparece, pelo tempo escolhido.
2. A sequência **sobe e some**; surgem os espaços e a paleta.
3. O paciente preenche de memória (qualquer cor é aceita).
4. Ao completar, a sequência **desce de volta** e cada espaço recebe ✓ (acertou) ou ✗ (errou). Após 2,5 s começa a próxima rodada.

### Sem memorização (0 s)

A sequência fica sempre visível e vale a **aprendizagem sem erro**: cor errada não entra no espaço, só balança de leve.

## Celular

Feito para funcionar bem no celular: as bolinhas usam o maior tamanho que cabe na tela.
- **Em pé:** a paleta fica em 2 linhas de 3 cores. Com 2–4 cores na sequência as bolinhas ficam grandes (~100 px).
- **Deitado:** recomendado para 5–6 cores, porque as 6 cabem em linha com folga (~100 px).

## Como usar

Abra `index.html` em qualquer navegador moderno, ou publique a pasta como site estático (ex.: Vercel, sem configuração).
