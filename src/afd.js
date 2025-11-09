import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato } from "../libs/automato.js";

export class AFD extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 1;
        this.nome = "AFD";

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
                    'background-width': '60px',   // pode ser % ou px
                    'background-height': '40px'
                });
                
                this.inicial = i;
            } else if ((estado.inicial && nome != estado.nome) || (estado.inicial && nome == estado.nome)) {
                this.estados[i].inicial = false;
                this.cy.getElementById(this.estados[i].nome).style({ 'background-image': 'none' });
            }

        });
    }

    recuperador(estados, transicoes) {
        this.estados = [...estados];
        this.transicoes = [...transicoes];
        this.cria_desenho();
    }

    campos_transicao() {
        let texto = document.createElement("input");
        texto.placeholder = "leitura";
        this.formTransicao = new FormularioTransicao(texto);
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
            super.adiciona_transicao(
                this.formTransicao.texto.value,
                this.formTransicao.origem.value,
                this.formTransicao.destino.value,
            );
            this.formTransicao.fechar();
        });
        document.body.appendChild(this.formTransicao.div);
    }

    executa_passo(passo) {
        palavra = document.getElementById("palavra");
        let estadoAtual = this.get_estado_by_nome(this.inicial);
        let passou = false;
        let erro = false;
        for (let i = 0; i < passo; i++) {
            this.transicoes.forEach(transicao => {
                if (transicao.origem == estadoAtual) {
                    if (palavra.value[i] == transicao.texto) {
                        estadoAtual = transicao.destino;
                        console.log("estado atual ; "+estadoAtual);
                        passou = true;
                    }
                }
            });
            if (!passou) {
                erro = true;
            }
            passou = false;
        }
        if (this.estados[estadoAtual].final && !erro) {
            new Alerta("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }

    testa_palavra() {
        palavra = document.getElementById("palavra");
        this.executa_passo(palavra.value.length);
    }

    debuga_palavra() {
        console.log("chegou aqui");
    }

    opcoes(i) {
        this.formopcoes.sujeito = i;
        document.body.appendChild(this.formopcoes.div);
    }
}

