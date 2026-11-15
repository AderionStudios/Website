/* Extra pages: bilingual translations, JSON-driven credits and Join Us form. */
const extraTr = {
  footerHome:'Ana sayfa',studioPageEyebrow:'BİZ KİMİZ?',studioPageTitle:'Küçük bir ekip.<br><em>Büyük dünyalar.</em>',
  studioPageIntro:'Aderion Studios, karakterleri ve hikâyeleri merkeze alan oyunlar kurmayı hedefleyen bağımsız bir stüdyo. Kendi yolumuzu, merak ettiğimiz dünyaları yaratarak çiziyoruz.',
  studioPageRoadmapButton:'Yol haritamız',studioPageTeamButton:'Ekibimizi tanı',studioPageStoryLabel:'BİZİM HİKÂYEMİZ',
  studioPageStoryTitle:'Oyundan önce<br><em>bir his vardır.</em>',
  studioPageStoryLead:'Aderion’da bir dünyanın değerini yalnızca boyutu ya da teknik gösterişi belirlemez. Oyuncunun karakterlerle kurduğu bağ, aldığı kararlar ve hatırladığı anlar belirler.',
  studioPageStoryBody:'Visual Novel ile güçlü anlatılar, Voxel ile keşfedilesi alanlar, 2D oyunlarla da oynanışın taşıdığı hikâyeler hayal ediyoruz. Henüz planlama ve üretim yolculuğumuzu şekillendiriyoruz; her adımı düşünerek atmak istiyoruz.',
  studioValuesLabel:'BİZİM İÇİN ÖNEMLİ OLAN',studioValueOne:'Anlatı',studioValueOneDesc:'Oynanışın içine işleyen, karakterleri güçlü hikâyeler.',
  studioValueTwo:'Keşif',studioValueTwoDesc:'Detaylarıyla merak uyandıran, kendine has dünyalar.',
  studioValueThree:'Birlikte üretim',studioValueThreeDesc:'Sanat, yazılım ve sesin birbirini tamamladığı ekip çalışması.',
  roadmapLabel:'YOL HARİTAMIZ',roadmapTitle:'Adım adım.<br><em>Özenle.</em>',
  roadmapNote:'Aşağıdaki başlıklar planlanan çalışma aşamalarımızdır; resmî tarih veya tamamlanmış proje duyurusu değildir.',
  roadmapStatePlan:'PLANLANAN',roadmapOneTitle:'Temel & ekip',roadmapOneText:'Stüdyo kimliğini, çalışma biçimini ve yaratıcı ekip yapılanmasını oluşturmak.',
  roadmapTwoTitle:'Prototip & dünya',roadmapTwoText:'Visual Novel, Voxel ve 2D fikirlerinden seçilen konseptleri oynanabilir prototiplere dönüştürmek.',
  roadmapThreeTitle:'Test & geliştirme',roadmapThreeText:'İlk oynanabilir yapıları test etmek; hikâyeyi, hissi ve oynanışı geri bildirimle geliştirmek.',
  roadmapFourTitle:'Topluluk & paylaşım',roadmapFourText:'Doğru zamanda oynanış kesitleri, geliştirme notları ve oyun duyurularını paylaşmak.',
  studioCtaLabel:'BU HİKÂYEDE BİR YERİN VAR',studioCtaTitle:'Yeni dünyalar <em>birlikte</em> kurulur.',studioCtaText:'Sanat, hikâye veya geliştirme tarafında katkı vermek ister misin?',
  creditsEyebrow:'STÜDYO KÜNYESİ',creditsTitle:'Dünyaların <em>arkasındaki</em><br>insanlar.',
  creditsIntro:'Aderion’u şekillendiren ekip. Farklı uzmanlıklar, ortak bir dünya kurma isteği.',creditsRoster:'EKİP / CREDITS',creditsLoading:'Ekip bilgileri yükleniyor…',
  creditsSourceNote:'Üyeler ve roller data/credits.json üzerinden gösterilir. Avatarlar önce yerel dosyalardan, ardından GitHub yedeğinden yüklenir.',
  creditsCtaLabel:'EKİBİN BİR PARÇASI OL',creditsCtaTitle:'Sıradaki hikâyeyi <em>birlikte</em> yazalım.',
  creditRole:'STÜDYO ROLÜ',creditProfile:'Discord profili',creditMembers:'ÜYE',creditSource:'Profil bağlantıları',
  joinEyebrow:'JOIN US / BİZE KATIL',joinTitle:'Birlikte<br><em>üretelim.</em>',
  joinIntro:'Karakter çizmeyi, unutulmaz diyaloglar yazmayı veya küçük dünyalar kodlamayı seviyorsan, aynı hikâyede buluşabiliriz.',
  joinExplore:'Pozisyonları keşfet',joinApplyLink:'Ön başvuru',joinHeroFoot:'ÖN BAŞVURU HAVUZU · PORTFÖY ODAKLI',
  positionsLabel:'BİRLİKTE ÇALIŞABİLECEĞİMİZ ALANLAR',positionsTitle:'Aradığımız şey:<br><em>aynı heyecan.</em>',
  positionsNote:'Bu roller stüdyonun planlanan oyun türlerine göre önerilen katkı alanlarıdır. Kesinleşmiş açık iş ilanı veya ücretli pozisyon duyurusu değildir.',
  filterAll:'Tümü',filterArt:'Sanat',filterWriting:'Hikâye',filterDev:'Geliştirme',filterAudio:'Ses',roleInterest:'Bu alanla ilgileniyorum',
  applyLabel:'İLK ADIM',applyTitle:'Bize biraz<br><em>kendinden bahset.</em>',
  applyIntro:'Portföyünü, ilgilendiğin rolü ve üzerinde çalıştığın işleri paylaşabilirsin. Özellikle bitmiş bir projen olmasa da üretme isteğini anlatman değerli.',
  applyStepOne:'Bir alan seç.',applyStepTwo:'Çalışmalarını paylaş.',applyStepThree:'Başvurunu gönder.',
  applyPrivacy:'Başvuru bilgilerin contact@aderionstudios.com adresine e-posta ile iletilir. Değerlendirme amacıyla stüdyo posta kutusunda saklanabilir.',
  applyFormLabel:'TANIŞMA FORMU / APPLICATION',applyName:'Adın soyadın *',applyEmail:'E-posta *',applyRole:'İlgilendiğin alan *',
  applyChoose:'Pozisyon seç',applyPortfolio:'Portföy / GitHub / itch.io bağlantısı *',applyExperience:'Deneyim düzeyin',
  experienceBeginner:'Yeni başlıyorum',experienceSome:'Birkaç proje yaptım',experienceExperienced:'Deneyimliyim',
  applyMessage:'Bize kendinden ve üretmek istediklerinden bahset *',
  applyConsent:'Başvuru bilgilerimin değerlendirilmek üzere Aderion Studios’a e-posta ile gönderilmesini kabul ediyorum.',
  applySubmit:'Başvurumu gönder',applicationSending:'Başvurun gönderiliyor…',applicationSent:'Başvurun e-posta gönderimi için sunucu tarafından kabul edildi. Teşekkürler!',applicationError:'Başvuru gönderilemedi. Lütfen daha sonra tekrar dene veya contact@aderionstudios.com adresine yaz.',applicationLocal:'Bu formun doğrudan gönderimi PHP destekli yayında çalışır. E-posta uygulaman açılıyor; göndermeyi sen tamamlamalısın.',applicationRateLimit:'Kısa sürede çok sayıda başvuru denendi. Bir süre sonra tekrar dene.',applicationSubject:'Aderion Studios — Ön Başvuru',
  applicationCopied:'Ön başvuru taslağı panoya kopyalandı. Başvuruyu iletmek için stüdyonun doğrulanmış iletişim kanalına göndermen gerekiyor.',
  applicationMail:'E-posta taslağın açılıyor. Gönderim için e-posta uygulamanda onay vermen gerekir.',
  applicationFailed:'Panoya erişilemiyor. Metni açılan pencereden kopyalayabilirsin.'
};
const extraEn = {
  footerHome:'Home',studioPageEyebrow:'WHO ARE WE?',studioPageTitle:'Small team.<br><em>Big worlds.</em>',
  studioPageIntro:'Aderion Studios is an independent game studio aiming to build games centered on characters and stories. We find our way by imagining worlds we want to explore.',
  studioPageRoadmapButton:'Our roadmap',studioPageTeamButton:'Meet our team',studioPageStoryLabel:'OUR STORY',
  studioPageStoryTitle:'Before a game,<br><em>there is a feeling.</em>',
  studioPageStoryLead:'At Aderion, a world is not defined by its size or spectacle alone. It is shaped by the bond between player and character, the decisions made, and the moments remembered.',
  studioPageStoryBody:'We imagine compelling narratives through visual novels, intriguing spaces through voxel worlds, and stories told through gameplay in 2D experiences. We are still shaping our production journey, choosing each step with intention.',
  studioValuesLabel:'WHAT MATTERS TO US',studioValueOne:'Narrative',studioValueOneDesc:'Strong character stories woven into the gameplay.',
  studioValueTwo:'Discovery',studioValueTwoDesc:'Distinctive worlds that spark curiosity with every detail.',
  studioValueThree:'Making together',studioValueThreeDesc:'Collaboration where art, code, and sound belong together.',
  roadmapLabel:'OUR ROADMAP',roadmapTitle:'Step by step.<br><em>With intention.</em>',
  roadmapNote:'These are proposed production phases, not official release dates or completed-project announcements.',
  roadmapStatePlan:'PLANNED',roadmapOneTitle:'Foundations & team',roadmapOneText:'Establish our studio identity, workflows, and creative team structure.',
  roadmapTwoTitle:'Prototype & world',roadmapTwoText:'Turn selected visual novel, voxel, and 2D concepts into playable prototypes.',
  roadmapThreeTitle:'Test & iterate',roadmapThreeText:'Test early builds and improve story, feeling, and gameplay with feedback.',
  roadmapFourTitle:'Community & sharing',roadmapFourText:'Share development notes, gameplay glimpses, and announcements when they are ready.',
  studioCtaLabel:'THERE IS A PLACE FOR YOU IN THIS STORY',studioCtaTitle:'New worlds are built <em>together.</em>',studioCtaText:'Want to contribute through art, storytelling, or development?',
  creditsEyebrow:'STUDIO CREDITS',creditsTitle:'The people <em>behind</em><br>the worlds.',
  creditsIntro:'The people shaping Aderion. Different skills, the same drive to build worlds.',creditsRoster:'TEAM / CREDITS',creditsLoading:'Loading team information…',
  creditsSourceNote:'Team profiles are read from data/credits.json. Images load from local files first, then fall back to GitHub mirrors.',
  creditsCtaLabel:'BE PART OF THE TEAM',creditsCtaTitle:'Let’s write the next story <em>together.</em>',
  creditRole:'STUDIO ROLE',creditProfile:'Discord profile',creditMembers:'MEMBER',creditSource:'Profile links',
  joinEyebrow:'JOIN US / CREATE WITH US',joinTitle:'Let’s make<br><em>something.</em>',
  joinIntro:'If you love drawing characters, writing memorable dialogue, or coding little worlds, we might be part of the same story.',
  joinExplore:'Explore roles',joinApplyLink:'Introduce yourself',joinHeroFoot:'EXPRESSION OF INTEREST · PORTFOLIO FIRST',
  positionsLabel:'WAYS WE COULD COLLABORATE',positionsTitle:'What matters most:<br><em>shared excitement.</em>',
  positionsNote:'These roles are suggested collaboration areas based on our planned game genres, not confirmed openings or paid job announcements.',
  filterAll:'All',filterArt:'Art',filterWriting:'Writing',filterDev:'Development',filterAudio:'Audio',roleInterest:'I’m interested in this role',
  applyLabel:'FIRST STEP',applyTitle:'Tell us<br><em>about yourself.</em>',
  applyIntro:'Share your portfolio, the role that interests you, and what you have been making. Even without a completed project, your motivation matters.',
  applyStepOne:'Pick an area.',applyStepTwo:'Share your work.',applyStepThree:'Send your application.',
  applyPrivacy:'Your application is emailed to contact@aderionstudios.com and may be retained in the studio inbox for review.',
  applyFormLabel:'INTRODUCTION / APPLICATION',applyName:'Full name *',applyEmail:'Email *',applyRole:'Area of interest *',
  applyChoose:'Choose a role',applyPortfolio:'Portfolio / GitHub / itch.io URL *',applyExperience:'Experience level',
  experienceBeginner:'Just starting out',experienceSome:'A few projects completed',experienceExperienced:'Experienced',
  applyMessage:'Tell us about yourself and what you hope to make *',
  applyConsent:'I agree that my application details may be emailed to Aderion Studios for consideration.',
  applySubmit:'Submit application',applicationSending:'Sending your application…',applicationSent:'The server accepted your application for email delivery. Thank you!',applicationError:'Your application could not be submitted. Please try again or email contact@aderionstudios.com.',applicationLocal:'Direct submission requires PHP hosting. Your email app is opening; you must send the message yourself.',applicationRateLimit:'Too many submissions. Please try again later.',applicationSubject:'Aderion Studios — Expression of Interest',
  applicationCopied:'Your application draft was copied. To submit it, send it through the studio’s verified contact channel.',
  applicationMail:'Your email draft is opening. Confirm sending in your email application.',
  applicationFailed:'Clipboard access is blocked. Copy the text from the dialog.'
};
Object.assign(translations.tr,extraTr);
Object.assign(translations.en,extraEn);

