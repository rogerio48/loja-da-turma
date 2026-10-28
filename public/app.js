const quantidade = document.querySelector('#quantidade');
const resultado = document.querySelector('#resultado');
document.querySelector('#calcular').addEventListener('click', () => {
  try {
    const total = calcularTotal(15, Number(quantidade.value));
    resultado.textContent = 'Total: ' + total.toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL'
    });
  } catch (erro) {
    resultado.textContent = erro.message;
  }
});
fetch('/api/status')
  .then(resposta => {
    if (!resposta.ok) throw new Error('Falha no status');
    return resposta.json();
  })
  .then(dados => {
    document.querySelector('#ambiente').textContent =
      'Ambiente: ' + dados.ambiente + ' | Versao: ' + dados.revisao.slice(0, 8);
  })
  .catch(() => {
    document.querySelector('#ambiente').textContent = 'Servidor indisponivel.';
  });
