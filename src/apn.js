import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato, Estado } from "../libs/automato.js";

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

    push(empilha) {
        for (const char of empilha) {
            this.pilha.push(char);
            this.empilha(empilha);
        }
    }

    desempilha() {
        let tabela = document.body.getElementById("pilha");
        tabela.firstElementChild.remove();
    }

    pop(desempilha) {
        if (this.pilha[this.pilha.length - 1] == desempilha || desempilha == "") {
            this.pilha.pop();
            this.desempilha();
            return true;
        } else {
            return false;
        }
    }


}

export class APN extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 5;
        this.nome = "APN";
        this.momento = 0;
        this.instancias = [];

        this.formEstado = new FormularioEstado();
        this.campos_transicao();
        this.configura_opcoes();
        this.botoes_formulario();
    }

    botoes_formulario() {
        this.formEstado.adiciona.onclick = () => {
            super.adiciona_estado(this.formEstado.nome.value);
            this.formEstado.fechar();
        };
        this.formTransicao.adiciona.onclick = () => {
            let leitura = this.formTransicao.texto.children[0].value;
            let Tleitura = leitura;
            if (Tleitura == "") {
                Tleitura = "λ";
            }
            let empilha = this.formTransicao.texto.children[2].value;
            let Tempilha = empilha;
            if (Tempilha == "") {
                Tempilha = "λ";
            }
            let desempilha = this.formTransicao.texto.children[4].value;
            let Tdesempilha = desempilha;
            if (Tdesempilha == "") {
                Tdesempilha = "λ";
            }
            let texto = Tleitura + "," + Tdesempilha + "/" + Tempilha;
            super.adiciona_transicao({
                texto: texto,
                origem: this.formTransicao.origem.value,
                destino: this.formTransicao.destino.value,
                extras: {
                    empilha: empilha,
                    desempilha: desempilha
                }
            });
            this.formTransicao.fechar();
        };
    }

    configura_opcoes() {
        this.formopcoes = new FormularioOpcoes();

        this.formopcoes.final.onclick = () => {
            let i = this.formopcoes.sujeito;
            this.estados[i].torna_final();
            this.cy.no_final(i, this.estados[i].final);
            this.formopcoes.fechar();
        };

        this.formopcoes.inicial.onclick = () => {
            let i = this.formopcoes.sujeito;
            this.estados[i].torna_inicial();
            this.cy.no_inicial(i, this.estados[i].inicial);
            this.formopcoes.fechar();
        };
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

    exibe_form_estado() {
        document.body.appendChild(this.formEstado.div);
    }

    exibe_form_transicao() {
        document.body.appendChild(this.formTransicao.div);
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

        if (this.verifica_aceitacao()) {
            new Alerta("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }

    zera() {
        this.momento = 0;
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
        console.log(this.instancias);
        let colunas = document.getElementById("tabelaPalavra").children;
        let final = document.getElementById("palavra").value.length;
        if (this.momento < final) {

            colunas[this.momento].style.backgroundColor = "white";
            this.instancias.forEach(instancia => {
                this.cy.getElementById(instancia.estadoAtual).style({ 'background-color': '#0074D9' });
            });

            this.executa_momento();
            colunas[this.momento + 1].style.backgroundColor = "green";
            this.instancias.forEach(instancia => {
                this.cy.getElementById(instancia.estadoAtual).style({ 'background-color': 'green' });
            });
            ++this.momento;
        } else {
            if (this.verifica_aceitacao()) {
                new Alerta("palavra aceita");
            } else {
                new Alerta("palavra recusada");
            }
        }
    }

    verifica_aceitacao() {
        let resposta = false;
        this.instancias.forEach(instancia => {
            resposta = resposta || (this.estados[instancia.estadoAtual].final && instancia.pilha.length == 0);
        });
        return resposta;
    }
}
