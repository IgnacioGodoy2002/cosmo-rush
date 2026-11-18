// Extensions for the supplied Pengu Rush 1.7.1 compiled build.
const pilots=['mapache','capibara','tucan','suri'];
const pilotNamesByLocale={es:['Mapache','Capibara','Tucán','Suri'],en:['Raccoon','Capybara','Toucan','Suri'],pt:['Guaxinim','Capivara','Tucano','Suri']};
let selectedPilot='mapache';
try {const saved=localStorage.getItem('pengu-pilot');if(pilots.includes(saved))selectedPilot=saved;}catch{}
const originalBootPreload=se.prototype.preload;
se.prototype.preload=function(){originalBootPreload.call(this);this.load.image('player-armed','assets/player/mapache.png');for(const pilot of pilots){this.load.image(pilot,`assets/player/${pilot==='suri'?'suri-v2':pilot}.png`);this.load.image(`${pilot}-wave`,`assets/player/${pilot==='suri'?'suri-v2':pilot}-wave.png`);this.load.image(`${pilot}-rear`,`assets/player/${pilot}-rear.png`);this.load.image(`${pilot}-rear-wave`,`assets/player/${pilot}-rear-wave.png`);}};
$e.prototype.create=function(){
 const locale=Me.getLocale();
 const pilotNames=pilotNamesByLocale[locale]||pilotNamesByLocale.es;
 this.isStartingGame=false;this.onSuraEvent=null;this.recordScoreText=null;
 const {width:w,height:h}=this.scale;
 this.cameras.main.setBackgroundColor('#061226');this.tryPlayMenuMusic();this.buildStars(w,h);
 const s=Math.min(w/720,h/1280),root=this.add.container(w/2,h/2).setScale(s);
 const add=o=>{root.add(o);return o;};
 const txt=(x,y,text,size,color='#ffffff')=>add(this.add.text(x,y,text,{fontFamily:'Lilita One, Arial Black, Arial',fontSize:size+'px',fontStyle:'normal',color,align:'center',stroke:'#041024',strokeThickness:2,shadow:{offsetX:0,offsetY:2,color:'#041024',blur:0,fill:true,stroke:false}}).setOrigin(.5));
 const panel=add(this.add.graphics());panel.fillStyle(0x091b36,.95).fillRoundedRect(-338,-630,676,1260,30);panel.lineStyle(2,0x29c9eb,.4).strokeRoundedRect(-338,-630,676,1260,30);
 txt(0,-530,'COSMO RUSH',66,'#fff0c8').setStroke('#122545',8).setShadow(0,5,'#000916',0,true,true);
 for(const [i,locale] of ['es','en','pt'].entries()){
  const chip=txt((i-1)*90,605,locale.toUpperCase(),26,Me.getLocale()===locale?'#65ebff':'#849bb7').setInteractive({useHandCursor:true});
  chip.on('pointerdown',()=>{Me.setLocale(locale);this.scene.restart();});
 }
 const mute=txt(267,-530,Y.isMuted?'♪ OFF':'♪ ON',26,'#9db8d3').setInteractive({useHandCursor:true});mute.on('pointerdown',()=>mute.setText(Y.toggleMute()?'♪ OFF':'♪ ON'));
 const ship=add(this.add.image(0,-350,selectedPilot).setDisplaySize(238,238));
 this.tweens.add({targets:ship,y:'+=7',duration:1800,yoyo:true,repeat:-1,ease:'Sine.InOut'});
 const heroName=txt(0,-194,pilotNames[pilots.indexOf(selectedPilot)],32,'#5be6ff');
 txt(0,-138,({es:'ELEGÍ TU PILOTO',en:'CHOOSE YOUR PILOT',pt:'ESCOLHA SEU PILOTO'})[locale]||'ELEGÍ TU PILOTO',26,'#a2bbd4');
 const cards=[];
 for(let i=0;i<4;i++){
  const x=i%2===0?-156:156,y=-66+Math.floor(i/2)*106;
  const bg=add(this.add.rectangle(x,y,286,86,0x102c48).setStrokeStyle(2,0x315775).setInteractive({useHandCursor:true}));
  add(this.add.image(x-93,y,pilots[i]).setDisplaySize(62,62));
  const label=txt(x+36,y,pilotNames[i],26);
  cards.push({bg,label,pilot:pilots[i]});
  bg.on('pointerdown',()=>{selectedPilot=pilots[i];try{localStorage.setItem('pengu-pilot',selectedPilot);}catch{}ship.setTexture(selectedPilot);heroName.setText(pilotNames[i]);refresh();fe.play(this,'sfx-click');});
 }
 const refresh=()=>cards.forEach(c=>{const active=c.pilot===selectedPilot;c.bg.setFillStyle(active?0x10546b:0x102c48).setStrokeStyle(active?4:2,active?0x52e7ff:0x315775);c.label.setColor(active?'#75f1ff':'#edf5ff');});refresh();
 const button=(y,label,color,onClick,height=70,size=32)=>{const bg=add(this.add.rectangle(0,y,570,height,color).setStrokeStyle(2,0x71e7ff,.5).setInteractive({useHandCursor:true}));const text=txt(0,y,label,size);bg.on('pointerdown',onClick);return [bg,text];};
 [this.jugarBg,this.jugarText]=button(197,Q('menu_play'),0x087eaf,()=>this.startGame());
 button(285,Q('menu_how_to_play'),0x172e4c,()=>this.scene.start('InstructionsScene'),58,28);
 txt(-56,127,Q('menu_record_label'),26,'#ffca65');
 this.recordScoreText=txt(175,127,String(ve.load().bestScore),28,'#ffca65');
 txt(0,350,'TOP 3',28,'#ffd879');
 const rankRows=[];
 for(let i=0;i<3;i++){
  const y=397+i*50;
  add(this.add.rectangle(0,y,570,44,0x10253e));
  txt(-262,y,String(i+1),28,['#ffd879','#cbdbe7','#d7a177'][i]);
  const name=txt(-225,y,'…',28,'#c2d5e7').setOrigin(0,.5);
  const score=txt(264,y,'',28,'#ffffff').setOrigin(1,.5);
  rankRows.push({name,score});
 }
 ze().then(entries=>{
  if(!root.active)return;
  for(let i=0;i<3;i++){
   const row=rankRows[i],entry=entries[i];
   if(!entry){row.name.setText('—');continue;}
   row.score.setText(Number(entry.score).toLocaleString());
   const maxNameWidth=Math.min(365,465-row.score.width);
   let alias=String(entry.alias);
   row.name.setText(alias);
   while(row.name.width>maxNameWidth&&alias.length>1){alias=alias.slice(0,-1);row.name.setText(alias+'…');}
   row.name.setColor(entry.isCurrentPlayer?'#65ebff':'#c2d5e7');
  }
 }).catch(()=>{if(root.active)for(const row of rankRows)row.name.setText('—');});
 const ranking=add(this.add.rectangle(0,550,420,44,0x173552).setStrokeStyle(1,0x315775).setInteractive({useHandCursor:true}));
 txt(0,550,Q('leaderboard_view_ranking'),26,'#86bad3');
 ranking.on('pointerdown',()=>this.scene.start('LeaderboardScene'));

 this.time.addEvent({delay:6500,loop:true,callback:()=>{ship.setTexture(selectedPilot+'-wave');this.time.delayedCall(1500,()=>ship.active&&ship.setTexture(selectedPilot));}});
 this.setupSuraIntegration();
 this.events.once(q.Scenes.Events.SHUTDOWN,()=>{if(this.onSuraEvent)try{Ie().unsubscribe(this.onSuraEvent);}catch{}});
};
zt.prototype.preload=function(){};
const originalGameCreate=zt.prototype.create;
zt.prototype.create=function(){
 originalGameCreate.call(this);
 this.player.setTexture(selectedPilot+'-rear').setDisplaySize(244,244);
 this.player.body.setSize(512,512).updateFromGameObject();
 this.pilotWaveClock=0;this.thruster?.updateAnchor();
 this.time.addEvent({delay:9000,loop:true,callback:()=>{if(this.gameOver||this.paused)return;this.player.setTexture(selectedPilot+'-rear-wave');this.time.delayedCall(1500,()=>{if(this.player.active&&!this.gameOver)this.player.setTexture(selectedPilot+'-rear');});}});
};
// Keep original collisions, score handling, audio and host integration.
// Fit portrait phones to their actual height; desktop has a wider playfield.
function responsiveGameSize(){
 const w=document.getElementById('app').clientWidth,h=document.getElementById('app').clientHeight;
 const ratio=w/h;
 return w>=768?{width:Math.min(1120,Math.max(900,1280*ratio)),height:1280}:{width:720,height:Math.max(1280,720/ratio)};
}
Object.assign(ce,responsiveGameSize());

kt.prototype.updateAnchor=function(){
 if(!this.emitters)return;
 const a=pilotExhaust[this.player.texture.key]||{x:0,y:.46};
 const x=this.player.displayWidth*a.x,y=this.player.displayHeight*a.y;
 this.emitters.cyan.startFollow(this.player,x,y+3);
 this.emitters.orange.startFollow(this.player,x,y);
 this.emitters.anchor?.setPosition(this.player.x+x,this.player.y+y);
};

const pilotExhaust={"mapache-rear":{"x":0.0003,"y":0.3608},"capibara-rear":{"x":-0.0011,"y":0.3617},"tucan-rear":{"x":0.0024,"y":0.3601},"suri-rear":{"x":-0.0001,"y":0.3604},"mapache-rear-wave":{"x":0.0008,"y":0.3619},"capibara-rear-wave":{"x":-0.0005,"y":0.3612},"tucan-rear-wave":{"x":0.0007,"y":0.36},"suri-rear-wave":{"x":-0.0001,"y":0.3602}};
