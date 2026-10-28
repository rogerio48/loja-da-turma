const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const arquivos = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/calculos.js': ['calculos.js', 'text/javascript; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};
function criarServidor() {
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.writeHead(405); return res.end('Metodo nao permitido');
    }
    const rota = req.url.split('?')[0];
    if (rota === '/api/status') {
      let revisao = 'local';
      try { revisao = (await fs.readFile(path.join(__dirname, 'REVISION'), 'utf8')).trim(); }
      catch { /* Desenvolvimento local nao tem REVISION. */ }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true,
        ambiente: process.env.APP_ENV || 'desenvolvimento', revisao }));
    }
    const arquivo = arquivos[rota];
    if (!arquivo) { res.writeHead(404); return res.end('Pagina nao encontrada'); }
    try {
      const conteudo = await fs.readFile(path.join(__dirname, 'public', arquivo[0]));
      res.writeHead(200, { 'Content-Type': arquivo[1] });
      res.end(conteudo);
    } catch {
      res.writeHead(500); res.end('Falha ao ler arquivo');
    }
  });
}
if (require.main === module) {
  const porta = Number(process.env.PORT || 3000);
  criarServidor().listen(porta, '0.0.0.0', () => {
    console.log('Loja disponivel na porta ' + porta);
  });
}
module.exports = { criarServidor };
