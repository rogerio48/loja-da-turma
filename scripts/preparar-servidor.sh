#!/usr/bin/env bash
# PROFESSOR: apenas em servidor Ubuntu 24.04 x64 dedicado a esta aula.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo 'Use sudo bash'; exit 1; }
[ "$(uname -m)" = x86_64 ] || { echo 'Este instalador e apenas x64'; exit 1; }
apt-get update
apt-get install -y curl xz-utils ca-certificates openssh-server ufw
VERSAO=v24.22.1
ARQUIVO="node-$VERSAO-linux-x64.tar.xz"
TEMPORARIO=$(mktemp -d)
trap 'rm -rf "$TEMPORARIO"' EXIT
cd "$TEMPORARIO"
curl -fsSLO "https://nodejs.org/dist/$VERSAO/$ARQUIVO"
curl -fsSLO "https://nodejs.org/dist/$VERSAO/SHASUMS256.txt"
grep " $ARQUIVO\$" SHASUMS256.txt | sha256sum -c -
tar -xJf "$ARQUIVO" -C /usr/local --strip-components=1
node --version
npm install --global pm2
id deploy >/dev/null 2>&1 || useradd --create-home --shell /bin/bash deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
install -d -m 755 -o deploy -g deploy /home/deploy/uploads /home/deploy/loja
# O script de deploy deve ter sido enviado para /tmp/loja-deploy.sh.
install -m 755 /tmp/loja-deploy.sh /usr/local/bin/loja-deploy
systemctl enable --now ssh
pm2 startup systemd -u deploy --hp /home/deploy
ufw allow OpenSSH
ufw allow 3000/tcp
ufw allow 3001/tcp
# Nao habilita o firewall sozinho: o professor verifica o acesso primeiro.
echo 'Preparacao concluida. Confira o firewall e autorize a chave da aula.'
