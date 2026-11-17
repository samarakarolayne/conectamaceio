const linkCadastrar = document.getElementById("linkCadastrar");
const modal = document.getElementById("modalCadastro");
const fecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formCadastro");
const erro = document.getElementById("erro");

linkCadastrar.addEventListener("click", (e) => {
  e.preventDefault(); 
  modal.hidden = false;
});

fecharModal.addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.hidden = true;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.hidden = true;
});

function cnpjValido(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (base) => {
    let soma = 0;
    let peso = base.length - 7;
    for (const n of base) {
      soma += Number(n) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calc(cnpj.slice(0, 12));
  const d2 = calc(cnpj.slice(0, 12) + d1);
  return cnpj.endsWith(`${d1}${d2}`);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  erro.textContent = "";

  const dados = Object.fromEntries(new FormData(form));

  if (dados.nome.trim().length < 3) {
    erro.textContent = "Digite o nome da instituição.";
    return;
  }
  if (!cnpjValido(dados.cnpj)) {
    erro.textContent = "CNPJ inválido.";
    return;
  }
  if (dados.whatsapp.replace(/\D/g, "").length < 10) {
    erro.textContent = "WhatsApp inválido.";
    return;
  }
  if (!dados.email.includes("@")) {
    erro.textContent = "E-mail inválido.";
    return;
  }
  if (dados.senha.length < 8) {
    erro.textContent = "A senha precisa ter pelo menos 8 caracteres.";
    return;
  }
  if (dados.senha !== dados.senha2) {
    erro.textContent = "As senhas não coincidem.";
    return;
  }

  //aqui entra o envio ao servidor(BD)
  form.reset();
  modal.hidden = true;
  alert("Cadastro enviado! Aguarde a verificação.");
});

const modalDetalhes = document.getElementById("modalDetalhes");
const fecharDetalhes = document.getElementById("fecharDetalhes");
const tituloDetalhes = document.getElementById("tituloDetalhes");
const textoDetalhes = document.getElementById("textoDetalhes");
const pixDetalhes = document.getElementById("pixDetalhes");
const emailOficial = "maceioconecta800@gmail.com";

const dadosInstituicoes = {
  "Lar dos Idosos Amor e Vida": "Instituição que cuida de idosos em Maceió. Precisa com urgência de fraldas geriátricas, leite em pó e produtos de higiene.",
  "Centro de Apoio ao Autista": "Oferece apoio terapêutico para crianças autistas. Precisa de materiais terapêuticos, brinquedos sensoriais e papelaria.",
  "Associação Mulheres em Ação": "Apoia mulheres em situação de vulnerabilidade. Precisa de cestas básicas, roupas e produtos de higiene.",
  "Instituto Educação para Todos": "Ajuda crianças com material escolar. Precisa de cadernos, mochilas e livros infantis.",
  "Abrigo de Animais Patinhas": "Resgata e cuida de animais abandonados. Precisa de ração, medicamentos e cobertores.",
  "Casa da Criança Esperança": "Acolhe crianças. Precisa de fraldas infantis, leite, fórmulas e brinquedos."
};

document.querySelectorAll(".divCard").forEach((card) => {
  const nome = card.querySelector("h3").textContent;
  const botoes = card.querySelectorAll("button");
  const btnSaberMais = botoes[0];
  const btnPix = botoes[1];

  btnSaberMais.addEventListener("click", () => {
    tituloDetalhes.textContent = nome;
    textoDetalhes.textContent = dadosInstituicoes[nome] || "Instituição parceira do Conecta Maceió.";
    modalDetalhes.hidden = false;
  });

  btnPix.addEventListener("click", () => {
    navigator.clipboard.writeText(emailOficial);
    alert("PIX copiado: " + emailOficial + " - " + nome);
  });
});

fecharDetalhes.addEventListener("click", () => {
  modalDetalhes.hidden = true;
});
modalDetalhes.addEventListener("click", (e) => {
  if (e.target === modalDetalhes) modalDetalhes.hidden = true;
});

document.getElementById("btnCopiarPixDetalhes").addEventListener("click", () => {
  navigator.clipboard.writeText(pixDetalhes.textContent);
  alert("PIX copiado!");
});

document.getElementById("btnWhats").addEventListener("click", () => {
  const msg = document.getElementById("mensagemDoacao").value || "Olá! Vim pelo Conecta Maceió e quero ajudar.";
  window.open("mailto:" + emailOficial + "?subject=Quero ajudar pelo Conecta Maceió&body=" + encodeURIComponent(msg), "_blank");
});

document.querySelector(".cardApoio button").addEventListener("click", () => {
  navigator.clipboard.writeText(emailOficial);
  alert("PIX do Conecta Maceió copiado: " + emailOficial);
});

const listaCadastradas = document.getElementById("listaCadastradas");

const formOriginal = document.getElementById("formCadastro");
formOriginal.addEventListener("submit", () => {
  setTimeout(() => {
    const nomeDigitado = document.getElementById("nome").value;
    if (nomeDigitado) {
      if (listaCadastradas.textContent.includes("Nenhuma")) {
        listaCadastradas.innerHTML = "";
      }
      const item = document.createElement("li");
      item.innerHTML = "<strong>" + nomeDigitado + "</strong> - Aguardando verificação";
      listaCadastradas.appendChild(item);
    }
  }, 100);
});
