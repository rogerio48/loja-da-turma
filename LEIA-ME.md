# Loja da Turma

Leia primeiro o PDF Manual_CI_CD_Nodejs.pdf fornecido com este pacote.

Use Node 24 LTS e Git Bash no Windows.

```bash
npm ci
npm test
npm start
```

Abra http://localhost:3000. Para gerar a distribuicao, execute npm run build.

Apenas ci.yml esta ativo. O arquivo entrega.yml.example deve ser renomeado somente depois da preparacao do servidor e dos ambientes, conforme o manual.

Servidor: Ubuntu 24.04 x64 dedicado e autorizado. O professor realiza a preparacao; os scripts nao devem ser executados em servidores existentes de outros projetos. Nenhuma infraestrutura e contratada por este pacote.

Nove testes locais e build foram verificados. O deploy remoto depende da conta e do servidor do professor e precisa de validacao piloto. A aplicacao e demonstrativa, sem compras reais nem dados de clientes.
