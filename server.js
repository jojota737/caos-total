const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rooms = new Map();
const COLORS = ["#8bff65", "#63d9ff", "#ffcf5c", "#ff6b9a", "#b58cff"];

app.use(express.static("public"));

function code() {
  return crypto.randomBytes(2).toString("hex").toUpperCase();
}
function snapshot(room) {
  return { code: room.code, started: room.started, players: [...room.players.values()] };
}
function broadcast(room) {
  io.to(room.code).emit("room:update", snapshot(room));
}
function leave(socket) {
  const roomCode = socket.data.roomCode;
  if (!roomCode) return;
  const room = rooms.get(roomCode);
  socket.data.roomCode = null;
  if (!room) return;
  room.players.delete(socket.id);
  if (!room.players.size) rooms.delete(roomCode);
  else broadcast(room);
}

io.on("connection", socket => {
  socket.on("room:create", (name, done) => {
    leave(socket);
    let roomCode;
    do { roomCode = code(); } while (rooms.has(roomCode));
    const room = { code: roomCode, started: false, players: new Map() };
    rooms.set(roomCode, room);
    joinRoom(socket, room, name, done);
  });

  socket.on("room:join", ({ code: roomCode, name }, done) => {
    const room = rooms.get(String(roomCode || "").toUpperCase());
    if (!room) return done?.({ error: "Sala não encontrada." });
    if (room.players.size >= 5) return done?.({ error: "Sala cheia (máximo 5 jogadores)." });
    if (room.started) return done?.({ error: "A partida já começou." });
    leave(socket);
    joinRoom(socket, room, name, done);
  });

  function joinRoom(socket, room, name, done) {
    const player = {
      id: socket.id,
      name: String(name || "Jogador").trim().slice(0, 16) || "Jogador",
      x: 450 + Math.random() * 100,
      y: 260 + Math.random() * 80,
      color: COLORS[room.players.size % COLORS.length],
      boostUntil: 0
    };
    room.players.set(socket.id, player);
    socket.join(room.code);
    socket.data.roomCode = room.code;
    done?.({ ok: true, room: snapshot(room) });
    broadcast(room);
  }

  socket.on("player:move", ({ x, y }) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.id);
    if (!player || room.started === false) return;
    const dx = Math.max(-1, Math.min(1, Number(x) || 0));
    const dy = Math.max(-1, Math.min(1, Number(y) || 0));
    const speed = Date.now() < player.boostUntil ? 7 : 3.2;
    player.x = Math.max(24, Math.min(876, player.x + dx * speed));
    player.y = Math.max(24, Math.min(576, player.y + dy * speed));
    socket.to(room.code).emit("player:moved", player);
    socket.emit("player:moved", player);
  });

  socket.on("player:boost", () => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.id);
    if (!player || Date.now() < player.boostUntil) return;
    player.boostUntil = Date.now() + 450;
    io.to(room.code).emit("player:boosted", player.id);
  });

  socket.on("game:start", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.players.size < 2) return;
    room.started = true;
    broadcast(room);
  });

  socket.on("disconnect", () => leave(socket));
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Caos Total rodando na porta " + (process.env.PORT || 3000));
});
