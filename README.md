# Ejderha Uçuşu 🐉

Zümrüt ejderhanın sırtında okyanusun, adaların ve bulutların üstünde uçtuğun 3D oyun.
Telefonda (Android ve iPhone) ve bilgisayarda çalışır, iki kişi kendi telefonundan aynı gökyüzünde uçabilir.

Bu depo üç şey üretir:

| Ne | Nasıl | Nerede |
|---|---|---|
| **Android APK** | GitHub Actions otomatik derler | Actions → "Android APK" → *Artifacts* |
| **iPhone (imzasız IPA)** | GitHub Actions macOS'ta derler | Actions → "iOS (imzasız IPA)" → *Artifacts* |
| **Web sürümü** | GitHub Pages'e yayınlanır | iPhone'da Safari → Paylaş → **Ana Ekrana Ekle** |

---

## 1. Depoyu GitHub'a yükle

1. GitHub'da yeni bir depo aç (örnek ad: `ejderha-ucusu`).
2. Bu klasördeki **tüm dosyaları** (gizli `.github` klasörü dahil) depoya yükle.
3. Yükleme `main` dalına yapıldığında üç iş akışı kendiliğinden başlar.

## 2. Android APK'yı indir

1. Depoda **Actions** sekmesine gir → **Android APK** işine tıkla.
2. Bitince (5–8 dk) sayfanın altındaki **Artifacts** bölümünden `EjderhaUcusu-Android` dosyasını indir.
3. Zip'i aç, `app-debug.apk` dosyasını telefona at ve kur ("bilinmeyen kaynaklara izin ver" demen gerekebilir).

## 3. iPhone'a kurmanın iki yolu

**Kolay yol — web sürümü (önerilen):**
1. Depoda **Settings → Pages → Source: GitHub Actions** seç.
2. Actions'ta **Web sürümü** işi bitince adres çıkar (ör. `https://kullaniciadin.github.io/ejderha-ucusu/`).
3. iPhone'da bu adresi **Safari** ile aç → Paylaş → **Ana Ekrana Ekle**. Uygulama gibi tam ekran açılır.

**Uygulama dosyası (IPA):**
1. Actions → **iOS (imzasız IPA)** → Artifacts'tan `EjderhaUcusu-imzasiz.ipa`'yı indir.
2. Bilgisayarda **Sideloadly** ya da **AltStore** ile kendi Apple kimliğinle imzalayıp iPhone'a yükle.
3. Ücretsiz Apple kimliğiyle imza 7 gün geçerlidir; sonra yeniden yüklemek gerekir. App Store'a koymak için Apple Developer hesabı (yıllık ücretli) gerekir.

## 4. Arkadaşınla çevrim içi oynamak için sunucuyu kur

claude.ai içinde oda sistemi hazır gelir; uygulamada ise küçük bir sunucu gerekir (`server/` klasörü).

1. [render.com](https://render.com)'a GitHub hesabınla gir → **New → Blueprint** → bu depoyu seç. `render.yaml` sayesinde sunucu kendiliğinden kurulur (ücretsiz plan).
2. Render sana bir adres verir, ör. `https://ejderha-sunucu.onrender.com`.
3. Depoda `www/config.js` dosyasını aç ve şu satırı yaz (https yerine **wss**):
   ```js
   window.EJDERHA_SERVER = 'wss://ejderha-sunucu.onrender.com';
   ```
4. Kaydedince Android, iOS ve web sürümleri yeniden derlenir. Oyunda **👥 Arkadaşla uç → Oda kur**, kodu arkadaşına ver, o da **Katıl** desin.

> Ücretsiz Render sunucusu bir süre kullanılmayınca uyur; ilk bağlantı 30–50 saniye sürebilir.

## Haritalar

- **İstanbul haritası** (varsayılan): Boğaz, Haliç, iki asma köprü, Kız Kulesi, Galata Kulesi, Sultanahmet, Ayasofya, Süleymaniye, Çamlıca Kulesi, Adalar, vapurlar ve binlerce bina.
- **Takımada:** Yanardağ, şelale, kayalık kuleler, mavi lagün.

Menüdeki **Harita** bölümünden değiştirilir.

## Kontroller

**Telefon:** Joystick yukarı = yüksel, aşağı = alçal/dalış, sağa-sola = yatarak dön. Bırakınca seyir hızında düz uçar.
Sağdaki tuşlar: Hızlan, Süzül, Yavaşla, Ateş, Saldır, Kalk/İn. Süzülürken rüzgârın çarptığı yamaçlarda ve güneşin ısıttığı karalarda yükselen hava seni yukarı taşır (ekranda 💨 göstergesi). Ekranın boş yerini sürükleyerek kamerayı çevirebilirsin.

**Bilgisayar:** ↑/Boşluk yüksel · ↓/C alçal · A/D dön · W/S gaz · Shift turbo · Q süzül · F ateş · sol tık saldırı · E kalkış/iniş · R kükre · X keskin dönüş · V kamera · H sinema modu · T günün saati

## Klasörler

```
www/              oyunun kendisi (index.html) + ayarlar
  config.js       çevrim içi sunucu adresi
  net-shim.js     uygulamada oda sistemini kendi sunucumuza bağlar
server/           çevrim içi oda sunucusu (Node.js + ws)
scripts/          three.js'i uygulamanın içine kopyalar (çevrimdışı açılsın diye)
.github/workflows Android, iOS ve web derlemeleri
```

## Bilmen gerekenler

- Beş özgün ejderha türü var (Zümrüt Taç, Kor Kanat, Fırtına Süzgeci, Ay Gölgesi, Kristal Diş); her birinin gövdesi, kanadı, boynuzu ve kuyruğu farklı.
- Ejderhalar Blender'da değil, kod içinde iskeletli olarak üretiliyor (55 kemik, 17 animasyon). Gerçek bir Blender GLB modeli ileride eklenebilir.
- Grafik ayarı varsayılan olarak **Yüksek**; güçlü telefonlarda ⚙️ menüsünden **Ultra** seçilebilir, telefon zorlanırsa oyun çözünürlüğü kendiliğinden düşürür.
- iOS derlemesi imzasızdır; doğrudan App Store'a gönderilemez.
