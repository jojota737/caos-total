# Caos Total ⚡

Jogo multiplayer 2D de arena para 2 a 5 jogadores.

## Publicar gratuitamente no Render

O projeto já inclui `render.yaml`. Use o botão abaixo para criar o servidor multiplayer na sua conta Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jojota737/caos-total)

1. Abra o botão e entre/crie sua conta Render.
2. Confira o serviço **caos-total** e mantenha o plano **Free**.
3. Clique em **Apply** para iniciar a publicação.
4. Quando o deploy terminar, abra a URL `https://caos-total.onrender.com` (ou a URL que o Render mostrar no painel).
5. Use essa URL no Kodular para gerar o APK. Todos os jogadores devem abrir essa mesma URL.

O servidor Node.js e o site ficam no mesmo endereço, então o Socket.IO conecta automaticamente e as salas funcionam entre celulares diferentes.

**Limite do plano gratuito:** o Render pode colocar o servidor em repouso após 15 minutos sem tráfego. A primeira conexão depois disso pode levar cerca de um minuto para acordar. O plano gratuito é adequado para testes e projetos pessoais, mas não garante disponibilidade contínua.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm start
```

Abra http://localhost:3000. O servidor também expõe `/health` para verificar se está ativo.

## Controles

- Celular: joystick, Impulso e Disparar.
- Computador: WASD ou setas, espaço para impulso e F para disparar.

## Estado

Protótipo inicial. Precisa de testes com vários dispositivos e melhorias de balanceamento, segurança, efeitos e sons.
