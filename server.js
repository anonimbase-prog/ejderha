// Ejderha Uçuşu oda sunucusu: oyuncular aynı oda koduna katılır, konumlarını paylaşır.
// Her oyuncu kendi ejderhasından sorumludur; sunucu gelen veriyi boyut ve hız açısından sınırlar.
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const ROOM_RE = /^[a-z0-9][a-z0-9_.-]{0,47}$/;
const MAX_PER_ROOM = 8, MAX_PRESENCE = 4096, MAX_MSG_PER_SEC = 60;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Ejderha Uçuşu sunucusu çalışıyor. Odalar: ' + rooms.size);
});
const wss = new WebSocketServer({ server, maxPayload: 8 * 1024 });
const rooms = new Map();
const dirty = new Set();
let nextId = 1;

function send(ws, obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function broadcast(name) {
  const room = rooms.get(name); if (!room) return;
  const peers = [...room.values()].filter(c => c.p).map(c => ({ id: c.id, p: c.p }));
  const msg = JSON.stringify({ t: 'peers', peers });
  for (const c of room.values()) if (c.ws.readyState === 1) c.ws.send(msg);
}
setInterval(() => { for (const n of dirty) broadcast(n); dirty.clear(); }, 66); // ~15 güncelleme/sn

function leave(c) {
  if (!c.room) return;
  const room = rooms.get(c.room);
  if (room) { room.delete(c.id); if (room.size === 0) rooms.delete(c.room); else dirty.add(c.room); }
  c.room = null;
}

wss.on('connection', ws => {
  const c = { id: 'p' + (nextId++), ws, room: null, p: null, n: 0, t: Date.now(), alive: true };
  send(ws, { t: 'hello', id: c.id });
  ws.on('pong', () => { c.alive = true; });
  ws.on('message', data => {
    const now = Date.now(); if (now - c.t > 1000) { c.t = now; c.n = 0; }
    if (++c.n > MAX_MSG_PER_SEC) return;
    let m; try { m = JSON.parse(data); } catch (e) { return; }
    if (m.t === 'join' && typeof m.room === 'string' && ROOM_RE.test(m.room)) {
      leave(c);
      if (!rooms.has(m.room)) rooms.set(m.room, new Map());
      const room = rooms.get(m.room);
      if (room.size >= MAX_PER_ROOM) { send(ws, { t: 'error', code: 'room_full' }); return; }
      c.room = m.room; room.set(c.id, c); dirty.add(c.room);
    } else if (m.t === 'presence' && c.room && m.p && typeof m.p === 'object' && !Array.isArray(m.p)) {
      if (JSON.stringify(m.p).length > MAX_PRESENCE) return;
      c.p = m.p; dirty.add(c.room);
    }
  });
  ws.on('close', () => leave(c));
  ws.on('error', () => leave(c));
  c.timer = setInterval(() => { if (!c.alive) { ws.terminate(); clearInterval(c.timer); return; } c.alive = false; try { ws.ping(); } catch (e) {} }, 30000);
  ws.on('close', () => clearInterval(c.timer));
});

server.listen(PORT, () => console.log('Ejderha sunucusu port ' + PORT + ' üzerinde çalışıyor'));
