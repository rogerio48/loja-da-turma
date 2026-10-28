#!/usr/bin/env bash
set -euo pipefail
AMBIENTE="${1:-}"
PACOTE="${2:-}"
REVISAO="${3:-}"
case "$AMBIENTE" in
  homologacao) PORTA=3001 ;;
  producao) PORTA=3000 ;;
  *) echo 'Ambiente invalido'; exit 1 ;;
esac
[[ "$PACOTE" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]]
[[ "$REVISAO" =~ ^[a-f0-9]{40}$ ]]
[[ "$PACOTE" == "$REVISAO-"* ]]
BASE="/home/deploy/loja/$AMBIENTE"
ARQUIVO="/home/deploy/uploads/$PACOTE.tar.gz"
RELEASE="$BASE/releases/$PACOTE"
mkdir -p "$BASE/releases"
mkdir "$RELEASE"
tar -xzf "$ARQUIVO" -C "$RELEASE"
test "$(cat "$RELEASE/REVISION")" = "$REVISAO"
cat > "$RELEASE/ecosystem.config.cjs" <<EOF
module.exports = { apps: [{
  name: 'loja-$AMBIENTE',
  script: '$RELEASE/server.js',
  cwd: '$RELEASE',
  env: { PORT: '$PORTA', APP_ENV: '$AMBIENTE' }
}] };
EOF
pm2 startOrRestart "$RELEASE/ecosystem.config.cjs" --update-env
SUCESSO=false
for TENTATIVA in {1..15}; do
  if curl -fsS "http://127.0.0.1:$PORTA/api/status" |
    node -e '
      let s = "";
      process.stdin.on("data", c => s += c);
      process.stdin.on("end", () => {
        try {
          const j = JSON.parse(s);
          const ok = j.ok && j.revisao === process.argv[1]
            && j.ambiente === process.argv[2];
          process.exit(ok ? 0 : 1);
        } catch { process.exit(1); }
      });
    ' "$REVISAO" "$AMBIENTE"; then
    SUCESSO=true
    break
  fi
  sleep 1
done
if [ "$SUCESSO" != true ]; then
  echo 'Verificacao falhou. O professor deve executar o rollback do manual.'
  exit 1
fi
ln -sfn "$RELEASE" "$BASE/current"
pm2 save
rm -f "$ARQUIVO"
echo "Deploy confirmado: $AMBIENTE, revisao $REVISAO, porta $PORTA"
