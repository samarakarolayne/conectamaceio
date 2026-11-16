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
  form.reset();
  modal.hidden = true;
  alert("Cadastro enviado! Aguarde a verificação.");
});

const inputCnpj = document.getElementById("cnpj");
if (inputCnpj) {
  inputCnpj.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")
         .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
         .replace(/\.(\d{3})(\d)/, ".$1/$2")
         .replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = v;
  });
}

const inputWhats = document.getElementById("whatsapp");
if (inputWhats) {
  inputWhats.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
  });
}

let minhasDoacoes = JSON.parse(localStorage.getItem("conecta_doacoes") || "[]");

function atualizarMinhasDoacoes() {
  const lista = document.getElementById("listaMinhasDoacoes");
  if (!lista) return;
  if (minhasDoacoes.length === 0) {
    lista.innerHTML = "<li>Nenhuma doação registrada ainda. Escolha uma causa acima!</li>";
    return;
  }
  lista.innerHTML = "";
  minhasDoacoes.forEach((d) => {
    const li = document.createElement("li");
    li.textContent = d;
    lista.appendChild(li);
  });
}
atualizarMinhasDoacoes();

const btnLimpar = document.getElementById("btnLimparDoacoes");
if (btnLimpar) {
  btnLimpar.addEventListener("click", () => {
    minhasDoacoes = [];
    localStorage.removeItem("conecta_doacoes");
    atualizarMinhasDoacoes();
  });
}

document.querySelectorAll(".btn-pix").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pix = btn.dataset.pix;
    if (!pix) {
      alert("PIX não cadastrado para esta instituição.");
      return;
    }
    try {
      await navigator.clipboard.writeText(pix);
      const original = btn.textContent;
      btn.textContent = "PIX Copiado!";
      setTimeout(() => (btn.textContent = original), 2000);
    } catch {
      prompt("Copie o PIX:", pix);
    }
  });
});

const modalDetalhe = document.getElementById("modalDetalhe");
const fecharDetalhe = document.getElementById("fecharDetalhe");
let instituicaoAtual = "";

if (modalDetalhe && fecharDetalhe) {
  fecharDetalhe.addEventListener("click", () => (modalDetalhe.hidden = true));
  modalDetalhe.addEventListener("click", (e) => {
    if (e.target === modalDetalhe) modalDetalhe.hidden = true;
  });
}

document.querySelectorAll(".btn-saber-mais").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!modalDetalhe) return;
    instituicaoAtual = btn.dataset.nome;
    document.getElementById("detalheNome").textContent = btn.dataset.nome;
    document.getElementById("detalheDesc").textContent = btn.dataset.desc;
    const lista = document.getElementById("detalheLista");
    lista.innerHTML = "";
    btn.dataset.necessidades.split("|").forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.trim();
      lista.appendChild(li);
    });
    const msg = encodeURIComponent("Olá! Vim pelo Conecta Maceió e quero ajudar a " + btn.dataset.nome + ".");
    document.getElementById("detalheWhatsapp").href = "https://wa.me/" + btn.dataset.whatsapp + "?text=" + msg;
    modalDetalhe.hidden = false;
  });
});

const btnQueroDoar = document.getElementById("btnQueroDoar");
if (btnQueroDoar) {
  btnQueroDoar.addEventListener("click", () => {
    const texto = instituicaoAtual + " - " + new Date().toLocaleDateString("pt-BR");
    minhasDoacoes.push(texto);
    localStorage.setItem("conecta_doacoes", JSON.stringify(minhasDoacoes));
    atualizarMinhasDoacoes();
    modalDetalhe.hidden = true;
    alert("Obrigado! Sua doação foi registrada em Minhas Doações.");
  });
}
