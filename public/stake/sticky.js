/* sticky registration button: shown after the hero CTA is scrolled past; hidden over #register, FAQ, footer and slider arrows */
(function(){
  var bar=document.getElementById('stickyCta'); if(!bar) return;
  var link=bar.querySelector('a');
  var heroCta=document.querySelector('.hero .hero-action');
  var hideInView=[document.getElementById('register'),document.getElementById('faq'),document.querySelector('footer')].filter(Boolean);
  var hideInBand=[].slice.call(document.querySelectorAll('.car-nav'));
  var ticking=false;
  function update(){
    ticking=false;
    var H=window.innerHeight, band=H-bar.offsetHeight-28;
    var past=heroCta ? heroCta.getBoundingClientRect().bottom<0 : window.scrollY>H;
    var clash=hideInView.some(function(el){ var r=el.getBoundingClientRect(); return r.top<H && r.bottom>0; })
           || hideInBand.some(function(el){ var r=el.getBoundingClientRect(); return r.top<H && r.bottom>band; });
    var on=past && !clash;
    bar.classList.toggle('on',on);
    bar.setAttribute('aria-hidden',String(!on));
    link.tabIndex=on?0:-1;
  }
  function req(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } }
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',req);
  update();
})();
