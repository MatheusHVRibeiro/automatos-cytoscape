class Estado {
  constructor(nome) {
    this.nome = nome;
    this.final = false;
  }
  torna_final() {
    if (this.final) {
      this.final = false;
      cy.getElementById(this.nome).style({'border-style': 'solid','border-width': 3});
    } else {
      this.final = true;
      cy.getElementById(this.nome).style({'border-style': 'double','border-width': 10});
    }
  }
}

class Transicao {
  constructor(origem, destino, texto) {
    this.origem = origem;
    this.destino = destino;
    this.texto = texto;
  }
}

export class Automato {
  constructor(cy) {
    this.tipo = 0;
    this.nome = "";
    this.estados = [];
    this.transicoes = [];
    this.cy = cy;
  }

  cria_desenho() {
    this.estados.forEach(estado => {
      this.cy.add({ data: { id: estado.nome } });
    });
    this.transicoes.forEach(transicao => {
      let id = transicao.origem + "->" + transicao.texto + "->" + transicao.destino;
      this.cy.add({ data: { id: id, source: transicao.origem, target: transicao.destino, valor: transicao.texto } });
    });
    this.cy.layout({ name: 'circle' }).run();
  }

  adiciona_estado(novo) {
    let repete = false;
    this.estados.forEach(estado => {
      if (novo == estado.nome) {
        repete = true;
      }
    });
    if (!repete) {
      this.estados.push(new Estado(novo));
      this.cy.add({ data: { id: novo } });
      this.cy.layout({ name: 'circle' }).run();
    } else {
      alert("já existe um estado com este nome, favor incerir outro nome");
    }
  }

  adiciona_transicao(texto, origem, destino) {
    let id = origem + "->" + texto + "->" + destino;
    let repete = false;
    this.transicoes.forEach(transicao => {
      if (texto == transicao.texto && origem == transicao.origem && destino == transicao.destino) {
        repete = true;
      }
    });
    if (!repete) {
      this.transicoes.push(new Transicao(origem, destino, texto));
      this.cy.add({ data: { id: id, source: origem, target: destino, valor: texto } });
      this.cy.layout({ name: 'circle' }).run();
    } else {
      alert("Esta transição já existe, tente valores diferentes");
    }
  }


}
