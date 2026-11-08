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