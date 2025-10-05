import { AFD } from "./src/afd.js";
/*
import {AFN} from "./src/afn.js";
import {AFNL} from "./src/afnl.js";
import {APD} from "./src/apd.js";
import {APN} from "./src/apn.js";
import {MT} from "./src/mt.js";
*/
const no1 = 'no1';
const no2 = "no2";

const cy = cytoscape({
  container: document.getElementById('grafo'),

  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#0074D9',
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        'line-color': '#aaa',
        'width': 4,
        'label': 'data(valor)',
        'font-size': 12,
        'color': '#333',
        'text-background-color': '#fff',
        'text-background-opacity': 0.5,
        'text-background-padding': '2px',
        'text-margin-y': -12,

        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: { name: 'circle' }
});

const automato = new AFD(cy);

const radios = document.querySelectorAll('input[name="tipo"]');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      document.getElementById("sigla").innerText = radio.value.toUpperCase();
      switch (radio.value) {
        case 'afd':
          console.log(radio.value);
          break;
        case 'afn':
          console.log(radio.value);
          break;
        case 'afnl':
          console.log(radio.value);
          break;
        case 'apd':
          console.log(radio.value);
          break;
        case 'apn':
          console.log(radio.value);
          break;
        case 'mt':
          console.log(radio.value);
          break;
      }
      init();
    }
  });
});


export function init() {
  let addEstado = document.getElementById("addEstado");
  addEstado.addEventListener("click", automato.adiciona_estado.bind(automato));

  let addTransicao = document.getElementById("addTransicao");
  addTransicao.addEventListener("click", automato.adiciona_transicao.bind(automato));

  let testa = document.getElementById("testa_palavra");
  testa.addEventListener("click", automato.testa_palavra.bind(automato));
  let debuga = document.getElementById("debuga_palavra");
  debuga.addEventListener("click", automato.debuga_palavra.bind(automato));
}

init();

document.getElementById("download").addEventListener("click", function () {
  let aux = {
    estados: [...automato.estados],
    transicoes: [...automato.transicoes]
  };

  // Converte o objeto JSON em uma string
  const jsonString = JSON.stringify(aux);

  // Cria um Blob com a string JSON
  const blob = new Blob([jsonString], { type: "application/json" });

  // Cria um link de download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "APN.json"; // Nome do arquivo a ser baixado

  // Adiciona o link à página e simula o clique
  document.body.appendChild(link);
  link.click();

  // Limpa o URL do objeto Blob após o download
  URL.revokeObjectURL(url);
});

document.getElementById("uploadInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return; // Se nenhum arquivo foi selecionado, saia da função

  // Cria um objeto FileReader para ler o conteúdo do arquivo
  const reader = new FileReader();

  // Define a função de callback a ser chamada quando a leitura for concluída
  reader.onload = function (event) {
    const jsonData = JSON.parse(event.target.result);
    automato = jsonData;
    automato.forEach(estado => {
      estado.adiciona_transisao = function (i, valor, empilha, desempilha) {
        let valida = true;
        this.transicoes.forEach(transicao => {
          if (transicao.valor == valor) {
            valida = false;
            alert("transisao invalida para APN");
          }
        });
        if (valor == "") {
          valida = false;
          alert("transisao invalida para APN");
        }
        if (valida) {
          this.transicoes.push(new Transicao(this.numero, i, valor, this.transicoes.length, empilha, desempilha));
        }

        desenha(ctx);
      };

      estado.remove_transicao = function (i) {
        this.transicoes = this.transicoes.filter(objeto => objeto.numero !== i);
        for (i = 0; i < this.transicoes.length; ++i) {
          this.transicoes[i].numero = i;
        }
        desenha(ctx);
      };

      estado.torna_final = function () {
        this.final = !this.final;
        desenha(ctx);
      };
    });
    desenha(ctx);
  };

  // Inicia a leitura do arquivo como texto
  reader.readAsText(file);
});
