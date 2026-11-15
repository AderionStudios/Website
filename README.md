# Aderion Studios — Website V3

Önceki V2 tasarımı korunarak dört sayfaya **koyu mod** ve **gerçek Join Us e-posta gönderimi** eklendi.

## Koyu / açık mod

- Tüm sayfalarda dil seçeneğinin solundaki ay/güneş düğmesiyle değiştirilir.
- Seçim tarayıcıdaki `localStorage` üzerinde saklanır; sayfa geçişinde korunur.
- İlk ziyaret açık temayla başlar (orijinal tasarım).
- Sayfa, mobil menü, kartlar, form alanları ve Credits sayfası da renk değiştirir.

## Join Us başvuru gönderimi

- `join.html` formu, ziyaretçi **Başvurumu gönder** dediğinde `POST api/apply.php` çağrısı yapar.
- Sunucu, e-postayı PHP `mail()` ile **contact@aderionstudios.com** adresine göndermeye çalışır. Gönderici aynı adrestir; adayın adresi `Reply-To` olur.
- Ad, e-posta, ilgili rol, portföy URL'si, deneyim ve açıklama gönderilir. Zorunlu onay, gizli spam alanı, temel sunucu doğrulaması ve IP başına saatlik sınırlama bulunur.
- **PHP `mail()` fonksiyonunun TRUE dönmesi sadece sunucunun postayı kuyruğa kabul ettiği anlamına gelir, posta kutusuna ulaştığını kanıtlamaz.** E-posta teslimi için cPanel hosting SMTP/mail servisi ve alan adının SPF/DKIM/DMARC yapılandırmasının çalışması gerekir. Gerçek bir test başvurusuyla doğrulayın.
- E-posta gönderilemezse form **başarılı olduğunu iddia etmez**, Türkçe/İngilizce hata verir; aday formu tekrar deneyebilir.
- `file://` üzerinden yerel HTML önizlemesi PHP çalıştıramaz. Bu ortamda form bir `mailto:` taslağı açar ve başvurunun gönderiminin kullanıcı tarafından tamamlanması gerektiğini söyler. `python -m http.server` de PHP çalıştırmaz.

## cPanel yükleme (önemli)

1. ZIP'i açıp `index.html`, `studio.html`, `credits.html`, `join.html`, `assets/`, `data/` ve **`api/`** klasörlerini `public_html/` içine yükleyin. `scripts/` yalnızca Credits yerel yedeğini üretmek içindir.
2. cPanel'de alan adınızın PHP desteklediğini ve `mail()` fonksiyonuna izin verildiğini kontrol edin. `contact@aderionstudios.com` adresini etkinleştirin ve domain e-posta gönderimini SPF/DKIM/DMARC ile yapılandırın. Hosting tarafında yalnızca SMTP ile gönderime izin veriliyorsa `api/apply.php` dosyasını PHPMailer/SMTP'ye geçirmek gerekir.
3. Test başvurusu yapın, gelen kutusu ve spam klasörünü kontrol edin. Gerekirse hosting mail loglarını inceleyin.
4. Başvuru toplanacağı için yayımlamadan önce uygun **KVKK aydınlatma metnini**, saklama süresini, veri sahiplerinin haklarını ve stüdyonun gizlilik politikasını ekleyin. Formdaki izin kutusu tek başına mevzuat uyumu sağlamaz.

### PHP ile yerelde test

```bash
cd aderion-studios-v3
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
