let formulario = document.querySelector("form");
console.log(formulario);
formulario.addEventListener("submit", async (e) => {
    e.preventDefault()
    let nomeCompleto = document.getElementById("nome-completo").value
    let cpf = document.getElementById("input-cpf").value
    console.log(nomeCompleto, cpf);
    try {
        var respostaApi = await fetch("http://api", {
            method: "post", body: {
                nome: nomeCompleto, cpf: cpf
            }
        })
    } catch (error) {
        alert("Desculpe, não foi possível cadastrar o motorista. Tente novamente mais tarde.")

    }

});
