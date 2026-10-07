//
// FASE 1: Captura dos elementos do DOM
//

const campoTarefa = document.getElementById("campo-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");

const prioridade = document.getElementById("prioridade");

const botaoTema = document.getElementById("botao-tema");

const porcentagem = document.getElementById("porcentagem");
const barraProgresso = document.getElementById("barra-progresso");

const botaoLimpar = document.getElementById("botao-limpar");

const inputFoto = document.getElementById("input-foto");
const fotoPerfil = document.getElementById("foto-perfil");

const filtros = document.querySelectorAll(".filtro");


//
// FASE 2: Gerenciamento de Estado
//

const tarefas = [];


//
// FASE 2.1: Persistência com localStorage
//

const CHAVE_STORAGE = "tarefas";

// Função para SALVAR as tarefas
function salvarTarefas() {

    const tarefasEmTexto =
        JSON.stringify(tarefas);

    localStorage.setItem(
        CHAVE_STORAGE,
        tarefasEmTexto
    );
}

// Função para CARREGAR as tarefas
function carregarTarefas() {

    const dadosSalvos =
        localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {

        const tarefasSalvas =
            JSON.parse(dadosSalvos);

        tarefasSalvas.forEach(function(tarefa) {

            tarefas.push(tarefa);

        });
    }
}


//
// FASE 3: Mostrar as tarefas
//

function mostrarTarefas() {

    listaTarefas.innerHTML = "";

    const filtro =
        document.querySelector(".filtro.ativo")
        .dataset.filtro;

    let lista = tarefas;


    if (filtro === "pendentes") {

        lista = tarefas.filter(
            tarefa => !tarefa.concluida
        );
    }


    if (filtro === "concluidas") {

        lista = tarefas.filter(
            tarefa => tarefa.concluida
        );
    }


    lista.forEach(function(tarefa) {

        const item =
            document.createElement("li");


        item.classList.add(
            "item-tarefa",
            "prioridade-" + tarefa.prioridade
        );


        if (tarefa.concluida) {

            item.classList.add("concluido");
        }


        const conteudo =
            document.createElement("div");

        conteudo.classList.add(
            "conteudo-tarefa"
        );


        const texto =
            document.createElement("span");

        texto.textContent =
            tarefa.texto;


        conteudo.appendChild(texto);


        const acoes =
            document.createElement("div");

        acoes.classList.add("acoes");

        const concluir =
            document.createElement("button");

        concluir.classList.add(
            "botao-acao"
        );


        concluir.innerHTML =
            tarefa.concluida
            ? '<i class="fa-solid fa-rotate-left"></i>'
            : '<i class="fa-solid fa-check"></i>';


        concluir.title =
            tarefa.concluida
            ? "Desmarcar"
            : "Concluir";


        concluir.onclick = function() {

            tarefa.concluida =
                !tarefa.concluida;

            salvarTarefas();

            mostrarTarefas();
        };

        const editar =
            document.createElement("button");

        editar.classList.add(
            "botao-acao"
        );


        editar.innerHTML =
            '<i class="fa-solid fa-pen"></i>';

        editar.title = "Editar";


        editar.onclick = function() {

            const novoTexto =
                prompt(
                    "Digite o novo nome da tarefa:",
                    tarefa.texto
                );


            if (
                novoTexto !== null &&
                novoTexto.trim() !== ""
            ) {

                tarefa.texto =
                    novoTexto.trim();

                salvarTarefas();

                mostrarTarefas();
            }
        };

        const excluir =
            document.createElement("button");

        excluir.classList.add(
            "botao-acao",
            "botao-excluir"
        );


        excluir.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        excluir.title = "Excluir";


        excluir.onclick = function() {

            const indice =
                tarefas.findIndex(
                    t => t.id === tarefa.id
                );


            if (indice !== -1) {

                tarefas.splice(indice, 1);
            }


            salvarTarefas();

            mostrarTarefas();
        };


        acoes.appendChild(concluir);
        acoes.appendChild(editar);
        acoes.appendChild(excluir);


        item.appendChild(conteudo);
        item.appendChild(acoes);


        listaTarefas.appendChild(item);
    });


    atualizarContador();
    atualizarProgresso();
}


