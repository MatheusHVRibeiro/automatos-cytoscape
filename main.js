import {cy} from "./libs/cy.js";
import { AFD } from "./src/afd.js";
/*
import {AFN} from "./src/afn.js";
import {AFNL} from "./src/afnl.js";
import {APD} from "./src/apd.js";
import {APN} from "./src/apn.js";
import {MT} from "./src/mt.js";
*/

const dicionario = {
  1: "AFD",
  2: "AFN",
  3: "AFNλ",
  4: "APD",
  5: "APN",
  6: "MT"
};
let modo = 1;
let automato = new AFD(cy);



window.inicia_automato = function (op) {
  modo = op;
  document.getElementById("sigla").innerText = dicionario[modo];
  document.getElementById("titulo").innerText = dicionario[modo];
  document.getElementById("download").innerText = "Baixar " + dicionario[modo];
  document.getElementById("importar").innerText = "Importar " + dicionario[modo];
}

export function init() {

  document.getElementById("addEstado").addEventListener("click", automato.adiciona_estado.bind(automato));
  document.getElementById("addTransicao").addEventListener("click", automato.adiciona_transicao.bind(automato));

  document.getElementById("testa_palavra").addEventListener("click", automato.testa_palavra.bind(automato));
  document.getElementById("debuga_palavra").addEventListener("click", automato.debuga_palavra.bind(automato));
}

init();

document.getElementById("download").addEventListener("click", function () {
  let aux = {
    estados: [...automato.estados],
    transicoes: [...automato.transicoes],
    tipo: automato.tipo
  };

  const jsonString = JSON.stringify(aux);

  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = dicionario[modo] + ".json"; 

  document.body.appendChild(link);
  link.click();


  URL.revokeObjectURL(url);
});

function lerArquivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

document.getElementById("upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const texto = await lerArquivo(file);
  const jsonData = JSON.parse(texto);

  if (jsonData.tipo == 1) {
    automato = new AFD(cy);
  }
  automato.recuperador(jsonData.estados, jsonData.transicoes);
  console.log(automato.estados);
});