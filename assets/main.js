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
    formButton:'E-posta taslağı oluştur',formHint:'E-posta uygulaman açılır; göndermek için son onayı sen verirsin.',
    footerRights:'Tüm hakları saklıdır.',backTop:'Yukarı dön',
    copied:'Mesaj taslağın panoya kopyalandı. E-posta ile paylaşabilirsin.',mailDraft:'E-posta uygulaman açılıyor; gönderim için onay vermen gerekir.',
    copyFailed:'Kopyalama engellendi; açılan pencereden metni kopyalayabilirsin.',messageSubject:'Aderion Studios — İletişim',
    inviteLabel:'AYNI HİKÂYENİN PARÇASI OL',inviteTitle:'Bu dünyayı <em>birlikte</em> kuralım.',inviteIntro:'Hikâye anlatmayı, karakterlere hayat vermeyi veya oyun geliştirmeyi seviyorsan tanışalım.',inviteJoin:'Bize Katıl / Join Us',inviteMeet:'Ekibi tanı',
    namePlaceholder:'Adın / Name',msgPlaceholder:'Bir merhaba de...',menuOpen:'Menüyü aç',menuClose:'Menüyü kapat',changeLang:'Dili İngilizce olarak değiştir',themeToDark:'Koyu moda geç',themeToLight:'Açık moda geç'
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
    formButton:'Create email draft',formHint:'Your email app will open; you confirm sending the message.',
    footerRights:'All rights reserved.',backTop:'Back to top',
    copied:'Your message draft was copied. You can share it by email.',mailDraft:'Your email app is opening; please confirm before sending.',
    copyFailed:'Clipboard access was blocked; copy the text from the dialog.',messageSubject:'Aderion Studios — Contact',
    inviteLabel:'BE PART OF THE SAME STORY',inviteTitle:'Let’s build <em>together.</em>',inviteIntro:'If you love storytelling, bringing characters to life, or making games, we would love to meet you.',inviteJoin:'Join Us',inviteMeet:'Meet the team',
    namePlaceholder:'Your name',msgPlaceholder:'Say hello...',menuOpen:'Open menu',menuClose:'Close menu',changeLang:'Dili Türkçe olarak değiştir',themeToDark:'Switch to dark mode',themeToLight:'Switch to light mode'
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
const toast = document.querySelector('#toast');
const totalGalleryItems = galleryTrack?.querySelectorAll('.gallery-item').length || 0;

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
  const draft=`${translations[locale].messageSubject}\n\n${message}\n\n${name}\n${email}`;
  const status=document.querySelector('#formStatus');
  if(CONTACT_EMAIL.trim()){
    const subject=encodeURIComponent(translations[locale].messageSubject);
    const body=encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href=`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent=translations[locale].mailDraft;
    showToast(translations[locale].mailDraft);
  } else if(await copyText(draft)){
    status.textContent=translations[locale].copied;
    showToast(translations[locale].copied);
  } else {
    status.textContent=translations[locale].copyFailed;
    window.prompt(translations[locale].copyFailed,draft);
  }
});
document.querySelectorAll('.footer-year, #footerYear').forEach(el=>el.textContent=new Date().getFullYear());
