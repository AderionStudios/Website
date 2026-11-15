# Aderion Studios – Credits görselleri (V6 düzeltmesi)

## Neden 404 alıyordum?

Önceki `update-credits.py` yanlış bir varsayımla yalnızca GitHub'a yüklenmiş `assets/img/team/discord_cache/...` medya dosyalarını arıyordu. Orijinal projenin `scripts/render-credits.js` betiği ise görselleri **yerel derleme sırasında** Discord profil verilerinden indiriyor. Bu klasördeki dosyaların GitHub'da bulunması garanti değildir; bu nedenle 404 normaldir.

## Yeni araç ne yapıyor?

`update-credits.bat` şu sırayla ilerler:
1. `assets/images/team/` klasöründe daha önce indirilmiş ve geçerli bir avatar/banner varsa korur.
2. Eski GitHub projesinin bilgisayarındaki `assets/img/team/discord_cache/` dosyalarını arar ve bulursa yeni siteye kopyalar.
3. Dosya yoksa orijinal repo gibi `https://japi.rest/discord/v1/user/{discordId}` adresinden **her kişi için bir kez** herkese açık profil verisini ister. Gelen Discord CDN avatar ve banner URL'lerinden resimleri indirir.
4. Gelen dosyanın gerçek biçimini (`gif`, `png`, `jpg` veya `webp`) kontrol eder. Gerekirse `credits.json` içindeki `avatarExt`/`bannerExt` alanlarını düzeltir; `assets/credits-data.js` dosyasını yeniler.
5. Hiçbir kaynak sonuç vermezse sitede baş harf ve CSS banner görünür; yanlışlıkla başarı yazmaz.

**Not:** Discord profil servisleri bazen erişilemez/rate-limited olabilir veya bir kullanıcının banner'ı olmayabilir. API'nin çalışma garantisi yoktur. Bu durumda görselleri elle kaydedebilirsin.

## Nasıl kullanacağım?

1. ZIP içindeki **`scripts/update-credits.py`** ve **`assets/pages.js`** dosyalarını mevcut site klasöründe aynı dizinlerle değiştir. Kendi düzenlediğin `data/credits.json` dosyasını silme veya eski örnekle değiştirme.
2. PowerShell'de site klasörünün içine gir ve `./update-credits.bat` (Windows PowerShell: `.\\update-credits.bat`) çalıştır.
3. Güncel Discord fotoğraflarını yeniden indirmek istersen `./update-credits.bat --force` kullan.
4. İşlem bittiğinde `assets/images/team/` klasörünü, `assets/pages.js` dosyasını ve güncellenen `data/credits.json` ile `assets/credits-data.js` dosyalarını cPanel'e yükle.
5. Credits sayfasında **Ctrl + F5** yap.

## Elle görsel eklemek

Alternatif: görseli kendi bilgisayarına indirip `assets/images/team/` içine bu isimlerle koy:
- `296189055379570688_avatar.png` / `296189055379570688_banner.png` (Stettin)
- `966300934202359888_avatar.png` / `966300934202359888_banner.png` (Flaouve)

`.gif`, `.jpg`, `.webp` da desteklenir. İndirilen görselin dosya uzantısı gerçek biçimiyle aynı olmalıdır. Yeni üye eklendiğinde dosya adında ilgili Discord ID kullanılır. İstersen `credits.json` içinde `avatar` ve `banner` alanlarına kendi HTTPS görüntü URL'lerini veya `assets/images/team/...` yolunu da yazabilirsin.

## Önemli

Site, önce kendi yerel görsellerini kullanır; GitHub'da olmayan cache URL'lerini artık boşuna istemez. Görseller senin bilgisayarında başarıyla indirilip sunucuya yüklenmediyse sitenin kendiliğinden onları göstermesi mümkün değildir. Bu araç Discord token'ı istemez, herhangi bir başvuru/e-posta ayarına dokunmaz.
