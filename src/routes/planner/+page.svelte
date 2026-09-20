<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  onMount(() => {

(function(){
  var nf=new Intl.NumberFormat('en-US');
  var $=function(id){return document.getElementById(id);};

  var STAT={str:{A:1600,B:1700},spd:{A:1600,B:2000},dex:{A:1800,B:1500},def:{A:2100,B:-600}};
  var PROPS=[['Shack',100],['Trailer',165],['Apartment',188],['Semi-Detached',275],['Detached',500],
    ['Beach House',650],['Chalet',725],['Villa',800],['Penthouse',1150],['Mansion',1725],
    ['Ranch',1925],['Palace',2550],['Castle',3475],['Private Island',5025]];
  // name = exact Torn item name for live price matching
  var ITEMS=[
    {id:'lolli',name:'Lollipop',happy:25,kind:'candy',cd:30},
    {id:'bonbon',name:'Bag of Bon Bons',happy:25,kind:'candy',cd:30},
    {id:'choc',name:'Box of Chocolate Bars',happy:25,kind:'candy',cd:30},
    {id:'bigchoc',name:'Big Box of Chocolate Bars',happy:35,kind:'candy',cd:30},
    {id:'ckiss',name:'Bag of Candy Kisses',happy:50,kind:'candy',cd:30},
    {id:'toot',name:'Bag of Tootsie Rolls',happy:75,kind:'candy',cd:30},
    {id:'truf',name:'Bag of Chocolate Truffles',happy:100,kind:'candy',cd:30},
    {id:'humb',name:'Bag of Humbugs',happy:150,kind:'candy',cd:30},
    {id:'jaw',name:'Jawbreaker',happy:150,kind:'candy',cd:30},
    {id:'cake',name:'Birthday Cupcake',happy:250,kind:'candy',cd:30},
    {id:'edvd',name:'Erotic DVD',happy:2500,kind:'flat',cd:0},
    {id:'feath',name:'Feathery Hotel Coupon',happy:500,kind:'flat',cd:360},
    {id:'xan',name:'Xanax',happy:75,kind:'flat',cd:0}
  ];
  var qty={}, price={}, live={};
  ITEMS.forEach(function(it){qty[it.id]=0;price[it.id]=null;live[it.id]=false;});

  // property dropdown
  PROPS.forEach(function(p){var o=document.createElement('option');o.value=p[1];o.textContent=p[0]+' · '+nf.format(p[1]);if(p[0]==='Castle')o.selected=true;$('p-prop').appendChild(o);});

  // item rows
  ITEMS.forEach(function(it){
    var row=document.createElement('div'); row.className='item';
    row.innerHTML='<div class="nm">'+it.name+'<small>+'+it.happy+(it.kind==='candy'?' · candy':'')+'</small></div>'+
      '<div class="stepper"><button type="button" aria-label="less">−</button><span class="q" id="q-'+it.id+'">0</span><button type="button" aria-label="more">+</button></div>'+
      '<div class="price"><input type="number" min="0" inputmode="numeric" placeholder="$ each" id="pr-'+it.id+'"></div>';
    var b=row.querySelectorAll('button');
    b[0].addEventListener('click',function(){qty[it.id]=Math.max(0,qty[it.id]-1);$('q-'+it.id).textContent=qty[it.id];calc();});
    b[1].addEventListener('click',function(){qty[it.id]++;$('q-'+it.id).textContent=qty[it.id];calc();});
    var pin=row.querySelector('input');
    pin.addEventListener('input',function(e){var v=parseFloat(e.target.value);price[it.id]=isNaN(v)?null:v;live[it.id]=false;e.target.classList.remove('live');calc();});
    $('p-items').appendChild(row);
  });

  var candyMult=1;
  Array.prototype.forEach.call($('p-mults').querySelectorAll('.chip'),function(ch){
    ch.addEventListener('click',function(){ch.setAttribute('aria-pressed',(ch.getAttribute('aria-pressed')!=='true').toString());recalcMult();calc();});
  });
  function recalcMult(){candyMult=1;Array.prototype.forEach.call($('p-mults').querySelectorAll('.chip'),function(ch){if(ch.getAttribute('aria-pressed')==='true')candyMult*=parseFloat(ch.dataset.mult);});}
  $('p-xtc').addEventListener('click',function(){this.setAttribute('aria-pressed',(this.getAttribute('aria-pressed')!=='true').toString());calc();});
  ['p-prop','p-stat','p-total','p-dots','p-e','p-budget','p-perk','p-cd'].forEach(function(id){$(id).addEventListener('input',calc);$(id).addEventListener('change',calc);});

  function dS(H,S,dots,E,A,B,perkMult){
    var Sc=Math.min(S,50000000);
    var br=Sc*(1+0.07*Math.log(1+H/250)) + 8*Math.pow(H,1.05) + (1-Math.pow(H/99999,2))*A + B;
    return br*(1/200000)*dots*E*perkMult;
  }
  function calc(){
    var baseline=parseFloat($('p-prop').value)||100, st=STAT[$('p-stat').value];
    var S=Math.max(0,parseFloat($('p-total').value)||0), dots=Math.max(0.1,parseFloat($('p-dots').value)||0.1);
    var E=parseFloat($('p-e').value)||10, budget=Math.max(0,parseFloat($('p-budget').value)||0);
    var perkMult=1+(Math.max(0,parseFloat($('p-perk').value)||0)/100), cdRed=parseFloat($('p-cd').value)||1;
    var addHappy=0,cd=0,cost=0,anyPrice=false,units=0;
    ITEMS.forEach(function(it){var q=qty[it.id];if(!q)return;units+=q;
      addHappy+=it.happy*q*(it.kind==='candy'?candyMult:1);
      cd+=it.cd*q*(it.kind==='candy'?cdRed:1);
      if(price[it.id]!=null){anyPrice=true;cost+=price[it.id]*q;}});
    var peak=baseline+addHappy;
    if($('p-xtc').getAttribute('aria-pressed')==='true')peak*=2;
    peak=Math.min(99999,peak);
    var H=peak,eLeft=budget,gain=0,trains=0,guard=0;
    while(eLeft>=E && guard<200000){gain+=dS(H,S,dots,E,st.A,st.B,perkMult);H=Math.max(baseline,H-0.5*E);eLeft-=E;trains++;guard++;}
    var perE=trains>0?gain/(trains*E):0;
    $('r-happy').textContent=nf.format(Math.round(peak));
    $('r-happy-sub').textContent='baseline '+nf.format(Math.round(baseline));
    $('r-gain').textContent=gain>=1?nf.format(Math.round(gain)):gain.toFixed(2);
    $('r-gain-sub').textContent=units+' item'+(units===1?'':'s')+' eaten';
    $('r-per').textContent=perE>=1?nf.format(Math.round(perE)):perE.toFixed(2);
    $('r-cd').textContent=cd>=60?(cd/60).toFixed(1)+' h':Math.round(cd)+' m';
    $('r-trains').textContent=nf.format(trains);
    $('r-trains-sub').textContent=nf.format(trains*E)+' energy used';
    if(anyPrice&&gain>0){$('r-cost').textContent='$'+nf.format(Math.round(cost/gain));$('r-cost-sub').textContent='$'+nf.format(Math.round(cost))+' total';}
    else{$('r-cost').textContent='—';$('r-cost-sub').textContent='fetch or type prices';}
  }

  // ---- live prices via Torn API ----
  function setStatus(msg,cls){var s=$('status');s.textContent=msg;s.className='status'+(cls?' '+cls:'');}
  try{var saved=localStorage.getItem('tornApiKey'); if(saved){$('apikey').value=saved;setStatus('Saved key loaded. Click "Save & fetch prices" to refresh.','');}}catch(e){}

  function priceOf(rec){
    if(!rec) return null;
    var v = rec.market_value;
    if(v==null && rec.value) v = rec.value.market_value!=null ? rec.value.market_value : rec.value.buy_price;
    return (typeof v==='number' && v>0) ? v : null;
  }

  $('fetch').addEventListener('click',async function(){
    var key=$('apikey').value.trim();
    if(!key){setStatus('Enter your Limited API key first.','err');return;}
    try{localStorage.setItem('tornApiKey',key);}catch(e){}
    setStatus('Fetching item prices…','');
    try{
      var res=await fetch('https://api.torn.com/torn/?selections=items,gyms&key='+encodeURIComponent(key)+'&comment=JumpPlanner');
      var data=await res.json();
      if(data && data.error){setStatus('Torn API error '+data.error.code+': '+data.error.error,'err');return;}
      var items=data.items||{};
      // build lowercase-name -> record map
      var byName={};
      Object.keys(items).forEach(function(id){var it=items[id]; if(it&&it.name) byName[it.name.toLowerCase()]=it;});
      var hit=0,miss=[];
      ITEMS.forEach(function(it){
        var rec=byName[it.name.toLowerCase()]; var p=priceOf(rec);
        var input=$('pr-'+it.id);
        if(p!=null){price[it.id]=p;live[it.id]=true;input.value=Math.round(p);input.classList.add('live');hit++;}
        else{miss.push(it.name);}
      });
      var gymN=data.gyms?populateGyms(data.gyms):0;
      calc();
      var msg=hit+' price'+(hit===1?'':'s')+' loaded'+(gymN?' · '+gymN+' gyms':'')+(miss.length?' · unmatched: '+miss.join(', '):'')+' · '+new Date().toLocaleTimeString();
      setStatus(msg, hit?'ok':'err');
    }catch(err){
      setStatus('Could not reach the Torn API ('+(err&&err.message?err.message:'network/CORS')+'). Check the key and your connection.','err');
    }
  });
  $('forget').addEventListener('click',function(){
    try{localStorage.removeItem('tornApiKey');}catch(e){}
    $('apikey').value='';
    ITEMS.forEach(function(it){if(live[it.id]){price[it.id]=null;live[it.id]=false;var i=$('pr-'+it.id);i.value='';i.classList.remove('live');}});
    calc();setStatus('Key removed from this browser.','');
  });

  // ---- gyms ----
  var gymsData=null;
  var STATNAME={str:'strength',spd:'speed',dex:'dexterity',def:'defense'};
  function populateGyms(gyms){
    gymsData=gyms; var sel=$('p-gym'); sel.innerHTML='<option value="">— pick a gym —</option>';
    var ids=Object.keys(gyms).sort(function(a,b){var ga=gyms[a],gb=gyms[b];return (ga.energy||0)-(gb.energy||0)||String(ga.name).localeCompare(String(gb.name));});
    var n=0;
    ids.forEach(function(id){var g=gyms[id]; if(!g||!g.name)return;
      function d(x){return x?(x/10).toFixed(1):'–';}
      var o=document.createElement('option'); o.value=id;
      o.textContent=g.name+' · '+d(g.strength)+'/'+d(g.speed)+'/'+d(g.defense)+'/'+d(g.dexterity)+' · '+(g.energy||'?')+'e';
      sel.appendChild(o); n++;});
    return n;
  }
  function applyGymDots(){
    if(!gymsData) return; var id=$('p-gym').value; if(!id||!gymsData[id]) return;
    var g=gymsData[id], dots=g[STATNAME[$('p-stat').value]];
    if(dots&&dots>0) $('p-dots').value=(dots/10);
    if(g.energy) $('p-e').value=String(g.energy);
  }
  $('p-gym').addEventListener('change',function(){applyGymDots();calc();});
  $('p-stat').addEventListener('change',function(){applyGymDots();calc();});

  // ---- energy quick-adds ----
  Array.prototype.forEach.call($('p-eadd').querySelectorAll('.chip'),function(ch){
    ch.addEventListener('click',function(){
      var add=parseFloat(ch.dataset.add)||0, cur=parseFloat($('p-budget').value)||0;
      $('p-budget').value = add===0 ? 0 : Math.round(cur+add); calc();
    });
  });

  // ---- fetch my profile (custom key) ----
  function perkPct(d,statKey){
    var name=STATNAME[statKey], total=0;
    Object.keys(d).forEach(function(k){
      if(!/_perks$/.test(k)||!Array.isArray(d[k])) return;
      d[k].forEach(function(s){
        if(typeof s!=='string'||!/gym gains/i.test(s)) return;
        var m=s.match(/([+-]?\d+(?:\.\d+)?)\s*%/); if(!m) return;
        var sl=s.toLowerCase(), mentions=/(strength|speed|defense|dexterity)/.test(sl);
        if(!mentions||sl.indexOf(name)>=0) total+=parseFloat(m[1]);
      });
    });
    return Math.round(total*100)/100;
  }
  $('profile').addEventListener('click',async function(){
    var key=$('apikey').value.trim();
    if(!key){setStatus('Enter your API key first.','err');return;}
    try{localStorage.setItem('tornApiKey',key);}catch(e){}
    setStatus('Fetching your profile…','');
    try{
      var res=await fetch('https://api.torn.com/user/?selections=battlestats,bars,gym,perks&key='+encodeURIComponent(key)+'&comment=JumpPlanner');
      var d=await res.json();
      if(d&&d.error){setStatus('Torn API error '+d.error.code+': '+d.error.error+' — profile needs a Custom key with gym + battle-stats access.','err');return;}
      var got=[];
      var total=(typeof d.total==='number')?d.total:((d.strength||0)+(d.speed||0)+(d.defense||0)+(d.dexterity||0));
      if(total>0){$('p-total').value=Math.round(total);got.push('stat total');}
      if(d.happy&&d.happy.maximum){
        var mh=d.happy.maximum, sel=$('p-prop'), ex=document.getElementById('opt-fetched'); if(ex)ex.remove();
        var o=document.createElement('option'); o.id='opt-fetched'; o.value=mh; o.textContent='Your max happy · '+nf.format(mh);
        sel.insertBefore(o,sel.firstChild); o.selected=true; got.push('happy baseline');
      }
      if(d.energy&&typeof d.energy.current==='number'){$('p-budget').value=d.energy.current;got.push('energy');}
      if(d.active_gym){
        if(gymsData&&gymsData[d.active_gym]){$('p-gym').value=String(d.active_gym);applyGymDots();got.push('active gym');}
        else got.push('gym id (fetch prices first to load the gym list)');
      }
      var pk=perkPct(d,$('p-stat').value);
      if(pk>0){$('p-perk').value=pk;got.push('perks '+pk+'%');}
      calc();
      setStatus(got.length?('Loaded '+got.join(', ')+' · '+new Date().toLocaleTimeString()):'Fetched, but nothing to fill — check the key has gym + battle-stats access.', got.length?'ok':'err');
    }catch(err){
      setStatus('Could not reach the Torn API ('+(err&&err.message?err.message:'network/CORS')+').','err');
    }
  });

  recalcMult(); calc();
})();

  });
