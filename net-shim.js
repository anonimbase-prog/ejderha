/* Uygulamada çevrim içi oyun: oyunun kullandığı oda arayüzünü kendi WebSocket sunucumuzla sağlar.
   claude.ai içinde açıldığında hiçbir şey yapmaz (orada window.claude zaten var). */
(function(){
  if (window.claude || !window.EJDERHA_SERVER) return;
  const url = window.EJDERHA_SERVER;
  function makeRoom(){
    return { join(name){ return new Promise((resolve, reject)=>{
      let ws=null, userClosed=false, peersCb=null, connCb=null, myId=null, last=null, opened=false, retry=0;
      const api={
        presence(p){ last=p; if (ws && ws.readyState===1) ws.send(JSON.stringify({t:'presence', p})); return Promise.resolve(); },
        onPeers(cb){ peersCb=cb; return ()=>{ peersCb=null; }; },
        onConnection(cb){ connCb=cb; if (ws) cb(ws.readyState===1); return ()=>{ connCb=null; }; },
        leave(){ userClosed=true; if (ws) ws.close(); return Promise.resolve(); }
      };
      function connect(){
        ws=new WebSocket(url);
        ws.onopen=()=>{ retry=0; ws.send(JSON.stringify({t:'join', room:name})); if (last) ws.send(JSON.stringify({t:'presence', p:last})); if (connCb) connCb(true); if (!opened){ opened=true; resolve(api); } };
        ws.onmessage=(ev)=>{ let m; try{ m=JSON.parse(ev.data); }catch(e){ return; }
          if (m.t==='hello') myId=m.id;
          else if (m.t==='peers' && peersCb) peersCb({peers:m.peers.map(p=>({peer:p.id, isMe:p.id===myId, kind:'viewer', presence:p.p}))});
          else if (m.t==='error') console.warn('[Ejderha] Sunucu:', m.code); };
        ws.onclose=()=>{ if (connCb) connCb(false); if (userClosed) return; if (!opened && retry>=3){ reject({code:'upstream_error'}); return; } retry++; setTimeout(connect, Math.min(8000, 800*retry)); };
        ws.onerror=()=>{};
      }
      connect();
    }); } };
  }
  window.claude={ use:(n)=>Promise.resolve(n==='room' ? makeRoom() : null) };
})();
