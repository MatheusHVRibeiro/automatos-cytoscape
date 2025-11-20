import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato, Estado, Transicao } from "../libs/automato.js";

class Momento {
    constructor() {
        this.i = 0;
        this.estado = 0;
    }
}

export class AFD extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 1;
        this.nome = "AFD";
        this.momento = new Momento();

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
        estados.forEach(estado=>{
            this.estados.push(new Estado(estado.nome,estado.final,estado.inicial));
        });
        transicoes.forEach(transicao=>{
            this.transicoes.push(new Transicao(transicao.origem,transicao.destino,transicao.texto));
        });
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

    testa_palavra() {
        this.estados.forEach(estado=>{
            if(estado.inicial){
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
    debuga_palavra(){
        console.log(this.estados);
    }

    zera() {
        this.momento.estado = this.inicial;
        this.momento.i = 0;
    }

    executa_momento() {
        let palavra = document.getElementById("palavra");
        let passou = false;

        this.transicoes.forEach(transicao => {
            if (transicao.origem == this.momento.estado&&
                palavra.value[this.momento.i] == transicao.texto) {

                this.momento.estado = transicao.destino;
                passou = true;
            }
        });

        return passou;
    }

    opcoes(i) {
        this.formopcoes.sujeito = i;
        document.body.appendChild(this.formopcoes.div);
    }
}