const roles = [
  {id:'character-artist',category:'art',code:'ART / 01',tr:'2D Karakter Çizeri',en:'2D Character Artist',descTr:'Visual Novel karakterleri, ifadeler, kostümler ve sahneye uygun karakter çizimleri.',descEn:'Visual novel characters, expressions, costumes, and scene-ready character illustrations.',skills:'Character Design · 2D Art · Expressions'},
  {id:'background-artist',category:'art',code:'ART / 02',tr:'Arka Plan & Çevre Sanatçısı',en:'Background & Environment Artist',descTr:'Hikâyenin atmosferini kuran çevreler, arka planlar ve 2D sahne görselleri.',descEn:'Backgrounds, environments and 2D scenes that establish the mood of a story.',skills:'Backgrounds · Lighting · Environment'},
  {id:'voxel-artist',category:'art',code:'ART / 03',tr:'Voxel Sanatçısı',en:'Voxel Artist',descTr:'Blok tabanlı, karakterli küçük dünyalar ve keşfedilebilir ortamlar üretmek.',descEn:'Create expressive block-based worlds and explorable spaces.',skills:'Voxel · Worldbuilding · Level Art'},
  {id:'narrative-designer',category:'writing',code:'STORY / 01',tr:'Hikâye Yazarı & Narrative Designer',en:'Narrative Designer & Writer',descTr:'Dallanan diyaloglar, sahne akışları, karakter geçmişleri ve güçlü hikâye örgüleri.',descEn:'Branching dialogues, scene flows, character backstories, and compelling narratives.',skills:'Storytelling · Branching Dialogue · VN'},
  {id:'visual-novel-dev',category:'dev',code:'DEV / 01',tr:'Visual Novel Geliştiricisi',en:'Visual Novel Developer',descTr:'Diyalog sistemleri, seçim ekranları, kayıt akışı ve hikâye araçları geliştirmek.',descEn:'Build dialogue systems, choice screens, save flows, and narrative tools.',skills:'Ren’Py · Godot · Scripting'},
  {id:'2d-game-dev',category:'dev',code:'DEV / 02',tr:'2D Oyun Geliştiricisi',en:'2D Gameplay Developer',descTr:'Hikâye odaklı 2D oyunlarda karakter kontrolü, etkileşim ve temel oynanış geliştirmek.',descEn:'Build character controls, interactions, and core gameplay for story-focused 2D games.',skills:'Godot · Unity · 2D Gameplay'},
  {id:'uiux',category:'art',code:'DESIGN / 01',tr:'Oyun UI/UX Tasarımcısı',en:'Game UI/UX Designer',descTr:'Okunabilir diyalog kutuları, doğal menüler ve oyuncuya yardımcı arayüzler tasarlamak.',descEn:'Design readable dialogue boxes, natural menus, and player-friendly interfaces.',skills:'Game UI · Prototyping · UX'},
  {id:'sound',category:'audio',code:'AUDIO / 01',tr:'Besteci & Ses Tasarımcısı',en:'Composer & Sound Designer',descTr:'Sahnenin duygusunu taşıyan müzikler, atmosferler ve sade ses efektleri.',descEn:'Compose music, atmospheres, and sound effects that support the emotional tone.',skills:'OST · Ambience · SFX'}
];
const escapeHtml = value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let credits = window.ADERION_CREDITS || {departments:[]};
const safeLink = candidate=>{try{let url=new URL(candidate);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}};
// Credits images are stored locally after running update-credits.bat.
// Avoid hardcoded GitHub cache URLs: those files may not exist in the repository.
function creditMediaCandidates(member,kind){
  const explicit=typeof member[kind]==='string'?member[kind].trim():'';
  const id=String(member.discordId||'');
  const urls=[];
  if(explicit && (/^https:\/\//i.test(explicit)||/^assets\/images\/team\/[\w.-]+$/.test(explicit))){
    urls.push(explicit);
  }
  if(/^\d{16,24}$/.test(id)){
    const preferred=String(member[kind+'Ext']||'').toLowerCase();
    const extensions=[preferred,'png','gif','webp','jpg'].filter((ext,i,arr)=>
      ['png','gif','webp','jpg'].includes(ext)&&arr.indexOf(ext)===i);
    extensions.forEach(ext=>urls.push(`assets/images/team/${id}_${kind}.${ext}`));
  }
  return [...new Set(urls)];
}
function creditImgHtml(member,kind){
  const candidates=creditMediaCandidates(member,kind);
  if(!candidates.length)return '';
  return `<img src="${escapeHtml(candidates[0])}" data-credit-media="${escapeHtml(JSON.stringify(candidates))}" data-credit-media-index="0" alt="" loading="lazy" class="member-external-media" referrerpolicy="no-referrer">`;
}
function setupCreditImages(root){
  root.querySelectorAll('[data-credit-media]').forEach(img=>{
    const sources=JSON.parse(img.dataset.creditMedia);
    const next=()=>{
      const nextIndex=Number(img.dataset.creditMediaIndex||0)+1;
      if(nextIndex>=sources.length){img.hidden=true;return;}
      img.dataset.creditMediaIndex=String(nextIndex);
      img.src=sources[nextIndex];
    };
    img.addEventListener('error',next);
    // A cached image can fail before the listener has been installed.
    if(img.complete && img.naturalWidth===0)next();
  });
}
window.handleCreditAvatarError = function(img, discordId, fallbackSrc) {
  img.onerror = null;
  if (discordId && /^\d{16,24}$/.test(discordId)) {
    fetch(`https://japi.rest/discord/v1/user/${discordId}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.data && res.data.avatarURL) {
          img.src = res.data.avatarURL;
          return;
        }
        img.src = fallbackSrc;
      })
      .catch(() => {
        img.src = fallbackSrc;
      });
  } else {
    img.src = fallbackSrc;
  }
};

window.handleCreditBannerError = function(bannerImg, discordId) {
  bannerImg.onerror = null;
  bannerImg.style.opacity = '0';
  if (discordId && /^\d{16,24}$/.test(discordId)) {
    fetch(`https://japi.rest/discord/v1/user/${discordId}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.data) {
          const bannerEl = bannerImg.closest('.member-banner');
          if (res.data.bannerURL) {
            bannerImg.src = res.data.bannerURL;
            bannerImg.style.opacity = '1';
            if (bannerEl) bannerEl.style.backgroundImage = `url('${res.data.bannerURL}')`;
          } else if (res.data.banner_color) {
            if (bannerEl) bannerEl.style.backgroundColor = res.data.banner_color;
          }
        }
      })
      .catch(() => {});
  }
};

