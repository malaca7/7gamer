# Regras do Projeto 7 GAMER

## Repositório GitHub e Deploy Automático (`gh-pages`)

- **Repositório Remoto (`origin`)**: `https://github.com/malaca7/7gamer.git`
- **Regra Obrigatória de Finalização e Deploy**:
  Sempre que terminar completamente de fazer todas as tarefas e modificações solicitadas, e não houver mais nenhuma mensagem pendente nem nenhuma tarefa pendente, por fim realize:
  1. Commit e push das alterações de código para o repositório remoto no GitHub (`git push origin master`).
  2. Deploy da aplicação compilada para o GitHub Pages no branch `gh-pages` executando `npm run deploy` (`gh-pages -d dist`).
