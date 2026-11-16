# Aderion Studios — Website V3

Önceki V2 tasarımı korunarak dört sayfaya **koyu mod** ve **gerçek Join Us e-posta gönderimi** eklendi.

## Koyu / açık mod

- Tüm sayfalarda dil seçeneğinin solundaki ay/güneş düğmesiyle değiştirilir.
- Seçim tarayıcıdaki `localStorage` üzerinde saklanır; sayfa geçişinde korunur.
- İlk ziyaret açık temayla başlar (orijinal tasarım).
- Sayfa, mobil menü, kartlar, form alanları ve Credits sayfası da renk değiştirir.

## Join Us başvuru gönderimi

- `join.html` formu, ziyaretçi **Başvurumu gönder** dediğinde `POST api/apply.php` çağrısı yapar.
- Sunucu (`api/apply.php`, `api/contact.php`) e-postayı PHP `mail()` ile **değil**, `api/mailer_lib.php` içindeki SMTP istemcisiyle `mail.aderionstudios.com` üzerinden gönderir. Gönderici `contact@aderionstudios.com`, adayın adresi `Reply-To` olur.
- SMTP bilgileri `api/smtp_config.php` içindedir. Bu dosya **git'te yoktur** (`.gitignore`); `api/smtp_config.example.php` dosyasını kopyalayıp sunucuda gerçek şifreyle doldurun. Deploy workflow'u bu dosyaya dokunmaz.
- Güvenlik: TLS sertifikası doğrulanır (`verify_tls`), mesaj gövdesi dot-stuffing ile gönderilir, portföy alanı yalnızca http/https URL kabul eder, rate limit (IP başına 30 sn) doğrulama geçildikten sonra başlar. Cloudflare gibi bir proxy arkasındaysanız `trust_proxy_header` ayarını yapın; yoksa boş bırakın.
- Zorunlu onay, gizli spam alanı ve temel sunucu doğrulaması bulunur. Hata durumunda form **başarılı olduğunu iddia etmez**; hata, sitenin ana klasöründeki **gizli** `.error.log` dosyasına yazılır (cPanel File Manager'da "Show Hidden Files" açın; tarayıcıdan erişilemez). Eski `error.log` sunucuda kaldıysa silin.
- `file://` üzerinden yerel HTML önizlemesi PHP çalıştıramaz. Bu ortamda form bir `mailto:` taslağı açar. `python -m http.server` de PHP çalıştırmaz.

## cPanel yükleme (önemli)

1. ZIP'i açıp `index.html`, `studio.html`, `credits.html`, `join.html`, `assets/`, `data/` ve **`api/`** klasörlerini `public_html/` içine yükleyin. `scripts/` yalnızca Credits yerel yedeğini üretmek içindir.
2. cPanel'de alan adınızın PHP desteklediğini kontrol edin; `api/smtp_config.php` dosyasını sunucuda `smtp_config.example.php`'den oluşturun. `contact@aderionstudios.com` adresini etkinleştirin ve domain e-posta gönderimini SPF/DKIM/DMARC ile yapılandırın. Hosting tarafında yalnızca SMTP ile gönderime izin veriliyorsa `api/apply.php` dosyasını PHPMailer/SMTP'ye geçirmek gerekir.
3. Test başvurusu yapın, gelen kutusu ve spam klasörünü kontrol edin. Gerekirse hosting mail loglarını inceleyin.
4. Başvuru toplanacağı için yayımlamadan önce uygun **KVKK aydınlatma metnini**, saklama süresini, veri sahiplerinin haklarını ve stüdyonun gizlilik politikasını ekleyin. Formdaki izin kutusu tek başına mevzuat uyumu sağlamaz.

### PHP ile yerelde test

```bash
php -S localhost:8080
```

`http://localhost:8080` üzerinden görünümü ve formun hata durumlarını test edebilirsiniz. Gerçek gönderimi yalnızca posta gönderebilen bir cPanel sunucusunda ya da yapılandırılmış PHP sendmail/SMTP üzerinde test edin.

## Credits ve diğer içerik

V2'deki Credits JSON dinamiği, Studio yol haritası ve sekiz ön başvuru alanı aynen korunur. GitHub Credits verisini yenilemek için `data/credits.json` dosyasını güncelleyin; yerel `file://` yedeği gerekiyorsa `python scripts/sync-credits.py` çalıştırın.

İllüstrasyonlar kullanıcıdan alınan referanslardır; yayın haklarını doğrulayın.

- Header logo updated to use the custom circular artwork supplied by the studio.

## V5 — Credits gorselleri

**Ekranda avatar yerine S/F harfi gorunuyorsa:** Orijinal GitHub projesindeki Discord gorselleri onbellege alinip HTML'e ekleniyor; bizim statik tasarimda bu resimler dis baglantiya bagliydi. Yeni surumde yerel resimler tercih ediliyor.

Windows'ta `update-credits.bat`, Python kurulu diger sistemlerde `python scripts/update-credits.py` calistirip resimleri indirebilirsiniz. Sonra `assets/images/team/` klasorunu site ile birlikte cPanel'e yukleyin. Harici ag ulasilamazsa bas harfler yine yedek olarak gosterilir. Ayrinti icin `CREDITS-KILAVUZU.md` dosyasini okuyun.


## Canlı Discord profilleri (Ekip / Credits sayfası)

Ekip kartları artık Discord'dan **canlı** beslenir: isim, `@kullanıcı adı`, avatar, avatar dekorasyonu, afiş (Nitro varsa), afiş rengi ve **özel durum** ("🔥 11 oyuna hazır..." baloncuğu). Tarayıcı Discord'a doğrudan bağlanmaz; `api/discord.php` sunucuda sorgular, **10 dk (profil) / 60 sn (durum)** önbellekler ve sadece `data/credits.json` içindeki `discordId`'leri sorgular. Sayfa açıkken 90 sn'de bir kendini yeniler.

**Afiş sırası:** `credits.json`'daki `banner` (sabitlenmiş, Nitro gerekmez) → Discord afişi → Discord afiş/vurgu rengi → avatarın ortalama rengi. Yani Nitro'su olmayanın afişi boş kalmaz.

**GIF/resim sabitlemek için** (kalıcı): GIF'i `assets/images/team/` içine koyun ve üyeye `"banner": "assets/images/team/ad.gif"` ekleyin (tam `https://...` adresi de olur).

**Kurulum (sunucuda bir kez):**
1. `api/discord_config.example.php` dosyasını `api/discord_config.php` olarak kopyalayın (git'e girmez, deploy dokunmaz).
2. **Resmi API için bot token'ı:** discord.com/developers/applications -> New Application -> Bot -> *Reset Token* -> değeri `bot_token`'a yazın. Hiçbir intent açmaya, botu bir sunucuya eklemeye gerek yok. Token'ı kimseyle paylaşmayın. Token yoksa japi.rest yedeği (resmi olmayan) kullanılır.
3. **Canlı özel durum için Lanyard:** her ekip üyesi bir kez discord.gg/lanyard sunucusuna katılmalı. Katılmayan üyede `credits.json`'daki `bubble_tr/en` metni gösterilir.

`scripts/update-credits.py` yalnızca çevrimdışı yedek resimler içindir; canlı sistem onlara bağımlı değildir.
