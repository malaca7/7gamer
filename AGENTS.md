# Regras do Projeto 7 GAMER

## Repositório GitHub, Domínio Personalizado e Deploy Automático (`gh-pages`)

- **Repositório Remoto (`origin`)**: `https://github.com/malaca7/7gamer.git`
- **Custom Domain Obrigatório**: `7gamer.malaca.com.br`
  - O arquivo `public/CNAME` deve conter sempre `7gamer.malaca.com.br` para que todo build (`dist/CNAME`) e deploy para o branch `gh-pages` preserve o domínio personalizado no GitHub Pages.
- **Regra Obrigatória de Finalização e Deploy**:
  Sempre que terminar completamente de fazer todas as tarefas e modificações solicitadas, e não houver mais nenhuma mensagem pendente nem nenhuma tarefa pendente, por fim realize:
  1. Commit e push das alterações de código para o repositório remoto no GitHub (`git push origin master`).
  2. Deploy da aplicação compilada para o GitHub Pages no branch `gh-pages` executando `npm run deploy` (`gh-pages -d dist`).