//
// FASE 4: Adicionar uma tarefa
//

function adicionarTarefa() {

    const texto =
        campoTarefa.value.trim();


    if (texto === "") {

        alert("Digite uma tarefa!");

        campoTarefa.focus();

        return;
    }


    const novaTarefa = {

        id: Date.now(),

        texto: texto,

        prioridade: prioridade.value,

        concluida: false
    };


    tarefas.push(novaTarefa);

    salvarTarefas();

    campoTarefa.value = "";

    campoTarefa.focus();

    mostrarTarefas();
}


botaoAdicionar.onclick =
    adicionarTarefa;


// Adicionar apertando Enter

campoTarefa.addEventListener(
    "keydown",
    function(evento) {

        if (evento.key === "Enter") {

            adicionarTarefa();
        }
    }
);


//
// FASE 5: Contador
//

function atualizarContador() {

    const total =
        tarefas.length;


    const concluidas =
        tarefas.filter(
            tarefa => tarefa.concluida
        ).length;


    const pendentes =
        total - concluidas;


    if (total === 0) {

        contador.textContent =
            "Nenhuma tarefa";

    } else {

        contador.textContent =
            pendentes +
            " pendente(s) • " +
            concluidas +
            " concluída(s)";
    }
}


//
// FASE 5.1: Barra de progresso
//

function atualizarProgresso() {

    const total =
        tarefas.length;


    const concluidas =
        tarefas.filter(
            tarefa => tarefa.concluida
        ).length;


    let progresso = 0;


    if (total > 0) {

        progresso =
            Math.round(
                (concluidas / total) * 100
            );
    }


    porcentagem.textContent =
        progresso + "%";


    barraProgresso.style.width =
        progresso + "%";
}


//
// FASE 5.2: Filtros
//

filtros.forEach(function(filtro) {

    filtro.onclick = function() {

        filtros.forEach(function(botao) {

            botao.classList.remove("ativo");
        });


        filtro.classList.add("ativo");

        mostrarTarefas();
    };
});


//
// FASE 5.3: Limpar tarefas concluídas
//

botaoLimpar.onclick = function() {

    for (
        let i = tarefas.length - 1;
        i >= 0;
        i--
    ) {

        if (tarefas[i].concluida) {

            tarefas.splice(i, 1);
        }
    }


    salvarTarefas();

    mostrarTarefas();
};


//
// FASE 5.4: Modo escuro
//

botaoTema.onclick = function() {

    document.body.classList.toggle(
        "modo-escuro"
    );


    const escuro =
        document.body.classList.contains(
            "modo-escuro"
        );


    const icone =
        botaoTema.querySelector("i");


    if (escuro) {

        icone.classList.remove("fa-moon");

        icone.classList.add("fa-sun");

    } else {

        icone.classList.remove("fa-sun");

        icone.classList.add("fa-moon");
    }


    localStorage.setItem(
        "temaEscuro",
        escuro
    );
};


//
// FASE 5.5: Foto de perfil
//

inputFoto.onchange = function(evento) {

    const arquivo =
        evento.target.files[0];


    if (!arquivo) {

        return;
    }


    const leitor =
        new FileReader();


    leitor.onload = function(e) {

        fotoPerfil.src =
            e.target.result;


        localStorage.setItem(
            "foto",
            e.target.result
        );
    };


    leitor.readAsDataURL(arquivo);
};


//
// FASE 6: Carregar informações salvas
//

function iniciar() {


    const tema =
        localStorage.getItem("temaEscuro");


    if (tema === "true") {

        document.body.classList.add(
            "modo-escuro"
        );


        const icone =
            botaoTema.querySelector("i");


        icone.classList.remove("fa-moon");

        icone.classList.add("fa-sun");
    }

    const foto =
        localStorage.getItem("foto");


    if (foto) {

        fotoPerfil.src = foto;
    }

    mostrarTarefas();
}
//
// FASE 7: Inicialização
//

carregarTarefas();

iniciar();