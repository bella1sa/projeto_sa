// Seleciona elementos
const editarBtn = document.getElementById('editarBtn');
const inputFoto = document.getElementById('inputFoto');
const fotoPerfil = document.getElementById('fotoPerfil');
const imgFoto = document.getElementById('img-foto');
const sairBtn = document.getElementById('sairBtn');

// Abrir seletor de arquivos ao clicar no botão
editarBtn.addEventListener('click', () => {
  inputFoto.click();
});

// Atualizar foto ao escolher arquivo
inputFoto.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    // Atualiza o background da div
    fotoPerfil.style.backgroundImage = `url('${e.target.result}')`;
    
    // Atualiza a tag <img>, se existir
    if (imgFoto) {
      imgFoto.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
});

// Botão sair
sairBtn.addEventListener('click', () => {
  alert('Você saiu da sua conta.');
  window.location.href = 'login.html';
});
