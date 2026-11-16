<?php
/**
 * ============================================================================
 * ADERION STUDIOS — Discord canlı profil ayarları (ÖRNEK)
 *
 * Bu dosyayı `discord_config.php` olarak kopyalayın ve YALNIZCA sunucudaki
 * kopyaya gerçek değerleri yazın. `discord_config.php` .gitignore'dadır, GitHub'a
 * ve deploy'a gitmez. Bot token'ını asla commit etmeyin / sohbette paylaşmayın.
 *
 * Veri kaynakları (sırayla denenir):
 *   1) Discord resmi API'si + bot token'ı  -> isim, avatar, afiş, afiş rengi, dekorasyon
 *   2) japi.rest (yedek, token gerektirmez) -> aynı alanlar, resmi olmayan üçüncü taraf
 *   3) Lanyard (isteğe bağlı)              -> canlı "özel durum" (🔥 11 oyuna hazır...)
 *      Lanyard için her ekip üyesinin discord.gg/lanyard sunucusuna katılması gerekir.
 * ============================================================================
 */
return [
    // Discord Developer Portal -> Uygulama -> Bot -> Reset Token.
    // Hiçbir "intent" açmaya gerek yok, bot hiçbir sunucuya eklenmek zorunda değil.
    'bot_token'     => '',

    // Canlı özel durum için Lanyard kullan (üyeler Lanyard sunucusuna katılmalı).
    'lanyard'       => true,

    // Bot token yoksa / başarısızsa japi.rest'e düş.
    'japi_fallback' => true,

    // Önbellek süreleri (saniye). Profil: isim/avatar/afiş. Durum: Lanyard.
    'profile_ttl'   => 600,
    'presence_ttl'  => 60,

    // Sadece test için (yerel sahte sunucular). Canlıda DEĞİŞTİRMEYİN.
    // 'discord_base' => 'https://discord.com/api/v10',
    // 'lanyard_base' => 'https://api.lanyard.rest/v1',
    // 'japi_base'    => 'https://japi.rest/discord/v1',
];
