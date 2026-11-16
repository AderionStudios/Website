<?php
/**
 * ============================================================================
 * ADERION STUDIOS — SMTP Yapılandırma ÖRNEĞİ
 *
 * Bu dosyayı `smtp_config.php` olarak kopyalayın ve gerçek bilgileri YALNIZCA
 * sunucudaki (veya yerel) kopyaya yazın. `smtp_config.php` .gitignore'dadır ve
 * GitHub'a / deploy'a GİTMEZ. Gerçek şifreyi asla commit etmeyin.
 * ============================================================================
 */
return [
    // Sunucu adresi: genellikle mail.alanadiniz.com
    'host'     => 'localhost',

    // SSL için 465, TLS (STARTTLS) için 587
    'port'     => 465,

    // Bağlantı tipi: 'ssl' veya 'tls'
    'secure'   => 'ssl',

    // cPanel'de açtığınız e-posta adresi
    'username' => 'contact@aderionstudios.com',

    // cPanel'de bu e-posta için belirlediğiniz şifre
    'password' => 'BURAYA_EPOSTA_SIFRENIZI_YAZIN',

    // Başvuruların teslim edileceği adres
    'to'       => 'contact@aderionstudios.com',

    // Gönderici başlığı
    'fromName' => 'Aderion Studios Web',

    // TLS sertifika doğrulaması (varsayılan: true). Kapatmayın.
    // Sertifika başka bir ana makine adına düzenlenmişse kapatmak yerine
    // 'peer_name' ile sertifikadaki adı belirtin.
    'verify_tls' => true,
    // 'peer_name' => 'sunucu.hosting-adi.com',

    // Site Cloudflare gibi bir proxy'nin ARKASINDAYSA, gerçek ziyaretçi IP'sini
    // taşıyan başlığı yazın (ör. 'HTTP_CF_CONNECTING_IP'). Proxy yoksa boş bırakın;
    // aksi halde başlık sahte yazılıp rate limit atlatılabilir.
    'trust_proxy_header' => '',
];
