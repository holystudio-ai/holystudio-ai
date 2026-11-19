/* student works: load + play muted video previews only while in view, pause when out of view */
(function(){
  var vids=[].slice.call(document.querySelectorAll('video.sw-media[data-src]'));
  if(!vids.length) return;
  function load(v){ if(!v.getAttribute('src')){ v.src=v.dataset.src; } }
  if(!('IntersectionObserver' in window)){ vids.forEach(function(v){ load(v); }); return; }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(x){
      var v=x.target;
      if(x.isIntersecting && x.intersectionRatio>=0.5){
        load(v); var p=v.play(); if(p&&p.catch) p.catch(function(){});
      } else if(!v.paused){ v.pause(); }
    });
  },{threshold:[0,0.5]});
  vids.forEach(function(v){ v.muted=true; io.observe(v); });
})();
