/* site B: channel names + YouTube link follow the montage (6 clips x 2.8s, hard cuts) */
(function(){
  var v=document.getElementById('heroVideo'), scr=document.getElementById('tvMontage');
  if(!v||!scr) return;
  var ch=[
    {n:'BINGHATTI X BUGATTI', yt:'-V3Yic_A9OE'},
    {n:'BETKING', yt:'ojv7Yxn3PvA'},
    {n:'AMIC', yt:'xNfiBxSdNIk'},
    {n:'AFFX', yt:'sNyjAXZDqbs'},
    {n:'PORSHE', yt:'_Yqku6a7v48'},
    {n:'HOLYSTUDIO', yt:'EqJAy6jo438'}
  ];
  var SEG=2.8, cur=-1;
  var name=document.getElementById('chName'), num=document.getElementById('chNum'), watch=document.getElementById('tvWatch');
  function loop(){ upd(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  function upd(){
    var i=Math.min(ch.length-1,Math.floor(v.currentTime/SEG));
    if(i!==cur){ cur=i; if(name) name.textContent=ch[i].n; if(num) num.textContent='0'+(i+1); scr.dataset.yt=ch[i].yt; if(watch) watch.dataset.yt=ch[i].yt; scr.setAttribute('aria-label','Дивитися ролик '+ch[i].n+' зі звуком'); if(watch){ watch.setAttribute('aria-label','Дивитися ролик '+ch[i].n+' зі звуком'); watch.title='Дивитися ролик '+ch[i].n+' зі звуком'; } }
  }
})();
