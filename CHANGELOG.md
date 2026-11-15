# Aderion Studios — Site Degisiklikleri

## V5 — Credits gorsel duzeltmesi

- `data/credits.json` icin `name`, `handle`, `avatarExt`, `bannerExt` gibi opsiyonel profil alanlari destekleniyor.
- Credits avatar ve banner kaynaklari oncelikle `assets/images/team/` uzerinden yukleniyor; dis baglanti olarak GitHub Raw ve jsDelivr yedekleri deneniyor.
- Eksik gorsellerde bas harf ve renk gecisi yedekleri korunuyor.
- Tek uyeli departman kartlari genis ekranda ortalaniyor.
- Windows icin `update-credits.bat` ve Python 3 icin `scripts/update-credits.py` eklendi. Bu araci internet baglantisi olan bilgisayarda calistirdiktan sonra indirilen gorselleri cPanel'e yukleyebilirsiniz.
- Tum V4 ozellikleri (ozel logo, acik/koyu mod, PHP basvuru formu) korundu.

Ayrintilar: `CREDITS-KILAVUZU.md`.
