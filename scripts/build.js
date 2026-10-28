const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const destino = path.join(raiz, 'dist');
const destinoPublic = path.join(destino, 'public');

// Prepara as pastas de distribuicao.
fs.mkdirSync(destinoPublic, { recursive: true });

// Copia o servidor.
fs.copyFileSync(
  path.join(raiz, 'server.js'),
  path.join(destino, 'server.js')
);

// Copia cada arquivo da pagina individualmente.
const arquivos = [
  'index.html',
  'style.css',
  'calculos.js',
  'app.js'
];

for (const arquivo of arquivos) {
  fs.copyFileSync(
    path.join(raiz, 'public', arquivo),
    path.join(destinoPublic, arquivo)
  );

  console.log('Copiado: ' + arquivo);
}

// Registra a revisao da aplicacao.
fs.writeFileSync(
  path.join(destino, 'REVISION'),
  process.env.GITHUB_SHA || 'local'
);

console.log('Build concluido: arquivos prontos em dist.');