/* =========================================================
   Pareamento de Cores
   Cada rodada: sequência modelo sorteada (sem repetir cor),
   espaços vazios embaixo e a paleta fixa com todas as cores.
   Funciona tocando (preenche o próximo espaço) ou arrastando
   (solta sobre o espaço desejado).

   Memorização (segundos > 0): só a sequência aparece; ao fim do
   tempo ela sobe e some, o paciente preenche de memória e, ao
   completar, a sequência desce de volta com ✓/✗ em cada espaço.
   Sem memorização (0 s): sequência sempre visível e aprendizagem
   sem erro (cor errada não entra, só balança).
   ========================================================= */

(function () {
  "use strict";

  // Paleta fixa, sempre na mesma ordem
  var CORES = [
    { nome: "vermelho", hex: "#E53935" },
    { nome: "laranja",  hex: "#FB8C00" },
    { nome: "amarelo",  hex: "#FDD835" },
    { nome: "verde",    hex: "#2E9E44" },
    { nome: "azul",     hex: "#1E63D6" },
    { nome: "roxo",     hex: "#8E44AD" }
  ];
  var PAUSA_ENTRE_RODADAS_MS = 1200;
  var PAUSA_FEEDBACK_MS = 2500; // tempo olhando o ✓/✗ antes da próxima rodada
  var LIMIAR_ARRASTO_PX = 10;

  var telaInicio = document.getElementById("tela-inicio");
  var telaFoco   = document.getElementById("tela-foco");
  var telaFim    = document.getElementById("tela-fim");
  var form       = document.getElementById("form-inicio");
  var modelo     = document.getElementById("modelo");
  var resposta   = document.getElementById("resposta");
  var paleta     = document.getElementById("paleta");

  var nCores, totalRodadas, rodada, memorizarMs;
  var ativo = false;
  var travado = false; // durante a memorização e as pausas
  var timerId = null;

  /* ---------- Campos numéricos (−/+ com limites) ---------- */

  function lerCampo(input) {
    var min = +input.min, max = +input.max;
    var v = parseInt(input.value, 10);
    if (isNaN(v)) v = +input.defaultValue;
    return Math.min(max, Math.max(min, v));
  }

  document.querySelectorAll(".passo").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.dataset.alvo);
      input.value = lerCampo(input) + +btn.dataset.delta;
      input.value = lerCampo(input);
    });
  });
  document.querySelectorAll(".campo__input").forEach(function (input) {
    input.addEventListener("blur", function () { input.value = lerCampo(input); });
  });

  /* ---------- Montagem da tela ---------- */

  function bola(classe, cor) {
    var el = document.createElement(classe === "paleta-cor" ? "button" : "div");
    el.className = "bola " + classe;
    if (cor) {
      el.style.backgroundColor = cor.hex;
      el.setAttribute("aria-label", cor.nome);
    }
    return el;
  }

  function sortearSequencia(n) {
    var idx = CORES.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) { // Fisher-Yates
      var j = Math.floor(Math.random() * (i + 1));
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx.slice(0, n);
  }

  function montarPaleta() {
    paleta.innerHTML = "";
    CORES.forEach(function (cor, i) {
      var el = bola("paleta-cor", cor);
      el.type = "button";
      el.dataset.cor = i;
      paleta.appendChild(el);
    });
  }

  function novaRodada() {
    travado = false;
    telaFoco.classList.remove("lembrando"); // sequência volta a descer
    resposta.classList.remove("completa");
    modelo.innerHTML = "";
    resposta.innerHTML = "";
    sortearSequencia(nCores).forEach(function (i) {
      modelo.appendChild(bola("modelo-cor", CORES[i]));
      var espaco = bola("espaco");
      espaco.dataset.alvo = i;
      espaco.setAttribute("aria-label", "espaço vazio");
      resposta.appendChild(espaco);
    });

    if (memorizarMs > 0) {
      travado = true;
      telaFoco.classList.add("memorizando"); // só a sequência na tela
      timerId = setTimeout(function () {
        telaFoco.classList.remove("memorizando");
        telaFoco.classList.add("lembrando"); // sequência sobe e some
        travado = false;
      }, memorizarMs);
    }
  }

  /* ---------- Regra do pareamento ---------- */

  function balancar(el) {
    el.classList.remove("balanca");
    void el.offsetWidth; // reinicia a animação
    el.classList.add("balanca");
  }

  function tentarPreencher(espaco, corEl) {
    if (!ativo || travado) return;
    var i = +corEl.dataset.cor;
    var errado = espaco && memorizarMs === 0 && +espaco.dataset.alvo !== i; // só barra no modo sem erro
    if (!espaco || espaco.classList.contains("preenchido") || errado) {
      balancar(corEl);
      return;
    }
    espaco.classList.add("preenchido");
    espaco.dataset.cor = i;
    espaco.style.backgroundColor = CORES[i].hex;
    espaco.setAttribute("aria-label", CORES[i].nome);

    if (!resposta.querySelector(".espaco:not(.preenchido)")) {
      travado = true;
      var pausa = PAUSA_ENTRE_RODADAS_MS;
      if (memorizarMs > 0) {
        telaFoco.classList.remove("lembrando"); // sequência desce para comparar
        resposta.querySelectorAll(".espaco").forEach(function (e) {
          e.classList.add(e.dataset.cor === e.dataset.alvo ? "certo" : "errado");
        });
        pausa = PAUSA_FEEDBACK_MS;
      } else {
        resposta.classList.add("completa");
      }
      timerId = setTimeout(function () {
        rodada++;
        if (rodada > totalRodadas) terminar();
        else novaRodada();
      }, pausa);
    }
  }

  function proximoEspaco() {
    return resposta.querySelector(".espaco:not(.preenchido)");
  }

  /* ---------- Tocar ou arrastar (Pointer Events) ---------- */

  var gesto = null; // { id, corEl, x0, y0, fantasma }

  paleta.addEventListener("pointerdown", function (e) {
    var corEl = e.target.closest(".paleta-cor");
    if (!corEl || gesto || travado) return;
    e.preventDefault();
    gesto = { id: e.pointerId, corEl: corEl, x0: e.clientX, y0: e.clientY, fantasma: null };
  });

  document.addEventListener("pointermove", function (e) {
    if (!gesto || e.pointerId !== gesto.id) return;
    if (!gesto.fantasma) {
      if (Math.hypot(e.clientX - gesto.x0, e.clientY - gesto.y0) < LIMIAR_ARRASTO_PX) return;
      gesto.fantasma = gesto.corEl.cloneNode(false);
      gesto.fantasma.className = "bola fantasma";
      telaFoco.appendChild(gesto.fantasma); // herda o tamanho calculado na tela
    }
    var r = gesto.fantasma.offsetWidth / 2;
    gesto.fantasma.style.transform =
      "translate(" + (e.clientX - r) + "px," + (e.clientY - r) + "px)";
  });

  function fimGesto(e, cancelado) {
    if (!gesto || e.pointerId !== gesto.id) return; // ignora outros dedos
    var g = gesto;
    gesto = null;
    if (g.fantasma) {
      g.fantasma.remove();
      if (cancelado) return;
      var alvo = document.elementFromPoint(e.clientX, e.clientY);
      var espaco = alvo && alvo.closest("#resposta .espaco");
      if (espaco) tentarPreencher(espaco, g.corEl);
      // soltou fora de um espaço: nada acontece
    } else if (!cancelado) {
      tentarPreencher(proximoEspaco(), g.corEl);
    }
  }

  document.addEventListener("pointerup", function (e) { fimGesto(e, false); });
  document.addEventListener("pointercancel", function (e) { fimGesto(e, true); });

  // Teclado (Enter/Espaço na cor): mesmo comportamento do toque
  paleta.addEventListener("click", function (e) {
    var corEl = e.target.closest(".paleta-cor");
    if (corEl && e.detail === 0) tentarPreencher(proximoEspaco(), corEl);
  });

  /* ---------- Iniciar / Parar / Fim ---------- */

  function mostrar(tela) {
    [telaInicio, telaFoco, telaFim].forEach(function (t) { t.hidden = t !== tela; });
  }

  function iniciar() {
    nCores = lerCampo(document.getElementById("cores"));
    totalRodadas = lerCampo(document.getElementById("rodadas"));
    memorizarMs = lerCampo(document.getElementById("memorizar")) * 1000;
    rodada = 1;
    ativo = true;
    telaFoco.style.setProperty("--n", nCores); // o CSS ajusta o tamanho das bolinhas
    montarPaleta();
    novaRodada();
    mostrar(telaFoco);
  }

  function encerrar() {
    ativo = false;
    clearTimeout(timerId);
    timerId = null;
    if (gesto && gesto.fantasma) gesto.fantasma.remove();
    gesto = null;
    telaFoco.classList.remove("memorizando", "lembrando");
  }

  function terminar() {
    encerrar();
    mostrar(telaFim);
  }

  function parar() {
    encerrar();
    mostrar(telaInicio);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); iniciar(); });
  document.getElementById("btn-parar").addEventListener("click", parar);
  document.getElementById("btn-voltar").addEventListener("click", function () { mostrar(telaInicio); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && ativo) parar();
  });
})();