</script>

<header><div class="wrap">
  <div class="top">
    <div>
      <h1>Torn <em>Jump</em> Planner</h1>
      <p class="sub">Pick your sweets, pull live market prices with your API key, and see happy reached, total stat gain and cost per stat for the jump.</p>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <a class="themed" href="{base}/">← Full guide</a>
      <a class="themed" href="{base}/crimes/">Crimes</a>
      <a class="themed" href="{base}/scripts/">Scripts</a>
      <span class="brandmark">TORN</span>
    </div>
  </div>

  <div class="say trainer">
    <div class="av"><span class="mono-badge">M</span><img src="{base}/assets/trainer.png" alt=""></div>
    <div><div><span class="nm">Rep</span><span class="tag">Coach's Tip</span></div>
      <p class="line">"Fetch your profile, load your gyms, pick your sweets. Then I'll tell you exactly what the jump buys — no guessing, no vibes."</p></div>
  </div>

  <div class="keybar">
    <h3>Live market prices</h3>
    <p class="keynote"><b>Prices</b> need a Limited key. <b>Fetch my profile</b> (stat total, active gym, happy, energy, perks) needs a <b>Custom</b> key with gym + battle-stats access. Your key is stored only in this browser (localStorage) and sent only to <span class="mono">api.torn.com</span>. Create one at <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" rel="noopener">torn.com → Settings → API Key</a>; revoke it there any time.</p>
    <div class="keyrow">
      <input id="apikey" type="password" autocomplete="off" spellcheck="false" placeholder="Paste Limited or Custom API key">
      <button class="btn primary" id="fetch">Save &amp; fetch prices</button>
      <button class="btn ghost" id="profile">Fetch my profile</button>
      <button class="btn ghost" id="forget">Forget key</button>
    </div>
    <div class="status" id="status" role="status" aria-live="polite"></div>
  </div>
