import { Alerta, FormularioEstado, FormularioTransicao } from "../libs/formulario.js";
import { Automato } from "../libs/automato.js";

export class AFD extends Automato {
    constructor(cy) {
        super(cy);
        this.nome = "AFD";
        this.formEstado = new FormularioEstado();
        this.campos_transicao();
    }
    campos_transicao() {
        let texto = document.createElement("input");
        texto.placeholder = "leitura";
        this.formTransicao = new FormularioTransicao(texto);
    }

    adiciona_estado() {
        this.formEstado.adiciona.addEventListener("click", () => {
            super.adiciona_estado(this.formEstado.nome.value);
            document.body.removeChild(this.formEstado.div);
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
            document.body.removeChild(this.formTransicao.div);
        });
        document.body.appendChild(this.formTransicao.div);
    }

    testa_palavra() {
        palavra = document.getElementById("palavra");
        let estadoAtual = 0;
        let passou = false;
        let erro = false;
        for (let i = 0; i < palavra.value.length; i++) {
            this.transicoes.forEach(transicao => {
                if (transicao.origem == estadoAtual) {
                    if (palavra.value[i] == transicao.texto) {
                        estadoAtual = transicao.destino;
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
            new ("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }
    debuga_palavra() {
        console.log("chegou aqui");
    }
}

