# Pareamento de Cores

Recurso de apoio à terapia ocupacional para trabalhar **pareamento de cores em sequência**, com baixíssima carga cognitiva: fundo branco, sem textos, sem placar — só as cores.

HTML, CSS e JavaScript puro. Sem build, sem dependências.

## Como funciona

1. Na configuração, escolha **cores na sequência** (padrão 3, de 2 a 6) e **rodadas** (padrão 10, de 1 a 30) e toque em **Iniciar**.
2. Em cada rodada aparecem, em linhas horizontais:
   - a **sequência modelo** (cores sorteadas, sem repetir);
   - os **espaços vazios** logo abaixo, para parear;
   - a **paleta** com todas as 6 cores, sempre na mesma ordem.
3. O paciente pode **tocar** uma cor (ela vai para o próximo espaço, da esquerda para a direita) ou **arrastar** a cor até o espaço.
4. **Aprendizagem sem erro:** cor errada não entra no espaço — a cor só dá um leve balanço.
5. Completou a linha → pequena pausa → próxima rodada. Ao fim das rodadas aparece "Muito bem!".
6. O botão discreto **parar** no canto (ou a tecla **Esc**) encerra a sessão.

## Celular

Feito para funcionar bem no celular: as bolinhas usam o maior tamanho que cabe na tela.
- **Em pé:** a paleta fica em 2 linhas de 3 cores. Com 2–4 cores na sequência as bolinhas ficam grandes (~100 px).
- **Deitado:** recomendado para 5–6 cores, porque as 6 cabem em linha com folga (~100 px).

## Como usar

Abra `index.html` em qualquer navegador moderno, ou publique a pasta como site estático (ex.: Vercel, sem configuração).
