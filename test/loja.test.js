const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { calcularTotal } = require('../public/calculos');
const { criarServidor } = require('../server');

test('dois cadernos custam 30 reais', () => {
  assert.equal(calcularTotal(15, 2), 30);
});
test('centavos sao calculados corretamente', () => {
  assert.equal(calcularTotal(0.1, 3), 0.3);
});
test('quantidade zero e recusada', () => {
  assert.throws(() => calcularTotal(15, 0));
});
test('quantidade fracionada e recusada', () => {
  assert.throws(() => calcularTotal(15, 1.5));
});
test('preco negativo e recusado', () => {
  assert.throws(() => calcularTotal(-15, 2));
});
test('quantidade acima do limite e recusada', () => {
  assert.throws(() => calcularTotal(15, 100));
});
async function comServidor(verificar) {
  const servidor = criarServidor();
  servidor.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  const base = 'http://127.0.0.1:' + servidor.address().port;
  try { await verificar(base); }
  finally {
    servidor.closeAllConnections();
    await new Promise(resolve => servidor.close(resolve));
  }
}
test('pagina inicial entrega o titulo da loja', async () => {
  await comServidor(async base => {
    const resposta = await fetch(base);
    assert.equal(resposta.status, 200);
    assert.match(await resposta.text(), /Loja da Turma/);
  });
});
test('API informa que o servidor esta funcionando', async () => {
  await comServidor(async base => {
    const resposta = await fetch(base + '/api/status');
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).ok, true);
  });
});
test('endereco inexistente retorna 404', async () => {
  await comServidor(async base => {
    assert.equal((await fetch(base + '/nao-existe')).status, 404);
  });
});
