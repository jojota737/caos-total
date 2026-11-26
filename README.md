# Caos Total ⚡

Jogo multiplayer 2D de arena para 2 a 5 jogadores.

## Rodar localmente
Requer Node.js 20 ou superior.

```bash
npm install
npm start
```

Abra http://localhost:3000. O servidor também expõe /health para verificação de saúde.

## Publicar com Koyeb
O projeto usa Express + Socket.IO e precisa de um serviço Node.js com suporte a WebSockets. O Koyeb documenta suporte nativo a WebSockets e deploy por GitHub.

1. Entre em https://app.koyeb.com/ e crie/acesse sua conta.
2. No painel, escolha **Create Web Service** e depois **GitHub**.
3. Conecte a conta GitHub e autorize o acesso ao repositório `jojota737/caos-total`.
4. Selecione a branch `main`.
5. Use o builder **Buildpack** (não Docker).
6. Configure o comando de build como `npm install` e o comando de execução como `npm start`.
7. Configure a porta HTTP detectada pela plataforma e health check HTTP em `/health`, se solicitado.
8. Escolha uma instância disponível no seu plano e clique em **Deploy**.

Quando o deploy terminar, abra o endereço `.koyeb.app` gerado. Essa URL serve o jogo e o Socket.IO pelo mesmo host, então a criação e entrada em salas usam o servidor correto. O GitHub Pages continua sendo apenas uma cópia estática e não hospeda as partidas.

## Controles
- Celular: joystick, Impulso e Disparar.
- Computador: WASD ou setas, espaço para impulso e F para disparar.

## Estado
Protótipo inicial. Precisa de testes com vários dispositivos e melhorias de balanceamento, segurança, efeitos e sons.
