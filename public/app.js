const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus()}});
const form=document.querySelector('#contact-form');if(form){const params=new URLSearchParams(location.search);const requestedMotif=params.get('motif')==='devis'?'atelier':params.get('motif');if(['atelier','autre','rendez-vous'].includes(requestedMotif))form.elements.motif.value=requestedMotif;const service=params.get('prestation')||params.get('service');if(service)form.elements.message.value=`Bonjour, je souhaite des informations sur : ${service}.\n`;}



// Keep the homepage header transparent at the top and opaque after scrolling.
if(document.body.classList.contains('home')){let scheduled=false;const updateHeader=()=>{scheduled=false;document.body.classList.toggle('neotisse-nav-scrolled',window.scrollY>16)};const scheduleHeader=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateHeader)}};updateHeader();window.addEventListener('scroll',scheduleHeader,{passive:true});window.addEventListener('pageshow',scheduleHeader);window.addEventListener('resize',scheduleHeader)}
