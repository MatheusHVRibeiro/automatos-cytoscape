export class Estado {
  constructor(nome, final = false, inicial = false) {
    this.nome = nome;
    this.final = final;
    this.inicial = inicial;
  }
  
}

export class Transicao {
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
    this.inicial = null;
    this.debug = false;
  }

  cria_desenho() {
    this.estados.forEach(estado => {
      this.cy.add({ data: { id: estado.nome } });
      if (estado.inicial) {
        this.cy.getElementById(estado.nome).style({ 'background-image': 'url(../img/inicial.png)' });
        this.cy.getElementById(estado.nome).style({ 'background-clip': ' none' });
        this.cy.getElementById(estado.nome).style({ 'bounds-expansion': ' 20' });
        this.cy.getElementById(estado.nome).style({
          'background-width': '60px',
          'background-height': '40px'
        });
      }
      if (estado.final) {
        this.cy.getElementById(estado.nome).style({ 'border-style': 'double', 'border-width': 10 });
      }
    });
    this.transicoes.forEach(transicao => {
      let id = transicao.origem + "->" + transicao.texto + "->" + transicao.destino;
      this.cy.add({ data: { id: id, source: transicao.origem, target: transicao.destino, valor: transicao.texto } });
    });
    this.cy.layout({ name: 'preset' }).run();
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
      this.cy.layout({ name: 'preset' }).run();
    } else if (repete) {
      alert("já existe um estado com este nome, favor incerir outro nome");
    }
  }

  adiciona_transicao(texto, origem, destino) {
    console.log(origem + "->" + texto + "->" + destino);
    let id = origem + "->" + texto + "->" + destino;
    let repete = false;
    this.transicoes.forEach(transicao => {
      if (texto == transicao.texto && origem == transicao.origem && destino == transicao.destino) {
        repete = true;
      }
    });
    if (!repete) {
      this.nova_transicao(texto, origem, destino)
      this.cy.add({ data: { id: id, source: origem, target: destino, valor: texto } });
      this.cy.layout({ name: 'preset' }).run();
    } else if (repete) {
      alert("Esta transição já existe, tente valores diferentes");
    }
  }

  nova_transicao(texto, origem, destino){
    this.transicoes.push(new Transicao(origem, destino, texto));
  }

  torna_final(nome) {
    let i = this.get_estado_by_nome(nome);
    if (this.estados[i].final) {
      this.estados[i].final = false;
      this.cy.getElementById(this.estados[i].nome).style({ 'border-style': 'solid', 'border-width': 3 });
    } else {
      this.estados[i].final = true;
      this.cy.getElementById(this.estados[i].nome).style({ 'border-style': 'double', 'border-width': 10 });
    }
  }

  torna_inicial(nome) {

    let i = this.get_estado_by_nome(nome);
    if (this.estados[i].inicial) {
      this.estados[i].inicial = false;
      this.cy.getElementById(this.estados[i].nome).style({ 'background-image': 'none' });
    } else {
      this.cy.getElementById(this.estados[i].nome).style({ 'background-image': 'url(../img/inicial.png)' });
      this.cy.getElementById(this.estados[i].nome).style({ 'background-clip': ' none' });
      this.cy.getElementById(this.estados[i].nome).style({ 'bounds-expansion': ' 20' });
      this.cy.getElementById(this.estados[i].nome).style({
        'background-width': '60px',   // pode ser % ou px
        'background-height': '40px'
      });
    }
  }
  
  get_estado_by_nome(nome) {
    for (let i = 0; i < this.estados.length; i++) {
      if (this.estados[i].nome == nome) {
        return i;
      }
    }
  }

  debuga_palavra() {
    let row = document.getElementById("tabelaPalavra");
    let area = document.getElementById("debugArea");
    let palavra = document.getElementById("palavra")
    if (!this.debug) {
      palavra.readOnly = true;
      for (let i = 0; i < palavra.value.length; i++) {
        let cell = document.createElement("td");
        cell.innerText = palavra.value[i];
        cell.className = "caracter";
        row.appendChild(cell);
      }
      area.style.display = "block";
      this.debug = true;
      if(this.tipo == 4 || this.tipo == 5){
        console.log(this.tipo);
        document.getElementById("pilha").style.display = "block";
      }
    } else if (this.debug) {
      row.innerHTML = "<td class='caracter' style='background-color:green;'>&nbsp;</td>";
      palavra.readOnly = false;
      area.style.display = "none";
      document.getElementById("pilha").style.display = "none";
      this.debug = false;
    }

  }
}
