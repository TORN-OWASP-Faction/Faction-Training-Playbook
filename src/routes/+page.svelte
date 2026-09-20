<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Tabs from '$lib/Tabs.svelte';

  const brackets = [
    { label: 'Broke', note: '< $5M', rows: [
      ['Jump to', "~ base happy (top up, don't jump)"], ['Happy', 'Cheap candy (+25), shoplifted'],
      ['Energy', 'Natural regen · LSD (cheap) · faction Xanax'], ['Property', 'Apartment → Semi'],
      ['Cadence', 'Train daily, fly Mexico to fund the next tier'] ] },
    { label: 'Building', note: '$5M – $100M', rows: [
      ['Jump to', '2,000 – 5,000'], ['Happy', 'Mid candy (+75–150), stacked'],
      ['Energy', 'Xanax daily · energy drinks (faction ×1.5)'], ['Property', 'Detached → Mansion'],
      ['Cadence', '1 candy jump/day + passive trains'] ] },
    { label: 'Established', note: '$100M – $1B', rows: [
      ['Jump to', '10,000 – 25,000'], ['Happy', 'eDVD (+2,500) · Ecstasy (×2) · premium candy'],
      ['Energy', 'Xanax + drinks + point refills'], ['Property', 'Castle → saving for Private Island'],
      ['Cadence', 'Daily eDVD jump; book up before big pushes'] ] },
    { label: 'Wealthy', note: '$1B +', rows: [
      ['Jump to', '50,000 – 99,999'], ['Happy', 'eDVD stacks · Ecstasy · Sweet Shop special (+4,500)'],
      ['Energy', 'Xanax + drinks + refills, stacked'], ['Property', 'Private Island (5,025) + marry to split upkeep'],
      ['Cadence', 'Max jump daily; time big pushes to World Diabetes Day (candy ×9)'] ] }
  ];
  const builds = [
    { label: 'Balanced', note: 'new players', rows: [
      ['Focus', 'All four evenly'], ['Role', 'Flexible, safe, good for chaining'],
      ['Scale', 'Keep stats within ~10–20% of each other until you pick a role'] ] },
    { label: 'Hitter', note: 'attack / war', rows: [
      ['Focus', 'Speed + Strength'], ['Role', 'Land fast, hit hard — the classic war attacker'],
      ['Scale', "Grow Speed and Strength together; keep some Defense so you're not glass"] ] },
    { label: 'Wall', note: 'defending', rows: [
      ['Focus', 'Defense + Speed'], ['Role', 'Survive attacks, hold during a war'],
      ['Scale', 'Defense leads; keep Speed up so you still hit back'] ] },
    { label: 'Pure', note: 'specialist', rows: [
      ['Focus', 'One stat, all-in'], ['Role', 'Max respect / niche (e.g. pure Speed). High risk/reward'],
      ['Scale', 'Only once you know why — a single weak stat is exploitable'] ] }
  ];
  onMount(() => {

(function(){
  function cssv(n){return getComputedStyle(document.body).getPropertyValue(n).trim();}

  // ---------- horizontal bars ----------
  function renderBars(el,data,max,fmt){
    el.innerHTML='';
    data.forEach(function(d){
      var row=document.createElement('div');
      row.className='bar-row'+(d.hi?' hi':'');
      var pct=Math.max(6, d.v/max*100);
      row.innerHTML='<div class="lbl">'+d.l+'</div><div class="track"><div class="fill" style="width:'+pct.toFixed(1)+'%"><span class="v">'+fmt(d.v)+'</span></div></div>';
      row.querySelector('.track').title=d.l+': '+fmt(d.v);
      el.appendChild(row);
    });
  }
  var props=[
    {l:'Shack',v:100},{l:'Trailer',v:165},{l:'Apartment',v:188},{l:'Semi-Detached',v:275},
    {l:'Detached',v:500},{l:'Beach House',v:650},{l:'Chalet',v:725},{l:'Villa',v:800},
    {l:'Penthouse',v:1150},{l:'Mansion',v:1725},{l:'Ranch',v:1925},{l:'Palace',v:2550},
    {l:'Castle',v:3475},{l:'Private Island',v:5025,hi:true}
  ];
  var candies=[
    {l:'Lollipop / Bon Bons',v:25},{l:'Big Box Choc Bars',v:35},{l:'Candy Kisses / Egg',v:50},
    {l:'Tootsie / Eyeballs',v:75},{l:'Truffles / Reindeer',v:100},{l:'Humbugs / Jawbreaker',v:150},
    {l:'Birthday Cupcake',v:250,hi:true}
  ];
  var nf=new Intl.NumberFormat('en-US');
  renderBars(document.getElementById('propbars'),props,5025,function(v){return nf.format(v);});
  renderBars(document.getElementById('candybars'),candies,250,function(v){return '+'+v;});

  // ---------- happy curve (Training Formula V2.0 bracket, Strength) ----------
  var S=10000, A=1600, B=1700;               // sample: newish player, Strength
  function bracket(H){
    return S*(1+0.07*Math.log(1+H/250)) + 8*Math.pow(H,1.05) + (1-Math.pow(H/99999,2))*A + B;
  }
  var base=bracket(250);                       // ~ no-jump baseline
  var W=900,Hh=380, m={l:52,r:18,t:22,b:40};
  var xMax=100000, yMax=90;
  function X(h){return m.l+(h/xMax)*(W-m.l-m.r);}
  function Y(mult){return Hh-m.b-(mult/yMax)*(Hh-m.t-m.b);}
  var pts=[];
  for(var i=0;i<=120;i++){var h=(i/120)*xMax; if(h<250)h=250; pts.push([h,bracket(h)/base]);}
  var line=pts.map(function(p,i){return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1);}).join(' ');
  var area=line+' L'+X(xMax)+' '+Y(0)+' L'+X(250)+' '+Y(0)+' Z';

  var svg=document.getElementById('curve');
  var NS='http://www.w3.org/2000/svg';
  function mk(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  var grid=cssv('--grid'), axis=cssv('--axis'), amber=cssv('--amber'), amberFill=cssv('--amber-fill');

  // y gridlines + labels
  [0,15,30,45,60,75,90].forEach(function(g){
    var y=Y(g);
    svg.appendChild(mk('line',{x1:m.l,y1:y,x2:W-m.r,y2:y,stroke:grid,'stroke-width':1}));
    var tx=mk('text',{x:m.l-9,y:y+4,'text-anchor':'end','font-size':11}); tx.textContent=g+'×'; svg.appendChild(tx);
  });
  // x labels
  [[250,'base'],[5000,'5k'],[25000,'25k'],[50000,'50k'],[100000,'99,999']].forEach(function(d){
    var x=X(d[0]);
    var tx=mk('text',{x:x,y:Hh-m.b+20,'text-anchor':'middle','font-size':11}); tx.textContent=d[1]; svg.appendChild(tx);
  });
  // area gradient
  var defs=mk('defs',{}); var lg=mk('linearGradient',{id:'ag',x1:0,y1:0,x2:0,y2:1});
  lg.appendChild(mk('stop',{offset:'0%','stop-color':amberFill,'stop-opacity':.42}));
  lg.appendChild(mk('stop',{offset:'100%','stop-color':amberFill,'stop-opacity':.02}));
  defs.appendChild(lg); svg.appendChild(defs);
  svg.appendChild(mk('path',{d:area,fill:'url(#ag)'}));
  svg.appendChild(mk('path',{d:line,fill:'none',stroke:amber,'stroke-width':2.5,'stroke-linejoin':'round'}));

  // annotation markers at jump tiers
  [[5000,'candy jump'],[25000,'eDVD range'],[99999,'max']].forEach(function(d){
    var mult=bracket(d[0])/base, x=X(d[0]), y=Y(mult);
    svg.appendChild(mk('circle',{cx:x,cy:y,r:4,fill:amber,stroke:cssv('--surface'),'stroke-width':2}));
    var lx = d[0]===99999 ? x-6 : x+8, anch = d[0]===99999 ? 'end':'start';
    var tx=mk('text',{x:lx,y:y-9,'text-anchor':anch,'font-size':11,'class':'anno'});
    tx.textContent=d[1]+' · '+Math.round(mult)+'×'; svg.appendChild(tx);
  });

  // hover crosshair + tooltip
  var tip=document.getElementById('tip'), card=svg.parentElement;
  var vline=mk('line',{y1:m.t,y2:Hh-m.b,stroke:axis,'stroke-width':1,'stroke-dasharray':'3 3',opacity:0});
  var vdot=mk('circle',{r:4.5,fill:amber,stroke:cssv('--surface'),'stroke-width':2,opacity:0});
  svg.appendChild(vline); svg.appendChild(vdot);
  function move(ev){
    var r=svg.getBoundingClientRect(), cx=ev.touches?ev.touches[0].clientX:ev.clientX;
    var px=(cx-r.left)/r.width*W;
    if(px<m.l||px>W-m.r){leave();return;}
    var h=(px-m.l)/(W-m.l-m.r)*xMax; if(h<250)h=250;
    var mult=bracket(h)/base, x=X(h), y=Y(mult);
    vline.setAttribute('x1',x); vline.setAttribute('x2',x); vline.setAttribute('opacity',1);
    vdot.setAttribute('cx',x); vdot.setAttribute('cy',y); vdot.setAttribute('opacity',1);
    tip.style.opacity=1;
    tip.style.left=(x/W*r.width)+'px';
    tip.style.top=(y/Hh*r.height)+'px';
    tip.textContent=nf.format(Math.round(h))+' happy · '+mult.toFixed(1)+'× gain';
  }
  function leave(){vline.setAttribute('opacity',0);vdot.setAttribute('opacity',0);tip.style.opacity=0;}
  svg.addEventListener('mousemove',move); svg.addEventListener('mouseleave',leave);
  svg.addEventListener('touchmove',move,{passive:true}); svg.addEventListener('touchend',leave);
})();

/* ---------- Jump Planner ---------- */
(function(){
  var nf=new Intl.NumberFormat('en-US');
  var STAT={str:{A:1600,B:1700},spd:{A:1600,B:2000},dex:{A:1800,B:1500},def:{A:2100,B:-600}};
  var PROPS=[['Shack',100],['Trailer',165],['Apartment',188],['Semi-Detached',275],['Detached',500],
    ['Beach House',650],['Chalet',725],['Villa',800],['Penthouse',1150],['Mansion',1725],
    ['Ranch',1925],['Palace',2550],['Castle',3475],['Private Island',5025]];
  // kind: 'candy' gets the multiplier stack; 'flat' does not
  var ITEMS=[
    {id:'lolli',nm:'Lollipop / Bon Bons',happy:25,kind:'candy',cd:30},
    {id:'bigbox',nm:'Big Box Choc Bars',happy:35,kind:'candy',cd:30},
    {id:'kiss',nm:'Candy Kisses / Choc Egg',happy:50,kind:'candy',cd:30},
    {id:'toot',nm:'Tootsie / Eyeballs',happy:75,kind:'candy',cd:30},
    {id:'truf',nm:'Truffles / Reindeer',happy:100,kind:'candy',cd:30},
    {id:'humb',nm:'Humbugs / Jawbreaker',happy:150,kind:'candy',cd:30},
    {id:'cake',nm:'Birthday Cupcake',happy:250,kind:'candy',cd:30},
    {id:'edvd',nm:'Erotic DVD',happy:2500,kind:'flat',cd:0},
    {id:'feath',nm:'Feathery Hotel Coupon',happy:500,kind:'flat',cd:360},
    {id:'xan',nm:'Xanax (happy part)',happy:75,kind:'flat',cd:0},
    {id:'sweet',nm:'Sweet Shop special (10★)',happy:4500,kind:'flat',cd:0}
  ];
  var qty={}, price={};
  ITEMS.forEach(function(it){qty[it.id]=0;price[it.id]=null;});

  var $=function(id){return document.getElementById(id);};
  // property dropdown
  var psel=$('p-prop');
  PROPS.forEach(function(p,i){var o=document.createElement('option');o.value=p[1];o.textContent=p[0]+' · '+nf.format(p[1]);if(p[0]==='Castle')o.selected=true;psel.appendChild(o);});

  // item rows
  var box=$('p-items');
  ITEMS.forEach(function(it){
    var row=document.createElement('div'); row.className='item';
    row.innerHTML=
      '<div class="nm">'+it.nm+'<small>+'+it.happy+(it.kind==='candy'?' · candy':'')+'</small></div>'+
      '<div class="stepper"><button type="button" aria-label="less">−</button><span class="q" id="q-'+it.id+'">0</span><button type="button" aria-label="more">+</button></div>'+
      '<div class="price"><input type="number" min="0" inputmode="numeric" placeholder="$ each" id="pr-'+it.id+'"></div>';
    var btns=row.querySelectorAll('button');
    btns[0].addEventListener('click',function(){qty[it.id]=Math.max(0,qty[it.id]-1);$('q-'+it.id).textContent=qty[it.id];calc();});
    btns[1].addEventListener('click',function(){qty[it.id]++;$('q-'+it.id).textContent=qty[it.id];calc();});
    row.querySelector('input').addEventListener('input',function(e){var v=parseFloat(e.target.value);price[it.id]=isNaN(v)?null:v;calc();});
    box.appendChild(row);
  });

  // multiplier chips (candy)
  var candyMult=1;
  Array.prototype.forEach.call($('p-mults').querySelectorAll('.chip'),function(ch){
    ch.addEventListener('click',function(){
      var on=ch.getAttribute('aria-pressed')==='true'; ch.setAttribute('aria-pressed',(!on).toString()); recalcMult(); calc();
    });
  });
  function recalcMult(){
    candyMult=1;
    Array.prototype.forEach.call($('p-mults').querySelectorAll('.chip'),function(ch){
      if(ch.getAttribute('aria-pressed')==='true') candyMult*=parseFloat(ch.dataset.mult);
    });
  }
  // ecstasy
  var xtc=$('p-xtc');
  xtc.addEventListener('click',function(){var on=xtc.getAttribute('aria-pressed')==='true';xtc.setAttribute('aria-pressed',(!on).toString());calc();});

  ['p-prop','p-stat','p-total','p-dots','p-e','p-budget','p-perk','p-cd'].forEach(function(id){
    $(id).addEventListener('input',calc); $(id).addEventListener('change',calc);
  });

  function dS(H,S,dots,E,A,B,perkMult){
    var Scap=Math.min(S,50000000);
    var bracket=Scap*(1+0.07*Math.log(1+H/250)) + 8*Math.pow(H,1.05) + (1-Math.pow(H/99999,2))*A + B;
    return bracket*(1/200000)*dots*E*perkMult;
  }

  function calc(){
    var baseline=parseFloat(psel.value)||100;
    var st=STAT[$('p-stat').value];
    var S=Math.max(0,parseFloat($('p-total').value)||0);
    var dots=Math.max(0.1,parseFloat($('p-dots').value)||0.1);
    var E=parseFloat($('p-e').value)||10;
    var budget=Math.max(0,parseFloat($('p-budget').value)||0);
    var perkMult=1+(Math.max(0,parseFloat($('p-perk').value)||0)/100);
    var cdRed=parseFloat($('p-cd').value)||1;

    // build the jump: sum happy + booster cooldown + cost
    var addHappy=0, cd=0, cost=0, anyPrice=false, itemUnits=0;
    ITEMS.forEach(function(it){
      var q=qty[it.id]; if(!q) return;
      itemUnits+=q;
      var h=it.happy*q*(it.kind==='candy'?candyMult:1);
      addHappy+=h;
      cd+=it.cd*q*(it.kind==='candy'?cdRed:1);
      if(price[it.id]!=null){anyPrice=true;cost+=price[it.id]*q;}
    });
    var peak=baseline+addHappy;
    if(xtc.getAttribute('aria-pressed')==='true') peak*=2;   // Ecstasy doubles current happy
    peak=Math.min(99999,peak);

    // simulate the energy dump with happy decaying ~50% of energy/train
    var H=peak, eLeft=budget, gain=0, trains=0, guard=0;
    while(eLeft>=E && guard<100000){
      gain+=dS(H,S,dots,E,st.A,st.B,perkMult);
      H=Math.max(baseline, H-0.5*E);
      eLeft-=E; trains++; guard++;
    }
    var perE = budget>0 ? gain/(trains*E||1) : 0;

    $('r-happy').textContent=nf.format(Math.round(peak));
    $('r-happy-sub').textContent='baseline '+nf.format(Math.round(baseline));
    $('r-gain').textContent = gain>=1 ? nf.format(Math.round(gain)) : gain.toFixed(2);
    $('r-gain-sub').textContent=itemUnits+' item'+(itemUnits===1?'':'s')+' eaten';
    $('r-per').textContent = perE>=1 ? nf.format(Math.round(perE)) : perE.toFixed(2);
    $('r-cd').textContent = cd>=60 ? (cd/60).toFixed(1)+' h' : Math.round(cd)+' m';
    $('r-trains').textContent=nf.format(trains);
    $('r-trains-sub').textContent=nf.format(trains*E)+' energy used';

    if(anyPrice && gain>0){
      $('r-cost').textContent='$'+nf.format(Math.round(cost/gain));
      $('r-cost-sub').textContent='$'+nf.format(Math.round(cost))+' total';
    }else{
      $('r-cost').textContent='—'; $('r-cost-sub').textContent='enter prices';
    }
  }

  recalcMult(); calc();
})();

  });
