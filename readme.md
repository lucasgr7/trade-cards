# README

## Visão Geral

Este projeto é um jogo de cartas online em tempo real, desenvolvido utilizando Vue 3 Composition API com composables para gerenciamento de estado. O backend é fornecido pelo Supabase, oferecendo sincronização de dados em tempo real e armazenamento. Este documento tem como objetivo explicar aos desenvolvedores a lógica do desenvolvimento, desde a inicialização da aplicação até as telas de criação de sala e entrada em uma sala existente. Também define como será a parte do Supabase e como os composables serão utilizados nas outras camadas do sistema, incluindo a partida em si.

## Fluxo da Aplicação

### 1. Inicialização (Startup)

**Objetivo**: Capturar o nome do usuário e permitir a seleção de um avatar para personalização.

**Funcionalidades**:

- **Entrada de nome do usuário**.
- **Seleção de avatar**:
  - Utilizar uma API pública para gerar avatares (exemplo: DiceBear Avatars).
  - Permitir que o usuário altere o avatar clicando em um botão para gerar uma nova imagem.
- **Persistência dos dados no navegador** usando `useLocalStorage` do vue-use.

**Fluxo**:

1. Ao acessar o aplicativo, verificar se há dados de usuário armazenados no local storage.
2. Se não houver, apresentar a tela de inicialização para entrada de nome e seleção de avatar.
3. Após o usuário confirmar, salvar os dados no local storage para acesso persistente.
4. Redirecionar o usuário para a tela de seleção de sala.

### Geração de Avatar

Utilizamos a API DiceBear para gerar avatares únicos do tipo "bottts-neutral" com base em um seed aleatório. O seed é gerado automaticamente cada vez que o usuário clica no botão de randomização, e tanto o nome quanto o avatar são persistidos no `localStorage`.

- URL de geração de avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed={SEED}`
- Persistência de dados: Nome e avatar são salvos no `localStorage` para serem recuperados em sessões futuras.

#### Passos:

1. Gera-se um nome aleatório (seed).
2. Usa-se o seed para gerar um avatar via API.
3. O nome e avatar são exibidos e persistidos localmente.

### Código Básico de Exemplo

```javascript
// Função para gerar um nome/seed aleatório
function generateRandomSeed() {
  return Math.random().toString(36).substring(7); // Gera um valor alfanumérico aleatório
}

// Função para gerar a URL do avatar usando o seed
function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
}

// Função para salvar o nome e o avatar no localStorage
function saveUserData(seed, avatarUrl) {
  localStorage.setItem('userSeed', seed);
  localStorage.setItem('avatarUrl', avatarUrl);
}

// Verifica se há dados do usuário armazenados no localStorage
function loadUserData() {
  const seed = localStorage.getItem('userSeed');
  const avatarUrl = localStorage.getItem('avatarUrl');
  return { seed, avatarUrl };
}

// Exemplo de uso
let { seed, avatarUrl } = loadUserData();

if (!seed || !avatarUrl) {
  // Se não houver dados armazenados, gera um novo nome e avatar
  seed = generateRandomSeed();
  avatarUrl = getAvatarUrl(seed);
  saveUserData(seed, avatarUrl);
}

