// A mesma regra funciona no navegador e nos testes do Node.
(function (raiz) {
  function calcularTotal(preco, quantidade) {
    if (!Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
      throw new Error('Informe preco valido e quantidade inteira de 1 a 99.');
    }
    return Math.round(preco * 100) * quantidade / 100;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calcularTotal };
  } else {
    raiz.calcularTotal = calcularTotal;
  }
})(globalThis);
