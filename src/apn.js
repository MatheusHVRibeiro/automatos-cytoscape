import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato, Estado } from "../libs/automato.js";

class Momento {
    constructor() {
        this.i = 0;
        this.estado = 0;
        this.nbug = true;
        this.pilha = [];
    }
}

class Instancia {
    constructor(instancia) {
        if (instancia != null) {
            this.estadoAtual = instancia.estadoAtual;
            this.pilha = instancia.pilha;
            this.cor = instancia.cor;
            this.erro = instancia.erro;
        } else {
            this.estadoAtual = 0;
            this.pilha = [];
            this.cor = "#00FA9A";
            this.erro = false;
        }
    }
    empilha(valor) {
        let tabela = document.body.getElementById("pilha");
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerText = valor;
        td.value = valor;
        tr.appendChild(td);
        tabela.prepend(tr);
    }
    desempilha() {
        let tabela = document.body.getElementById("pilha");
        tabela.firstElementChild.remove();
    }
}

export class Transicao {
    constructor(origem, destino, leitura, empilha, desempilha) {
        this.origem = origem;
        this.destino = destino;
        this.leitura = leitura;
        this.empilha = empilha;
        this.desempilha = desempilha;
    }
}

export class APN extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 5;
        this.nome = "APN";
        this.momento = new Momento();
        this.instancias = [];

        this.formEstado = new FormularioEstado();
        this.campos_transicao();
        this.configura_opcoes();
    }

    configura_opcoes() {
        this.formopcoes = new FormularioOpcoes();

        this.formopcoes.final.addEventListener("click", () => {
            let i = this.formopcoes.sujeito;
            this.torna_final(i);
            this.formopcoes.fechar();
            console.log(this.estados);
        });

        this.formopcoes.inicial.addEventListener("click", () => {
            let i = this.formopcoes.sujeito;
            this.torna_inicial(i);
            this.formopcoes.fechar();
            console.log(this.estados);
        });
    }

    torna_inicial(nome) {
        let i = this.get_estado_by_nome(nome);

        this.estados.forEach(estado => {
            if (!estado.inicial && nome == estado.nome) {
                this.estados[i].inicial = true;

                this.cy.getElementById(this.estados[i].nome).style({ 'background-image': 'url(../img/inicial.png)' });
                this.cy.getElementById(this.estados[i].nome).style({ 'background-clip': ' none' });
                this.cy.getElementById(this.estados[i].nome).style({ 'bounds-expansion': ' 20' });
                this.cy.getElementById(this.estados[i].nome).style({
                    'background-width': '60px',
                    'background-height': '40px'
                });

                this.inicial = this.estados[i].nome;
            } else if ((estado.inicial && nome != estado.nome) || (estado.inicial && nome == estado.nome)) {
                this.estados[i].inicial = false;
                this.cy.getElementById(this.estados[i].nome).style({ 'background-image': 'none' });
            }

        });
    }

    recuperador(estados, transicoes) {
        estados.forEach(estado => {
            this.estados.push(new Estado(estado.nome, estado.final, estado.inicial));
        });
        transicoes.forEach(transicao => {
            this.transicoes.push(new Transicao(transicao.origem, transicao.destino, transicao.leitura, transicao.empilha, transicao.desempilha));
        });
        this.cria_desenho();
    }

    campos_transicao() {
        let div = document.createElement("div");
        let texto = document.createElement("input");
        texto.placeholder = "leitura";
        let empilha = document.createElement("input");
        empilha.placeholder = "empilha";
        let desempilha = document.createElement("input");
        desempilha.placeholder = "desempilha";
        div.appendChild(texto);
        div.appendChild(document.createElement("br"));
        div.appendChild(empilha);
        div.appendChild(document.createElement("br"));
        div.appendChild(desempilha);
        div.appendChild(document.createElement("br"));

        this.formTransicao = new FormularioTransicao(div);
    }

    adiciona_estado() {
        this.formEstado.adiciona.addEventListener("click", () => {
            super.adiciona_estado(this.formEstado.nome.value);
            this.formEstado.fechar();
        });
        document.body.appendChild(this.formEstado.div);
    }

    adiciona_transicao() {
        this.formTransicao.adiciona.addEventListener("click", () => {
            let leitura = this.formTransicao.texto.children[0];
            let empilha = this.formTransicao.texto.children[2];
            let desempilha = this.formTransicao.texto.children[4];
            let texto = leitura.value + "," + desempilha.value + "/" + empilha.value;
            super.adiciona_transicao(
                texto,
                this.formTransicao.origem.value,
                this.formTransicao.destino.value,
            );
            this.formTransicao.fechar();
        });
        document.body.appendChild(this.formTransicao.div);
    }

    nova_transicao(texto, origem, destino) {
        let leitura = texto[0];
        let desempilha = texto[2];
        let empilha = "";
        for (let i = 4; i < texto.length; i++) {
            empilha = empilha + texto[i];
        }
        this.transicoes.push(new Transicao(origem, destino, leitura, empilha, desempilha));
        console.log(this.transicoes);
    }

    testa_palavra() {
        this.zera();
        this.estados.forEach(estado => {
            if (estado.inicial) {
                this.inicial = estado.nome
            }
        });
        let final = document.getElementById("palavra").value.length;
        let resultado = true;
        this.zera();

        while (this.momento.i < final) {
            if (resultado) {
                resultado = this.executa_momento();
            }
            ++this.momento.i;
        }

        if (this.estados[this.get_estado_by_nome(this.momento.estado)].final && resultado) {
            new Alerta("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }

    zera() {
        this.momento.estado = this.inicial;
        this.momento.i = 0;
        this.momento.nbug = true;
        this.instancias = [];
        this.instancias[0] = new Instancia();
        this.instancias = this.fecho(this.instancias);
    }

    executa_momento() {
        let temp = [];

        for (let i = 0; i < this.instancias.length; i++) {
            temp.push(...this.transisoes_validas(this.momento.i, this.instancias[i]));
        }
        this.instancias = [...temp];
        temp = [];

        this.reduz_instancias();
    }

    transisoes_validas(pos, instancia) {
        palavra = document.getElementById("palavra").value;
        let validos = [];
        let aux;
        let cont = 0;
        this.transicoes.forEach(transicao => {
            console.log(palavra[pos]);
            if (transicao.origem == instancia.estadoAtual && transicao.valor == palavra[pos]) {
                if (cont > 0) {
                    aux = new Instancia();
                    aux.estadoAtual = transicao.destino;
                    aux.pilha = [...instancia.pilha];
                    if (this.pop_instancia(aux, transicao.desempilha)) {
                        this.push_instancia(aux, transicao.empilha);
                        validos.push(aux);
                        cont++;
                    }
                } else {
                    if (this.pop_instancia(instancia, transicao.desempilha)) {
                        instancia.estadoAtual = transicao.destino;
                        this.push_instancia(instancia, transicao.empilha);
                        validos.push(instancia);
                        cont++;
                    }
                }
            }

        });
        return this.fecho(validos);

    }

    pop_instancia(instancia, desempilha) {
        if (instancia.pilha[instancia.pilha.length - 1] == desempilha) {
            instancia.pilha.pop();
            return true;
        }
        return desempilha == "";

    }

    push_instancia(instancia, empilha) {
        for (const char of empilha) {
            instancia.pilha.push(char);
        }
    }

    fecho(validos) {
        let aux;
        for (let i = 0; i < validos.length; i++) {
            this.transicoes.forEach(transicao => {
                if (transicao.origem == validos[i].estadoAtual) {
                    if (transicao.valor == "") {
                        aux = new Instancia();
                        aux.estadoAtual = transicao.destino;
                        aux.pilha = [...validos[i].pilha];
                        if (pop_instancia(aux, transicao.desempilha)) {
                            push_instancia(validos[i], transicao.empilha);
                            validos.push(aux);

                        }
                    }
                }
            });
        }
        return validos;
    }

    reduz_instancias() {
        let novo = [];
        let repete = false;
        for (let i = 0; i < this.instancias.length; i++) {
            for (let j = i + 1; j < this.instancias.length; j++) {
                if (this.instancias[i].estadoAtual == this.instancias[j].estadoAtual && this.instancias[i].pilha.length === this.instancias[j].pilha.length) {
                    if (this.instancias[i].pilha.every((x, k) => this.instancias[j].pilha[k] == x)) {
                        repete = true;
                    }
                }
            }
            if (!repete) {
                novo.push(this.instancias[i]);
            }
            repete = false;
        }

        this.instancias = [...novo]
    }

    opcoes(i) {
        this.formopcoes.sujeito = i;
        document.body.appendChild(this.formopcoes.div);
    }

    proximo() {
        let colunas = document.getElementById("tabelaPalavra").children;
        let final = document.getElementById("palavra").value.length;
        if (this.momento.i < final) {
            if (this.momento.nbug) {
                colunas[this.momento.i].style.backgroundColor = "white";
                this.cy.getElementById(this.momento.estado).style({ 'background-color': '#0074D9' });
                this.momento.nbug = this.executa_momento();
                colunas[this.momento.i + 1].style.backgroundColor = "green";
                this.cy.getElementById(this.momento.estado).style({ 'background-color': 'green' });
            }
            ++this.momento.i;
        } else {
            if (this.estados[this.get_estado_by_nome(this.momento.estado)].final && this.momento.nbug) {
                new Alerta("palavra aceita");
            } else {
                new Alerta("palavra recusada");
            }
        }
    }
}
