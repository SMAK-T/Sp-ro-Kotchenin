document.querySelectorAll('.review-expand').forEach(button=>button.addEventListener('click',()=>{
  const card=button.closest('.review-card');
  const expanded=button.getAttribute('aria-expanded')!=='true';
  card.classList.toggle('is-expanded',expanded);
  button.setAttribute('aria-expanded',String(expanded));
  button.textContent=expanded?'Réduire':'Lire la suite';
}));
const workshopTrack=document.querySelector('.workshop-track');
if(workshopTrack){
  const move=step=>workshopTrack.scrollBy({left:step*(workshopTrack.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(workshopTrack).columnGap)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  document.querySelectorAll('[data-workshop-step]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.workshopStep))));
  workshopTrack.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
}