// Exibe o avatar no elemento img
document.getElementById('avatar').src = avatarUrl;
```

### 2. Tela de Criação e Entrada em Sala

**Objetivo**: Permitir que o usuário crie uma nova sala ou entre em uma sala existente através de um código único.

**Funcionalidades**:

- **Criar Sala**:
  - Gerar um código único para a sala (exemplo: código alfanumérico).
  - Criar um registro da sala no Supabase com o código gerado e informações iniciais.
  - Redirecionar o usuário para a sala criada.
- **Entrar em Sala Existente**:
  - Permitir que o usuário insira um código de sala para ingressar.
  - Verificar se a sala existe no Supabase.
  - Adicionar o usuário à lista de participantes da sala.
  - Redirecionar o usuário para a sala correspondente.
- **Listagem de Salas (opcional)**:
  - Apresentar uma lista de salas disponíveis para ingressar.

**Fluxo**:

- **Usuário escolhe** entre criar uma nova sala ou entrar em uma existente.
- **Criar Sala**:
  1. Ao clicar em "Criar Sala", é gerado um código único.
  2. Os dados da sala são salvos no Supabase.
  3. O usuário é adicionado como criador/host da sala.
  4. Usuário é redirecionado para a sala.
- **Entrar em Sala**:
  1. Usuário insere o código da sala.
  2. O sistema verifica se a sala existe.
     - **Se existir**, o usuário é adicionado à sala.
     - Usuário é redirecionado para a sala.
     - **Se não existir**, é exibida uma mensagem de erro.

## Supabase

### Configuração

**Banco de Dados**:

- **Tabela `salas`**:
  - `id`: identificador único da sala.
  - `codigo`: código único da sala.
  - `jogadores`: lista de jogadores na sala (nome, avatar, id).
  - `estado`: estado atual da sala (aguardando, em andamento, finalizada).
  - `criado_em`: timestamp de criação.
- **Tabela `partidas`**:
  - `id`: identificador único da partida.
  - `sala_id`: referência à sala associada.
  - `estado_jogo`: estado atual da partida (cartas, ações, etc.).
  - `atualizado_em`: timestamp da última atualização.

**Autenticação**:

- Utilizar **autenticação anônima** do Supabase para identificar os usuários unicamente.

### Funcionalidades

- **Criar Sala**:
  - Endpoint para inserir uma nova sala no banco de dados.
  - Gerar um código único para a sala.
  - Adicionar o criador da sala à lista de jogadores.
- **Entrar em Sala**:
  - Endpoint para verificar se o código da sala existe.
  - Adicionar o jogador à lista de jogadores da sala.
- **Sincronização em Tempo Real**:
  - Utilizar o recurso de **subscriptions** do Supabase para atualizar a lista de jogadores em tempo real.
  - Assinar mudanças na tabela `salas` para refletir novos jogadores que entram ou saem.

## Composables

### Uso dos Composables

**Objetivo**: Reutilizar lógica e estado entre componentes de forma eficiente.

**Principais Composables**:

- **`useUsuario`**:
  - Gerencia os dados do usuário (nome, avatar).
  - Utiliza `useLocalStorage` para persistência.
  - **Exemplo de uso**:

    ```javascript
    import { ref } from 'vue';
    import { useLocalStorage } from '@vueuse/core';

    export function useUsuario() {
      const nome = useLocalStorage('nomeUsuario', '');
      const avatar = useLocalStorage('avatarUsuario', '');

      return { nome, avatar };
    }
    ```

- **`useSala`**:
  - Gerencia a lógica de criação e entrada em salas.
  - Interage com o Supabase para criar salas e adicionar jogadores.
  - Assina atualizações em tempo real para a sala atual.
- **`usePartida`**:
  - Gerencia o estado da partida em si.
  - Controla as ações do jogo, como distribuição de cartas, jogadas e turnos.
  - Sincroniza o estado do jogo entre os jogadores através do Supabase.

### Integração nas Camadas do Sistema

- **Inicialização**:
  - O composable `useUsuario` é utilizado na tela de startup para capturar e persistir os dados do usuário.
- **Criação/Entrada em Sala**:
  - O composable `useSala` é utilizado nas telas de criação e entrada em sala para gerenciar a lógica associada.
- **Partida**:
  - O composable `usePartida` é utilizado na tela da partida para controlar o fluxo do jogo.
  - Sincroniza ações dos jogadores e atualiza o estado do jogo em tempo real.

## Resumo

- A aplicação inicia capturando os dados do usuário e persistindo-os localmente.
- O usuário pode criar uma nova sala ou entrar em uma existente, interagindo com o Supabase para armazenamento e sincronização.
- Os composables são utilizados para modularizar a lógica e facilitar a manutenção e escalabilidade do código.
- O Supabase fornece o backend para armazenamento de dados e funcionalidades em tempo real, essenciais para a experiência do jogo multiplayer.
