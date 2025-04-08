# CheckPlant - Aplicativo de Anotações Geográficas

## 📱 Sobre o Projeto

CheckPlant é um aplicativo móvel desenvolvido com React Native e Expo que permite aos usuários criar e gerenciar anotações geográficas. O aplicativo utiliza a localização atual do usuário para registrar observações em um mapa interativo, facilitando o monitoramento e acompanhamento de informações em campo.

## ✨ Funcionalidades Principais

### 🗺️ Visualização de Anotações no Mapa
- Mapa interativo mostrando todas as anotações registradas
- Marcadores ajustados automaticamente para evitar sobreposição
- Visualização detalhada ao clicar em um marcador

### 📝 Adição de Novas Anotações
- Captura automática da localização atual do usuário
- Interface amigável para inserção de texto
- Feedback tátil e visual ao salvar uma anotação

### 🔄 Sincronização com Servidor
- Armazenamento local de anotações
- Sincronização com servidor remoto
- Indicador visual do status de sincronização

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm ou yarn
- Expo CLI
- Um dispositivo físico ou emulador para testes

### Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd CheckPlant
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o aplicativo
```bash
npx expo start
```

4. Escaneie o QR code com o aplicativo Expo Go (Android) ou a câmera (iOS)

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis
- **Expo**: Plataforma para facilitar o desenvolvimento React Native
- **TypeScript**: Superset tipado de JavaScript
- **React Navigation**: Navegação entre telas
- **Expo Location**: API para acesso à localização do dispositivo
- **React Native Maps**: Componente de mapa interativo
- **AsyncStorage**: Armazenamento local de dados
- **Axios**: Cliente HTTP para requisições à API
- **Expo Haptics**: Feedback tátil

## 📁 Estrutura do Projeto

```
/
├── app/                    # Arquivos de rotas e telas principais
│   ├── (tabs)/             # Telas com navegação por abas
│   │   ├── index.tsx       # Tela inicial com mapa
│   │   └── add.tsx         # Tela de adição de anotações
│   └── _layout.tsx         # Layout principal da aplicação
├── assets/                 # Recursos estáticos (imagens, fontes)
├── components/             # Componentes reutilizáveis
│   ├── AnnotationMap.tsx   # Componente do mapa com anotações
│   ├── AnnotationForm.tsx  # Formulário para adicionar anotações
│   └── ...                 # Outros componentes
├── constants/              # Constantes da aplicação
├── hooks/                  # Hooks personalizados
│   ├── useAnnotations.ts   # Gerenciamento de anotações
│   └── ...                 # Outros hooks
├── services/               # Serviços e APIs
│   └── AnnotationService.ts # Serviço para gerenciar anotações
├── types/                  # Definições de tipos TypeScript
└── utils/                  # Funções utilitárias
```

## 📱 Funcionalidades Detalhadas

### Gerenciamento de Anotações
- Armazenamento local usando AsyncStorage
- Estrutura de dados otimizada para anotações geográficas
- Sistema de status de sincronização para cada anotação

### Interface do Usuário
- Design responsivo e intuitivo
- Suporte a temas claro e escuro
- Feedback visual e tátil para ações do usuário

### Geolocalização
- Captura precisa da localização atual
- Visualização de anotações em mapa interativo
- Ajuste automático de marcadores para melhor visualização