</script>

<header class="hero"><div class="wrap">
  <span class="hero-badge">FACTION TRAINING · EST. 2004</span>
  <h1>Faction<br>Training <em>Playbook</em></h1>
  <p class="lede">Turn energy into stats fast — and spend cash so it actually pays off. Four people run this page: the plan, the method, the muscle, and the connections. Find the tier that matches you and follow their lead.</p>
  <div class="rule-strip" aria-hidden="true">
    <span style="background:var(--c-banker)"></span>
    <span style="background:var(--c-trainer)"></span>
    <span style="background:var(--c-militia)"></span>
    <span style="background:var(--c-fixer)"></span>
  </div>

  <div class="hero-crew">
    <div class="crew banker">
      <div class="art" style="background-image:url('{base}/assets/bg_bank.png')"></div>
      <div class="fallback">V</div>
      <div class="veil"></div>
      <img class="art" src="{base}/assets/banker.png" alt="Vincent Moretti, the banker" style="background:none">
      <div class="cap"><div class="role">Banker · Economy</div><div class="who">Vincent "Ledger" Moretti</div><div class="dom">Money · property · education · when not to spend</div></div>
    </div>
    <div class="crew trainer">
      <div class="art" style="background-image:url('{base}/assets/bg_gym.png')"></div>
      <div class="fallback">M</div>
      <div class="veil"></div>
      <img class="art" src="{base}/assets/trainer.png" alt="Maya Torres, the trainer" style="background:none">
      <div class="cap"><div class="role">Trainer · Progress</div><div class="who">Maya "Rep" Torres</div><div class="dom">Gym · happy · energy · routines · jumps</div></div>
    </div>
    <div class="crew militia">
      <div class="art" style="background-image:url('{base}/assets/bg_militia.png')"></div>
      <div class="fallback">R</div>
      <div class="veil"></div>
      <img class="art" src="{base}/assets/militia.png" alt="Marcus Kane, the militia veteran" style="background:none">
      <div class="cap"><div class="role">Militia · Factions</div><div class="who">Marcus "Rook" Kane</div><div class="dom">Faction perks · war readiness · preparation</div></div>
    </div>
    <div class="crew fixer">
      <div class="art" style="background-image:url('{base}/assets/bg_alley.png')"></div>
      <div class="fallback">N</div>
      <div class="veil"></div>
      <img class="art" src="{base}/assets/nico.png" alt="Nico Vescari, the fixer" style="background:none">
      <div class="cap"><div class="role">Fixer · Opportunity</div><div class="who">Nico "The Line" Vescari</div><div class="dom">Quick cash · leveling · flipping · introductions</div></div>
    </div>
  </div>
