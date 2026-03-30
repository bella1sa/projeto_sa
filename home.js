// ============================
// ELEMENTOS DO HTML
// ============================
const formulario = document.querySelector('#formulario');
const inputNome = document.querySelector('#search-input');

const catalogoInicial = document.getElementById('catalogo-inicial');
const resultadoPesquisa = document.getElementById('resultado-pesquisa');

const livrosContainer = document.querySelector('#livros-container');


// ============================
// BUSCAR LIVROS NA API
// ============================
async function buscarLivros(termoDigitado) {
    const termo = termoDigitado.trim();

    if (!termo) return;

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}`;

    livrosContainer.innerHTML = "<p>Carregando...</p>";

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const livros = dados.docs || [];
        livrosContainer.innerHTML = "";

        if (livros.length === 0) {
            livrosContainer.innerHTML = "<p>Nenhum livro encontrado.</p>";
            return;
        }

        livros.slice(0, 12).forEach(livro => {

            const titulo = livro.title || "Sem título";
            const autor = livro.author_name ? livro.author_name.join(", ") : "Autor desconhecido";
            const ano = livro.first_publish_year || "Ano não informado";

            const capa = livro.cover_i
                ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
                : "img/sem-capa.png";

            livrosContainer.innerHTML += `
                <div class="card-livro">
                    <img src="${capa}">
                    <div class="card-info">
                        <h3>${titulo}</h3>
                        <p><strong>Autor:</strong> ${autor}</p>
                        <p><strong>Ano:</strong> ${ano}</p>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro:", erro);
        livrosContainer.innerHTML = "<p>Erro ao buscar livros.</p>";
    }
}


// ============================
// MOSTRAR / ESCONDER CATÁLOGO
// ============================
function mostrarResultados() {
    catalogoInicial.style.display = "none";
    resultadoPesquisa.style.display = "block";
}

function mostrarCatalogo() {
    if (inputNome.value.trim() === "") {
        resultadoPesquisa.style.display = "none";
        catalogoInicial.style.display = "block";
    }
}


// ============================
// EVENTOS
// ============================
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inputNome.value.trim() === "") {
        mostrarCatalogo();
        return;
    }

    buscarLivros(inputNome.value);
    mostrarResultados();
});

inputNome.addEventListener("input", mostrarCatalogo);
