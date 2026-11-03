/* bonus countdown: 10 minutes per visitor, start stored in localStorage, stops at 00:00 (no loop) */
(function(){
  var KEY='hs_bonus_start', DUR=10*60*1000, start=0;
  try{ start=parseInt(localStorage.getItem(KEY),10)||0; if(!start){ start=Date.now(); localStorage.setItem(KEY,String(start)); } }catch(e){ start=Date.now(); }
  var M=document.getElementById('tM'),S=document.getElementById('tS');
  if(!M||!S) return;
  function p(n){ return String(n).padStart(2,'0'); }
  var iv;
  function tick(){
    var left=Math.max(0, Math.ceil((start+DUR-Date.now())/1000));
    M.textContent=p(Math.floor(left/60)); S.textContent=p(left%60);
    if(left<=0 && iv){ clearInterval(iv); }
  }
  tick(); iv=setInterval(tick,1000);
})();

/* TV OSD clock + make sure muted autoplay starts */
(function(){
  var v=document.getElementById('heroVideo'), c=document.getElementById('tvClock');
  if(!v) return;
  v.muted=true;
  var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){});
  v.addEventListener('timeupdate',function(){
    var t=Math.floor(v.currentTime);
    c.textContent='00:'+String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
  });
  /* sound toggle: tap on the screen OR the button under the TV (autoplay with sound is blocked by browsers) */
  var scr=document.getElementById('tvScreen'), btn=document.getElementById('tvSound');
  if(scr){
    var render=function(){
      var on=!v.muted;
      scr.classList.toggle('sound-on',on);
      scr.setAttribute('aria-pressed',String(on));
      scr.setAttribute('aria-label',on?'Вимкнути звук':'Увімкнути звук у ролику STAKE');
      if(btn){ var l=on?'Вимкнути звук':'Увімкнути звук'; btn.setAttribute('aria-label',l); btn.title=l; btn.setAttribute('aria-pressed',String(on)); btn.classList.toggle('on',on); }
    };
    var toggle=function(){
      v.muted=!v.muted;
      if(!v.muted){ v.volume=1; }
      var q=v.play(); if(q&&q.catch) q.catch(function(){});
      render();
    };
    scr.addEventListener('click',toggle);
    if(btn) btn.addEventListener('click',toggle);
    render();
  }
})();

/* carousels: arrows + mouse drag (mechanics from holystudio-lm2) + YouTube lightbox */
(function(){
  document.querySelectorAll('.car-track').forEach(function(tr){
    var box=tr.parentNode, prev=box.querySelector('.car-prev'), next=box.querySelector('.car-next');
    function step(){ var c=tr.firstElementChild; return c ? c.offsetWidth+16 : 300; }
    function sync(){ var max=tr.scrollWidth-tr.clientWidth-2; prev.disabled=tr.scrollLeft<=2; next.disabled=tr.scrollLeft>=max; }
    prev.addEventListener('click',function(){ tr.scrollLeft-=step(); });
    next.addEventListener('click',function(){ tr.scrollLeft+=step(); });
    tr.addEventListener('scroll',sync,{passive:true});
    window.addEventListener('resize',sync);
    var down=false,drag=false,sx=0,sl=0,justDragged=false;
    tr.addEventListener('pointerdown',function(e){ if(e.pointerType!=='mouse') return; down=true; drag=false; sx=e.clientX; sl=tr.scrollLeft; });
    tr.addEventListener('pointermove',function(e){
      if(!down) return;
      if(!drag && Math.abs(e.clientX-sx)>6){ drag=true; tr.classList.add('is-drag'); try{ tr.setPointerCapture(e.pointerId); }catch(_){} }
      if(drag) tr.scrollLeft=sl-(e.clientX-sx);
    });
    function up(e){ if(!down) return; down=false; if(drag){ justDragged=true; setTimeout(function(){ justDragged=false; },50); } drag=false; tr.classList.remove('is-drag'); try{ tr.releasePointerCapture(e.pointerId); }catch(_){} sync(); }
    tr.addEventListener('pointerup',up); tr.addEventListener('pointercancel',up);
    tr.addEventListener('click',function(e){ if(justDragged){ e.preventDefault(); e.stopPropagation(); } },true);
    sync();
  });

  var lb=document.getElementById('lb'), fr=document.getElementById('lb-frame');
  function close(){ lb.classList.remove('open'); fr.src=''; document.body.classList.remove('modal-open'); }
  document.querySelectorAll('[data-yt]').forEach(function(b){
    b.addEventListener('click',function(){
      fr.src='https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0';
      lb.classList.add('open'); document.body.classList.add('modal-open');
    });
  });
  lb.addEventListener('click',function(e){ if(e.target===lb||e.target.classList.contains('lb-close')) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&lb.classList.contains('open')) close(); });
})();

/* reveal on scroll */
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(function(e){ e.classList.add('in'); }); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }); },{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){ io.observe(e); });
})();

/* Meta Pixel: Lead on click to the registration bot (same pattern as holystudio-lm2) */
document.addEventListener('click', function(e){
  var a = e.target.closest('a[href*="HOLYSTUDIO_AI_bot"]');
  if (!a) return;
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {content_name: 'webinar_stake_1411', source_page: location.pathname});
  }
}, true);