function renderCreditsFromData(data) {
  const root = document.querySelector('#creditsRoot');
  if (!root || !data || !Array.isArray(data.departments)) return;

  let totalMembers = 0;
  data.departments.forEach(dept => {
    if (Array.isArray(dept.members)) {
      totalMembers += dept.members.length;
    }
  });

  const countEl = document.getElementById('creditsCount');
  if (countEl) {
    countEl.textContent = `${String(totalMembers).padStart(2, '0')} ${totalMembers === 1 ? 'MEMBER' : 'MEMBERS'}`;
  }

  const deptHtml = data.departments.map(dept => {
    const deptId = dept.id || 'dept-' + (dept.code || '00');
    const badgeText = dept.badge || (dept.code ? `DEP // ${dept.code}` : 'DEP');
    const titleTr = dept.title_tr || '';
    const titleEn = dept.title_en || dept.title_tr || '';
    const currentTitle = locale === 'tr' ? titleTr : titleEn;
    const memberCount = (dept.members || []).length;
    const memberLabel = memberCount === 1 ? '01 MEMBER' : `${String(memberCount).padStart(2, '0')} MEMBERS`;

    const membersHtml = (dept.members || []).map(member => {
      const discordId = String(member.discordId || '').trim();
      const memberId = member.id || discordId;
      const name = member.displayName || member.name || memberId;
      const handle = member.handle || (discordId ? `@${memberId}` : '');
      const roleBadge = member.roleBadge || 'MEMBER';
      
      const roleTr = member.role_tr || '';
      const roleEn = member.role_en || roleTr;
      const currentRole = locale === 'tr' ? roleTr : roleEn;

      const metaTr = member.meta_tr || '';
      const metaEn = member.meta_en || metaTr;
      const currentMeta = locale === 'tr' ? metaTr : metaEn;

      const bubbleTr = member.bubble_tr || member.bubble || '';
      const bubbleEn = member.bubble_en || bubbleTr;
      const currentBubble = locale === 'tr' ? bubbleTr : bubbleEn;

      // Banner URL
      let bannerSrc = member.banner || '';
      if (!bannerSrc && discordId) {
        bannerSrc = `assets/images/team/${discordId}_banner.${member.bannerExt || 'png'}`;
      }

      // Avatar URL
      let avatarSrc = member.avatar || '';
      if (!avatarSrc && discordId) {
        avatarSrc = `assets/images/team/${discordId}_avatar.${member.avatarExt || 'png'}`;
      }
      let fallbackAvatar = 'assets/img/team/avatar-default.svg';
      if (memberId === 'stettin') fallbackAvatar = 'assets/img/team/avatar-stettin.svg';
      if (memberId === 'flaouve') fallbackAvatar = 'assets/img/team/avatar-flaouve.svg';
      if (!avatarSrc) avatarSrc = fallbackAvatar;

      // Decoration
      let decorationHtml = '';
      if (member.decoration) {
        decorationHtml = `<img src="${escapeHtml(member.decoration)}" alt="" class="member-avatar-decoration" aria-hidden="true" onerror="this.remove();">`;
      } else if (discordId === '966300934202359888' || member.hasDecoration) {
        decorationHtml = `<img src="assets/images/team/${discordId}_decoration.png" alt="" class="member-avatar-decoration" aria-hidden="true" onerror="this.remove();">`;
      }

      // Status bubble
      let bubbleHtml = '';
      if (currentBubble) {
        bubbleHtml = `
          <div class="discord-status-bubble" data-bubble-tr="${escapeHtml(bubbleTr)}" data-bubble-en="${escapeHtml(bubbleEn)}">
            <span class="status-bubble-tail"></span>
            <span class="status-bubble-text">${escapeHtml(currentBubble)}</span>
          </div>`;
      }

      // Pronouns
      let pronounsHtml = '';
      if (member.pronouns) {
        pronounsHtml = `<span class="member-pronouns">• ${escapeHtml(member.pronouns)}</span>`;
      }

      // Discord button
      let discordBtnHtml = '';
      if (discordId) {
        const profileLabel = translations[locale]?.creditProfile || (locale === 'tr' ? 'Discord Profili' : 'Discord Profile');
        discordBtnHtml = `
          <a class="member-discord" target="_blank" rel="noopener noreferrer" href="https://discord.com/users/${escapeHtml(discordId)}">
            <svg class="discord-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span data-t="creditProfile">${escapeHtml(profileLabel)} ↗</span>
          </a>`;
      }

      // Social links
      let linksHtml = '';
      if (member.links && typeof member.links === 'object') {
        const linkItems = Object.entries(member.links).map(([k, u]) => {
          return `<a target="_blank" rel="noopener noreferrer" href="${escapeHtml(u)}">${escapeHtml(k)} ↗</a>`;
        }).join('');
        if (linkItems) {
          linksHtml = `<div class="member-socials">${linkItems}</div>`;
        }
      }

      const roleLabel = translations[locale]?.creditRole || (locale === 'tr' ? 'STÜDYO ROLÜ' : 'STUDIO ROLE');

      return `
        <article class="member-card reveal in-view" data-member-id="${escapeHtml(memberId)}">
          <div class="member-banner"${bannerSrc ? ` style="background-image: url('${escapeHtml(bannerSrc)}');"` : ''}>
            ${bannerSrc ? `<img src="${escapeHtml(bannerSrc)}" alt="${escapeHtml(name)} Banner" class="member-banner-img" loading="lazy" onerror="window.handleCreditBannerError(this, '${escapeHtml(discordId)}')">` : ''}
            <span class="member-banner-label">ADERION / CORE TEAM</span>
          </div>
          <div class="member-body">
            <div class="member-head">
              <div class="member-avatar">
                <img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(name)}" class="member-avatar-img" width="84" height="84" loading="lazy" onerror="window.handleCreditAvatarError(this, '${escapeHtml(discordId)}', '${fallbackAvatar}')">
                ${decorationHtml}
              </div>
              <span class="member-role-badge">${escapeHtml(roleBadge)}</span>
            </div>
            <div class="member-identity">
              <h3>${escapeHtml(name)}</h3>
              ${handle ? `<span>${escapeHtml(handle)}</span>` : ''}
              ${pronounsHtml}
            </div>
            ${bubbleHtml}
            <div class="member-role">
              <small data-t="creditRole">${escapeHtml(roleLabel)}</small>
              <strong data-role-tr="${escapeHtml(roleTr)}" data-role-en="${escapeHtml(roleEn)}">${escapeHtml(currentRole)}</strong>
              ${currentMeta ? `<span data-meta-tr="${escapeHtml(metaTr)}" data-meta-en="${escapeHtml(metaEn)}">${escapeHtml(currentMeta)}</span>` : ''}
            </div>
            <div class="member-actions">
              ${discordBtnHtml}
              ${linksHtml}
            </div>
          </div>
        </article>`;
    }).join('');

    return `
      <section class="credit-department" aria-labelledby="dept-${escapeHtml(deptId)}-heading">
        <div class="department-heading">
          <div>
            <span class="department-index" data-lang-tr="${escapeHtml(badgeText)}" data-lang-en="${escapeHtml(badgeText)}">${escapeHtml(badgeText)}</span>
            <h2 id="dept-${escapeHtml(deptId)}-heading" data-lang-tr="${escapeHtml(titleTr)}" data-lang-en="${escapeHtml(titleEn)}">${escapeHtml(currentTitle)}</h2>
          </div>
          <span class="department-count">${escapeHtml(memberLabel)}</span>
        </div>
        <div class="member-grid">
          ${membersHtml}
        </div>
      </section>`;
  }).join('');

  root.innerHTML = deptHtml;
}

