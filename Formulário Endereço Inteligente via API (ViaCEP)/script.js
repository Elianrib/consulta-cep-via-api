// elementos do formulário
const cepInput = document.getElementById("cep");
const logradouroInput = document.getElementById("logradouro");
const bairroInput = document.getElementById("bairro");
const cidadeInput = document.getElementById("cidade");
const ufInput = document.getElementById("uf");
const btnBuscar = document.getElementById("buscar");
const mensagemDiv = document.getElementById("mensagem");

// mostrar  a mensagem pro usuário
const exibirMensagem = (texto, erro = true) => {
    mensagemDiv.textContent = texto;
    mensagemDiv.style.color = erro ? "#af0000ff" : "#026e1cff";
};

// limpar campos  e  a mensagem
const limparCampos = () => {
    logradouroInput.value = "";
    bairroInput.value = "";
    cidadeInput.value = "";
    ufInput.value = "";
    mensagemDiv.textContent = "";
};

// formatar o CEP  enquanto digita
const formatarCep = () => {
    let cep = cepInput.value.replace(/\D/g, "");
    if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    cepInput.value = cep;
};

// busca   o CEP na API
const buscarCep = async () => {
    limparCampos();
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        exibirMensagem("CEP inválido. Digite 8 números.");
        return;
    }

    try {
        exibirMensagem("Buscando endereço...", false);
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await res.json();

        if (dados.erro) {
            exibirMensagem(`o CEP não foi encontrado: ${cepInput.value}`);
            limparCampos();
        } else {
            logradouroInput.value = dados.logradouro || "";
            bairroInput.value = dados.bairro || "";
            cidadeInput.value = dados.localidade || "";
            ufInput.value = dados.uf || "";
            exibirMensagem("Endereço encontrado!", false);
        }

    } catch (err) {
        console.error("Erro ao consultar o CEP:", err);
        exibirMensagem("Erro ao consultar o CEP. Tente de novo.");
    }
};

// eventos
cepInput.addEventListener("input", formatarCep);
cepInput.addEventListener("blur", buscarCep);
btnBuscar.addEventListener("click", buscarCep);
cepInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        buscarCep();
    }
});
