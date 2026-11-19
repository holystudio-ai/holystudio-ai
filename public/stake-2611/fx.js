/* arcade facts: chomper runs the track, text types in, numbers count up */
(function(){
  var rows=document.querySelectorAll('.score-row');
  if(!rows.length) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)) return; // static, final values already in HTML
  document.documentElement.classList.add('js-fx');
  function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
  rows.forEach(function(r){ r.querySelectorAll('.cnt').forEach(function(c){ c.dataset.final=c.textContent; c.textContent='0'; }); });
  function count(c){
    var to=+c.dataset.to, t0=performance.now(), D=1400;
    (function step(t){
      var k=Math.min(1,(t-t0)/D), e=1-Math.pow(1-k,3);
      c.textContent=k<1?fmt(Math.round(to*e)):c.dataset.final;
      if(k<1) requestAnimationFrame(step);
    })(t0);
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(x){
      if(!x.isIntersecting) return;
      var r=x.target; io.unobserve(r);
      setTimeout(function(){ r.classList.add('run'); r.querySelectorAll('.cnt').forEach(count); }, 120);
    });
  },{rootMargin:'0px 0px -12% 0px'});
  rows.forEach(function(r){ io.observe(r); });
})();
