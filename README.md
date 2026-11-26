# Caos Total ⚡

Party arena multiplayer 2D para 2 a 5 jogadores.

## Recursos
- Salas privadas com código e limite de 5 jogadores.
- Multiplayer em tempo real com Socket.IO.
- Arena vista de cima, obstáculos sólidos e colisão.
- Joystick para celular e WASD/setas no computador.
- Impulso com recarga de 3,5 segundos.
- Disparo com botão ou tecla F, mirando automaticamente no adversário vivo mais próximo.
- Vida, eliminações, placar, cronômetro e vencedor da rodada.
- Rodadas de até 2 minutos e opção de jogar novamente.
- Interface responsiva para celular e desktop.

## Executar
Requer Node.js 20 ou superior.

    npm install
    npm start

Acesse http://localhost:3000. Para testar em celulares na mesma rede, use o IP local do computador na porta 3000.

## Hospedar
Use um serviço que execute Node.js e aceite WebSockets. Comando de inicialização: npm start. A porta usa process.env.PORT. O endpoint /health pode ser usado como health check.

## Controles
- Celular: joystick, Impulso e Disparar.
- Computador: WASD ou setas, espaço para impulso e F para disparar.

## Estado
Protótipo jogável inicial. Ainda precisa de testes reais com vários dispositivos, balanceamento, efeitos e sons, matchmaking e revisão de segurança antes de produção.
