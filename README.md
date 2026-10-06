# Demir Digital

Vite, Three.js ve GSAP ile hazırlanmış; Türkçe içerikli, 3D ve kaydırma animasyonları kullanan dijital stüdyo sitesi. Özgün SVG proje görselleri, duyarlı tasarım, proje detayları ve brief oluşturma akışı içerir. Luma, Forma ve Volt, gerçek müşteri referansı olarak sunulmayan konsept çalışmalardır.

## Hazır siteyi indir

[Yayına hazır ZIP dosyasını indir](downloads/demir-digital-site.zip?raw=true)

Bu paket derlenmiş siteyi içerir. ZIP'i açıp içeriğini bir statik web sunucusunun kök dizinine yükleyin. Bilgisayarda görüntülemek için ZIP'ten çıkardığınız klasörde `python -m http.server 8080` çalıştırıp tarayıcıda `http://localhost:8080` adresini açabilirsiniz. 3D deneyimi ve JavaScript modülleri için sayfayı bir web sunucusu üzerinden açın.

Kaynak kodu indirmek için GitHub'da **Code → Download ZIP** seçeneğini kullanın. Geliştirme adımları aşağıdadır.

## Çalıştırma

Node.js 22.12+ önerilir.

```bash
npm ci
npm run dev
```

Üretim derlemesi ve yerel önizleme:

```bash
npm run build
npm run preview
```

## Doğrulama

```bash
npm test
```

Node test çalıştırıcısı, Vite üzerinden açılan siteyi Playwright ve kurulu Chromium ile tarayıcıda doğrular. Chromium bulunmayan bir makinede önce `npx playwright install chromium` çalıştırın.

## Uygulama notları

- `prefers-reduced-motion` tercihi desteklenir; WebGL kullanılamadığında alternatif görsel sunulur.
- İletişim akışı demo amaçlıdır: indirilebilir proje briefi oluşturur, dışarıya mesaj göndermez. Üretimde gerçek iletişim teslimatı için bir sunucu veya form hizmeti bağlanmalıdır.
- `npm run build` çıktısı `dist/` klasöründedir ve statik barındırmaya uygundur.