</div></header>

<!-- THE IDEA -->
<section id="idea"><div class="wrap">
  <span class="eyebrow">The one idea</span>
  <h2>Happy multiplies every train</h2>
  <p class="lede">Gym gains rise with your <strong>happy</strong> — steeply. A "happy jump" means: spike your happy with items, dump all your energy while it's high, then let it recharge. The curve below is why it works.</p>

  <div class="say trainer">
    <div class="av"><span class="mono-badge">M</span><img src="{base}/assets/trainer.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rep</span><span class="tag">Coach's Tip</span></div>
      <p class="line">"Happy is the multiplier. Stack it, dump every point of energy, then walk away. Miss the window and you just fed the clock."</p></div>
  </div>

  <div class="card chartcard" style="margin-top:22px">
    <h3>Relative gym gain vs. happy <span class="mono" style="color:var(--faint);font-weight:400;font-size:.8rem">— per unit of energy, vs. training at base happy</span></h3>
    <svg class="curve" id="curve" viewBox="0 0 900 380" role="img" aria-label="Gym gain multiple rising with happiness, from 1x at base happy to roughly 88x at maximum happy"></svg>
    <div id="tip"></div>
    <p class="note">Modeled from the accepted Training Formula V2.0 (Vladar). Shape is what matters: gains keep climbing with happy, so the highest-happy window is where energy is best spent.</p>
  </div>

  <div class="grid g2" style="margin-top:18px">
    <div class="callout">
      <h3>The golden rules</h3>
      <ul class="rules" style="margin-top:10px">
        <li><span class="k">×</span><div>Every train burns <b>40–60% of the energy you spend</b> back out of your happy bar.</div></li>
        <li><span class="k">⏱</span><div>Happy over your max <b>resets at :00 / :15 / :30 / :45</b>. Spend a jump immediately — don't let the clock eat it.</div></li>
        <li><span class="k">∏</span><div>Perks from <b>property, faction &amp; education multiply</b> your gains (they don't add). Stack them.</div></li>
        <li><span class="k">↓</span><div>The bigger your stats, the <b>less</b> happy matters — so new players get the most out of it.</div></li>
      </ul>
    </div>
    <div class="callout">
      <h3>The loop, in four moves</h3>
      <ul class="rules" style="margin-top:10px">
        <li><span class="k">1</span><div><b>Stack happy</b> — eat your happy items (candy / eDVD) to push happy high.</div></li>
        <li><span class="k">2</span><div><b>Dump energy</b> — train your target stat until happy drops, inside one 15-min window.</div></li>
        <li><span class="k">3</span><div><b>Refill energy</b> — Xanax, energy drinks, or natural regen.</div></li>
        <li><span class="k">4</span><div><b>Repeat</b> — or fly a money run while everything recharges.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<!-- LEVEL <=15 -->
<section id="new"><div class="wrap">
  <span class="eyebrow">Level 15 &amp; under</span>
  <h2>Foundation first — don't jump yet</h2>
  <p class="lede">At low stats, plain training already gains well and your cash is scarce. Spend money on <b>foundations that pay forever</b> (property, education), not on happy items. Do these in order:</p>

  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Ledger</span><span class="tag">Before You Buy</span></div>
      <p class="line">"You're not rich yet, so stop shopping. Property and education pay out every day you play. Candy doesn't. Don't spend ten million fixing what patience solves for free."</p></div>
  </div>

  <ol class="steps" style="margin-top:22px">
    <li><div><b>Finish the New Player Missions.</b><small>They hand you cash, items and gym progress while teaching the systems.</small></div></li>
    <li><div><b>Train every day — never sit on a capped energy bar.</b><small>Wasted energy is the only truly unrecoverable loss. Use it or bank it into Xanax later.</small></div></li>
    <li><div><b>Start a long education course now.</b><small>The gym-gain line (Sports Science) and permanent stat courses run in the background for days — start them early.</small></div></li>
    <li><div><b>Move off the Shack.</b><small>Even a Trailer/Apartment lifts your happy baseline cheaply (100 → 165 → 188). Buy the best property whose upkeep you can actually sustain.</small></div></li>
    <li><div><b>Top up happy with cheap candy.</b><small>Lollipops / Box of Chocolate Bars (+25) — often dropped by Shoplifting. Keep happy above the regen floor before you train.</small></div></li>
    <li><div><b>Fly Mexico for starter cash.</b><small>Shortest trip (17–24 min). Buy plushies/flowers at the General Store, sell back home.</small></div></li>
    <li><div><b>Ask the faction for Xanax.</b><small>+250 energy per pill — the single biggest boost to how fast you grow early. Take what leadership offers.</small></div></li>
  </ol>

  <div class="callout dont" style="margin-top:16px">
    <h3 style="color:var(--crime)">Don't, yet</h3>
    <p style="margin:6px 0 0">No eDVDs and no big happy jumps at this stage. They're expensive and your low stats don't need them — that money buys far more stats as a property upgrade or an education course. Jumping starts once you're past level 15 <em>and</em> have cash to spare.</p>
  </div>
</div></section>

<!-- MAKE MONEY -->
<section id="money"><div class="wrap">
  <span class="eyebrow">Level up · then get paid</span>
  <h2>Make money</h2>
  <p class="lede">Money moves through this city constantly — the trick is standing where it lands. Get to <strong>level 15</strong> (that's where the real money unlocks), then pick your hustle.</p>

  <div class="say fixer">
    <div class="av"><span class="mono-badge">N</span><img src="{base}/assets/nico.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Nico "The Line"</span><span class="tag">Between Us</span></div>
      <p class="line">"You want safe money? Talk to Ledger. You want money this week? Keep listening. First problem — you're stuck under 15. Let's fix that."</p></div>
  </div>

  <h3 style="margin-top:26px">1 · Rush to level 15, then stop</h3>
  <p style="color:var(--muted);margin:.2em 0 0">Level 15 unlocks <b>travel</b> — and travel is where money gets easy. Get there fast, then never grind levels again; they come on their own while you train.</p>
  <div class="grid g2" style="margin-top:14px">
    <div class="card">
      <h3>Leveling targets</h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Train enough to comfortably win, then attack inactive <b>"leveling targets"</b> (low stats for their level) and <b>leave them in the street</b> — that's the best XP. Spend all your energy on them until 15. Losing or taking heavy damage? Train more, try again in a few days.</p>
    </div>
    <div class="card" style="border-left:3px solid var(--c-fixer)">
      <h3>Losses — sell, don't buy <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">Nico Knows a Guy</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Some players <em>pay</em> to be fed easy wins to rush levels — but for our crew the money's on the other side. Level off <b>leveling targets</b>; <b>sell</b> your losses for cash. Be the one getting paid, not the one paying — see <a href="#sell-losses">Selling losses</a> below.</p>
    </div>
  </div>
  <div class="say trainer">
    <div class="av"><span class="mono-badge">M</span><img src="{base}/assets/trainer.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rep</span><span class="tag">Coach's Tip</span></div>
      <p class="line">"The day you hit 15, stop chasing levels. Every point of energy goes into the gym from there — level just shows up on its own."</p></div>
  </div>

  <h3 style="margin-top:30px">2 · Rent your happy, don't buy it</h3>
  <div class="callout" style="margin-top:10px">
    <ul class="rules">
      <li><span class="k">↧15</span><div>Getting to 15: <b>rent</b> a Mansion/Ranch (bare minimum a Penthouse, 925 happy) for <b>30–45 days</b>. Don't buy, don't rent long-term.</div></li>
      <li><span class="k">15+</span><div>At 15 you can afford a <b>Private Island</b> — ~$12–13M / 30 days for the 3,600-happy sweet spot. First PI: grab the cheapest one <b>with a landing strip</b> (even a 2,550 will do).</div></li>
    </ul>
  </div>
  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Ledger</span><span class="tag">Money Talk</span></div>
      <p class="line">"Buying a cheap property to save money is how you lose money. Rent short, move up the moment you hit 15. Your happy is an investment, not a possession."</p></div>
  </div>

  <h3 style="margin-top:30px">3 · Where the money is</h3>
  <div class="grid g2" style="margin-top:14px">
    <div class="card">
      <h3>Before 15 — shop flips <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">Quick Money</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">City → East Side → <b>Bits N Bobs</b> &amp; <b>Sweet Shop</b>. You can buy <b>100 items/day</b>; resell lollipops, beer and basic plushies to players at a markup — roughly <b>$50–60k/day</b>. Small, but it compounds your first property.</p>
    </div>
    <div class="card">
      <h3>After 15 — flowers &amp; plushies <span class="tag" style="color:var(--c-trainer);background:var(--ok-soft)">the big one</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Fly abroad, buy flowers/plushies from the General Store, fly home, sell to players. Huge demand — <b>$3–6M/day</b> active. See <a href="#schedule">Schedules</a> and the <a href="{base}/planner/">live planner</a> for destinations and timing.</p>
    </div>
    <div class="card" id="sell-losses" style="border-left:3px solid var(--c-fixer)">
      <h3>Selling losses <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">Quick Money</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Attack willing buyers and <b>lose on purpose</b> — they pay you <b>$250–350k per loss</b> (price a new service ~$250–300k). Advertise in <b>Trade Chat</b> ("Selling losses. $250k per."), collect after.</p>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">E</span><div>25 energy per attack → hospital; a <b>First Aid Kit</b> clears 50 min. A full bar = ~4 losses.</div></li>
        <li><span class="k">X</span><div><b>Xanax</b> (+250 energy) → ~10 more; stack First Aid Kits and knock out ~16 in a sitting (dual-tab it).</div></li>
        <li><span class="k">$</span><div>16 losses ≈ <b>$4M</b> gross → <b>~$2.8M net</b> after Xanax + kits (donator). Works before level 15 — you just need buyers.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Market flipping <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">Worth the Risk?</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Buy underpriced listings, resell higher. Real money — but it takes money to make money, it's time-consuming, and while you're small you're an easy <b>mug</b>. Scale it up as your stats and vault grow.</p>
    </div>
    <div class="card">
      <h3>Favors &amp; introductions <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">An Opportunity</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">The flip side of loss buying: strong players <b>sell</b> losses to levelers. Buyers for your flowers, someone who needs a job done — the faction is full of these. Ask around; someone always needs something.</p>
    </div>
  </div>

  <h3 style="margin-top:30px">4 · Don't get mugged</h3>
  <div class="say militia">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rook</span><span class="tag">Field Note</span></div>
      <p class="line">"Everyone gets mugged — plan for it. Keep cash off your person: a property vault if you can afford one, ghost trades (6-hour limit), the faction vault (some risk, no instant access), or park value in items and points. Use a mix until you own a PI vault."</p></div>
  </div>

  <div class="say fixer">
    <div class="av"><span class="mono-badge">N</span><img src="{base}/assets/nico.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Nico "The Line"</span><span class="tag">The Exit</span></div>
      <p class="line">"That's the map. Ledger tells you how to keep it, Rep tells you how to spend the energy. Me — I just know where it's moving. You didn't hear it from me."</p></div>
  </div>
</div></section>

<!-- BY INCOME -->
<section id="brackets"><div class="wrap">
  <span class="eyebrow">Level 15+ · by what you can spend</span>
  <h2>Pick your bracket</h2>
  <p class="lede">Past the foundation, how hard you jump is set by cash you can put to work — your wallet plus whatever the faction backs. Match yourself to a tier.</p>

  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Ledger</span><span class="tag">Money Talk</span></div>
      <p class="line">"Your wallet is part of your build. Pick the tier you can sustain — not the one you wish you were. You can afford it doesn't mean you should buy it."</p>
      <p class="line plain">Torres can turn money into stats fast. Unfortunately it's usually <em>my</em> money she wants to turn into stats.</p></div>
  </div>

  <Tabs items={brackets} accent="var(--amber)" />
  <p class="note">Faction holdings can effectively bump your bracket — if leadership funds your eDVDs or Xanax, train like the tier above your wallet.</p>
</div></section>

<!-- BUILDS -->
<section id="builds"><div class="wrap">
  <span class="eyebrow">Where your stats go</span>
  <h2>Builds &amp; how to scale them</h2>
  <p class="lede">Happy tells you how <em>fast</em> to grow; your build tells you <em>which</em> stat. Two relationships decide fights — get them right and pick a role.</p>

  <div class="say militia">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rook</span><span class="tag">Rook's Rule</span></div>
      <p class="line">"Stats don't make you useful — knowing what you're for does. Speed lands the hit, strength ends it. Pick a role and grow into it. A weak stat is just a door you left open."</p></div>
  </div>

  <div class="callout" style="margin-top:20px">
    <h3>The two match-ups that decide everything</h3>
    <ul class="rules" style="margin-top:10px">
      <li><span class="k">SPD</span><div><b>Speed vs their Dexterity</b> → whether you <b>land hits</b>. Out-speed their dex and you connect; fall behind and you miss.</div></li>
      <li><span class="k">STR</span><div><b>Strength vs their Defense</b> → how <b>hard you hit</b>. Out-muscle their defense and you do real damage.</div></li>
    </ul>
    <p style="margin:10px 0 0;color:var(--muted)">So an attacker wants Speed over the target's Dex and Strength over their Defense; a defender flips it — Defense to absorb, Dexterity to dodge.</p>
  </div>

  <Tabs items={builds} accent="var(--c-militia)" />

  <div class="callout" style="margin-top:16px">
    <h3>Scaling rules</h3>
    <ul class="rules" style="margin-top:10px">
      <li><span class="k">1</span><div><b>Start balanced</b>, specialize once you know your faction role (hitter vs wall).</div></li>
      <li><span class="k">2</span><div><b>Never let Speed lag</b> — it decides whether you hit at all; a huge Strength is wasted if you miss.</div></li>
      <li><span class="k">3</span><div><b>One stat per jump session</b> — focus each happy jump on a single stat (the planner's stat picker uses that stat's constants).</div></li>
      <li><span class="k">4</span><div><b>Re-check ratios as you grow</b> — if you start missing or getting hit, rebalance toward the lagging match-up.</div></li>
    </ul>
    <p class="note" style="margin-top:10px">Exact target ratios are a faction/meta call — pair this with leadership's build advice and peer research for your bracket.</p>
  </div>
</div></section>

<!-- SCHEDULES -->
<section id="schedule"><div class="wrap">
  <span class="eyebrow">Schedules</span>
  <h2>What a day looks like</h2>
  <p class="lede">Two rhythms. Run the <b>jump day</b> when you have happy items and time to sit at the keyboard; run the <b>steady day</b> otherwise — it still grows you while you earn.</p>

  <div class="say trainer">
    <div class="av"><span class="mono-badge">M</span><img src="{base}/assets/trainer.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rep</span><span class="tag">Rep Says</span></div>
      <p class="line">"Perfect isn't the goal — consistent is. One good jump feels great; a hundred ordinary days build the account. Energy at cap is wasted stats, so never sit on a full bar."</p></div>
  </div>

  <div class="grid g2" style="margin-top:22px">
    <div class="card">
      <h3>Jump day <span class="tag h">happy jump</span></h3>
      <div class="tl" style="margin-top:14px">
        <div class="row"><div class="time">:05</div><div class="blk b-x"><b>Prep</b> — full energy (Xanax if needed), happy items ready</div></div>
        <div class="row"><div class="time">:06–:08</div><div class="blk b-h"><b>Stack happy</b> — eat candy/eDVD up to your bracket's target</div></div>
        <div class="row"><div class="time">:08–:14</div><div class="blk b-e"><b>Dump energy</b> — train your build stat before the :15 reset</div></div>
        <div class="row"><div class="time">:15+</div><div class="blk b-f"><b>Fly</b> a money run while energy + cooldowns recharge</div></div>
        <div class="row"><div class="time">later</div><div class="blk b-x"><b>Repeat</b> the jump when energy + happy items are back</div></div>
      </div>
    </div>
    <div class="card">
      <h3>Steady day <span class="tag e">earn + grow</span></h3>
      <div class="tl" style="margin-top:14px">
        <div class="row"><div class="time">morning</div><div class="blk b-e"><b>Train</b> your full energy bar at current happy (top up with cheap candy)</div></div>
        <div class="row"><div class="time">midday</div><div class="blk b-f"><b>Fly</b> — plushies/flowers run sized to your travel method</div></div>
        <div class="row"><div class="time">evening</div><div class="blk b-e"><b>Train</b> the refilled bar; keep education course running</div></div>
        <div class="row"><div class="time">any time</div><div class="blk b-x"><b>Crimes</b> — spend nerve so the bar never sits full</div></div>
      </div>
    </div>
  </div>
  <div class="legend">
    <span><i class="dot" style="background:var(--amber-fill)"></i>Happy</span>
    <span><i class="dot" style="background:var(--energy)"></i>Energy / training</span>
    <span><i class="dot" style="background:var(--faint)"></i>Travel / money</span>
  </div>
</div></section>

<!-- ITEMS -->
<section id="items"><div class="wrap">
  <span class="eyebrow">What to buy</span>
  <h2>Item targets</h2>
  <p class="lede">Happy items push a jump; energy items give you more trains to spend at that happy. Prices move — the bot tracks live cost-per-point; values below are the effect.</p>

  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Ledger</span><span class="tag">Worth the Cost?</span></div>
      <p class="line">"Buy the happy that returns the most stats per dollar, not the biggest number. Happy is temporary; the gains aren't. Buy accordingly — the planner does the math."</p></div>
  </div>

  <h3 style="margin-top:22px">Happy</h3>
  <div class="tbl-scroll" style="margin-top:10px"><table>
    <thead><tr><th>Item</th><th>Happy</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Cheap candy <span class="tag h">low tier</span></td><td class="mono">+25</td><td>Lollipop, Box of Chocolate Bars, Bon Bons. Topping up / new players.</td></tr>
      <tr><td>Mid candy</td><td class="mono">+75–150</td><td>Tootsie Rolls, Humbugs, Jawbreaker, Pixie Sticks. Building-tier jumps.</td></tr>
      <tr><td>Birthday Cupcake</td><td class="mono">+250</td><td>Top candy value per item.</td></tr>
      <tr><td>Erotic DVD (eDVD)</td><td class="mono">+2,500</td><td>+5,000 working at 10★ Adult Novelties. The jump workhorse once you can afford it.</td></tr>
      <tr><td>Ecstasy</td><td class="mono">×2</td><td>Doubles current happy. Big drug cooldown — pairs with eDVD stacks.</td></tr>
      <tr><td>Xanax</td><td class="mono">+75</td><td>Bonus happy on top of its energy (below).</td></tr>
      <tr><td>Sweet Shop special</td><td class="mono">+4,500</td><td>10★ company, for job points. Endgame jumps.</td></tr>
    </tbody>
  </table></div>

  <h3 style="margin-top:26px">Energy</h3>
  <div class="tbl-scroll" style="margin-top:10px"><table>
    <thead><tr><th>Source</th><th>Energy</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Xanax <span class="tag e">best value</span></td><td class="mono">+250</td><td>~$3.4k/energy. Also +75 happy. The daily backbone.</td></tr>
      <tr><td>Natural regen</td><td class="mono">5 / 10–15 min</td><td>Free. Don't let it sit capped (150 donator / 100 not).</td></tr>
      <tr><td>Energy drinks</td><td class="mono">+5–30</td><td>Faction perk ×1.5. Adds 2h booster cooldown.</td></tr>
      <tr><td>LSD</td><td class="mono">+50</td><td>Cheapest per-energy budget option for low tiers.</td></tr>
      <tr><td>Feathery Hotel Coupon</td><td class="mono">full refill</td><td>+500 happy too; +6h booster cooldown.</td></tr>
      <tr><td>Point refill</td><td class="mono">+150</td><td>Costs points — for pushes, not daily.</td></tr>
    </tbody>
  </table></div>

  <h3 style="margin-top:26px">Books</h3>
  <div class="tbl-scroll" style="margin-top:10px"><table>
    <thead><tr><th>Book</th><th>Effect</th><th>When</th></tr></thead>
    <tbody>
      <tr><td>Yes Please Diabetes</td><td>Candy happy ×2 (31 days)</td><td>If you jump on candy often — stacks to ×9 on World Diabetes Day.</td></tr>
      <tr><td>Ignorance Is Bliss</td><td>Happy regens above max (31 days)</td><td>High tiers holding a big happy stack.</td></tr>
    </tbody>
  </table></div>
</div></section>

<!-- EDUCATION -->
<section id="edu"><div class="wrap">
  <span class="eyebrow">The compounding buy</span>
  <h2>Education targets</h2>
  <p class="lede">Education perks are <b>permanent and multiplicative</b> — a +1% gym-gain course keeps paying on every train forever. Long courses run in the background, so start them the day you qualify.</p>

  <div class="say militia">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rook</span><span class="tag">Faction Intel</span></div>
      <p class="line">"Your faction bonuses aren't decoration — they multiply everything you do here. Stack the gym-gain perks now. The faction gives you the advantage; wasting it is your decision."</p></div>
  </div>
  <div class="grid g2" style="margin-top:20px">
    <div class="card">
      <h3>Priority order</h3>
      <ul class="rules" style="margin-top:10px">
        <li><span class="k">1</span><div><b>Gym-gain courses</b> (Sports Science line) — direct % on the stat you're building.</div></li>
        <li><span class="k">2</span><div><b>Permanent stat / attribute courses</b> — flat strength/defense/endurance/intelligence boosts.</div></li>
        <li><span class="k">3</span><div><b>War &amp; property support</b> — see the faction's <em>Educations for War</em> guide for the exact list worth taking.</div></li>
      </ul>
    </div>
    <div class="callout">
      <h3>Why it beats another jump</h3>
      <p style="margin:6px 0 0">Perks multiply: property +2% × faction steadfast +15% × education +1% isn't +18%, it's ×1.02 × 1.15 × 1.01 ≈ <b>+19.7%</b> on <em>every</em> train. A one-time course fee buys a permanent slice of all future gains — the best-value purchase in the game after your property.</p>
    </div>
  </div>
</div></section>

<!-- PLANNER -->
<section id="planner"><div class="wrap">
  <span class="eyebrow">Interactive</span>
  <h2>Jump planner</h2>
  <p class="lede">Pick the sweets and items you plan to eat, set your build, and see what the jump actually gets you — happy reached, booster cooldown, and total stat gain across the whole energy dump. Prices are optional and typed in by hand here.</p>

  <p style="margin:6px 0 0"><a class="hero-badge" href="{base}/planner/" style="text-decoration:none">⚡ Open the live planner — auto-fills your stats, gyms &amp; prices with your API key →</a></p>

  <div class="say trainer">
    <div class="av"><span class="mono-badge">M</span><img src="{base}/assets/trainer.png" alt=""></div>
    <div class="body"><div class="hd"><span class="nm">Rep</span><span class="tag">Training Check</span></div>
      <p class="line">"Numbers, not vibes. Punch in your gym and your sweets and it tells you exactly what the jump buys. Don't chase the expensive method because someone richer told you to."</p></div>
  </div>

  <div class="plan-grid" style="margin-top:22px">
    <!-- setup -->
    <div class="card">
      <h3>Your setup</h3>
      <div class="two" style="margin-top:14px">
        <div class="field"><label for="p-prop">Property (happy baseline)</label>
          <select id="p-prop"></select></div>
        <div class="field"><label for="p-stat">Stat to train</label>
          <select id="p-stat">
            <option value="str">Strength</option><option value="spd">Speed</option>
            <option value="dex">Dexterity</option><option value="def">Defense</option>
          </select></div>
      </div>
      <div class="two">
        <div class="field"><label for="p-total">Current stat total</label>
          <input id="p-total" class="mono" type="number" min="0" value="1000000" inputmode="numeric"></div>
        <div class="field"><label for="p-dots">Gym dots (API ÷10)</label>
          <input id="p-dots" class="mono" type="number" min="0.1" step="0.1" value="7.3" inputmode="decimal"></div>
      </div>
      <div class="two">
        <div class="field"><label for="p-e">Energy / train</label>
          <select id="p-e"><option>5</option><option selected>10</option><option>25</option><option>50</option></select></div>
        <div class="field"><label for="p-budget">Energy to spend</label>
          <input id="p-budget" class="mono" type="number" min="0" step="10" value="1000" inputmode="numeric"></div>
      </div>
      <div class="two">
        <div class="field"><label for="p-perk">Gym-gain perks (%)</label>
          <input id="p-perk" class="mono" type="number" min="0" step="1" value="20" inputmode="numeric"></div>
        <div class="field"><label for="p-cd">Cooldown reduction</label>
          <select id="p-cd">
            <option value="1">None</option><option value="0.9">Fast Metabolism −10%</option>
            <option value="0.75">Professional −25%</option><option value="0.675">Both −32.5%</option>
          </select></div>
      </div>
      <div class="field" style="margin-bottom:4px"><label>Candy happy multipliers</label>
        <div class="chips" id="p-mults">
          <button class="chip" data-mult="3" aria-pressed="false">World Diabetes Day ×3</button>
          <button class="chip" data-mult="2" aria-pressed="false">Book ×2</button>
          <button class="chip" data-mult="1.5" aria-pressed="false">Voracity ×1.5</button>
          <button class="chip" data-mult="1.1" aria-pressed="false">Absorption ×1.1</button>
        </div>
      </div>
    </div>

    <!-- items -->
    <div class="card">
      <h3>Your sweets &amp; items</h3>
      <div class="price-hint">happy each · price (optional)</div>
      <div class="items" id="p-items" style="margin-top:4px"></div>
      <div class="field" style="margin-top:14px;margin-bottom:0">
        <label>Multiplier (applied to current happy)</label>
        <div class="chips">
          <button class="chip" id="p-xtc" aria-pressed="false">Ecstasy ×2 (doubles happy)</button>
        </div>
      </div>
    </div>
  </div>

  <!-- results -->
  <div class="results">
    <div class="tile accent"><div class="k">Happy reached</div><div class="v" id="r-happy">—</div><div class="sub" id="r-happy-sub">from baseline</div></div>
    <div class="tile"><div class="k">Total stat gain</div><div class="v" id="r-gain">—</div><div class="sub" id="r-gain-sub">over the dump</div></div>
    <div class="tile"><div class="k">Gain / energy</div><div class="v" id="r-per">—</div><div class="sub">this jump</div></div>
    <div class="tile"><div class="k">Booster cooldown</div><div class="v" id="r-cd">—</div><div class="sub">added by candy</div></div>
    <div class="tile"><div class="k">Trains</div><div class="v" id="r-trains">—</div><div class="sub" id="r-trains-sub">at your energy/train</div></div>
    <div class="tile"><div class="k">Cost / stat</div><div class="v" id="r-cost">—</div><div class="sub" id="r-cost-sub">enter prices</div></div>
  </div>

  <div class="disclaim">
    <span>ℹ️</span>
    <span><b>About live prices:</b> prices here are typed in by hand. For <b>live market prices</b> plus auto-filled stats, gyms and perks from your API key, use the <a href="{base}/planner/">live planner</a>. Gains use the accepted Training Formula V2.0 with happy decaying ~50% of energy spent as you train; randomness is excluded, so treat the number as the expected value.</span>
  </div>
</div></section>

<!-- CHARTS / REFERENCE -->
<section id="ref"><div class="wrap">
  <span class="eyebrow">Reference</span>
  <h2>The numbers behind it</h2>

  <div class="grid g2" style="margin-top:22px">
    <div class="card">
      <h3>Happy baseline by property <span class="mono" style="color:var(--faint);font-weight:400;font-size:.78rem">— max, with staff</span></h3>
      <div class="bars" id="propbars" style="margin-top:14px"></div>
      <p class="note">Private Island tops out at 5,025 happy — but it's endgame ($500M+). Marry to split its upkeep.</p>
    </div>
    <div class="card">
      <h3>Candy happy by tier <span class="mono" style="color:var(--faint);font-weight:400;font-size:.78rem">— base, before multipliers</span></h3>
      <div class="bars" id="candybars" style="margin-top:14px"></div>
      <p class="note">Multipliers stack up to ×9: World Diabetes Day ×3 × the book ×2 × faction Voracity ×1.5.</p>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:12px">
    <span class="brandmark" style="font-size:1.4rem;color:var(--ink)">TORN</span>
    <span style="font-family:'IBM Plex Mono',monospace;letter-spacing:.18em;font-size:.72rem;color:var(--muted)">CRIME PAYS · PROGRESS LASTS</span>
  </div>
  <strong>Faction Training Playbook.</strong> Guidance for faction members — figures are effects, not live prices (the tool tracks those). Ledger, Rep &amp; Rook are your guides; the numbers are the accepted community methods.
  <div class="src">
    <span>Sources: Torn wiki (Happy, Gym, Property, Marriage, Travel, Energy) &amp; accepted forum guides (Training Formula V2.0, Hank's/Baldr's Ratio, the happy-jump &amp; book guides).</span>
  </div>
  <p class="note">Mechanics change and prices move — treat targets as starting points and let the live tool refine them.</p>
</div></footer>