function updateStaticCreditsText() {
  const root = document.querySelector('#creditsRoot');
  if (!root) return;
  root.querySelectorAll('[data-role-tr]').forEach(el => {
    el.textContent = locale === 'tr' ? el.dataset.roleTr : el.dataset.roleEn;
  });
  root.querySelectorAll('[data-meta-tr]').forEach(el => {
    el.textContent = locale === 'tr' ? el.dataset.metaTr : el.dataset.metaEn;
  });
  root.querySelectorAll('[data-bubble-tr]').forEach(el => {
    const textEl = el.querySelector('.status-bubble-text');
    if (textEl) {
      textEl.textContent = locale === 'tr' ? el.dataset.bubbleTr : el.dataset.bubbleEn;
    }
  });
  root.querySelectorAll('[data-lang-tr]').forEach(el => {
    el.textContent = locale === 'tr' ? el.dataset.langTr : el.dataset.langEn;
  });
  const profileLabel = translations[locale]?.creditProfile || (locale === 'tr' ? 'Discord Profili' : 'Discord Profile');
  root.querySelectorAll('[data-t="creditProfile"]').forEach(el => {
    el.textContent = profileLabel + ' ↗';
  });
}

function renderCredits() {
  const root = document.querySelector('#creditsRoot');
  if (!root) return;
  if (credits && Array.isArray(credits.departments) && credits.departments.length > 0) {
    renderCreditsFromData(credits);
  } else {
    updateStaticCreditsText();
  }
}

