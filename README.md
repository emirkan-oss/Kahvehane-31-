# ☕ Kıraathane 31 Oyunu (The Coffeehouse Bill)

Geleneksel Türk kahvehanesi & kıraathanesi atmosferinde geçen, nostaljik adisyon fişi ve çuha masa temalı **gerçek zamanlı (real-time multiplayer)** 31 masa oyunu!

Arkadaşlarınızla masa açıp 4 haneli masa kodu veya doğrudan davet linkiyle anında katılabilir, isterseniz eksik kalan sandalyelere kahvehane müdavimi yapay zeka botları (Dayı Osman, Çaycı Rüstem vb.) ekleyerek oynayabilirsiniz.

---

## 🎲 Oyunun Kuralları (Kıraathane Raconu)

1. **Gizli Numaranı Seç**: Oyun başında her oyuncu 1 ile 31 arasında gizli bir sayı seçer.
2. **Sırayla Tahmin**: Sırası gelen oyuncu masada henüz söylenmemiş bir sayı söyler (1-31).
3. **Kurtulan Çayını Yudumlar**: Söylenen numara bir veya daha fazla oyuncunun gizli numarasıysa, o oyuncular anında masadan **yırttı (kurtuldu)** sayılır!
4. **Altın Racon**: Sıra sizdeyken **kendi gizli numaranızı söyleyemezsiniz!** Sizi ancak masadaki diğer oyuncuların tahmini kurtarabilir.
5. **Hesap Kime Kitlenir?**: Herkes tek tek kurtuldukça masa boşalır. Gizli numarası hiçbir zaman bulunamayıp en sona kalan oyuncu **masanın tüm adisyon hesabını öder!**

---

## 🚀 Özellikler

- 🌐 **Gerçek Zamanlı Multiplayer**: Socket.IO ile anlık çift taraflı senkronizasyon.
- 🔗 **Tek Tıkla Masayı Paylaş**: Masa kodu kopyalama ve doğrudan `?room=KOD` parametreli davet bağlantısı desteği.
- 🤖 **Akıllı Müdavim Botları**: Tek başınıza veya eksik kişiyle oynarken masaya otomatik tahmin yapan botlar eklenebilir.
- 🎭 **18 Karakterli Kıraathane Avatar Galerisi**: Pala Bıyık, Emekli Dayı, Çay Tiryakisi, Semaver, Fötr Şapka, Kaşarlı Tost vb.
- 🧾 **Otantik Adisyon Fişi Tasarımı**: Tırtıklı makbuz kenarları, tükenmez mavi/kırmızı kalem el yazısı, ıstampa damga efektleri.
- 🔊 **Web Audio API Ses Efektleri**: İnce belli çay kaşığı tıkırtısı, tükenmez kalem karalama, yırtma zili ve hesap şok kornası (harici dosya indirmeden saf tarayıcı sentezi).
- 📱 **Mobil & Masaüstü %100 Uyumlu**: Taşırma yapmayan esnek gridler ve dokunmatik optimize butonlar.

---

## 🛠️ Yerel Ortamda Çalıştırma (Local Development)

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn / bun

### Kurulum

```bash
# 1. Depoyu klonlayın
git clone https://github.com/KULLANICI_ADINIZ/kahvehane-31-oyunu.git
cd kahvehane-31-oyunu

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirici sunucusunu başlatın
npm run dev
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışacaktır. Tarayıcınızda açıp oynamaya başlayabilirsiniz!

---

## 🌍 Canlıya / Online Yayına Alma (Deploy)

Bu proje hem tek bir Node.js sunucusu (`server.ts` veya `server.js`) hem de statik istemci olarak yapılandırılmıştır. İstediğiniz herhangi bir ücretsiz bulut platformuna tek tıkla yükleyebilirsiniz:

### 1. Render.com
- Render üzerinde **New Web Service** seçin.
- GitHub reponuzu bağlayın.
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Hazır! Size özel bir `https://projeniz.onrender.com` bağlantısı verilir.

### 2. Railway.app
- **New Project** -> **Deploy from GitHub repo** seçin.
- Railway `PORT` ve `npm start` komutunu otomatik tanır ve yayına alır.

### 3. Fly.io
```bash
fly launch
fly deploy
```

---

## 📁 Proje Yapısı

```
├── public/
│   └── index.html      # Ana istemci arayüzü, Socket.io istemcisi, ses motoru ve stiller
├── server.ts           # TypeScript Socket.IO & Express multiplayer oyun sunucusu
├── server.js           # Bağımsız Node.js ES modül sunucusu
├── package.json        # Paket bağımlılıkları ve çalıştırma komutları
├── tsconfig.json       # TypeScript yapılandırması
├── .gitignore          # Git tarafından yok sayılacak dosyalar
└── README.md           # Proje belgelendirmesi
```

---

## 📜 Lisans
MIT Lisansı - Dilediğiniz gibi geliştirebilir, özelleştirebilir ve paylaşabilirsiniz! ☕🎲
