import { Automato } from "./libs/automato.js";
import { AFD } from "./src/afd.js";
/*
import {AFN} from "./src/afn.js";
import {AFNL} from "./src/afnl.js";
import {APD} from "./src/apd.js";
import {APN} from "./src/apn.js";
import {MT} from "./src/mt.js";
*/
let modo = 1;

const dicionario = {
  1:"AFD",
  2:"AFN",
  3:"AFNλ",
  4:"APD",
  5:"APN",
  6:"MT"
};

const cy = cytoscape({
  container: document.getElementById('grafo'),

  style: [
    {
      selector: 'node',
      style: {
        'text-valign': 'center',  
        'text-halign': 'center', 
        'background-color': '#0074D9',
        'label': 'data(id)',

        'border-width': 3,              
        'border-color': '#000000',      
        'border-opacity': 1,            
        'border-style': 'solid'
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

let automato = new AFD(cy);

window.inicia_automato = function(op){
  modo = op ;
  document.getElementById("sigla").innerText  = dicionario[modo];
  document.getElementById("titulo").innerText  = dicionario[modo];
  document.getElementById("download").innerText  = "Baixar "+dicionario[modo];
  document.getElementById("importar").innerText  = "Importar "+dicionario[modo];
}

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
    transicoes: [...automato.transicoes],
    tipo: automato.tipo
  };

  // Converte o objeto JSON em uma string
  const jsonString = JSON.stringify(aux);

  // Cria um Blob com a string JSON
  const blob = new Blob([jsonString], { type: "application/json" });

  // Cria um link de download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = dicionario[modo]+".json"; // Nome do arquivo a ser baixado

  // Adiciona o link à página e simula o clique
  document.body.appendChild(link);
  link.click();

  // Limpa o URL do objeto Blob após o download
  URL.revokeObjectURL(url);
});

document.getElementById("upload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return; // Se nenhum arquivo foi selecionado, saia da função

  // Cria um objeto FileReader para ler o conteúdo do arquivo
  const reader = new FileReader();

  // Define a função de callback a ser chamada quando a leitura for concluída
  reader.onload = function (event) {
    const jsonData = JSON.parse(event.target.result);
    if(jsonData.tipo == 1){
      automato = new AFD(cy);
    }
    automato.recuperador(jsonData.estados, jsonData.transicoes);
  };

  // Inicia a leitura do arquivo como texto
  reader.readAsText(file);
});
