export const cy = cytoscape({
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

  layout: {
    name: 'preset',

    fit: false
  }
});

cy.on('cxttap', 'node', function (evt) {
  const node = evt.target;
  automato.opcoes(node.id());
});
