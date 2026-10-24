// three.js'i internetten değil uygulamanın içinden yüklemek için kopyalar (çevrimdışı da açılsın).
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js');
const dst = path.join(__dirname, '..', 'www', 'vendor', 'three.min.js');
if (!fs.existsSync(src)) { console.error('three.js bulunamadı. Önce "npm install" çalıştır.'); process.exit(1); }
fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.copyFileSync(src, dst);
console.log('three.js kopyalandı ->', path.relative(process.cwd(), dst));
