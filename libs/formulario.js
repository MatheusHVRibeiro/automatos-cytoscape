class Formulario{
    constructor(){
        this.x = window.innerWidth / 3;
        this.y = window.innerHeight / 3;

        this.div = document.createElement("div");
        this.div.className = "menu";
        this.div.style.position = "absolute";
        this.div.style.backgroundColor = "white";
        this.div.style.border = "1px solid black";
        this.div.style.padding = "5px";
        this.div.style.left = this.x + "px";
        this.div.style.top = this.y + "px";
        this.div.style.display = "flex";
        this.div.style.flexDirection = "column";

    }
} 

export class FormularioEstado extends Formulario {
    constructor() {
        super();
        this.nome = document.createElement("input");
        this.nome.placeholder = "nome";
        this.div.appendChild(this.nome);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "adcionar"
        this.div.appendChild(this.adiciona);
    }
}

export class FormularioTransicao extends Formulario {
    constructor(texto) {
        super();
        this.origem = document.createElement("input");
        this.origem.placeholder = "origem";
        this.div.appendChild(this.origem);

        this.destino = document.createElement("input");
        this.destino.placeholder = "destino";
        this.div.appendChild(this.destino);

        this.texto = texto;
        this.div.appendChild(this.texto);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "adcionar";
        this.div.appendChild(this.adiciona);
    }
}

export class Alerta extends Formulario{
    constructor(texto) {
        super();
        this.alerta = document.createElement("label");
        this.alerta.innerText = texto;
        this.div.appendChild(this.alerta);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "adcionar"
        this.div.appendChild(this.adiciona);

        this.adiciona.addEventListener("click", () => {
            document.body.removeChild(this);
        });
        document.body.appendChild(this);
    }
}