export class Estado {
  constructor(id, nome, final = false, inicial = false) {
    this.id = id;
    this.nome = nome;
    this.final = final;
    this.inicial = inicial;
  }

  torna_inicial() {
    this.inicial = !this.inicial;
  }

  torna_final() {
    this.final = !this.final;
  }

}

export class Transicao {
  constructor(id, origem, destino, texto, extras = {}) {
    this.id = id;
    this.origem = origem;
    this.destino = destino;
    this.texto = texto;
    this.extras = extras;
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

  verifica_estado(novo) {
    let valido = true;
    this.estados.forEach(estado => {
      if (novo == estado.nome) {
        valido = false;
      }
    });
    return valido
  }

  adiciona_estado(novo) {
    if (this.verifica_estado(novo)) {
      this.estados.push(new Estado(this.estados.length, novo));
    } else {
      alert("já existe um estado com este nome, favor incerir outro nome");
    }
  }

  verifica_transicao(transicao) {
    let aprovada = true;
    this.transicoes.forEach(trans => {
      if (transicao.texto == trans.texto && transicao.origem == trans.origem && transicao.destino == trans.destino) {
        aprovada = false;
      }
    });
    return aprovada
  }

  adiciona_transicao(transicao) {
    if (this.verifica_transicao(transicao)) {
      let id = this.transicoes.length;
      this.transicoes.push(new Transicao(id, transicao.origem, transicao.destino, transicao.texto, transicao.extras));
    } else {
      alert("Esta transição já existe, tente valores diferentes");
    }
  }
  
  recuperador(estados, transicoes){
    estados.forEach(estado => {
      this.adiciona_estado(estado.nome);
    });
    transicoes.forEach(transicao=>{
      this.adiciona_transicao(transicao);
      this.recupera_extras(transicao);
    });
  }

  recupera_extras(transicao){
    throw new Error('instancia de Automato criada indevidamente para: '+ transicao);
  }

}
