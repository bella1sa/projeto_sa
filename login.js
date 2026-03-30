// Conecta ao formulário correto
const formulario = document.getElementById('form-login');

if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        // Campos reais do HTML
        const email = document.getElementById('email-login').value.trim();
        const senha = document.getElementById('senha-login').value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Busca usuários cadastrados no localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Procura o usuário usando email + senha
        const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuarioEncontrado) {
            // Salva o usuário logado no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

            alert('Login bem-sucedido!');
            window.location.href = 'conta.html';
        } else {
            alert('Email ou senha incorretos.');
        }
    });
}
