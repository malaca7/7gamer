# 7 GAMER — Portal de Comunidade Gamer e Divulgação de Servidores

Portal profissional e moderno focado na divulgação de comunidades legítimas de jogos online, servidores de jogos dedicados, grupos de jogadores e eventos de e-sports.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v3](https://tailwindcss.com/) com paleta personalizada e-sports (preto, grafite, neon red `#ff1e42`)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Banco de Dados & Autenticação**: [Supabase](https://supabase.com/) (PostgreSQL com Row Level Security - RLS)
- **Tipografia**: Orbitron, Rajdhani e Inter (Google Fonts)

---

## 🎮 Estrutura do Portal

1. **Cabeçalho**: Logo tipográfico original "7 GAMER", navegação com links rápidos e botão para o Painel Administrativo.
2. **Hero Section**: Título de impacto *"SUA PRÓXIMA PARTIDA COMEÇA AQUI"*, estatísticas de confiança e chamadas de ação para o catálogo e o Discord oficial.
3. **Comunidades em Destaque**: Cards prioritários com servidores em alta, badges de verificação e conexão rápida.
4. **Catálogo Completo**:
   - Barra de pesquisa em tempo real por nome, jogo ou estilo.
   - Filtros por plataforma (PC, Console, Mobile, Multiplataforma).
   - Filtros por categoria (Roleplay, Competitiva, Casual, Survival, MMORPG, Eventos, Outros).
   - Ordenação (Mais recentes, Destaques, Alfabética).
   - Botões contextuais para Discord e WhatsApp (exibidos apenas se os links forem válidos).
   - Identificação transparente de dados demonstrativos (*"Exemplo demonstrativo"*).
5. **Recém-Adicionadas**: Lista dinâmica com os últimos servidores cadastrados.
6. **Central do Jogador no Discord**: Chamada de ação para o servidor oficial 7 GAMER no Discord.
7. **Rodapé**: Links rápidos, canais oficiais, contato e declaração de compromisso anti-pirataria.
8. **Painel Administrativo Completo**:
   - Acesso restrito com autenticação e recuperação de senha.
   - Indicadores de métricas (Total, Publicadas, Rascunhos, Em Destaque).
   - Tabela de gerenciamento de comunidades com CRUD completo (criar, visualizar, editar, publicar/despublicar, destacar, excluir com confirmação).
   - Configurações gerais do portal (nome, slogan, descrição, links oficiais Discord/WhatsApp, rodapé e contato).
   - Modal com o script SQL completo pronto para executar no Supabase.

---

## 🛠️ Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
O portal estará disponível em: `http://localhost:5173/`

### 3. Gerar a compilação de produção
```bash
npm run build
```

---

## 🔐 Acesso Administrativo e Demonstração

O painel administrativo possui verificação de credenciais e autorização por perfil:

- **Acesso rápido ao painel**: Clique no botão **"Painel Admin"** no cabeçalho ou acesse a URL com o hash `/#admin`.
- **Credenciais de teste pré-configuradas (Modo Demonstração)**:
  - **E-mail**: `admin@7gamer.com`
  - **Senha**: `7gamer123`
  - *(Você pode clicar no botão **"Preencher"** na tela de login para preencher automaticamente).*

---

## 🗄️ Integração com o Supabase

O projeto já está 100% preparado para conectar com seu projeto Supabase:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) e crie um novo projeto.
2. Abra o menu **SQL Editor** no painel do Supabase.
3. Copie o script SQL contido no arquivo `supabase/schema.sql` (ou clique no botão **"Ver Script SQL"** dentro do painel do 7 GAMER) e execute no SQL Editor.
4. Crie um arquivo `.env` na raiz do projeto (baseado em `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```
5. Reinicie o servidor (`npm run dev`). O sistema reconhecerá automaticamente a conexão remota com suporte a políticas de segurança RLS (Row Level Security).

---

## 🛡️ Políticas e Diretrizes

O portal 7 GAMER foi desenvolvido em estrita conformidade com diretrizes éticas e de direitos autorais:
- Divulgação exclusiva de jogos licenciados, servidores autorizados e comunidades legítimas.
- Proibição absoluta de links ou hospedagem de pirataria, cracks ou ferramentas ilícitas (cheats/hacks).
