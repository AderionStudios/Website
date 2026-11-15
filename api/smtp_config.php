<?php
/**
 * ============================================================================
 * ADERION STUDIOS — SMTP E-posta Yapılandırması
 * cPanel'deki contact@aderionstudios.com hesabınızın bilgileri.
 * ============================================================================
 */
return [
    // Sunucu adresi: genellikle mail.alanadiniz.com veya localhost
    'host'     => 'mail.aderionstudios.com',

    // SSL için 465, TLS için 587
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
    'fromName' => 'Aderion Studios Web'
];