async function loadCredits() {
  const root = document.querySelector('#creditsRoot');
  if (!root) return;

  try {
    const res = await fetch(`data/credits.json?v=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.departments) && data.departments.length > 0) {
        window.ADERION_CREDITS = data;
        credits = data;
        renderCreditsFromData(data);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not load data/credits.json dynamically:', err);
  }

  if (window.ADERION_CREDITS && Array.isArray(window.ADERION_CREDITS.departments) && window.ADERION_CREDITS.departments.length > 0) {
    credits = window.ADERION_CREDITS;
    renderCreditsFromData(credits);
  } else {
    updateStaticCreditsText();
  }
}
function renderRoles(){
 const root=document.querySelector('#rolesRoot');if(!root)return;
 const active=document.querySelector('.filter-chip.is-active')?.dataset.filter||'all';
 root.innerHTML=roles.filter(role=>active==='all'||role.category===active).map(role=>`
 <article class="role-card" data-role="${role.id}"><div class="role-top"><span>${escapeHtml(role.code)}</span><span class="role-plus">✳</span></div>
 <h3>${escapeHtml(role[locale])}</h3><p>${escapeHtml(role[locale==='tr'?'descTr':'descEn'])}</p>
 <div class="role-bottom"><small>${escapeHtml(role.skills)}</small><button type="button" class="role-apply" data-apply-role="${role.id}">${escapeHtml(translations[locale].roleInterest)} <span aria-hidden="true">↗</span></button></div></article>`).join('');
 root.querySelectorAll('[data-apply-role]').forEach(button=>button.addEventListener('click',()=>{
   document.querySelector('#applyRole').value=button.dataset.applyRole;
   document.querySelector('#application').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
   setTimeout(()=>document.querySelector('#applyRole')?.focus({preventScroll:true}),350);
 }));
 const select=document.querySelector('#applyRole');const previous=select.value;
 select.querySelectorAll('option:not([value=""])').forEach(el=>el.remove());
 roles.forEach(role=>select.add(new Option(role[locale],role.id)));
 select.value=previous;
}
const filters=document.querySelectorAll('.filter-chip');
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(el=>{let active=el===button;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',String(active));});
 renderRoles();
}));
const APPLICATION_EMAIL='contact@aderionstudios.com';
const APPLICATION_ENDPOINT='api/apply.php';
document.querySelector('#applicationForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fd = new FormData(form);
  const role = roles.find(item => item.id === fd.get('role'));
  if (!role) return;
  const dict = translations[locale];
  const status = document.querySelector('#applicationStatus');
  const submitBtn = form.querySelector('[type="submit"]');
  const submitText = submitBtn ? submitBtn.querySelector('span') : null;

  // Local file preview fallback
  if (location.protocol === 'file:') {
    const message = [
      dict.applicationSubject,
      '',
      'Name: ' + String(fd.get('name') || '').trim(),
      'Email: ' + String(fd.get('email') || '').trim(),
      'Role: ' + (role ? role[locale] : ''),
      'Portfolio: ' + String(fd.get('portfolio') || '').trim(),
      'Experience: ' + String(fd.get('experience') || ''),
      '',
      String(fd.get('message') || '').trim()
    ].join('\n');
    location.href = 'mailto:' + APPLICATION_EMAIL + '?subject=' + encodeURIComponent(dict.applicationSubject) + '&body=' + encodeURIComponent(message);
    form.reset();
    if (status) status.textContent = dict.applicationSent;
    showToast(dict.applicationSent);
    return;
  }

  // Production API Submission
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    if (submitText) submitText.textContent = dict.applicationSending;
  }
  if (status) status.textContent = dict.applicationSending;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let res;
    try {
      res = await fetch(APPLICATION_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    let data = null;
    try { data = await res.json(); } catch (_) {}

    if (res.ok && data && data.ok) {
      form.reset();
      const successMsg = data.message || dict.applicationSent;
      if (status) status.textContent = successMsg;
      showToast(successMsg);
    } else {
      const errMsg = (data && data.message) ? data.message : (res.status === 429 ? dict.applicationRateLimit : dict.applicationError);
      if (status) status.textContent = errMsg;
      showToast(errMsg);
    }
  } catch (_) {
    if (status) status.textContent = dict.applicationError;
    showToast(dict.applicationError);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      if (submitText) submitText.textContent = dict.applySubmit;
    }
  }
});
document.addEventListener('aderion:language',()=>{
 const names={studio:['Stüdyo','Studio'],credits:['Ekip & Credits','Team & Credits'],join:['Bize Katıl','Join Us']};
 const key=document.body.dataset.page;
 if(names[key])document.title=`${names[key][locale==='tr'?0:1]} — Aderion Studios`;
 renderCredits();renderRoles();
 document.querySelector('#applicationStatus')?.replaceChildren();
 const name=document.querySelector('#applyName'),message=document.querySelector('#applyMessage');
 if(name)name.placeholder=locale==='tr'?'Ad Soyad':'Full name';
 if(message)message.placeholder=locale==='tr'?'Biraz kendinden bahset...':'Tell us a little about yourself...';
});
setLanguage(locale);
loadCredits();
