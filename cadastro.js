// Conecta com o formulário correto
const formulario = document.getElementById('form-cadastro');

if (formulario) {
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    // Captura dos IDs que estão no HTML
    const email = document.getElementById('email').value.trim();
    const cliente = document.getElementById('cliente').value.trim(); // era "usuario"
    const senha = document.getElementById('senha').value.trim();

    // Verifica se os campos foram preenchidos
    if (!email || !cliente || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Busca usuários existentes ou cria array vazio
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o cliente já existe
    const clienteExistente = usuarios.find(u => u.cliente === cliente);
    if (clienteExistente) {
      alert('Nome de usuário já cadastrado.');
      return;
    }

    // Adiciona novo cliente
    usuarios.push({ email, cliente, senha });

    // Salva no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    
    // Redireciona para login
    window.location.href = "login.html";
  });
}
