/*
 * Aderion Studios — static website.
 * Set CONTACT_EMAIL to your verified studio email to enable one-click mail drafting.
 * Without it, the form copies a message draft locally. It never claims to send messages.
 */
const CONTACT_EMAIL = 'contact@aderionstudios.com';

const translations = {
  tr: {
    navStudio:'Stüdyo',navCredits:'Ekip',navJoin:'Bize Katıl',navFocus:'Neler yapıyoruz?',navVisuals:'Görsel dünya',navContact:'İletişim',
    heroEyebrow:'BAĞIMSIZ OYUN STÜDYOSU',heroTitle:'Hikâyelerin<br><span class="headline-nowrap">içine <em>doğru.</em></span>',
    heroLead:'Bazen bir karakter, bazen küçücük bir seçim... Biz, uzun süre akılda kalan oyun dünyaları kurmak için yola çıktık.',
    heroButton:'Dünyamızı keşfet',heroSecondary:'Bizi tanı',heroBottom:'DUYGUSU OLAN DÜNYALAR TASARLIYORUZ.',
    studioEyebrow:'KİMİZ?',studioTitle:'Biraz hayal gücü.<br>Biraz <em>merak.</em><br>Bolca hikâye.',
    studioText:'Aderion Studios, oyuncunun yalnızca izleyici değil, hikâyenin bir parçası olduğu deneyimler üretme fikriyle yola çıkan bağımsız bir oyun stüdyosu.',
    studioSub:'Henüz yolun başındayız. Karakterleri, atmosferi ve küçük detayları önemseyen Visual Novel, Voxel ve 2D hikâye odaklı oyunlar geliştirmeyi hedefliyoruz.',
    studioMore:'Yaklaşımımızı öğren',focusEyebrow:'NELERE ODAKLANIYORUZ?',focusTitle:'Üç farklı yol.<br><em>Tek bir tutku.</em>',
    focusIntro:'Birbirinden farklı görünebilirler, ama hepsinin merkezinde aynı şey var: oyuncunun içinde kaybolmak isteyeceği bir dünya.',
    novelTag:'SEÇİMLER · KARAKTERLER · DUYGULAR',novelDescription:'Her seçimin başka bir his bıraktığı, karakterlerin hafızada yer ettiği hikâyeler.',
    voxelDescription:'Küçük bloklardan büyük keşiflere açılan, kendine özgü dünyalar.',storyHeading:'Hikâyeler',
    storyDescription:'Atmosferi ve oynanışı birbirine bağlayan iki boyutlu maceralar.',
    focusNote:'* Bu bölümdeki çizimler oyun ekran görüntüsü değil, stüdyonun görsel yönünü anlatan referanslardır.',
    approachEyebrow:'BİZİM YAKLAŞIMIMIZ',approachTitle:'Önce his.<br><em>Sonra her şey.</em>',approachIntro:'Yapmak istediğimiz oyunlarda birkaç şeye özellikle önem veriyoruz.',
    approachOneTitle:'Karakterler önemli.',approachOne:'İnandığın, merak ettiğin ve hikâyesini gerçekten önemsediğin karakterler yaratmak.',
    approachTwoTitle:'Dünyalar yaşayan yerler.',approachTwo:'Arka plandaki küçük bir ayrıntının bile anlatacak bir şeyinin olması.',
    approachThreeTitle:'Oyuncu hikâyenin içinde.',approachThree:'Seçimleri, keşifleri ve hisleriyle deneyimin gerçek bir parçası olması.',
    visualsEyebrow:'GÖRSEL DÜNYAMIZ',visualsTitle:'Biraz renk.<br>Biraz <em>atmosfer.</em>',
    visualsIntro:'Sadelik, karakter ve duygu. Bizi heyecanlandıran çizim diline küçük bir bakış.',
    galleryOne:'Karakterin dili',galleryTwo:'Küçük bir an',galleryThree:'Samimi detaylar',galleryFour:'İfade ve duygu',galleryFive:'Sade kompozisyon',
    visualsCaption:'GÖRSEL REFERANSLAR / PROJE GÖRSELLERİ DEĞİLDİR',
    contactEyebrow:'BAĞLANTIDA KALALIM',contactTitle:'Güzel hikâyeler<br><em>birlikte başlar.</em>',
    contactIntro:'Bir fikrin, önerin ya da sadece söylemek istediğin bir şey mi var? Bir mesajla başlayabiliriz.',
    contactStatus:'YENİ HİKÂYELER İÇİN YOLDAYIZ',formEyebrow:'BİR MESAJ BIRAK',formName:'Adın',formEmail:'E-posta adresin',formMessage:'Mesajın',
    formButton:'Mesajı gönder',
    footerRights:'Tüm hakları saklıdır.',backTop:'Yukarı dön',
    formSending:'Gönderiliyor…',formSent:'Mesajın stüdyoya iletildi! En kısa sürede dönüş yapacağız.',
    formError:'Mesaj gönderilemedi. Lütfen daha sonra tekrar dene.',
    formRateLimit:'Kısa sürede çok sayıda mesaj denendi. Bir süre sonra tekrar dene.',
    formCopiedLocal:'Sunucu bağlantısı olmadan mesajın ve alıcı e-posta adresi panoya kopyalandı.',
    copied:'Mesaj taslağın panoya kopyalandı. E-posta ile paylaşabilirsin.',
    copyFailed:'Kopyalama engellendi; açılan pencereden metni kopyalayabilirsin.',messageSubject:'Aderion Studios — İletişim',
    inviteLabel:'AYNI HİKÂYENİN PARÇASI OL',inviteTitle:'Bu dünyayı <em>birlikte</em> kuralım.',inviteIntro:'Hikâye anlatmayı, karakterlere hayat vermeyi veya oyun geliştirmeyi seviyorsan tanışalım.',inviteJoin:'Bize Katıl / Join Us',inviteMeet:'Ekibi tanı',
    footerHome:'Ana sayfa',
    vnBackLink:'Odak alanlarına dön',vnBannerTitle:'Her seçimin<br><em>bir izi var.</em>',vnBannerLead:'Karakterlerin yalnızca ekranda görünmediği; sesleri, suskunlukları ve kararlarınla hafızanda yer ettiği anlatı odaklı deneyimler.',vnBannerTags:'SEÇİMLER · KARAKTERLER · ATMOSFER',
    vnOverviewLabel:'NEDEN VISUAL NOVEL?',vnOverviewTitle:'Sözcüklerin ve<br><em>suskunlukların</em> ritmi.',vnOverviewLead:'Bir visual novel bizim için yalnızca metin okumak değil; bir karakterin bakışında, duraksamasında ve verdiğin kararın ağırlığında yaşamaktır.',vnOverviewBody:'Aderion Studios’ta diyalogların doğallığına, sahne geçişlerinin temposuna ve oyuncuya gerçekten söz hakkı tanıyan dallanmalara odaklanıyoruz. Küçük bir kararın bile birkaç bölüm sonra bambaşka bir duyguyla geri dönmesini seviyoruz.',
    vnPillarsLabel:'ÜÇ TEMEL DİREK',vnPillarOneTitle:'Seçimler & Dallanma',vnPillarOneDesc:'Yalnızca sonu değiştiren değil, karakterlerin sana bakışını ve sahnelerin tonunu şekillendiren anlamlı kararlar.',
    vnPillarTwoTitle:'Karakter Odaklı Anlatı',vnPillarTwoDesc:'Kendi kusurları, mizahı ve kırılganlıklarıyla gerçek hissettiren, hikâye bittiğinde bile akılda kalan karakterler.',
    vnPillarThreeTitle:'Sanat & Atmosfer',vnPillarThreeDesc:'Işık, renk paleti, ifade çizimleri ve ince ses tasarımıyla her sahnenin duygusunu derinleştiren görsel dünya.',
    vnNoteLabel:'STÜDYO NOTU',vnNoteTitle:'Yaklaşımımız <em>gelişiyor.</em>',vnNoteText:'Visual Novel projemiz şu an konsept ve anlatı tasarımı aşamasında. Paylaşılan görseller, stüdyonun hedeflediği görsel tonu yansıtan referanslardır.',vnCtaJoin:'Bize Katıl',vnCtaBack:'Odak alanlarına dön',
    namePlaceholder:'Adın / Name',msgPlaceholder:'Bir merhaba de...',menuOpen:'Menüyü aç',menuClose:'Menüyü kapat',changeLang:'Dili İngilizce olarak değiştir',themeToDark:'Koyu moda geç',themeToLight:'Açık moda geç',
    lightboxDialog:'Görsel galerisi',lightboxClose:'Galeriyi kapat',lightboxPrev:'Önceki görsel',lightboxNext:'Sonraki görsel'
  },
  en: {
    navStudio:'Studio',navCredits:'Credits',navJoin:'Join Us',navFocus:'What we make',navVisuals:'Visual world',navContact:'Get in touch',
    heroEyebrow:'INDEPENDENT GAME STUDIO',heroTitle:'Step into<br><span class="headline-nowrap">the <em>story.</em></span>',
    heroLead:'Sometimes a character, sometimes a tiny choice... We set out to create game worlds that stay with you long after the screen fades.',
    heroButton:'Explore our world',heroSecondary:'Meet the studio',heroBottom:'WE IMAGINE WORLDS THAT MAKE YOU FEEL.',
    studioEyebrow:'WHO ARE WE?',studioTitle:'A little wonder.<br>A little <em>curiosity.</em><br>A lot of story.',
    studioText:'Aderion Studios is an independent game studio founded on a simple idea: players should be part of the story, not just watch it unfold.',
    studioSub:'We are at the beginning of our journey. Our goal is to create visual novels, voxel games and story-driven 2D experiences that value character, atmosphere and tiny details.',
    studioMore:'Our approach',focusEyebrow:'WHAT WE FOCUS ON',focusTitle:'Three directions.<br><em>One passion.</em>',
    focusIntro:'They may seem very different, but all three share one thing: a world you cannot help getting lost in.',
    novelTag:'CHOICES · CHARACTERS · EMOTIONS',novelDescription:'Stories where choices resonate and characters stay with you.',
    voxelDescription:'Distinctive little worlds built block by block, inviting big discoveries.',storyHeading:'Stories',
    storyDescription:'Two-dimensional adventures where atmosphere and gameplay come together.',
    focusNote:'* Illustrations here are visual references, not screenshots from our games.',
    approachEyebrow:'OUR APPROACH',approachTitle:'Feeling first.<br><em>Everything else follows.</em>',approachIntro:'A few things matter to us in the games we hope to make.',
    approachOneTitle:'Characters matter.',approachOne:'Creating people you believe in, wonder about and genuinely care for.',
    approachTwoTitle:'Worlds should feel alive.',approachTwo:'Even the smallest background detail can have something to say.',
    approachThreeTitle:'The player belongs in the story.',approachThree:'Choices, discoveries and feelings make the experience their own.',
    visualsEyebrow:'OUR VISUAL WORLD',visualsTitle:'A little color.<br>A little <em>atmosphere.</em>',
    visualsIntro:'Simplicity, character and feeling. A small look at the illustration styles that inspire us.',
    galleryOne:'Character language',galleryTwo:'A little moment',galleryThree:'Honest details',galleryFour:'Expression & feeling',galleryFive:'Quiet composition',
    visualsCaption:'VISUAL REFERENCES / NOT PROJECT SCREENSHOTS',
    contactEyebrow:'LET’S CONNECT',contactTitle:'Good stories<br><em>start together.</em>',
    contactIntro:'Have an idea, a suggestion, or simply something to say? It can all start with a message.',
    contactStatus:'NEW STORIES ARE ON THEIR WAY',formEyebrow:'LEAVE A MESSAGE',formName:'Your name',formEmail:'Email address',formMessage:'Your message',
    formButton:'Send message',
    footerRights:'All rights reserved.',backTop:'Back to top',
    formSending:'Sending…',formSent:'Your message has been sent to the studio! We will get back to you soon.',
    formError:'Could not send message. Please try again later.',
    formRateLimit:'Too many messages sent in a short time. Please try again soon.',
    formCopiedLocal:'Without a PHP server, your message and recipient email were copied to the clipboard.',
    copied:'Your message draft was copied. You can share it by email.',
    copyFailed:'Clipboard access was blocked; copy the text from the dialog.',messageSubject:'Aderion Studios — Contact',
    inviteLabel:'BE PART OF THE SAME STORY',inviteTitle:'Let’s build <em>together.</em>',inviteIntro:'If you love storytelling, bringing characters to life, or making games, we would love to meet you.',inviteJoin:'Join Us',inviteMeet:'Meet the team',
    footerHome:'Home',
    vnBackLink:'Back to focus areas',vnBannerTitle:'Every choice<br><em>leaves a trace.</em>',vnBannerLead:'Narrative-driven experiences where characters don’t just appear on screen—they stay in your memory through their voices, silences, and your decisions.',vnBannerTags:'CHOICES · CHARACTERS · ATMOSPHERE',
    vnOverviewLabel:'WHY VISUAL NOVELS?',vnOverviewTitle:'The rhythm of words<br><em>and</em> silences.',vnOverviewLead:'To us, a visual novel is never just reading lines—it is living inside a character’s glance, a quiet pause, and the weight of a decision.',vnOverviewBody:'At Aderion Studios, we focus on natural dialogue, deliberate scene pacing, and branching paths that give players a genuine voice. Even a small choice should echo back chapters later with a completely different emotion.',
    vnPillarsLabel:'THREE CORE PILLARS',vnPillarOneTitle:'Choices & Branching',vnPillarOneDesc:'Meaningful decisions that don’t just alter an ending, but reshape how characters see you and how scenes unfold.',
    vnPillarTwoTitle:'Character-Driven Storytelling',vnPillarTwoDesc:'Characters with their own flaws, humor, and quiet vulnerabilities—people who feel real long after the credits roll.',
    vnPillarThreeTitle:'Art & Atmosphere',vnPillarThreeDesc:'A visual world where lighting, color palette, expressive sprites, and subtle sound design deepen every scene.',
    vnNoteLabel:'STUDIO NOTE',vnNoteTitle:'Our craft is <em>in motion.</em>',vnNoteText:'Our Visual Novel direction is currently in early concept and narrative design. The artwork shown reflects the visual mood and tone we are aiming for.',vnCtaJoin:'Join Us',vnCtaBack:'Back to focus areas',
    namePlaceholder:'Your name',msgPlaceholder:'Say hello...',menuOpen:'Open menu',menuClose:'Close menu',changeLang:'Dili Türkçe olarak değiştir',themeToDark:'Switch to dark mode',themeToLight:'Switch to light mode',
    lightboxDialog:'Image gallery',lightboxClose:'Close gallery',lightboxPrev:'Previous image',lightboxNext:'Next image'
  }
};