</div></header>

<section><div class="wrap">
  <div class="plan-grid">
    <div class="card">
      <h3>Your setup</h3>
      <div class="field" style="margin-top:14px"><label for="p-gym">Gym <span style="text-transform:none;letter-spacing:0;color:var(--faint)">— fetch to populate, sets dots + energy</span></label>
        <select id="p-gym"><option value="">— pick or fetch prices to load gyms —</option></select></div>
      <div class="two">
        <div class="field"><label for="p-prop">Property (happy baseline)</label><select id="p-prop"></select></div>
        <div class="field"><label for="p-stat">Stat to train</label>
          <select id="p-stat"><option value="str">Strength</option><option value="spd">Speed</option><option value="dex">Dexterity</option><option value="def">Defense</option></select></div>
      </div>
      <div class="two">
        <div class="field"><label for="p-total">Current stat total</label><input id="p-total" type="number" min="0" value="1000000" inputmode="numeric"></div>
        <div class="field"><label for="p-dots">Gym dots (API ÷10)</label><input id="p-dots" type="number" min="0.1" step="0.1" value="7.3" inputmode="decimal"></div>
      </div>
      <div class="two">
        <div class="field"><label for="p-e">Energy / train</label><select id="p-e"><option>5</option><option selected>10</option><option>25</option><option>50</option></select></div>
        <div class="field"><label for="p-budget">Energy to spend</label><input id="p-budget" type="number" min="0" step="10" value="1000" inputmode="numeric"></div>
      </div>
      <div class="chips" style="margin:-4px 0 13px" id="p-eadd">
        <button class="chip" data-add="250" type="button">+ Xanax 250</button>
        <button class="chip" data-add="150" type="button">+ Refill 150</button>
        <button class="chip" data-add="30" type="button">+ Drink 30</button>
        <button class="chip" data-add="0" type="button">reset</button>
      </div>
      <div class="two">
        <div class="field"><label for="p-perk">Gym-gain perks (%)</label><input id="p-perk" type="number" min="0" step="1" value="20" inputmode="numeric"></div>
        <div class="field"><label for="p-cd">Cooldown reduction</label>
          <select id="p-cd"><option value="1">None</option><option value="0.9">Fast Metabolism −10%</option><option value="0.75">Professional −25%</option><option value="0.675">Both −32.5%</option></select></div>
      </div>
      <div class="field" style="margin-bottom:0"><label>Candy happy multipliers</label>
        <div class="chips" id="p-mults">
          <button class="chip" data-mult="3" aria-pressed="false">World Diabetes Day ×3</button>
          <button class="chip" data-mult="2" aria-pressed="false">Book ×2</button>
          <button class="chip" data-mult="1.5" aria-pressed="false">Voracity ×1.5</button>
          <button class="chip" data-mult="1.1" aria-pressed="false">Absorption ×1.1</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Your sweets &amp; items</h3>
      <div class="price-hint">qty · price each ($)</div>
      <div class="items" id="p-items" style="margin-top:6px"></div>
      <div class="field" style="margin-top:14px;margin-bottom:0"><label>Multiplier (applied to current happy)</label>
        <div class="chips"><button class="chip" id="p-xtc" aria-pressed="false">Ecstasy ×2 (doubles happy)</button></div>
      </div>
    </div>
  </div>

  <div class="results">
    <div class="tile accent"><div class="k">Happy reached</div><div class="v" id="r-happy">—</div><div class="sub" id="r-happy-sub">from baseline</div></div>
    <div class="tile"><div class="k">Total stat gain</div><div class="v" id="r-gain">—</div><div class="sub" id="r-gain-sub">over the dump</div></div>
    <div class="tile"><div class="k">Gain / energy</div><div class="v" id="r-per">—</div><div class="sub">this jump</div></div>
    <div class="tile"><div class="k">Booster cooldown</div><div class="v" id="r-cd">—</div><div class="sub">added by candy</div></div>
    <div class="tile"><div class="k">Trains</div><div class="v" id="r-trains">—</div><div class="sub" id="r-trains-sub">at your energy/train</div></div>
    <div class="tile"><div class="k">Cost / stat</div><div class="v" id="r-cost">—</div><div class="sub" id="r-cost-sub">fetch or type prices</div></div>
  </div>

  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div><div><span class="nm">Ledger</span><span class="tag">Worth the Cost?</span></div>
      <p class="line">"Read cost-per-stat, not the sticker price. Cheap and inexpensive aren't the same thing — buy the happy that returns the most."</p></div>
  </div>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:10px">
    <span class="brandmark" style="color:var(--ink)">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">CRIME PAYS · PROGRESS LASTS</span>
  </div>
  <strong>Torn Jump Planner.</strong> Gains use the accepted Training Formula V2.0 (Vladar); happy decays ~50% of energy spent per train and randomness is excluded, so the gain is an expected value.
  <div class="disclaim"><span>ℹ️</span><span>Prices come from each item's Torn <span class="mono">market_value</span> (a market average, not the single lowest listing). Item names are matched against the live item list, so a renamed or unmatched item stays blank. This tool talks only to api.torn.com; nothing else leaves your browser.</span></div>
</div></footer>
