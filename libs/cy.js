export class Grafo {
  constructor(automato) {
    this.automato = automato;

    this.cy = cytoscape({
      container: document.getElementById('grafo'),
      style: [
        {
          selector: 'node',
          style: {
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#0074D9',
            'label': 'data(nome)',

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
            'label': 'data(nome)',
            'font-size': 12,
            'color': '#333',
            'text-background-color': '#fff',
            'text-background-opacity': 0.5,
            'text-background-padding': '2px',
            'text-margin-y': -12,
            'text-wrap': 'wrap',

            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'preset',

        fit: false
      }
    });
    console.log(this.automato);
    this.cy.on('cxttap', 'node', function (evt) {
      console.log(this.automato);
      this.automato.opcoes(evt.target.id());
    });
  }

  adciona_aresta(id, origem, destino, texto) {
    let repete = false;
    this.cy.edges().forEach(edge => {
      if (edge.source() == origem && edge.target == destino) {
        edge.data('nome', edge.label() + ';' + texto);
        repete = true;
      }
    });
    if (!repete) {
      this.cy.add({ data: { id: id, source: origem, target: destino, nome: texto } });
    }
    this.cy.layout({ name: 'preset' }).run();
  }

  adciona_no(id, nome, final, inicial) {
    this.cy.add({ data: { id: id, nome: nome } });
    this.cy.layout({ name: 'preset' }).run();
    if(final){
        this.no_final(id);
      }
      if(inicial){
        this.no_inicial(id);
      }
  }

  no_inicial(id) {
    this.cy.getElementById(id).style({ 'background-image': 'url(../img/inicial.png)' });
    this.cy.getElementById(id).style({ 'background-clip': ' none' });
    this.cy.getElementById(id).style({ 'bounds-expansion': ' 20' });
    this.cy.getElementById(id).style({
      'background-width': '60px',
      'background-height': '40px'
    });
  }

  no_final(id) {
    this.cy.getElementById(id).style({ 'border-style': 'double', 'border-width': 10 });
  }

  no_n_inicial(id) {
    this.cy.getElementById(id).style({ 'background-image': 'none' });
  }
  
  no_n_final(id) {
    this.cy.getElementById(id).style({ 'border-style': 'solid', 'border-width': 3 });
  }

  atualizar() {
    cy.elements().remove();
    this.automato.estados.forEach(estado => {
      this.adciona_no(estado.id, estado.nome, estado.final, estado.inicial);
    });

    this.automato.transicoes.forEach(transicao => {
      adciona_aresta(transicao.id, transicao.origem, transicao.destino, transicao.texto) ;
    });
  }

}