const root = document.documentElement;
root.classList.add('has-js');
let locale = 'tr';
try { if (localStorage.getItem('aderion-language') === 'en') locale = 'en'; } catch (_) {}
const langBtn = document.querySelector('#langBtn');
const themeBtn = document.querySelector('#themeToggle');
function setTheme(theme) {
  const isDark = theme === 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';
  root.style.colorScheme = isDark ? 'dark' : 'light';
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(isDark));
    const label = translations[locale][isDark ? 'themeToLight' : 'themeToDark'];
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#101824' : '#f8f9fc');
  try { localStorage.setItem('aderion-theme', isDark ? 'dark' : 'light'); } catch (_) {}
}
themeBtn?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const header = document.querySelector('#siteHeader');
const progressBar = document.querySelector('#progressBar');
const menuToggle = document.querySelector('#menuToggle');
const mobileMenu = document.querySelector('#mobileMenu');
const galleryTrack = document.querySelector('#galleryTrack');
const galleryPrev = document.querySelector('#galleryPrev');
const galleryNext = document.querySelector('#galleryNext');
const galleryIndex = document.querySelector('#galleryIndex');
const galleryTotal = document.querySelector('#galleryTotal');
const toast = document.querySelector('#toast');
const galleryItems = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-item')) : [];
const totalGalleryItems = galleryItems.length;
const formatGalleryNumber = num => String(num).padStart(2, '0');
if (galleryTotal) galleryTotal.textContent = formatGalleryNumber(totalGalleryItems);

