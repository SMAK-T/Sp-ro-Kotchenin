document.querySelectorAll('.review-expand').forEach(button=>button.addEventListener('click',()=>{
  const card=button.closest('.review-card');
  const expanded=button.getAttribute('aria-expanded')!=='true';
  card.classList.toggle('is-expanded',expanded);
  button.setAttribute('aria-expanded',String(expanded));
  button.textContent=expanded?'Réduire':'Lire la suite';
}));
const workshopTrack=document.querySelector('.workshop-track');
if(workshopTrack){
  const move=step=>{const card=workshopTrack.querySelector('article');if(!card)return;workshopTrack.scrollBy({left:step*(card.getBoundingClientRect().width+(parseFloat(getComputedStyle(workshopTrack).columnGap)||0)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};
  document.querySelectorAll('[data-workshop-step]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.workshopStep))));
  workshopTrack.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
}

// Keep wheel scrolling on the page; drag the native side scrollbar to browse reviews.
(() => {
  const reviews=document.querySelector('#livre-d-or .review-grid');
  if(!reviews)return;
  reviews.addEventListener('wheel',event=>{
    if(event.ctrlKey||!event.deltaY)return;
    event.preventDefault();
    const unit=event.deltaMode===1?20:event.deltaMode===2?innerHeight:1;
    window.scrollBy({top:event.deltaY*unit,left:0,behavior:'instant'});
  },{passive:false});
})();
