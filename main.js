import { cy } from "./libs/cy.js";
import { AFD } from "./src/afd.js";
/*
import {AFN} from "./src/afn.js";
import {AFNL} from "./src/afnl.js";
import {APD} from "./src/apd.js";
import {APN} from "./src/apn.js";
import {MT} from "./src/mt.js";
*/

export class Main {
  constructor() {
    this.automato = new AFD(cy);
    this.modo = 1;
    this.dicionario = {
      1: "AFD",
      2: "AFN",
      3: "AFNλ",
      4: "APD",
      5: "APN",
      6: "MT"
    };

    document.getElementById("addEstado").addEventListener("click", this.automato.adiciona_estado.bind(this.automato));
    document.getElementById("addTransicao").addEventListener("click", this.automato.adiciona_transicao.bind(this.automato));

    document.getElementById("testa_palavra").addEventListener("click", this.automato.testa_palavra.bind(this.automato));
    document.getElementById("debuga_palavra").addEventListener("click", this.automato.debuga_palavra.bind(this.automato));
    
    document.getElementById("download").addEventListener("click", this.download.bind(this));
    document.getElementById("upload").addEventListener("change", this.le_arquivo.bind(this));

    window.inicia_automato = this.carrega_modo.bind(this);
  }

  download() {
    let aux = {
      estados: [...this.automato.estados],
      transicoes: [...this.automato.transicoes],
      tipo: this.automato.tipo
    };

    const jsonString = JSON.stringify(aux);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.dicionario[this.modo] + ".json";

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
  }

  le_arquivo(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      this.carrega_automato(jsonData);
    };

    reader.readAsText(file);
  }

  carrega_automato(jsonData) {
    if (jsonData.modo == 1) {
      this.automato = new AFD(cy);
    }
    this.automato.recuperador(jsonData.estados, jsonData.transicoes);
  }

  carrega_modo(op) {
    this.modo = op;
    document.getElementById("sigla").innerText = this.dicionario[this.modo];
    document.getElementById("titulo").innerText = this.dicionario[this.modo];
    document.getElementById("download").innerText = "Baixar " + this.dicionario[this.modo];
    document.getElementById("importar").innerText = "Importar " + this.dicionario[this.modo];
  }

}

const main = new Main();