function setLanguage(language) {
  locale = language;
  const dictionary = translations[locale];
  root.setAttribute('lang', locale);
  document.querySelectorAll('[data-t]').forEach(element => {
    const translated = dictionary[element.dataset.t];
    if (translated !== undefined) element.textContent = translated;
  });
  document.querySelectorAll('[data-t-html]').forEach(element => {
    const translated = dictionary[element.dataset.tHtml];
    if (translated !== undefined) element.innerHTML = translated;
  });
  langBtn.innerHTML = `${locale === 'tr' ? 'EN' : 'TR'} <span aria-hidden="true">↗</span>`;
  langBtn.setAttribute('aria-label', dictionary.changeLang);
  if (themeBtn) { const label = dictionary[root.dataset.theme === 'dark' ? 'themeToLight' : 'themeToDark']; themeBtn.setAttribute('aria-label', label); themeBtn.title = label; }
  menuToggle.setAttribute('aria-label',dictionary[menuToggle.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen']);
  if(document.querySelector('#contactName')) document.querySelector('#contactName').placeholder = dictionary.namePlaceholder;
  if(document.querySelector('#contactMessage')) document.querySelector('#contactMessage').placeholder = dictionary.msgPlaceholder;
  if(document.querySelector('#formStatus')) document.querySelector('#formStatus').textContent = '';
  document.title = (document.body.dataset.page === 'home' ? (locale === 'tr' ? 'Aderion Studios — Hikâyelerin İçine Doğru' : 'Aderion Studios — Step Into the Story') : (document.body.dataset.pageTitle || document.title));
  try { localStorage.setItem('aderion-language',locale); } catch (_) {}
  document.dispatchEvent(new CustomEvent('aderion:language',{detail:{locale}}));
}
langBtn.addEventListener('click',()=>setLanguage(locale === 'tr' ? 'en' : 'tr'));
setLanguage(locale);
setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

function closeMenu(){
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label',translations[locale].menuOpen);
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('inert','');
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click',()=>{
  const isOpening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded',String(isOpening));
  menuToggle.setAttribute('aria-label',translations[locale][isOpening ? 'menuClose' : 'menuOpen']);
  mobileMenu.classList.toggle('open',isOpening);
  if(isOpening) mobileMenu.removeAttribute('inert'); else mobileMenu.setAttribute('inert','');
  document.body.classList.toggle('menu-open',isOpening);
});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>1030)closeMenu();});

