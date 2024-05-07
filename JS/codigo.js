var container = document.querySelector(".conteudo");
console.log(container);
container.addEventListener("submit", async (e) => {
    e.preventDefault()
    let NomeSolic = document.getElementById("name").value
    let OrigemViagem = document.getElementById("origem").value
    let DestinoViagem = document.getElementById("destino").value
    let NomeMoto = document.getElementById("chs-driver").value
    let PlacaVeiculo = document.getElementById("chs-veicle").value
    let ValorViagem = document.getElementById("value").value
    let Nfe = document.getElementById("nota-fiscal").value
    let DataViagem = document.getElementById("data-viagem").value
    let DescrCarga = document.getElementById("descricao").value
    let Despesas = document.getElementById("despesas").value

    console.log(NomeSolic, OrigemViagem, DestinoViagem, NomeMoto, PlacaVeiculo, ValorViagem, Nfe, DataViagem, DescrCarga, Despesas);
    try {
        var answer = await fetch("https://", {
            method: "post", body: {
                name:NomeSolic, origem:OrigemViagem, destino:DestinoViagem, "chs-driver":NomeMoto,"chs-veicle":PlacaVeiculo, "value":ValorViagem, "nota-fiscal":Nfe, "data-viagem":DataViagem, descricao:DescrCarga, despesas:despesas
            }
        })
    } catch (error) {
        alert("Não encontrado")

    }

});