function onScroll(){
  const max = Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  progressBar.style.width = `${Math.max(0,Math.min(100,(window.scrollY/max)*100))}%`;
  header.classList.toggle('scrolled',window.scrollY>16);
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const observer = new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px 50px 0px'});
  revealElements.forEach(element=>observer.observe(element));
} else revealElements.forEach(element=>element.classList.add('in-view'));

function galleryStep(){
  const first=galleryTrack?.querySelector('.gallery-item');
  if(!first) return 300;
  const gap=parseFloat(getComputedStyle(galleryTrack).gap)||0;
  return first.getBoundingClientRect().width+gap;
}
function updateGallery(){
  if(!galleryTrack) return;
  const step=galleryStep();
  const index=Math.max(0,Math.min(totalGalleryItems-1,Math.round(galleryTrack.scrollLeft/step)));
  if(galleryIndex) galleryIndex.textContent=String(index+1).padStart(2,'0');
  if(galleryPrev) galleryPrev.disabled=galleryTrack.scrollLeft<8;
  if(galleryNext) galleryNext.disabled=galleryTrack.scrollLeft+galleryTrack.clientWidth>=galleryTrack.scrollWidth-8;
}
galleryPrev?.addEventListener('click',()=>galleryTrack.scrollBy({left:-galleryStep(),behavior:'smooth'}));
galleryNext?.addEventListener('click',()=>galleryTrack.scrollBy({left:galleryStep(),behavior:'smooth'}));
galleryTrack?.addEventListener('scroll',updateGallery,{passive:true});
window.addEventListener('resize',updateGallery);
window.addEventListener('load',updateGallery);
updateGallery();

if (galleryTrack && totalGalleryItems > 0) {
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'galleryLightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-backdrop" data-lightbox-close></div>
    <div class="lightbox-shell">
      <div class="lightbox-topbar">
        <div class="lightbox-counter" aria-live="polite">
          <b id="lightboxCurrent">01</b><span>/</span><span id="lightboxTotal">${formatGalleryNumber(totalGalleryItems)}</span>
        </div>
        <button type="button" class="lightbox-close" id="lightboxClose" data-lightbox-close>×</button>
      </div>
      <div class="lightbox-stage">
        <button type="button" class="lightbox-nav lightbox-prev" id="lightboxPrev">←</button>
        <figure class="lightbox-figure">
          <div class="lightbox-media">
            <img id="lightboxImg" src="" alt="">
          </div>
          <figcaption class="lightbox-caption">
            <span class="lightbox-tag" id="lightboxTag"></span>
            <span class="lightbox-title" id="lightboxTitle"></span>
          </figcaption>
        </figure>
        <button type="button" class="lightbox-nav lightbox-next" id="lightboxNext">→</button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxCurrent = lightbox.querySelector('#lightboxCurrent');
  const lightboxCloseBtn = lightbox.querySelector('#lightboxClose');
  const lightboxPrevBtn = lightbox.querySelector('#lightboxPrev');
  const lightboxNextBtn = lightbox.querySelector('#lightboxNext');
  const lightboxStage = lightbox.querySelector('.lightbox-stage');
  const lightboxFigure = lightbox.querySelector('.lightbox-figure');
  const lightboxImg = lightbox.querySelector('#lightboxImg');
  const lightboxTag = lightbox.querySelector('#lightboxTag');
  const lightboxTitle = lightbox.querySelector('#lightboxTitle');

  let activeIndex = 0;
  let isLightboxOpen = false;
  let lastFocusedItem = null;
  let slideAnimation = null;
  let dragMoved = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let trackStartScrollLeft = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function syncLightboxLabels() {
    const dict = translations[locale];
    lightbox.setAttribute('aria-label', dict.lightboxDialog);
    lightboxCloseBtn.setAttribute('aria-label', dict.lightboxClose);
    lightboxPrevBtn.setAttribute('aria-label', dict.lightboxPrev);
    lightboxNextBtn.setAttribute('aria-label', dict.lightboxNext);
  }

  function renderLightboxItem(index, direction = 0) {
    const item = galleryItems[index];
    if (!item) return;
    const img = item.querySelector('img');
    const tag = item.querySelector('figcaption span:first-child')?.textContent?.trim() || '';
    const title = item.querySelector('figcaption span:last-child')?.textContent?.trim() || '';

    lightboxImg.src = img?.currentSrc || img?.getAttribute('src') || '';
    lightboxImg.alt = img?.getAttribute('alt') || title;
    lightboxTag.textContent = tag;
    lightboxTitle.textContent = title;
    lightboxCurrent.textContent = formatGalleryNumber(index + 1);

    const disableNav = totalGalleryItems <= 1;
    lightboxPrevBtn.disabled = disableNav;
    lightboxNextBtn.disabled = disableNav;

    if (direction !== 0 && !prefersReducedMotion() && typeof lightboxFigure.animate === 'function') {
      slideAnimation?.cancel();
      const offset = direction > 0 ? 34 : -34;
      slideAnimation = lightboxFigure.animate(
        [
          { opacity: 0, transform: `translateX(${offset}px) scale(0.985)` },
          { opacity: 1, transform: 'translateX(0) scale(1)' }
        ],
        { duration: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }
  }

  function openLightbox(index) {
    activeIndex = ((index % totalGalleryItems) + totalGalleryItems) % totalGalleryItems;
    lastFocusedItem = galleryItems[activeIndex] || document.activeElement;
    isLightboxOpen = true;
    syncLightboxLabels();
    renderLightboxItem(activeIndex, 0);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxCloseBtn.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!isLightboxOpen) return;
    isLightboxOpen = false;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastFocusedItem && typeof lastFocusedItem.focus === 'function') {
      lastFocusedItem.focus({ preventScroll: true });
    }
  }

  function stepLightbox(direction) {
    if (totalGalleryItems <= 1) return;
    activeIndex = (activeIndex + direction + totalGalleryItems) % totalGalleryItems;
    renderLightboxItem(activeIndex, direction);
  }

  galleryTrack.addEventListener('pointerdown', event => {
    dragMoved = false;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    trackStartScrollLeft = galleryTrack.scrollLeft;
  });

  galleryTrack.addEventListener('pointermove', event => {
    if (
      Math.abs(event.clientX - pointerStartX) > 6 ||
      Math.abs(event.clientY - pointerStartY) > 6 ||
      Math.abs(galleryTrack.scrollLeft - trackStartScrollLeft) > 6
    ) {
      dragMoved = true;
    }
  });

  galleryItems.forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-haspopup', 'dialog');

    item.addEventListener('click', () => {
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      openLightbox(index);
    });

    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxPrevBtn.addEventListener('click', () => stepLightbox(-1));
  lightboxNextBtn.addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', event => {
    if (event.target.hasAttribute('data-lightbox-close') || event.target === lightboxStage || event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxStage.addEventListener('touchstart', event => {
    if (event.changedTouches.length !== 1) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  lightboxStage.addEventListener('touchend', event => {
    if (!isLightboxOpen || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      stepLightbox(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!isLightboxOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepLightbox(1);
    }
  });

  document.addEventListener('aderion:language', () => {
    syncLightboxLabels();
    if (isLightboxOpen) renderLightboxItem(activeIndex, 0);
  });
}

let toastTimeout;
function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>toast.classList.remove('show'),4500);
}
async function copyText(text){
  try {
    if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);return true;}
  }catch(_){}
  const helper=document.createElement('textarea');
  helper.value=text;helper.style.position='fixed';helper.style.opacity='0';helper.style.top='-1000px';
  document.body.appendChild(helper);helper.focus();helper.select();
  let success=false;
  try{success=document.execCommand('copy');}catch(_){}
  helper.remove();
  return success;
}
document.querySelector('#contactForm')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity())return;
  const name=form.elements.name.value.trim();
  const email=form.elements.email.value.trim();
  const message=form.elements.message.value.trim();
  if(!name||!email||!message)return;
  const dict=translations[locale];
  const status=document.querySelector('#formStatus');
  const submitBtn=form.querySelector('[type="submit"]');
  const submitText=submitBtn?.querySelector('span[data-t="formButton"]');
  const clipboardText=`To: ${CONTACT_EMAIL}\nSubject: ${dict.messageSubject}\n\n${message}\n\n${name}\n${email}`;

  async function copyFallback(){
    if(await copyText(clipboardText)){
      if(status) status.textContent=dict.formCopiedLocal;
      showToast(dict.formCopiedLocal);
    } else {
      if(status) status.textContent=dict.copyFailed;
      window.prompt(dict.copyFailed,clipboardText);
    }
  }

  if(submitBtn){
    submitBtn.disabled=true;
    submitBtn.setAttribute('aria-busy','true');
    if(submitText) submitText.textContent=dict.formSending;
  }
  if(status) status.textContent=dict.formSending;

  try{
    if(location.protocol==='file:'){
      await copyFallback();
      return;
    }
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    let res;
    try{
      res=await fetch('api/contact.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name,email,message}),
        signal:controller.signal
      });
    }finally{
      clearTimeout(timeout);
    }

    if(res.status===404||res.status===405||res.status===501){
      await copyFallback();
      return;
    }

    let data=null;
    try{data=await res.json();}catch(_){}

    if(!data){
      await copyFallback();
      return;
    }

    if(res.ok&&data.ok){
      form.reset();
      const successMsg=(locale==='tr'&&data.message)?data.message:dict.formSent;
      if(status) status.textContent=successMsg;
      showToast(successMsg);
    }else if(res.status===429){
      const rateMsg=(locale==='tr'&&data.message)?data.message:dict.formRateLimit;
      if(status) status.textContent=rateMsg;
      showToast(rateMsg);
    }else{
      const errMsg=(locale==='tr'&&data.message)?data.message:dict.formError;
      if(status) status.textContent=errMsg;
      showToast(errMsg);
    }
  }catch(_){
    await copyFallback();
  }finally{
    if(submitBtn){
      submitBtn.disabled=false;
      submitBtn.removeAttribute('aria-busy');
      if(submitText) submitText.textContent=translations[locale].formButton;
    }
  }
});
document.querySelectorAll('.footer-year, #footerYear').forEach(el=>el.textContent=new Date().getFullYear());
