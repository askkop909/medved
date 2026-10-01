/* ============================================================
   МЕДВЕЖИЙ РУЧЕЙ — v2.7 · standalone JavaScript
   ============================================================ */
(function(){
'use strict';

/* ==================== 1. CSS ==================== */
const _CSS = `
*{margin:0;padding:0;box-sizing:border-box;user-select:none;}
html,body{width:100%;height:100%;overflow:hidden;background:#000;}
body{font-family:'Courier New',Consolas,monospace;color:#b9b9b9;cursor:crosshair;}
canvas{display:block;position:fixed;inset:0;}
#hud{position:fixed;inset:0;pointer-events:none;z-index:10;}
#hud.hidden{display:none;}
.panel{position:absolute;background:rgba(6,8,7,.72);border:1px solid rgba(120,130,110,.28);backdrop-filter:blur(2px);padding:9px 12px;font-size:12px;letter-spacing:.5px;box-shadow:0 0 22px rgba(0,0,0,.85) inset;}
#brainPanel{position:absolute;left:18px;bottom:172px;width:120px;height:128px;background:rgba(6,8,7,.82);border:1px solid rgba(120,130,110,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 4px 4px;box-shadow:0 0 22px rgba(0,0,0,.85),0 0 26px rgba(120,60,160,.10) inset;transition:border-color .3s,box-shadow .3s;}
#brainPanel.critical{border-color:rgba(180,40,40,.75);box-shadow:0 0 22px rgba(0,0,0,.85),0 0 26px rgba(180,40,40,.28) inset,0 0 18px rgba(180,40,40,.4);animation:brainShake .35s infinite;}
@keyframes brainShake{0%,100%{transform:translate(0,0);}25%{transform:translate(-1px,1px);}75%{transform:translate(1px,-1px);}}
#brainPanel .brainLbl{font-size:9px;color:#7d8a72;letter-spacing:2px;margin-bottom:2px;}
#brainCanvas{display:block;}
#brainPct{font-size:14px;color:#a05fd6;letter-spacing:1px;font-weight:bold;text-shadow:0 0 10px rgba(160,95,214,.6);margin-top:3px;transition:color .3s;}
#brainPanel.critical #brainPct{color:#e06060;text-shadow:0 0 12px rgba(220,60,60,.9);animation:brainPulse .7s infinite;}
@keyframes brainPulse{50%{opacity:.5;transform:scale(1.08);}}
#bars{left:18px;bottom:18px;width:238px;}
.bar{margin-bottom:7px;}
.bar:last-child{margin-bottom:0;}
.bar .lbl{display:flex;justify-content:space-between;font-size:10px;color:#7d8a72;margin-bottom:3px;letter-spacing:1px;}
.bar .track{height:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);position:relative;overflow:hidden;}
.bar .fill{height:100%;width:100%;transition:width .18s linear;}
#hpFill{background:linear-gradient(90deg,#7a1414,#c92a2a);}
#stFill{background:linear-gradient(90deg,#1f5c3a,#37b06b);}
#btFill{background:linear-gradient(90deg,#8a6a12,#e0b93a);}
#snFill{background:linear-gradient(90deg,#4a2a6a,#a05fd6);}
.low .fill{animation:blink .55s infinite;}
@keyframes blink{50%{opacity:.28;}}
#objPanel{right:18px;top:220px;left:auto;width:300px;}
#objPanel h3{font-size:11px;color:#8b6b3a;letter-spacing:2px;margin-bottom:8px;font-weight:normal;border-bottom:1px solid rgba(139,107,58,.3);padding-bottom:5px;}
.obj{font-size:11.5px;line-height:1.5;color:#6f7a68;margin-bottom:4px;padding-left:16px;position:relative;}
.obj:before{content:'○';position:absolute;left:0;color:#4a5544;}
.obj.done{color:#4a5a48;text-decoration:line-through;}
.obj.done:before{content:'●';color:#3f8a4f;}
.obj.active{color:#d8cba8;}
.obj.active:before{content:'▶';color:#c9a227;animation:pulse 1.4s infinite;}
@keyframes pulse{50%{opacity:.35;}}
#infoPanel{right:18px;top:18px;width:186px;text-align:right;}
#infoPanel .row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;color:#889078;}
#infoPanel .row b{color:#c4bfa6;font-weight:normal;}
#minimap{position:absolute;right:18px;bottom:18px;width:180px;height:180px;background:rgba(4,6,5,.85);border:1px solid rgba(120,130,110,.35);box-shadow:0 0 22px rgba(0,0,0,.85);}
#minimapLbl{position:absolute;right:18px;bottom:202px;font-size:9px;color:#5c6455;letter-spacing:2px;background:rgba(4,6,5,.85);padding:2px 6px;border:1px solid rgba(120,130,110,.2);}
#flashlightIcon{position:absolute;right:18px;bottom:250px;width:68px;height:68px;border-radius:50%;padding:3px;background:conic-gradient(#e0c86a 0% 100%,rgba(255,255,255,.08) 100% 100%);box-shadow:0 0 18px rgba(0,0,0,.9),0 0 14px rgba(200,180,100,.12);pointer-events:none;transition:box-shadow .25s;}
#flashlightIcon .fl-inner{width:100%;height:100%;border-radius:50%;background:rgba(6,8,7,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(120,130,110,.35);}
#flashlightIcon .fl-emoji{font-size:20px;line-height:1;margin-bottom:1px;filter:drop-shadow(0 0 4px rgba(255,220,120,.8));transition:filter .2s,opacity .2s;}
#flashlightIcon .fl-pct{font-size:10px;letter-spacing:1px;color:#e0c86a;font-weight:bold;}
#flashlightIcon.off .fl-emoji{filter:grayscale(1) brightness(.35);}
#flashlightIcon.off .fl-pct{color:#6d7560;}
#flashlightIcon.low .fl-inner{animation:flBlink .55s infinite;border-color:rgba(220,60,60,.6);}
@keyframes flBlink{50%{opacity:.45;}}
#prompt{position:absolute;left:50%;bottom:118px;transform:translateX(-50%);background:rgba(8,10,9,.85);border:1px solid rgba(180,160,90,.45);padding:8px 18px;font-size:13px;color:#e2d9b8;letter-spacing:1px;display:none;white-space:nowrap;box-shadow:0 0 24px rgba(0,0,0,.9);}
#prompt .key{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 7px;margin-right:7px;color:#e8dca8;}
#messages{position:absolute;left:50%;top:74px;transform:translateX(-50%);width:560px;text-align:center;}
.msg{font-size:12.5px;color:#cbbf94;background:rgba(8,10,8,.75);border-left:2px solid #8a6a2a;padding:6px 14px;margin-bottom:6px;letter-spacing:.6px;animation:msgIn .35s ease;}
@keyframes msgIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}
#cross{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border:1px solid rgba(200,200,180,.4);border-radius:50%;}
#staminaBar{position:absolute;left:50%;bottom:36px;transform:translateX(-50%);width:340px;height:20px;background:rgba(6,8,7,.78);border:1px solid rgba(120,130,110,.4);box-shadow:0 0 22px rgba(0,0,0,.85),0 0 14px rgba(60,180,90,.08) inset;overflow:hidden;opacity:0;transition:opacity .35s;}
#staminaBar.visible{opacity:1;}
#staminaBar.low{border-color:rgba(220,60,60,.7);box-shadow:0 0 22px rgba(0,0,0,.85),0 0 14px rgba(220,60,60,.25) inset;}
#staminaBar .sb-fill{height:100%;width:100%;background:linear-gradient(90deg,#1f5c3a,#37b06b);transition:width .1s linear,background .2s;}
#staminaBar.low .sb-fill{background:linear-gradient(90deg,#7a1414,#c92a2a);}
#staminaBar .sb-lbl{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:10px;letter-spacing:3px;color:rgba(255,255,255,.55);text-shadow:0 0 4px rgba(0,0,0,.9);pointer-events:none;}
#staminaBar.exhausted .sb-fill{animation:sbFlash .35s infinite;}
@keyframes sbFlash{50%{opacity:.4;}}
#bossBar{position:absolute;left:50%;top:60px;transform:translateX(-50%);width:560px;display:none;pointer-events:none;z-index:12;text-align:center;}
#bossBar.on{display:block;animation:bossIn .5s ease;}
@keyframes bossIn{from{opacity:0;transform:translate(-50%,-20px);}to{opacity:1;transform:translate(-50%,0);}}
#bossBar .bb-name{font-size:14px;letter-spacing:8px;color:#e06060;text-shadow:0 0 14px rgba(220,60,60,.85);margin-bottom:6px;font-weight:normal;}
#bossBar .bb-track{height:16px;background:rgba(0,0,0,.88);border:1px solid rgba(200,60,60,.6);box-shadow:0 0 24px rgba(180,20,20,.5) inset;position:relative;overflow:hidden;}
#bossBar .bb-fill{height:100%;width:100%;background:linear-gradient(90deg,#5a1010,#c92a2a,#e06060);transition:width .28s ease;}
#bossBar.stage2 .bb-fill{background:linear-gradient(90deg,#c92a2a,#ff4040,#ff8080);animation:bossPulse .55s infinite;}
@keyframes bossPulse{50%{opacity:.72;}}
#bossBar.stage2 .bb-track{border-color:rgba(255,80,80,.9);box-shadow:0 0 24px rgba(255,40,40,.7) inset;}
#bossBar .bb-stage{font-size:10px;letter-spacing:5px;color:#c9a227;margin-top:5px;}
#bossBar.stage2 .bb-stage{color:#e06060;animation:bossStageBlink .6s infinite;}
@keyframes bossStageBlink{50%{opacity:.4;}}
#bossHint{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:rgba(8,10,9,.9);border:1px solid rgba(200,60,60,.5);padding:8px 18px;font-size:12px;color:#e8c8a8;letter-spacing:1.5px;display:none;pointer-events:none;z-index:12;box-shadow:0 0 22px rgba(120,0,0,.5);}
#bossHint.on{display:block;}
#hideMinigame{position:fixed;left:50%;top:52%;transform:translate(-50%,-50%);width:600px;max-width:92vw;background:rgba(6,8,7,.96);border:1px solid rgba(180,160,90,.55);padding:16px 24px 14px;box-shadow:0 0 46px rgba(0,0,0,.98),0 0 26px rgba(120,80,40,.22) inset;display:none;z-index:28;pointer-events:none;}
#hideMinigame.on{display:block;animation:hmIn .3s ease;}
@keyframes hmIn{from{opacity:0;transform:translate(-50%,calc(-50% + 14px));}to{opacity:1;transform:translate(-50%,-50%);}}
#hideMinigame.bearNear{border-color:rgba(220,40,40,.9);box-shadow:0 0 46px rgba(0,0,0,.98),0 0 30px rgba(220,40,40,.45) inset,0 0 24px rgba(220,40,40,.45);animation:hmShake .18s infinite;}
@keyframes hmShake{0%,100%{transform:translate(-50%,-50%);}50%{transform:translate(calc(-50% + 2px),calc(-50% + 1px));}}
.hm-title{font-size:13px;letter-spacing:7px;color:#e0c86a;text-align:center;margin-bottom:8px;font-weight:normal;}
.hm-title .warn{color:#e06060;font-weight:bold;animation:hmWarn .6s infinite;}
@keyframes hmWarn{50%{opacity:.4;}}
.hm-hint{font-size:10.5px;letter-spacing:2px;color:#7d8a72;text-align:center;margin-top:10px;}
.hm-hint .k{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 6px;color:#e8dca8;margin:0 2px;}
.hm-stats{display:flex;justify-content:space-around;margin-top:10px;font-size:11px;color:#889078;letter-spacing:2px;}
.hm-stats b{color:#c4bfa6;font-weight:normal;}
.hm-stats .hit b{color:#7fd68a;}
.hm-stats .miss b{color:#e06060;}
#escapeMinigame{position:fixed;left:50%;top:52%;transform:translate(-50%,-50%);width:600px;max-width:92vw;background:rgba(6,8,7,.96);border:1px solid rgba(180,160,90,.55);padding:16px 24px 14px;box-shadow:0 0 46px rgba(0,0,0,.98),0 0 26px rgba(120,80,40,.22) inset;display:none;z-index:29;pointer-events:none;}
#escapeMinigame.on{display:block;animation:hmIn .3s ease;}
#escapeMinigame.danger{border-color:rgba(220,40,40,.9);box-shadow:0 0 46px rgba(0,0,0,.98),0 0 30px rgba(220,40,40,.45) inset;}
.em-title{font-size:13px;letter-spacing:7px;color:#e0c86a;text-align:center;margin-bottom:8px;font-weight:normal;}
.em-hint{font-size:10.5px;letter-spacing:2px;color:#7d8a72;text-align:center;margin-top:10px;}
.em-hint .k{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 6px;color:#e8dca8;margin:0 2px;}
#fuelMinigame{position:fixed;left:50%;top:52%;transform:translate(-50%,-50%);display:none;z-index:29;pointer-events:none;max-width:96vw;max-height:96vh;}
#fuelMinigame.on{display:block;}
#fuelMinigame .fm-wrap{background:rgba(6,8,7,.96);border:1px solid rgba(180,160,90,.55);padding:14px 20px 10px;box-shadow:0 0 46px rgba(0,0,0,.98),0 0 26px rgba(120,80,40,.22) inset;max-width:96vw;max-height:96vh;box-sizing:border-box;animation:fuelPanelIn .3s ease;}
@keyframes fuelPanelIn{from{opacity:0;transform:scale(0.94);}to{opacity:1;transform:scale(1);}}
#fuelMinigame.danger .fm-wrap{border-color:rgba(220,40,40,.9);box-shadow:0 0 46px rgba(0,0,0,.98),0 0 30px rgba(220,40,40,.45) inset;}
#fuelMinigame .fm-hint{font-size:10.5px;letter-spacing:2px;color:#7d8a72;text-align:center;margin-top:6px;}
#fuelMinigame .fm-hint .k{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 6px;color:#e8dca8;margin:0 2px;}
#fuelCanvas{max-width:100%;height:auto;display:block;}
#lockpickMinigame{position:fixed;left:50%;top:52%;transform:translate(-50%,-50%);background:rgba(6,8,7,.96);border:1px solid rgba(180,160,90,.55);padding:14px 20px 12px;box-shadow:0 0 46px rgba(0,0,0,.98),0 0 26px rgba(120,80,40,.22) inset;display:none;z-index:29;pointer-events:none;max-width:96vw;max-height:96vh;box-sizing:border-box;animation:fuelPanelIn .3s ease;}
#lockpickMinigame.on{display:block;}
#lockpickMinigame.fail{border-color:rgba(220,40,40,.9);box-shadow:0 0 46px rgba(0,0,0,.98),0 0 30px rgba(220,40,40,.45) inset;}
.lp-title{font-size:13px;letter-spacing:6px;color:#e0c86a;text-align:center;margin-bottom:8px;font-weight:normal;}
.lp-hint{font-size:10.5px;letter-spacing:2px;color:#7d8a72;text-align:center;margin-top:8px;}
.lp-hint .k{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 6px;color:#e8dca8;margin:0 2px;}
#lpCanvas{display:block;margin:0 auto;max-width:100%;height:auto;border:1px solid rgba(120,130,110,.35);background:#0a0c0a;}
#tumblerMinigame{position:fixed;left:50%;top:52%;transform:translate(-50%,-50%);background:rgba(6,8,7,.96);border:1px solid rgba(180,160,90,.55);padding:14px 20px 12px;box-shadow:0 0 46px rgba(0,0,0,.98),0 0 26px rgba(120,80,40,.22) inset;display:none;z-index:29;pointer-events:none;max-width:96vw;max-height:96vh;box-sizing:border-box;animation:fuelPanelIn .3s ease;}
#tumblerMinigame.on{display:block;}
#tumblerMinigame.fail{border-color:rgba(220,40,40,.9);box-shadow:0 0 46px rgba(0,0,0,.98),0 0 30px rgba(220,40,40,.45) inset;}
.tb-title{font-size:13px;letter-spacing:6px;color:#e0c86a;text-align:center;margin-bottom:8px;font-weight:normal;}
.tb-hint{font-size:10.5px;letter-spacing:2px;color:#7d8a72;text-align:center;margin-top:8px;}
.tb-hint .k{display:inline-block;background:#2a2a20;border:1px solid #6b6b4a;border-radius:3px;padding:1px 6px;color:#e8dca8;margin:0 2px;}
#tbCanvas{display:block;margin:0 auto;max-width:100%;height:auto;border:1px solid rgba(120,130,110,.35);background:#0a0c0a;}
#inv{position:fixed;inset:0;background:rgba(2,3,3,.93);z-index:30;display:none;flex-direction:column;align-items:center;justify-content:center;}
#inv.show{display:flex;}
#inv h2{font-size:20px;letter-spacing:8px;color:#9a8f6a;margin-bottom:6px;font-weight:normal;}
#inv .sub{font-size:11px;color:#5c6455;letter-spacing:3px;margin-bottom:26px;}
#invGrid{display:grid;grid-template-columns:repeat(5,132px);gap:12px;}
.invSlot{height:112px;border:1px solid rgba(120,130,110,.22);background:rgba(255,255,255,.02);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;text-align:center;}
.invSlot .ic{font-size:26px;margin-bottom:8px;filter:grayscale(.3);}
.invSlot .nm{font-size:10.5px;color:#a89f80;line-height:1.3;}
.invSlot .ct{font-size:10px;color:#6d7560;margin-top:4px;}
.invSlot.empty{opacity:.22;}
#invHint{margin-top:26px;font-size:11px;color:#5c6455;letter-spacing:2px;}
.invSlot.noteSlot{cursor:pointer;border-color:rgba(201,181,122,.55);background:rgba(201,181,122,.06);}
.invSlot.noteSlot:hover{background:rgba(201,181,122,.16);}
.invSlot.useSlot{cursor:pointer;border-color:rgba(127,214,138,.5);background:rgba(127,214,138,.05);}
.invSlot.useSlot:hover{background:rgba(127,214,138,.16);border-color:rgba(127,214,138,.85);box-shadow:0 0 14px rgba(127,214,138,.25) inset;}
.invSlot.useSlot:active{transform:scale(.97);}
#noteView{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:35;display:none;align-items:center;justify-content:center;}
#noteView.show{display:flex;}
.notePaper{width:640px;max-width:90vw;background:#1a1810;border:1px solid #4a4230;padding:34px 40px;box-shadow:0 0 70px rgba(0,0,0,1);position:relative;}
.notePaper:before{content:'';position:absolute;inset:6px;border:1px solid rgba(120,110,70,.14);pointer-events:none;}
.notePaper h3{color:#c9b57a;font-size:15px;letter-spacing:2px;margin-bottom:18px;font-weight:normal;}
.notePaper p{color:#a89f80;font-size:13px;line-height:1.85;white-space:pre-wrap;font-family:'Courier New',monospace;}
.notePaper .hint{margin-top:24px;font-size:10px;color:#5c6455;letter-spacing:2px;text-align:right;}
#mapView{position:fixed;inset:0;background:rgba(2,3,3,.97);z-index:36;display:none;align-items:center;justify-content:center;flex-direction:column;padding:8px;box-sizing:border-box;}
#mapView.show{display:flex;}
#mapCanvas{background:#08090a;border:2px solid #4a4230;box-shadow:0 0 70px rgba(0,0,0,1);display:block;}
#mapTitle{color:#c9b57a;font-size:13px;letter-spacing:6px;margin-bottom:8px;font-family:'Courier New',monospace;}
#mapHint{color:#5c6455;font-size:11px;letter-spacing:3px;margin-top:6px;font-family:'Courier New',monospace;}
#mapLegend{margin-top:8px;display:flex;gap:32px;font-size:11px;color:#889078;font-family:'Courier New',monospace;flex-wrap:wrap;justify-content:center;}
#mapLegend span b{color:#e0c86a;font-weight:normal;}
.screen{position:fixed;inset:0;z-index:40;display:none;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,#0d0f0c 0%,#000 78%);}
.screen.show{display:flex;}
#title h1{font-size:56px;letter-spacing:18px;color:#8a2626;text-shadow:0 0 42px rgba(160,30,30,.55);font-weight:normal;}
#title .sub{font-size:12px;letter-spacing:9px;color:#5c6455;margin-top:12px;}
#title .lore{max-width:620px;text-align:center;font-size:12.5px;line-height:1.95;color:#6d7560;margin-top:26px;}
.btn{margin-top:16px;padding:13px 52px;background:transparent;border:1px solid #6b4a2a;color:#d8c48a;font-family:inherit;font-size:14px;letter-spacing:5px;cursor:pointer;transition:.22s;}
.btn:hover{background:#2a1c0e;color:#f0dca8;box-shadow:0 0 26px rgba(180,120,40,.35);}
.btn.small{margin-top:12px;padding:9px 28px;font-size:10px;letter-spacing:3px;}
#saveStatus{position:absolute;left:50%;bottom:32px;transform:translateX(-50%);font-size:10px;letter-spacing:2px;color:#7fd68a;opacity:0;transition:opacity .3s;z-index:70;pointer-events:none;}
#title .ctrl{margin-top:20px;display:grid;grid-template-columns:repeat(4,auto);gap:7px 26px;font-size:11px;color:#5c6455;}
#title .ctrl b{color:#9a8f6a;font-weight:normal;}
#slots,#achievements,#settings{background:radial-gradient(ellipse at center,#0d0f0c 0%,#000 78%);}
#slots h1,#achievements h1,#settings h1{font-size:32px;letter-spacing:12px;color:#9a8f6a;margin-bottom:8px;font-weight:normal;}
#slots .sub,#achievements .sub,#settings .sub{font-size:11px;letter-spacing:4px;color:#5c6455;margin-bottom:32px;}
#slotsGrid{display:grid;grid-template-columns:repeat(2,340px);gap:14px;}
.slotCard{height:150px;border:1px solid rgba(120,130,110,.35);background:rgba(255,255,255,.02);padding:14px 18px;cursor:pointer;transition:.2s;position:relative;display:flex;flex-direction:column;justify-content:space-between;}
.slotCard:hover{border-color:rgba(201,162,39,.85);background:rgba(201,162,39,.06);box-shadow:0 0 22px rgba(180,120,40,.25);}
.slotCard .slotNum{font-size:10px;letter-spacing:3px;color:#7d8a72;}
.slotCard .slotName{font-size:16px;letter-spacing:3px;color:#d8c48a;margin-top:6px;margin-bottom:8px;}
.slotCard.empty .slotName{color:#5c6455;}
.slotCard .slotInfo{font-size:11px;line-height:1.7;color:#889078;letter-spacing:.5px;}
.slotCard .slotDel{position:absolute;right:10px;top:10px;font-size:10px;color:#7a3a3a;letter-spacing:2px;opacity:0;transition:.2s;padding:2px 6px;border:1px solid transparent;cursor:pointer;}
.slotCard:hover .slotDel{opacity:1;}
.slotCard .slotDel:hover{color:#e06060;border-color:rgba(220,60,60,.5);}
#achList{display:grid;grid-template-columns:repeat(2,340px);gap:10px;max-height:60vh;overflow:auto;padding-right:6px;}
.ach{display:flex;gap:12px;align-items:flex-start;padding:10px 14px;border:1px solid rgba(120,130,110,.22);background:rgba(255,255,255,.02);font-size:11.5px;}
.ach.locked{opacity:.35;}
.ach .achIcon{font-size:22px;filter:grayscale(.85);}
.ach.unlocked .achIcon{filter:none;}
.ach .achTxt b{display:block;color:#d8c48a;font-weight:normal;font-size:12px;margin-bottom:3px;letter-spacing:1px;}
.ach.unlocked .achTxt b{color:#e0c86a;}
.ach .achTxt span{color:#889078;line-height:1.4;}
#settingsBox{display:flex;flex-direction:column;gap:20px;width:440px;padding:20px 26px;border:1px solid rgba(120,130,110,.25);background:rgba(255,255,255,.02);}
.settingRow{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#a89f80;letter-spacing:1px;}
.settingRow input[type=range]{width:220px;accent-color:#c9a227;background:transparent;}
.settingRow .val{color:#e0c86a;min-width:48px;text-align:right;font-family:monospace;}
#dead h1{font-size:48px;letter-spacing:14px;color:#8a1a1a;text-shadow:0 0 44px rgba(180,20,20,.6);font-weight:normal;}
#dead .sub{margin-top:16px;font-size:12px;letter-spacing:4px;color:#5c6455;}
#dead .stats{margin-top:30px;font-size:12px;color:#7d8a72;line-height:2;text-align:center;}
#win h1{font-size:44px;letter-spacing:12px;color:#4f9a5a;text-shadow:0 0 44px rgba(60,180,90,.45);font-weight:normal;}
#win .sub{margin-top:16px;font-size:12px;letter-spacing:4px;color:#5c6455;}
#win .stats{margin-top:30px;font-size:12px;color:#7d8a72;line-height:2;text-align:center;}
#pause{background:rgba(0,0,0,.86);}
#pause h1{font-size:34px;letter-spacing:12px;color:#9a8f6a;font-weight:normal;}
#dmg{position:fixed;inset:0;pointer-events:none;z-index:20;opacity:0;background:radial-gradient(ellipse at center,transparent 32%,rgba(150,0,0,.82) 100%);}
#sting{position:fixed;inset:0;pointer-events:none;z-index:21;opacity:0;background:radial-gradient(ellipse at center,transparent 22%,rgba(60,0,0,.9) 100%);}
#hideOverlay{position:fixed;inset:0;pointer-events:none;z-index:19;opacity:0;transition:opacity .3s;background:radial-gradient(ellipse at center,transparent 5%,rgba(0,0,0,.96) 45%);}
#hideOverlay.on{opacity:1;}
#hideOverlay .txt{position:absolute;left:50%;top:80%;transform:translateX(-50%);color:#5c6455;font-size:11px;letter-spacing:3px;font-family:'Courier New',monospace;}
#hideOverlay.on .txt{color:#c9a227;}
#jumpscare{position:fixed;inset:0;z-index:60;pointer-events:none;display:none;background:#000;overflow:hidden;}
#jumpscare.on{display:block;animation:jsShake .08s infinite;}
@keyframes jsShake{0%{transform:translate(0,0) scale(1);}25%{transform:translate(-6px,3px) scale(1.02);}50%{transform:translate(4px,-5px) scale(1.01);}75%{transform:translate(-3px,-2px) scale(1.03);}100%{transform:translate(5px,4px) scale(1);}}
#jumpscare canvas{position:absolute;inset:0;width:100%;height:100%;}
#jumpscare .red{position:absolute;inset:0;background:radial-gradient(circle,#a80000 0%,#000 85%);opacity:.35;mix-blend-mode:multiply;}
#jumpscare .scratch{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,0,0,.05) 0px,transparent 2px,transparent 4px);animation:scr .05s infinite;}
@keyframes scr{50%{transform:translateY(1px);}}
#pulse{position:fixed;inset:0;pointer-events:none;z-index:22;opacity:0;background:radial-gradient(ellipse at center,transparent 20%,rgba(80,0,0,.95) 100%);}
#whisper{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:25;pointer-events:none;font-family:'Courier New',monospace;font-size:22px;letter-spacing:8px;color:#7a1a1a;text-shadow:0 0 20px #8a0000;opacity:0;white-space:nowrap;}
#whisper.on{animation:whisperAnim 1.6s ease;}
@keyframes whisperAnim{0%{opacity:0;transform:translate(-50%,-50%) scale(0.6);}25%{opacity:1;transform:translate(-50%,-50%) scale(1.05);}75%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.4);}}
.hide{display:none !important;}
#horrorVignette{position:fixed;inset:0;pointer-events:none;z-index:9000;background:radial-gradient(circle at 50% 50%,transparent 36%,rgba(0,0,0,.78) 100%);opacity:.72;mix-blend-mode:multiply;transition:opacity .08s;}
#horrorFlash{position:fixed;inset:0;pointer-events:none;z-index:9001;background:rgba(120,0,0,.24);opacity:0;}
`;
const _styleEl = document.createElement('style');
_styleEl.textContent = _CSS;
document.head.appendChild(_styleEl);

/* ==================== 2. HTML ==================== */
document.body.innerHTML = `
<div id="horrorVignette"></div><div id="horrorFlash"></div>
<audio id="soundtrack" loop preload="auto">
  <source src="soundtrack.mp3" type="audio/mpeg">
  <source src="soundtrack.ogg" type="audio/ogg">
  <source src="soundtrack.wav" type="audio/wav">
</audio>
<canvas id="game"></canvas>
<div id="hud" class="hidden">
  <div class="panel" id="objPanel"><h3>ЗАДАЧИ</h3><div id="objList"></div></div>
  <div class="panel" id="infoPanel">
    <div class="row"><span>ФОНАРЬ</span><b id="iFlash">ВКЛ</b></div>
    <div class="row"><span>БАТАРЕИ</span><b id="iBatt">0</b></div>
    <div class="row"><span>АПТЕЧКИ</span><b id="iMed">0</b></div>
    <div class="row"><span>ФАЛЬШФЕЙЕРЫ</span><b id="iFlare">0</b></div>
    <div class="row"><span>ВРЕМЯ</span><b id="iTime">00:00</b></div>
  </div>
  <div id="brainPanel">
    <div class="brainLbl">РАССУДОК</div>
    <canvas id="brainCanvas" width="96" height="76"></canvas>
    <div id="brainPct">100%</div>
  </div>
  <div id="bars">
    <div class="bar" id="hpBar"><div class="lbl"><span>ЗДОРОВЬЕ</span><span id="hpTxt">100</span></div><div class="track"><div class="fill" id="hpFill"></div></div></div>
    <div class="bar" id="btBar"><div class="lbl"><span>ЗАРЯД ФОНАРЯ</span><span id="btTxt">100</span></div><div class="track"><div class="fill" id="btFill"></div></div></div>
    <div class="bar" id="snBar"><div class="lbl"><span>РАССУДОК</span><span id="snTxt">100</span></div><div class="track"><div class="fill" id="snFill"></div></div></div>
  </div>
  <canvas id="minimap" width="180" height="180"></canvas>
  <div id="minimapLbl">КАРТА · [R] ПОЛНАЯ</div>
  <div id="flashlightIcon">
    <div class="fl-inner">
      <div class="fl-emoji">🔦</div>
      <div class="fl-pct" id="flPct">100%</div>
    </div>
  </div>
  <div id="prompt"></div>
  <div id="messages"></div>
  <div id="cross"></div>
  <div id="staminaBar">
    <div class="sb-fill" id="sbFill"></div>
    <div class="sb-lbl" id="sbLbl">ВЫНОСЛИВОСТЬ</div>
  </div>
  <div id="bossBar">
    <div class="bb-name">АЛЬФА · ВЛАДЫКА ЛЕСА</div>
    <div class="bb-track"><div class="bb-fill" id="bossBarFill"></div></div>
    <div class="bb-stage" id="bossStage">СТАДИЯ 1</div>
  </div>
  <div id="bossHint">ЛКМ рядом с Альфой — удар · ЛКМ вдалеке — бросок фальшфейера</div>
</div>
<div id="hideMinigame">
  <div class="hm-title" id="hmTitle">СПОКОЙСЯ</div>
  <canvas id="hmCanvas" width="550" height="100"></canvas>
  <div class="hm-hint">КЛИКАЙ <span class="k">ЛКМ</span> / <span class="k">ПКМ</span> / <span class="k">SPACE</span> В ЗЕЛЁНОЙ ЗОНЕ · <span class="k">E</span> ВЫЙТИ</div>
  <div class="hm-stats"><span class="hit">УДАРЫ: <b id="hmHits">0</b></span><span class="miss">ПРОМАХИ: <b id="hmMisses">0</b></span></div>
</div>
<div id="escapeMinigame">
  <div class="em-title">ВЗЛОМ ЗАМКА</div>
  <canvas id="emCanvas" width="550" height="130"></canvas>
  <div class="em-hint">ЖМИ ПОКАЗАННУЮ КЛАВИШУ ЗА <span class="k">1</span> СЕКУНДУ · <span class="k">10</span> УСПЕХОВ · <span class="k">5</span> ПРОМАХОВ = ЗАНОВО</div>
</div>
<div id="fuelMinigame">
  <div class="fm-wrap">
    <canvas id="fuelCanvas" width="560" height="440"></canvas>
    <div class="fm-hint">КЛИКАЙ ПО РУБИЛЬНИКАМ ЧТОБЫ ПОВТОРИТЬ СХЕМУ · <span class="k">ESC</span> ОТМЕНА</div>
  </div>
</div>
<div id="lockpickMinigame">
  <div class="lp-title">ПРОВЕДИ КЛЮЧ ЧЕРЕЗ СКВАЖИНУ</div>
  <canvas id="lpCanvas" width="540" height="396"></canvas>
  <div class="lp-hint">ВЕДИ <span class="k">МЫШЬ</span> ОТ <span class="k">S</span> ДО <span class="k">E</span> · НЕ КАСАЙСЯ СТЕН · <span class="k">ESC</span> ОТМЕНА</div>
</div>
<div id="tumblerMinigame">
  <div class="tb-title">ЗАМОК ГЕНЕРАТОРНОЙ</div>
  <canvas id="tbCanvas" width="560" height="300"></canvas>
  <div class="tb-hint">КЛИКАЙ ПО ПИНАМ, КОГДА ОНИ В ЗЕЛЁНОЙ ЗОНЕ · 5/5 = ЗАМОК ОТКРЫТ · <span class="k">ESC</span> ОТМЕНА</div>
</div>
<div id="dmg"></div>
<div id="sting"></div>
<div id="pulse"></div>
<div id="hideOverlay"><div class="txt" id="hideTxt">[E] ВЫЙТИ ИЗ УКРЫТИЯ</div></div>
<div id="whisper"></div>
<div id="jumpscare"><canvas id="jsCanvas"></canvas><div class="scratch"></div><div class="red"></div></div>
<div id="inv"><h2>ИНВЕНТАРЬ</h2><div class="sub">СНАРЯЖЕНИЕ РЕЙНДЖЕРА</div><div id="invGrid"></div><div id="invHint">[TAB] или [ESC] ЗАКРЫТЬ · ЛКМ ПО ПРЕДМЕТУ — ИСПОЛЬЗОВАТЬ</div></div>
<div id="noteView"><div class="notePaper"><h3 id="noteTitle"></h3><p id="noteBody"></p><div class="hint">[ESC] ЗАКРЫТЬ</div></div></div>
<div id="mapView">
  <div id="mapTitle">КАРТА НАЦИОНАЛЬНОГО ПАРКА «МЕДВЕЖИЙ РУЧЕЙ»</div>
  <canvas id="mapCanvas"></canvas>
  <div id="mapLegend"><span><b>●</b> ты</span><span><b>●</b> здание / объект</span><span><b>■</b> генератор / вышка</span></div>
  <div id="mapHint">[R] или [ESC] ЗАКРЫТЬ КАРТУ</div>
</div>
<div id="saveStatus"></div>
<div class="screen show" id="title">
  <h1>МЕДВЕЖИЙ РУЧЕЙ</h1>
  <div class="sub">НАЦИОНАЛЬНЫЙ ПАРК · ЗОНА ОТЧУЖДЕНИЯ</div>
  <div class="lore">
    Три дня назад группа туристов не вышла на связь.<br>
    Сегодня утром замолчала и сама станция.<br>
    Ты — рейнджер Алекс Ворон. Ты приехал один.<br><br>
    <span style="color:#8a2626">Медведи здесь больше не боятся людей.<br>Они на них охотятся.</span>
  </div>
  <button class="btn" id="playBtn">ИГРАТЬ</button>
  <button class="btn small" id="achBtn">ДОСТИЖЕНИЯ</button>
  <button class="btn small" id="setBtn">НАСТРОЙКИ</button>
  <div class="ctrl">
    <span><b>WASD</b> движение</span><span><b>МЫШЬ</b> обзор</span><span><b>SHIFT</b> бег</span><span><b>F</b> фонарь</span>
    <span><b>E</b> действие / укрытие</span><span><b>ЛКМ</b> фальшфейер / удар</span><span><b>Q</b> аптечка</span><span><b>R</b> карта</span>
    <span><b>TAB</b> инвентарь</span><span><b>ESC</b> пауза</span>
  </div>
</div>
<div class="screen" id="slots">
  <h1>СОХРАНЕНИЯ</h1>
  <div class="sub">ВЫБЕРИ СЛОТ</div>
  <div id="slotsGrid"></div>
  <button class="btn small" id="slotsBackBtn">НАЗАД</button>
</div>
<div class="screen" id="achievements">
  <h1>ДОСТИЖЕНИЯ</h1>
  <div class="sub">СОБРАНО: <span id="achCounter">0 / 6</span></div>
  <div id="achList"></div>
  <button class="btn small" id="achBackBtn">НАЗАД</button>
</div>
<div class="screen" id="settings">
  <h1>НАСТРОЙКИ</h1>
  <div class="sub">ЗВУК</div>
  <div id="settingsBox">
    <div class="settingRow"><span>ГРОМКОСТЬ ЗВУКОВ</span><input type="range" id="setSfx" min="0" max="100" value="100"><span class="val" id="setSfxVal">100%</span></div>
    <div class="settingRow"><span>ГРОМКОСТЬ МУЗЫКИ</span><input type="range" id="setMusic" min="0" max="100" value="100"><span class="val" id="setMusicVal">100%</span></div>
  </div>
  <button class="btn small" id="setBackBtn">НАЗАД</button>
</div>
<div class="screen" id="dead">
  <h1>ТЫ МЁРТВ</h1>
  <div class="sub" id="deadSub">ЛЕС ЗАБРАЛ ЕЩЁ ОДНОГО</div>
  <div class="stats" id="deadStats"></div>
  <button class="btn" id="retryBtn">ЗАНОВО</button>
</div>
<div class="screen" id="win">
  <h1>СПАСЕНИЕ</h1>
  <div class="sub">СИГНАЛ ПРИНЯТ. ВЕРТОЛЁТ В ПУТИ.</div>
  <div class="stats" id="winStats"></div>
  <button class="btn" id="againBtn">ЕЩЁ РАЗ</button>
</div>
<div class="screen" id="pause">
  <h1>ПАУЗА</h1>
  <div class="sub" style="font-size:11px;letter-spacing:4px;color:#5c6455;margin-top:14px;">НАЖМИ ESC ЧТОБЫ ПРОДОЛЖИТЬ</div>
  <button class="btn small" id="saveBtn">СОХРАНИТЬ ИГРУ</button>
  <button class="btn" id="quitBtn">В ГЛАВНОЕ МЕНЮ</button>
</div>
`;

/* ==================== 3. Ambient scare layer 1 ==================== */
(function(){
let A=null,ready=false,next=9+Math.random()*16;
function unlock(){if(ready)return;ready=true;try{A=new(window.AudioContext||window.webkitAudioContext)();A.resume()}catch(e){}}
["keydown","mousedown","touchstart"].forEach(x=>addEventListener(x,unlock,{once:true}));
function noise(d,v,fq){if(!A)return;let n=A.sampleRate*d,b=A.createBuffer(1,n,A.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;let s=A.createBufferSource(),f=A.createBiquadFilter(),g=A.createGain();s.buffer=b;f.type="bandpass";f.frequency.value=fq;f.Q.value=.7;g.gain.setValueAtTime(.0001,A.currentTime);g.gain.exponentialRampToValueAtTime(v,A.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,A.currentTime+d);s.connect(f).connect(g).connect(A.destination);s.start();s.stop(A.currentTime+d)}
function monster(){if(!A)return;let t=A.currentTime,o=A.createOscillator(),q=A.createOscillator(),g=A.createGain(),f=A.createBiquadFilter();o.type="sawtooth";q.type="sine";o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(38,t+1.3);q.frequency.setValueAtTime(100,t);q.frequency.exponentialRampToValueAtTime(25,t+1.4);f.type="lowpass";f.frequency.value=900;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.3,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+1.5);o.connect(f);q.connect(f);f.connect(g).connect(A.destination);o.start();q.start();o.stop(t+1.55);q.stop(t+1.55)}
function scream(){if(!A)return;let t=A.currentTime,o=A.createOscillator(),g=A.createGain();o.type="sawtooth";o.frequency.setValueAtTime(850,t);o.frequency.exponentialRampToValueAtTime(210,t+.7);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.17,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.78);o.connect(g).connect(A.destination);o.start();o.stop(t+.82)}
function scare(){if(!A)return;noise(.4,.2,800);setTimeout(monster,70);setTimeout(scream,220);next=12+Math.random()*25}
setInterval(()=>{next-=.25;if(next<=0&&document.visibilityState==="visible")scare()},250);
setInterval(()=>{if(A&&Math.random()<.18)noise(.14,.05,150)},6500);
})();

/* ==================== 4. Ambient scare layer 2 ==================== */
(function(){
  let nextScare=18+Math.random()*25, last=performance.now(), pulse=0;
  const v=document.getElementById('horrorVignette'), f=document.getElementById('horrorFlash');
  function tone(){
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      const c=new C(),o=c.createOscillator(),g=c.createGain();
      o.type='sine';o.frequency.setValueAtTime(58+Math.random()*25,c.currentTime);
      o.frequency.exponentialRampToValueAtTime(32,c.currentTime+1.7);
      g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.045,c.currentTime+.12);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+1.9);
      o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+2);
    }catch(e){}
  }
  function scare(){
    f.style.transition='none';f.style.opacity='.25';v.style.opacity='.96';tone();
    setTimeout(()=>{f.style.transition='opacity .75s';f.style.opacity='0'},90);
    setTimeout(()=>{v.style.opacity='.72'},500);
    nextScare=18+Math.random()*35;
  }
  setInterval(()=>{
    const now=performance.now(),dt=(now-last)/1000;last=now;nextScare-=dt;pulse+=dt;
    if(nextScare<=0 && document.visibilityState==='visible') scare();
    v.style.opacity=(.69+Math.sin(pulse*.65)*.045).toFixed(3);
  },250);
})();

/* ==================== 5. Основная игра ==================== */
(function(){
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a);
const dist=(x1,y1,x2,y2)=>Math.hypot(x2-x1,y2-y1);
const angDiff=(a,b)=>{let d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;};

let _seed=987654321;
function srand(){_seed=(_seed*1664525+1013904223)>>>0;return _seed/4294967296;}
function hash2(x,y){let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967296;}

const TILE=32, MAP_W=180, MAP_H=180;
const T_EMPTY=0,T_TREE=1,T_WALL=2,T_BUSH=3,T_FLOOR=4,T_DOOR=5,T_WATER=6;

let GENERATED_BUILDINGS=[];

const ARENA = { tx: 30, ty: 158, radiusTiles: 15, cx: 0, cy: 0, radiusPx: 0, built: false };

const LOCATIONS=[
  {name:'ДОМ РЫБАКА',   x:13, y:12, side:'СЕВЕРО-ЗАПАД'},
  {name:'ДОМ ЕГЕРЕЙ',   x:60, y:12, side:'СЕВЕРО-ВОСТОК'},
  {name:'ГЕНЕРАТОРНАЯ', x:13, y:60, side:'ЮГО-ЗАПАД'},
  {name:'РАДИОВЫШКА',   x:60, y:60, side:'ЮГО-ВОСТОК'},
  {name:'СЕВЕРНЫЕ ВОРОТА', x:37, y:3, side:'СЕВЕР'}
];

const SET_KEY = 'medvezhiy_ruchey_settings_v1';
const SETTINGS = { sfx: 1.0, music: 1.0 };
const ACH_KEY = 'medvezhiy_ruchey_achievements_v1';
const ACH_DEFS = [
  {id:'first_escape', icon:'🏆', name:'СПАСЕНИЕ',        desc:'Сбежать из парка через Северные ворота'},
  {id:'all_notes',    icon:'📚', name:'АРХИВАРИУС',      desc:'Собрать все 10 записок'},
  {id:'sanity_low',   icon:'💀', name:'НА ГРАНИ',        desc:'Сбежать с рассудком меньше 20%'},
  {id:'sanity_high',  icon:'🧠', name:'ЯСНЫЙ УМ',        desc:'Сбежать с рассудком больше 90%'},
  {id:'speedrun',     icon:'⚡', name:'БЫСТРЕЕ ВЕТРА',   desc:'Сбежать быстрее чем за 5 минут'},
  {id:'boar_hunter',  icon:'🐗', name:'УКРОТИТЕЛЬ',      desc:'Оглушить 5 кабанов'}
];
function loadSettings(){
  try{
    const s = JSON.parse(localStorage.getItem(SET_KEY));
    if(s && typeof s.sfx === 'number') SETTINGS.sfx = clamp(s.sfx, 0, 1);
    if(s && typeof s.music === 'number') SETTINGS.music = clamp(s.music, 0, 1);
  }catch(e){}
}
function saveSettings(){ try{ localStorage.setItem(SET_KEY, JSON.stringify(SETTINGS)); }catch(e){} }
function getAchievements(){ try{ return JSON.parse(localStorage.getItem(ACH_KEY)) || {}; }catch(e){ return {}; } }
function unlockAchievement(id){
  const a = getAchievements();
  if(a[id]) return;
  a[id] = Date.now();
  try{ localStorage.setItem(ACH_KEY, JSON.stringify(a)); }catch(e){}
  const def = ACH_DEFS.find(d=>d.id===id);
  if(def && typeof message === 'function'){
    setTimeout(()=>message('🏆 ДОСТИЖЕНИЕ: ' + def.name, '#e0c86a'), 1200);
  }
}

const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const lightCanvas=document.createElement('canvas');
const lctx=lightCanvas.getContext('2d');
const minimapCanvas=document.getElementById('minimap');
const mmctx=minimapCanvas.getContext('2d');
const jsCanvas=document.getElementById('jsCanvas');
const jsctx=jsCanvas.getContext('2d');
const brainCanvas=document.getElementById('brainCanvas');
const brainCtx=brainCanvas.getContext('2d');
const brainPanelEl=document.getElementById('brainPanel');
const brainPctEl=document.getElementById('brainPct');
const hmCanvas=document.getElementById('hmCanvas');
const hmCtx=hmCanvas.getContext('2d');
const hmEl=document.getElementById('hideMinigame');
const hmHitsEl=document.getElementById('hmHits');
const hmMissesEl=document.getElementById('hmMisses');
const hmTitleEl=document.getElementById('hmTitle');

let W=0,H=0;
function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
  lightCanvas.width=W;lightCanvas.height=H;
  jsCanvas.width=W;jsCanvas.height=H;
}
window.addEventListener('resize',resize);resize();

/* ============ МИНИ-ИГРА УКРЫТИЯ ============ */
const hideGame = {
  active:false, cursorPos:0, cursorDir:1, cursorSpeed:0.78,
  targetCenter:0.5, targetWidth:0.34,
  hits:0, misses:0, consecutiveMisses:0,
  lastResult:null, resultTimer:0, resultPos:0.5,
  bearNear:false, shakeAmp:0, flashHit:0, flashMiss:0,
  zeroSanityTime:0, timeInLocker:0
};
function startHideGame(){
  hideGame.active=true;
  hideGame.cursorPos=0; hideGame.cursorDir=1;
  hideGame.targetCenter=0.5; hideGame.targetWidth=0.34;
  hideGame.hits=0; hideGame.misses=0; hideGame.consecutiveMisses=0;
  hideGame.lastResult=null; hideGame.resultTimer=0;
  hideGame.shakeAmp=0; hideGame.flashHit=0; hideGame.flashMiss=0;
  hideGame.zeroSanityTime=0; hideGame.timeInLocker=0;
  if(hmHitsEl)hmHitsEl.textContent='0';
  if(hmMissesEl)hmMissesEl.textContent='0';
  if(hmEl){ hmEl.classList.add('on'); hmEl.classList.remove('bearNear'); }
  if(hmTitleEl)hmTitleEl.textContent='СПОКОЙСЯ';
}
function endHideGame(){
  hideGame.active=false;
  if(hmEl){ hmEl.classList.remove('on'); hmEl.classList.remove('bearNear'); }
}
function updateHideGameHUD(){
  if(hmHitsEl)hmHitsEl.textContent=hideGame.hits;
  if(hmMissesEl)hmMissesEl.textContent=hideGame.misses;
}
function hideGameClick(){
  if(!hideGame.active)return;
  const d=Math.abs(hideGame.cursorPos-hideGame.targetCenter);
  const half=hideGame.targetWidth/2;
  if(d<=half){
    hideGame.hits++;
    hideGame.consecutiveMisses=0;
    hideGame.lastResult='hit';
    hideGame.resultTimer=0.45;
    hideGame.resultPos=hideGame.cursorPos;
    hideGame.flashHit=0.5;
    const restore=hideGame.bearNear?13:10;
    player.sanity=Math.min(100,player.sanity+restore);
    SFX.hideHit();
    hideGame.targetWidth=Math.max(0.16,hideGame.targetWidth*0.94);
    const drift=(Math.random()-0.5)*0.16;
    hideGame.targetCenter=clamp(hideGame.targetCenter+drift,0.22,0.78);
  } else {
    hideGame.misses++;
    hideGame.consecutiveMisses++;
    hideGame.lastResult='miss';
    hideGame.resultTimer=0.45;
    hideGame.resultPos=hideGame.cursorPos;
    hideGame.flashMiss=0.6;
    hideGame.shakeAmp=10;
    player.sanity=Math.max(0,player.sanity-8);
    SFX.hideMiss();
    G.stingFlash=Math.max(G.stingFlash,0.35);
    if(hideGame.consecutiveMisses>=3){
      panicExitHide('Ты не выдержал. Ты выскочил из укрытия!');
      return;
    }
  }
  updateHideGameHUD();
  updateHUD();
}
function updateHideGame(dt){
  if(!hideGame.active)return;
  hideGame.timeInLocker+=dt;
  let near=false;
  const _allEnemies=[...bears,...boars];
  for(const b of _allEnemies){
    const d=dist(b.x,b.y,player.x,player.y);
    if(d<340 && (b.state==='chase'||b.state==='investigate'||b.state==='search')){ near=true;break; }
  }
  if(near!==hideGame.bearNear){
    hideGame.bearNear=near;
    if(hmEl)hmEl.classList.toggle('bearNear',near);
    if(hmTitleEl)hmTitleEl.innerHTML=near?'<span class="warn">ОН РЯДОМ</span>':'СПОКОЙСЯ';
    if(near){ SFX.whisper(); showWhisper('...дышит...'); }
  }
  const speedMul=near?1.55:1.0;
  const speed=hideGame.cursorSpeed*speedMul;
  hideGame.cursorPos+=hideGame.cursorDir*speed*dt;
  if(hideGame.cursorPos>=1){hideGame.cursorPos=1;hideGame.cursorDir=-1;}
  if(hideGame.cursorPos<=0){hideGame.cursorPos=0;hideGame.cursorDir=1;}
  const drain=near?1.2:0.3;
  player.sanity=clamp(player.sanity-drain*dt,0,100);
  if(hideGame.resultTimer>0)hideGame.resultTimer-=dt;
  if(hideGame.shakeAmp>0)hideGame.shakeAmp=Math.max(0,hideGame.shakeAmp-dt*35);
  if(hideGame.flashHit>0)hideGame.flashHit=Math.max(0,hideGame.flashHit-dt*2);
  if(hideGame.flashMiss>0)hideGame.flashMiss=Math.max(0,hideGame.flashMiss-dt*2);
  if(player.sanity<=0){
    hideGame.zeroSanityTime+=dt;
    if(hideGame.zeroSanityTime>10){
      panicExitHide('Рассудок не выдержал. Ты потерял контроль.');
      return;
    }
  } else { hideGame.zeroSanityTime=0; }
  updateHUD();
  drawHideGame();
}
function panicExitHide(reason){
  const px=player.x, py=player.y;
  exitHide();
  message(reason,'#e06060');
  player.sanity=Math.max(0,player.sanity-18);
  player.noise=1.0;
  player.invuln=0.4;
  bears.forEach(b=>{
    if(dist(b.x,b.y,px,py)<500){ b.state='chase'; b.lastKnown={x:px,y:py}; b.lostT=6;b.alert=1;b.path=null; }
  });
  boars.forEach(b=>{
    if(dist(b.x,b.y,px,py)<500){ b.state='chase'; b.lastKnown={x:px,y:py}; b.lostT=5;b.alert=1;b.path=null; }
  });
  SFX.growl(1); SFX.treeCrack(); G.shake=20;
}
function drawHideGame(){
  const w=hmCanvas.width, h=hmCanvas.height;
  const g=hmCtx;
  g.setTransform(1,0,0,1,0,0);
  let sx=0,sy=0;
  if(hideGame.shakeAmp>0){ sx=(Math.random()-0.5)*hideGame.shakeAmp; sy=(Math.random()-0.5)*hideGame.shakeAmp; }
  g.translate(sx,sy);
  g.clearRect(-20,-20,w+40,h+40);
  g.fillStyle='rgba(8,10,9,0.85)';
  g.fillRect(0,0,w,h);
  const trackY=h/2, trackH=52, trackX=16, trackW=w-32;
  g.fillStyle='rgba(255,255,255,0.05)';
  g.fillRect(trackX,trackY-trackH/2,trackW,trackH);
  g.strokeStyle='rgba(180,160,90,0.35)';
  g.lineWidth=1;
  g.strokeRect(trackX+0.5,trackY-trackH/2+0.5,trackW-1,trackH-1);
  g.strokeStyle='rgba(180,160,90,0.10)';
  for(let i=1;i<10;i++){ const x=trackX+(i/10)*trackW; g.beginPath();g.moveTo(x,trackY-trackH/2);g.lineTo(x,trackY+trackH/2);g.stroke(); }
  const tc=hideGame.targetCenter, tw=hideGame.targetWidth;
  const danger=hideGame.bearNear;
  const targetFill=danger?'rgba(220,70,50,0.45)':'rgba(80,220,120,0.42)';
  const targetEdge=danger?'rgba(255,120,80,0.95)':'rgba(120,255,160,0.95)';
  const zp=1+Math.sin(performance.now()*0.006)*0.05;
  const tWp=tw*trackW*zp;
  const tXp=trackX+(tc-tw*zp/2)*trackW;
  const grad=g.createLinearGradient(tXp,0,tXp+tWp,0);
  grad.addColorStop(0,'rgba(0,0,0,0)'); grad.addColorStop(0.5,targetFill); grad.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=grad;
  g.fillRect(tXp,trackY-trackH/2,tWp,trackH);
  g.strokeStyle=targetEdge; g.lineWidth=1.5;
  g.strokeRect(tXp+0.5,trackY-trackH/2+0.5,tWp-1,trackH-1);
  const cX=trackX+tc*trackW;
  g.strokeStyle=targetEdge; g.setLineDash([3,3]); g.lineWidth=1;
  g.beginPath();g.moveTo(cX,trackY-trackH/2);g.lineTo(cX,trackY+trackH/2);g.stroke();
  g.setLineDash([]);
  const cursorX=trackX+hideGame.cursorPos*trackW;
  const cursorNear=Math.abs(hideGame.cursorPos-tc)<=tw/2;
  g.fillStyle=cursorNear?'#fff0a0':'#e8dca8';
  g.shadowColor=cursorNear?'#ffe680':'#e8dca8';
  g.shadowBlur=cursorNear?18:10;
  g.fillRect(cursorX-2.5,trackY-trackH/2-8,5,trackH+16);
  g.shadowBlur=0;
  g.fillStyle=cursorNear?'#ffe680':'#e8dca8';
  g.beginPath(); g.moveTo(cursorX,trackY-trackH/2-8); g.lineTo(cursorX-6,trackY-trackH/2-16); g.lineTo(cursorX+6,trackY-trackH/2-16); g.closePath();g.fill();
  g.beginPath(); g.moveTo(cursorX,trackY+trackH/2+8); g.lineTo(cursorX-6,trackY+trackH/2+16); g.lineTo(cursorX+6,trackY+trackH/2+16); g.closePath();g.fill();
  if(hideGame.resultTimer>0){
    const a=hideGame.resultTimer/0.45;
    const rx=trackX+hideGame.resultPos*trackW;
    if(hideGame.lastResult==='hit'){
      g.fillStyle='rgba(120,255,140,'+a+')'; g.font='bold 18px Courier New'; g.textAlign='center';
      g.fillText('+',rx,trackY-32);
      g.strokeStyle='rgba(120,255,140,'+a+')'; g.lineWidth=2;
      g.beginPath(); g.arc(rx,trackY,30*(1.4-a*0.4),0,7); g.stroke();
    } else {
      g.fillStyle='rgba(255,80,60,'+a+')'; g.font='bold 18px Courier New'; g.textAlign='center';
      g.fillText('✕',rx,trackY-32);
      g.strokeStyle='rgba(255,80,60,'+a+')'; g.lineWidth=2;
      g.beginPath(); g.arc(rx,trackY,30*(1.4-a*0.4),0,7); g.stroke();
    }
  }
  if(hideGame.flashHit>0){ g.fillStyle='rgba(80,255,120,'+(hideGame.flashHit*0.18)+')'; g.fillRect(0,0,w,h); }
  if(hideGame.flashMiss>0){ g.fillStyle='rgba(255,60,60,'+(hideGame.flashMiss*0.22)+')'; g.fillRect(0,0,w,h); }
  if(danger){ const p=0.10+Math.sin(performance.now()*0.009)*0.07; g.fillStyle='rgba(220,40,40,'+p+')'; g.fillRect(0,0,w,h); }
  if(player.sanity<25){ const t=(25-player.sanity)/25; g.fillStyle='rgba(120,0,0,'+(t*0.3)+')'; g.fillRect(0,0,w,h); }
}

/* ============ МИНИ-ИГРА ПОБЕГА ============ */
const escapeGame = {
  active: false, currentKey: null, keyLabel: '',
  timer: 0, maxTimer: 1.0,
  hits: 0, misses: 0, maxHits: 10, maxMisses: 5,
  resultTimer: 0, lastResult: null,
  keys:  ['KeyQ','KeyE','KeyZ','KeyR','KeyF'],
  labels:['Q','E','Z','R','F']
};
function startEscapeGame(){
  escapeGame.active = true; escapeGame.hits = 0; escapeGame.misses = 0;
  escapeGame.resultTimer = 0; escapeGame.lastResult = null;
  nextEscapeKey();
  const el = document.getElementById('escapeMinigame'); if(el) el.classList.add('on');
  SFX.click();
  message('Взлом замка! Жми показанные клавиши!', '#e0c86a');
}
function nextEscapeKey(){
  const i = Math.floor(Math.random() * escapeGame.keys.length);
  escapeGame.currentKey = escapeGame.keys[i];
  escapeGame.keyLabel   = escapeGame.labels[i];
  escapeGame.timer      = escapeGame.maxTimer;
}
function escapeGamePress(code){
  if(!escapeGame.active) return;
  if(code === escapeGame.currentKey){
    escapeGame.hits++; escapeGame.lastResult = 'hit'; escapeGame.resultTimer = 0.4;
    SFX.hideHit();
    if(escapeGame.hits >= escapeGame.maxHits){ endEscapeGame(true); return; }
    nextEscapeKey();
  } else {
    escapeGame.misses++; escapeGame.lastResult = 'miss'; escapeGame.resultTimer = 0.4;
    SFX.hideMiss();
    G.stingFlash = Math.max(G.stingFlash, 0.4);
    if(escapeGame.misses >= escapeGame.maxMisses){
      escapeGame.hits = 0; escapeGame.misses = 0;
      message('ЗАМОК ЗАКЛИНИЛО! ЗАНОВО!', '#e06060'); SFX.deny();
    }
    nextEscapeKey();
  }
}
function endEscapeGame(success){
  escapeGame.active = false;
  const el = document.getElementById('escapeMinigame'); if(el) el.classList.remove('on');
  if(success){
    message('ЗАМОК ОТКРЫТ!', '#7fd68a'); SFX.pickup();
    setTimeout(()=>{ if(G.state === 'play') startBossFight(); }, 900);
  }
}
function updateEscapeGame(dt){
  if(!escapeGame.active) return;
  escapeGame.timer -= dt;
  const el = document.getElementById('escapeMinigame');
  if(el) el.classList.toggle('danger', escapeGame.timer < 0.35);
  if(escapeGame.timer <= 0){
    escapeGame.misses++; escapeGame.lastResult = 'miss'; escapeGame.resultTimer = 0.4;
    SFX.hideMiss();
    G.stingFlash = Math.max(G.stingFlash, 0.3);
    if(escapeGame.misses >= escapeGame.maxMisses){
      escapeGame.hits = 0; escapeGame.misses = 0;
      message('ЗАМОК ЗАКЛИНИЛО! ЗАНОВО!', '#e06060'); SFX.deny();
    }
    nextEscapeKey();
  }
  if(escapeGame.resultTimer > 0) escapeGame.resultTimer -= dt;
  drawEscapeGame();
}
function drawEscapeGame(){
  const emCanvas = document.getElementById('emCanvas');
  if(!emCanvas) return;
  const emCtx = emCanvas.getContext('2d');
  const w = emCanvas.width, h = emCanvas.height;
  const g = emCtx;
  g.setTransform(1,0,0,1,0,0);
  g.clearRect(0,0,w,h);
  g.fillStyle = 'rgba(8,10,9,0.85)'; g.fillRect(0,0,w,h);
  const timerPct = Math.max(0, Math.min(1, escapeGame.timer / escapeGame.maxTimer));
  const barX = 20, barY = 8, barW = w - 40, barH = 6;
  g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(barX, barY, barW, barH);
  const timerColor = timerPct > 0.5 ? '#e0c86a' : (timerPct > 0.25 ? '#e0a83a' : '#e06060');
  g.fillStyle = timerColor; g.fillRect(barX, barY, barW * timerPct, barH);
  g.strokeStyle = 'rgba(180,160,90,0.4)'; g.lineWidth = 1;
  g.strokeRect(barX+0.5, barY+0.5, barW-1, barH-1);
  const cx = w/2, cy = h/2 + 6;
  const pulse = 1 + Math.sin(performance.now()*0.008) * 0.045;
  g.save(); g.translate(cx, cy); g.scale(pulse, pulse);
  const kw = 72, kh = 72;
  g.fillStyle = 'rgba(30,28,20,0.95)'; g.strokeStyle = '#8a7a4a'; g.lineWidth = 3;
  g.fillRect(-kw/2, -kh/2, kw, kh); g.strokeRect(-kw/2, -kh/2, kw, kh);
  g.strokeStyle = 'rgba(201,162,39,0.5)'; g.lineWidth = 1;
  g.strokeRect(-kw/2+5, -kh/2+5, kw-10, kh-10);
  g.fillStyle = '#e8dca8'; g.font = 'bold 48px Courier New';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(escapeGame.keyLabel, 0, 4);
  g.restore();
  const dotY = h - 14, dotSpacing = 12;
  const totalW = (escapeGame.maxHits - 1) * dotSpacing;
  const startX = (w - totalW) / 2;
  for(let i=0;i<escapeGame.maxHits;i++){
    g.beginPath(); g.arc(startX + i*dotSpacing, dotY, 4, 0, 7);
    if(i < escapeGame.hits){ g.fillStyle = '#7fd68a'; g.fill(); }
    else { g.fillStyle = 'rgba(255,255,255,0.12)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.stroke(); }
  }
  g.font = '11px Courier New'; g.textBaseline = 'middle';
  g.textAlign = 'left'; g.fillStyle = '#e06060';
  g.fillText('ПРОМАХИ: ' + escapeGame.misses + '/' + escapeGame.maxMisses, 14, barY + 22);
  g.textAlign = 'right'; g.fillStyle = '#7fd68a';
  g.fillText('УСПЕХ: ' + escapeGame.hits + '/' + escapeGame.maxHits, w-14, barY + 22);
  if(escapeGame.resultTimer > 0){
    const a = escapeGame.resultTimer / 0.4;
    if(escapeGame.lastResult === 'hit'){ g.fillStyle = 'rgba(80,255,120,'+(a*0.18)+')'; g.fillRect(0,0,w,h); }
    else { g.fillStyle = 'rgba(255,60,60,'+(a*0.28)+')'; g.fillRect(0,0,w,h); }
  }
}

/* ============ МИНИ-ИГРА ГЕНЕРАТОРА ============ */
const fuelGame = {
  active: false, cells: new Array(16).fill(0), target: new Array(16).fill(0),
  timeLeft: 25, maxTime: 25, round: 1, maxRound: 3,
  roundTimes: [25, 17, 12], shakeAmp: 0, flashCorrect: 0, hoverIdx: -1,
  _generator: null, panelX: 0, panelY: 0, cellW: 0, cellH: 0
};
function startFuelGame(){
  fuelGame.active = true; fuelGame.round = 1;
  startFuelRound();
  const el = document.getElementById('fuelMinigame');
  if(el){ el.classList.add('on'); el.classList.remove('danger'); }
  SFX.click();
  message('Панель генератора. Раунд 1/3 — 25 секунд!', '#e0c86a');
  drawFuelGame();
}
function startFuelRound(){
  const t = fuelGame.roundTimes[fuelGame.round-1] || 15;
  fuelGame.maxTime = t; fuelGame.timeLeft = t;
  fuelGame.cells = new Array(16).fill(0);
  fuelGame.target = [];
  for(let i=0;i<16;i++) fuelGame.target.push(Math.random()<0.5?1:0);
  const ones = fuelGame.target.reduce((a,b)=>a+b,0);
  if(ones===0||ones===16){ fuelGame.target[Math.floor(Math.random()*16)]=1; fuelGame.target[Math.floor(Math.random()*16)]=0; }
  fuelGame.shakeAmp = 0; fuelGame.flashCorrect = 0; fuelGame.hoverIdx = -1;
}
function fuelGameCellClick(idx){
  if(!fuelGame.active) return;
  if(idx<0||idx>=16) return;
  fuelGame.cells[idx] = fuelGame.cells[idx]?0:1;
  SFX.click();
  let allMatch = true;
  for(let i=0;i<16;i++) if(fuelGame.cells[i]!==fuelGame.target[i]){ allMatch=false;break; }
  if(allMatch){
    SFX.hideHit(); fuelGame.flashCorrect = 1; drawFuelGame();
    if(fuelGame.round >= fuelGame.maxRound){ setTimeout(()=>endFuelGame(true), 420); }
    else {
      fuelGame.round++;
      const nextT = fuelGame.roundTimes[fuelGame.round-1];
      message('Раунд '+fuelGame.round+'/3 — '+nextT+' секунд!', '#e0c86a');
      setTimeout(()=>{ if(!fuelGame.active) return; startFuelRound(); drawFuelGame(); }, 500);
    }
    return;
  }
  drawFuelGame();
}
function endFuelGame(success){
  if(!fuelGame.active) return;
  fuelGame.active = false;
  const el = document.getElementById('fuelMinigame'); if(el) el.classList.remove('on');
  if(!success){ message('Ты не успел подключить панель.', '#c95a5a'); return; }
  const st = fuelGame._generator;
  if(st && !st.used){
    st.used = true; player.hasFuel = false;
    SFX.generator();
    message('ГЕНЕРАТОР ЗАПУЩЕН. Свет по всему лагерю.','#7fd68a');
    completeObjective('gen');
    bears.forEach(b=>{b.baseSpeed+=14;b.speed=b.baseSpeed;b.sightRange+=30;});
    boars.forEach(b=>{b.baseSpeed+=10;b.speed=b.baseSpeed;b.sightRange+=20;});
    setTimeout(()=>{if(G.state==='play')message('Они услышали. Они идут.','#c98a2a');},2400);
  }
}
function updateFuelGame(dt){
  if(!fuelGame.active) return;
  fuelGame.timeLeft -= dt;
  if(fuelGame.shakeAmp>0) fuelGame.shakeAmp = Math.max(0, fuelGame.shakeAmp-dt*30);
  if(fuelGame.flashCorrect>0) fuelGame.flashCorrect = Math.max(0, fuelGame.flashCorrect-dt*2);
  const el = document.getElementById('fuelMinigame');
  if(el) el.classList.toggle('danger', fuelGame.timeLeft<5);
  if(fuelGame.timeLeft<=0){
    fuelGame.round = 1; fuelGame.shakeAmp = 14;
    player.sanity = Math.max(0, player.sanity-15);
    G.stingFlash = Math.max(G.stingFlash, 0.5);
    SFX.deny(); SFX.growl(0.7);
    message('Время вышло! Всё заново с раунда 1!', '#e06060');
    startFuelRound();
  }
  drawFuelGame();
}
function drawFuelGame(){
  const el = document.getElementById('fuelCanvas'); if(!el) return;
  const g = el.getContext('2d');
  const w = el.width, h = el.height;
  g.setTransform(1,0,0,1,0,0);
  let sx=0, sy=0;
  if(fuelGame.shakeAmp>0){ sx=(Math.random()-0.5)*fuelGame.shakeAmp; sy=(Math.random()-0.5)*fuelGame.shakeAmp; }
  g.fillStyle='#0a0c0a'; g.fillRect(0,0,w,h);
  g.save(); g.translate(sx,sy);
  const t = Math.max(0, fuelGame.timeLeft/fuelGame.maxTime);
  g.fillStyle='rgba(255,255,255,0.08)'; g.fillRect(20,12,w-40,8);
  const barColor = t>0.5?'#7fd68a':(t>0.25?'#e0b93a':'#e06060');
  g.fillStyle=barColor; g.fillRect(20,12,(w-40)*t,8);
  g.strokeStyle='rgba(180,160,90,0.4)'; g.lineWidth=1; g.strokeRect(20.5,12.5,w-41,7);
  g.font='10px Courier New'; g.textBaseline='middle';
  g.textAlign='left'; g.fillStyle='#e0c86a'; g.fillText('ПАНЕЛЬ ГЕНЕРАТОРА', 20, 34);
  g.textAlign='center'; g.fillStyle='#e0c86a'; g.fillText('РАУНД ' + fuelGame.round + ' / ' + fuelGame.maxRound, w/2, 34);
  g.textAlign='right'; g.fillStyle=barColor; g.fillText(Math.ceil(fuelGame.timeLeft)+' С', w-20, 34);
  const sCell=14, sGap=3, sTotal=4*sCell+3*sGap;
  const sX=(w-sTotal)/2, sY=52;
  g.strokeStyle='rgba(120,130,110,0.45)'; g.lineWidth=1;
  g.strokeRect(sX-14, sY-14, sTotal+28, sTotal+28);
  g.font='9px Courier New'; g.textAlign='left'; g.textBaseline='top'; g.fillStyle='#7d8a72';
  g.fillText('СХЕМА', sX-14+5, sY-14+3);
  for(let i=0;i<16;i++){
    const r=Math.floor(i/4), c=i%4;
    const cx=sX+c*(sCell+sGap), cy=sY+r*(sCell+sGap);
    const on=fuelGame.target[i];
    g.fillStyle = on?'#3a8a3a':'#1a1a1a'; g.fillRect(cx,cy,sCell,sCell);
    g.strokeStyle = on?'#7fd68a':'#444'; g.lineWidth=1;
    g.strokeRect(cx+0.5,cy+0.5,sCell-1,sCell-1);
    g.fillStyle = on?'#b8ffca':'#555'; g.beginPath(); g.arc(cx+sCell/2,cy+sCell/2,1.9,0,7); g.fill();
  }
  const panelX=36, panelY=sY+sTotal+30, panelW=w-72, panelH=h-panelY-14;
  const cellW=panelW/4, cellH=panelH/4;
  fuelGame.panelX=panelX; fuelGame.panelY=panelY; fuelGame.cellW=cellW; fuelGame.cellH=cellH;
  g.fillStyle='#101216'; g.fillRect(panelX-4,panelY-4,panelW+8,panelH+8);
  g.strokeStyle='#2a2e36'; g.lineWidth=2; g.strokeRect(panelX-3,panelY-3,panelW+6,panelH+6);
  for(let i=0;i<16;i++){
    const r=Math.floor(i/4), c=i%4;
    const cx=panelX+c*cellW, cy=panelY+r*cellH;
    const on=fuelGame.cells[i];
    const shouldBeOn=fuelGame.target[i];
    const correct = (on===shouldBeOn);
    g.fillStyle = on?'rgba(60,160,80,0.16)':'rgba(30,32,38,0.7)';
    g.fillRect(cx+3,cy+3,cellW-6,cellH-6);
    if(fuelGame.hoverIdx===i){ g.strokeStyle='#e0c86a'; g.lineWidth=2; }
    else if(correct && on){ g.strokeStyle='rgba(127,214,138,0.55)'; g.lineWidth=1; }
    else { g.strokeStyle='rgba(120,130,110,0.35)'; g.lineWidth=1; }
    g.strokeRect(cx+3.5,cy+3.5,cellW-7,cellH-7);
    const sw = Math.min(cellW*0.46, 62);
    const sh = Math.min(cellH*0.58, 34);
    const scx = cx+cellW/2;
    const scy = cy+cellH/2 - 2;
    g.fillStyle='#08090c'; g.fillRect(scx-sw/2, scy-sh/2, sw, sh);
    g.strokeStyle='#2a2e36'; g.lineWidth=1.5; g.strokeRect(scx-sw/2+0.5, scy-sh/2+0.5, sw-1, sh-1);
    g.fillStyle = on?'rgba(80,220,120,0.18)':'rgba(180,60,60,0.14)';
    g.fillRect(scx-sw/2+4, scy-sh/2+4, sw-8, sh-8);
    const leverY = on ? scy-sh*0.22 : scy+sh*0.22;
    if(on){ g.shadowColor='#7fd68a'; g.shadowBlur=10; g.fillStyle='#7fd68a'; g.fillRect(scx-sw/2+6, leverY-2.5, sw-12, 5); g.shadowBlur=0; }
    else { g.fillStyle='#a04040'; g.fillRect(scx-sw/2+6, leverY-2.5, sw-12, 5); }
    g.font='bold 8px Courier New'; g.textAlign='center'; g.textBaseline='middle';
    g.fillStyle = on?'#b8ffca':'#666'; g.fillText(on?'ВКЛ':'ВЫКЛ', scx, cy+cellH-11);
    g.font='8px Courier New'; g.textAlign='left'; g.textBaseline='top'; g.fillStyle='#4a5544';
    g.fillText('#'+(i+1), cx+8, cy+6);
    if(shouldBeOn){ g.fillStyle='rgba(127,214,138,0.75)'; g.beginPath(); g.arc(cx+cellW-11, cy+11, 2.6, 0, 7); g.fill(); }
  }
  if(fuelGame.flashCorrect>0){ g.fillStyle='rgba(120,255,140,'+(fuelGame.flashCorrect*0.4)+')'; g.fillRect(-20,-20,w+40,h+40); }
  g.restore();
}

/* ============ МИНИ-ИГРА КЛЮЧА (ЛАБИРИНТ) ============ */
const lpGame = {
  active:false, grid:null, cols:15, rows:11, cell:36,
  playerX:0, playerY:0, radius:6, startX:0, startY:0, endX:0, endY:0,
  itemRef:null, shakeAmp:0, flashFail:0, flashWin:0, attemptCount:0,
  trail:[], trailTimer:0, winTimer:0
};
const LP_CANVAS = document.getElementById('lpCanvas');
const lpCtx = LP_CANVAS ? LP_CANVAS.getContext('2d') : null;
function lpGenerateMaze(cols,rows){
  const grid=[];
  for(let y=0;y<rows;y++){ const r=[]; for(let x=0;x<cols;x++) r.push(1); grid.push(r); }
  const stack=[[1,1]]; grid[1][1]=0;
  const dirs=[[2,0],[-2,0],[0,2],[0,-2]];
  while(stack.length){
    const [cx,cy]=stack[stack.length-1];
    const nb=[];
    for(const [dx,dy] of dirs){
      const nx=cx+dx, ny=cy+dy;
      if(nx>0&&ny>0&&nx<cols-1&&ny<rows-1&&grid[ny][nx]===1) nb.push([nx,ny,cx+dx/2,cy+dy/2]);
    }
    if(nb.length===0){ stack.pop(); continue; }
    const [nx,ny,mx,my]=nb[Math.floor(Math.random()*nb.length)];
    grid[my][mx]=0; grid[ny][nx]=0; stack.push([nx,ny]);
  }
  return grid;
}
function startLockpickGame(item){
  lpGame.active = true;
  lpGame.grid = lpGenerateMaze(lpGame.cols, lpGame.rows);
  lpGame.itemRef = item;
  const c = lpGame.cell;
  lpGame.startX = 1*c + c/2; lpGame.startY = 1*c + c/2;
  lpGame.endX = (lpGame.cols-2)*c + c/2; lpGame.endY = (lpGame.rows-2)*c + c/2;
  lpGame.playerX = lpGame.startX; lpGame.playerY = lpGame.startY;
  lpGame.shakeAmp = 0; lpGame.flashFail = 0; lpGame.flashWin = 0;
  lpGame.attemptCount = 0; lpGame.trail = []; lpGame.trailTimer = 0; lpGame.winTimer = 0;
  const el = document.getElementById('lockpickMinigame');
  if(el){ el.classList.add('on'); el.classList.remove('fail'); }
  SFX.click();
  message('Ключ застрял в скважине. Проведи его через лабиринт.','#e0c86a');
  drawLockpickGame();
}
function endLockpickGame(success){
  if(!lpGame.active) return;
  lpGame.active = false;
  const el = document.getElementById('lockpickMinigame');
  if(el){ el.classList.remove('on'); el.classList.remove('fail'); }
  const item = lpGame.itemRef;
  lpGame.itemRef = null;
  if(success && item && !item.taken){
    item.taken = true; player.hasKey = true;
    SFX.pickup();
    message('Получено: Ключ от генераторной','#e0c86a');
    completeObjective('key');
    updateHUD();
  } else if(!success){ message('Ключ остался на месте. Попробуй снова.','#8a9a7a'); }
}
function lpCollides(px, py, r){
  const cw = lpGame.cell;
  const g = lpGame.grid;
  if(!g) return true;
  const x0 = Math.floor((px-r)/cw), x1 = Math.floor((px+r)/cw);
  const y0 = Math.floor((py-r)/cw), y1 = Math.floor((py+r)/cw);
  for(let y=y0;y<=y1;y++){
    for(let x=x0;x<=x1;x++){
      if(y<0||x<0||y>=lpGame.rows||x>=lpGame.cols) return true;
      if(g[y][x]===1){
        const rx = x*cw, ry = y*cw;
        const nx = Math.max(rx, Math.min(px, rx+cw));
        const ny = Math.max(ry, Math.min(py, ry+cw));
        const dx = px-nx, dy = py-ny;
        if(dx*dx+dy*dy < r*r) return true;
      }
    }
  }
  return false;
}
function lpResetToStart(){
  lpGame.playerX = lpGame.startX; lpGame.playerY = lpGame.startY;
  lpGame.trail = []; lpGame.shakeAmp = 14; lpGame.flashFail = 0.7; lpGame.attemptCount++;
  SFX.hideMiss();
  G.stingFlash = Math.max(G.stingFlash, 0.35);
  const el = document.getElementById('lockpickMinigame');
  if(el){ el.classList.add('fail'); clearTimeout(lpGame._failT); lpGame._failT = setTimeout(()=>el.classList.remove('fail'), 320); }
}
function lpMoveTowards(tx, ty){
  const oldX = lpGame.playerX, oldY = lpGame.playerY;
  const dx = tx - oldX, dy = ty - oldY;
  const d = Math.hypot(dx, dy);
  if(d < 0.01) return;
  const stepSize = 3;
  const steps = Math.ceil(d / stepSize);
  for(let i=1;i<=steps;i++){
    const t = i/steps;
    const px = oldX + dx*t, py = oldY + dy*t;
    if(lpCollides(px, py, lpGame.radius)){ lpResetToStart(); return; }
    lpGame.playerX = px; lpGame.playerY = py;
  }
  const dEnd = Math.hypot(lpGame.playerX - lpGame.endX, lpGame.playerY - lpGame.endY);
  if(dEnd < lpGame.cell*0.45 && lpGame.winTimer<=0){
    lpGame.flashWin = 1; lpGame.winTimer = 0.55; SFX.hideHit();
  }
}
function lpHandleMouse(clientX, clientY){
  if(!lpGame.active || !LP_CANVAS) return;
  const rect = LP_CANVAS.getBoundingClientRect();
  if(clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
  const scaleX = LP_CANVAS.width / rect.width;
  const scaleY = LP_CANVAS.height / rect.height;
  let mx = (clientX - rect.left) * scaleX;
  let my = (clientY - rect.top) * scaleY;
  mx = Math.max(lpGame.radius, Math.min(LP_CANVAS.width - lpGame.radius, mx));
  my = Math.max(lpGame.radius, Math.min(LP_CANVAS.height - lpGame.radius, my));
  lpMoveTowards(mx, my);
  drawLockpickGame();
}
function updateLockpickGame(dt){
  if(!lpGame.active) return;
  if(lpGame.shakeAmp>0) lpGame.shakeAmp = Math.max(0, lpGame.shakeAmp - dt*40);
  if(lpGame.flashFail>0) lpGame.flashFail = Math.max(0, lpGame.flashFail - dt*2.2);
  if(lpGame.flashWin>0) lpGame.flashWin = Math.max(0, lpGame.flashWin - dt*1.5);
  if(lpGame.winTimer>0){ lpGame.winTimer -= dt; if(lpGame.winTimer<=0){ endLockpickGame(true); return; } }
  lpGame.trailTimer -= dt;
  if(lpGame.trailTimer<=0){ lpGame.trailTimer = 0.03; lpGame.trail.push({x:lpGame.playerX, y:lpGame.playerY, life:1.2}); if(lpGame.trail.length>120) lpGame.trail.shift(); }
  for(let i=lpGame.trail.length-1;i>=0;i--){ lpGame.trail[i].life -= dt; if(lpGame.trail[i].life<=0) lpGame.trail.splice(i,1); }
  drawLockpickGame();
}
function drawLockpickGame(){
  if(!lpCtx || !LP_CANVAS || !lpGame.grid) return;
  const w = LP_CANVAS.width, h = LP_CANVAS.height;
  const cw = lpGame.cell;
  lpCtx.setTransform(1,0,0,1,0,0);
  let sx=0, sy=0;
  if(lpGame.shakeAmp>0){ sx=(Math.random()-0.5)*lpGame.shakeAmp; sy=(Math.random()-0.5)*lpGame.shakeAmp; }
  lpCtx.save(); lpCtx.translate(sx, sy);
  lpCtx.fillStyle='#0a0c0a'; lpCtx.fillRect(-20,-20,w+40,h+40);
  for(let y=0;y<lpGame.rows;y++){
    for(let x=0;x<lpGame.cols;x++){
      const px=x*cw, py=y*cw;
      if(lpGame.grid[y][x]===1){
        lpCtx.fillStyle='#2a2a2a'; lpCtx.fillRect(px,py,cw,cw);
        lpCtx.fillStyle='#3a3a3a'; lpCtx.fillRect(px+2,py+2,cw-4,cw-4);
        lpCtx.strokeStyle='rgba(0,0,0,0.4)'; lpCtx.lineWidth=1; lpCtx.strokeRect(px+2.5,py+2.5,cw-5,cw-5);
      } else { lpCtx.fillStyle='#141814'; lpCtx.fillRect(px,py,cw,cw); }
    }
  }
  for(const t of lpGame.trail){ lpCtx.fillStyle='rgba(201,162,39,'+(t.life*0.35)+')'; lpCtx.beginPath(); lpCtx.arc(t.x,t.y,4,0,7); lpCtx.fill(); }
  lpCtx.fillStyle='rgba(127,214,138,0.25)'; lpCtx.beginPath(); lpCtx.arc(lpGame.startX, lpGame.startY, cw*0.35, 0, 7); lpCtx.fill();
  lpCtx.fillStyle='#7fd68a'; lpCtx.font='bold 14px Courier New'; lpCtx.textAlign='center'; lpCtx.textBaseline='middle'; lpCtx.fillText('S', lpGame.startX, lpGame.startY);
  const pe = 1 + Math.sin(performance.now()*0.006)*0.12;
  lpCtx.fillStyle='rgba(201,162,39,0.28)'; lpCtx.beginPath(); lpCtx.arc(lpGame.endX, lpGame.endY, cw*0.4*pe, 0, 7); lpCtx.fill();
  lpCtx.fillStyle='#e0c86a'; lpCtx.beginPath(); lpCtx.arc(lpGame.endX, lpGame.endY, cw*0.22*pe, 0, 7); lpCtx.fill();
  lpCtx.fillStyle='#1a1408'; lpCtx.font='bold 13px Courier New'; lpCtx.fillText('E', lpGame.endX, lpGame.endY+1);
  lpCtx.save(); lpCtx.translate(lpGame.playerX, lpGame.playerY);
  const pg = lpCtx.createRadialGradient(0,0,0,0,0,18);
  pg.addColorStop(0,'rgba(255,220,90,0.55)'); pg.addColorStop(1,'rgba(255,220,90,0)');
  lpCtx.fillStyle = pg; lpCtx.beginPath(); lpCtx.arc(0,0,18,0,7); lpCtx.fill();
  lpCtx.fillStyle='#e8dca8'; lpCtx.beginPath(); lpCtx.arc(0,0,lpGame.radius,0,7); lpCtx.fill();
  lpCtx.strokeStyle='#c9a227'; lpCtx.lineWidth=1.5; lpCtx.beginPath(); lpCtx.arc(0,0,lpGame.radius,0,7); lpCtx.stroke();
  lpCtx.restore();
  if(lpGame.flashFail>0){ lpCtx.fillStyle='rgba(255,60,60,'+(lpGame.flashFail*0.35)+')'; lpCtx.fillRect(-20,-20,w+40,h+40); }
  if(lpGame.flashWin>0){ lpCtx.fillStyle='rgba(120,255,140,'+(lpGame.flashWin*0.35)+')'; lpCtx.fillRect(-20,-20,w+40,h+40); }
  lpCtx.fillStyle='rgba(0,0,0,0.55)'; lpCtx.fillRect(6,6,170,22);
  lpCtx.strokeStyle='rgba(180,160,90,0.4)'; lpCtx.lineWidth=1; lpCtx.strokeRect(6.5,6.5,169,21);
  lpCtx.fillStyle='#e0c86a'; lpCtx.font='11px Courier New'; lpCtx.textAlign='left'; lpCtx.textBaseline='middle';
  lpCtx.fillText('ПОПЫТКИ: ' + lpGame.attemptCount, 14, 18);
  lpCtx.restore();
}

/* ============ МИНИ-ИГРА ЗАМКА (ПОДБОР ШТИФТОВ) ============ */
const tumblerGame = { active:false, pins:[], numPins:5, winTimer:0, flashWin:0, flashMiss:0, shakeAmp:0, generatorRef:null, _failT:null };
const TB_CANVAS = document.getElementById('tbCanvas');
const tbCtx = TB_CANVAS ? TB_CANVAS.getContext('2d') : null;
function tbMakePins(){
  const pins=[];
  for(let i=0;i<tumblerGame.numPins;i++){
    const zoneCenter = 0.25 + Math.random()*0.5;
    const zoneHalf = 0.075 + Math.random()*0.025;
    pins.push({ pos: Math.random(), dir: Math.random()<0.5?1:-1, speed: 0.55 + Math.random()*0.45, zoneCenter, zoneHalf, locked:false, flash:0, lockAnim:0 });
  }
  return pins;
}
function startTumblerGame(st){
  tumblerGame.active = true;
  tumblerGame.pins = tbMakePins();
  tumblerGame.winTimer = 0; tumblerGame.flashWin = 0; tumblerGame.flashMiss = 0; tumblerGame.shakeAmp = 0;
  tumblerGame.generatorRef = st || null;
  const el = document.getElementById('tumblerMinigame');
  if(el){ el.classList.add('on'); el.classList.remove('fail'); }
  SFX.click();
  message('Замок генераторной. Подбери штифты — попади в зелёные зоны.','#e0c86a');
  drawTumblerGame();
}
function endTumblerGame(success){
  if(!tumblerGame.active) return;
  tumblerGame.active = false;
  const el = document.getElementById('tumblerMinigame');
  if(el){ el.classList.remove('on'); el.classList.remove('fail'); }
  const gen = tumblerGame.generatorRef;
  tumblerGame.generatorRef = null;
  if(success){
    SFX.pickup();
    message('Замок открыт! Панель генератора доступна.','#7fd68a');
    if(gen){ fuelGame._generator = gen; setTimeout(()=>{ if(G.state==='play' && !gen.used) startFuelGame(); }, 400); }
  } else { message('Замок заклинило. Придётся начинать заново.','#8a9a7a'); }
}
function tbGetPinX(i){ const pad = 24; const w = TB_CANVAS.width; const innerW = w - pad*2; return pad + innerW * ((i + 0.5) / tumblerGame.numPins); }
function tbGetPinY(pos){ const top = 50; const bot = TB_CANVAS.height - 30; return top + (bot - top) * pos; }
function tbHandleClick(clientX, clientY){
  if(!tumblerGame.active || !TB_CANVAS) return;
  const rect = TB_CANVAS.getBoundingClientRect();
  if(clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
  const scaleX = TB_CANVAS.width / rect.width;
  const mx = (clientX - rect.left) * scaleX;
  const pad = 24; const w = TB_CANVAS.width;
  const innerW = w - pad*2; const pinW = innerW / tumblerGame.numPins;
  const idx = Math.floor((mx - pad) / pinW);
  if(idx < 0 || idx >= tumblerGame.numPins) return;
  const p = tumblerGame.pins[idx]; if(!p || p.locked) return;
  const d = Math.abs(p.pos - p.zoneCenter);
  if(d <= p.zoneHalf){
    p.locked = true; p.flash = 0.6; p.lockAnim = 1;
    SFX.hideHit();
    const all = tumblerGame.pins.every(q=>q.locked);
    if(all){ tumblerGame.flashWin = 1; tumblerGame.winTimer = 0.7; SFX.pickup(); }
  } else {
    p.flash = -0.6; p.pos = Math.random(); p.speed = 0.55 + Math.random()*0.45;
    tumblerGame.flashMiss = 0.6; tumblerGame.shakeAmp = 10;
    SFX.hideMiss();
    G.stingFlash = Math.max(G.stingFlash, 0.35);
    const el = document.getElementById('tumblerMinigame');
    if(el){ el.classList.add('fail'); clearTimeout(tumblerGame._failT); tumblerGame._failT = setTimeout(()=>el.classList.remove('fail'), 300); }
  }
}
function updateTumblerGame(dt){
  if(!tumblerGame.active) return;
  if(tumblerGame.shakeAmp>0) tumblerGame.shakeAmp = Math.max(0, tumblerGame.shakeAmp - dt*40);
  if(tumblerGame.flashWin>0) tumblerGame.flashWin = Math.max(0, tumblerGame.flashWin - dt*1.6);
  if(tumblerGame.flashMiss>0) tumblerGame.flashMiss = Math.max(0, tumblerGame.flashMiss - dt*2.2);
  for(const p of tumblerGame.pins){
    if(!p.locked){ p.pos += p.dir * p.speed * dt; if(p.pos >= 1){ p.pos = 1; p.dir = -1; } if(p.pos <= 0){ p.pos = 0; p.dir = 1; } }
    else { if(p.lockAnim>0) p.lockAnim = Math.max(0, p.lockAnim - dt*2.5); }
    if(p.flash!==0){ if(p.flash>0) p.flash = Math.max(0, p.flash - dt*2); else p.flash = Math.min(0, p.flash + dt*2); }
  }
  if(tumblerGame.winTimer > 0){ tumblerGame.winTimer -= dt; if(tumblerGame.winTimer <= 0){ endTumblerGame(true); return; } }
  drawTumblerGame();
}
function drawTumblerGame(){
  if(!tbCtx || !TB_CANVAS) return;
  const w = TB_CANVAS.width, h = TB_CANVAS.height;
  tbCtx.setTransform(1,0,0,1,0,0);
  let sx=0, sy=0;
  if(tumblerGame.shakeAmp>0){ sx = (Math.random()-0.5)*tumblerGame.shakeAmp; sy = (Math.random()-0.5)*tumblerGame.shakeAmp; }
  tbCtx.fillStyle='#0a0c0a'; tbCtx.fillRect(0,0,w,h);
  tbCtx.save(); tbCtx.translate(sx, sy);
  tbCtx.strokeStyle='rgba(120,130,110,0.08)'; tbCtx.lineWidth=1;
  for(let x=0;x<w;x+=20){ tbCtx.beginPath(); tbCtx.moveTo(x,0); tbCtx.lineTo(x,h); tbCtx.stroke(); }
  for(let y=0;y<h;y+=20){ tbCtx.beginPath(); tbCtx.moveTo(0,y); tbCtx.lineTo(w,y); tbCtx.stroke(); }
  const top = 50; const bot = h - 30;
  const pad = 24; const innerW = w - pad*2; const pinW = innerW / tumblerGame.numPins;
  for(let i=0;i<tumblerGame.numPins;i++){
    const p = tumblerGame.pins[i];
    const cx = tbGetPinX(i);
    const px = pad + i*pinW;
    const locked = p.locked;
    tbCtx.fillStyle = 'rgba(20,24,20,0.9)'; tbCtx.fillRect(px+8, top, pinW-16, bot-top);
    tbCtx.strokeStyle = 'rgba(120,130,110,0.35)'; tbCtx.lineWidth = 1; tbCtx.strokeRect(px+8.5, top+0.5, pinW-17, bot-top-1);
    const zTop = top + (bot-top)*(p.zoneCenter - p.zoneHalf);
    const zBot = top + (bot-top)*(p.zoneCenter + p.zoneHalf);
    tbCtx.fillStyle = locked ? 'rgba(80,220,120,0.28)' : 'rgba(80,220,120,0.16)';
    tbCtx.fillRect(px+9, zTop, pinW-18, zBot-zTop);
    tbCtx.strokeStyle = locked ? 'rgba(140,255,160,0.9)' : 'rgba(120,255,160,0.65)';
    tbCtx.lineWidth = 1.5; tbCtx.strokeRect(px+9, zTop, pinW-18, zBot-zTop);
    tbCtx.strokeStyle = 'rgba(220,80,80,0.35)'; tbCtx.setLineDash([3,3]);
    tbCtx.beginPath(); tbCtx.moveTo(px+10, top+3); tbCtx.lineTo(px+pinW-10, top+3);
    tbCtx.moveTo(px+10, bot-3); tbCtx.lineTo(px+pinW-10, bot-3); tbCtx.stroke();
    tbCtx.setLineDash([]);
    const py = tbGetPinY(p.pos);
    let pinColor;
    if(locked) pinColor = '#7fd68a';
    else if(p.flash>0) pinColor = '#b8ffca';
    else if(p.flash<0) pinColor = '#e06060';
    else pinColor = '#e0c86a';
    if(!locked){
      tbCtx.save(); tbCtx.shadowColor = pinColor; tbCtx.shadowBlur = 12;
      tbCtx.fillStyle = pinColor; tbCtx.fillRect(px+14, py-4, pinW-28, 8); tbCtx.restore();
      tbCtx.fillStyle = 'rgba(0,0,0,0.55)'; tbCtx.beginPath(); tbCtx.arc(cx, py, 3, 0, 7); tbCtx.fill();
    } else {
      const zc = top + (bot-top)*p.zoneCenter;
      const glow = 0.55 + Math.sin(performance.now()*0.006 + i)*0.2;
      tbCtx.save(); tbCtx.shadowColor = '#7fd68a'; tbCtx.shadowBlur = 16*glow + 8;
      tbCtx.fillStyle = '#7fd68a'; tbCtx.fillRect(px+12, zc-4, pinW-24, 8); tbCtx.restore();
      tbCtx.fillStyle = 'rgba(255,255,180,'+(0.7+glow*0.3)+')';
      tbCtx.font = 'bold 11px Courier New'; tbCtx.textAlign = 'center'; tbCtx.textBaseline = 'middle';
      tbCtx.fillText('★', cx, zc - 14);
    }
    tbCtx.fillStyle = 'rgba(120,130,110,0.7)'; tbCtx.font = '10px Courier New'; tbCtx.textAlign = 'center'; tbCtx.textBaseline = 'top';
    tbCtx.fillText('#'+(i+1), cx, h-20);
  }
  tbCtx.fillStyle = 'rgba(0,0,0,0.55)'; tbCtx.fillRect(10, 8, 210, 26);
  tbCtx.strokeStyle = 'rgba(180,160,90,0.4)'; tbCtx.lineWidth = 1; tbCtx.strokeRect(10.5, 8.5, 209, 25);
  tbCtx.fillStyle = '#e0c86a'; tbCtx.font = 'bold 12px Courier New'; tbCtx.textAlign = 'left'; tbCtx.textBaseline = 'middle';
  const done = tumblerGame.pins.filter(p=>p.locked).length;
  tbCtx.fillText('ШТИФТЫ: ' + done + ' / ' + tumblerGame.numPins, 18, 22);
  if(tumblerGame.flashWin>0){ tbCtx.fillStyle = 'rgba(120,255,140,'+(tumblerGame.flashWin*0.35)+')'; tbCtx.fillRect(-20,-20,w+40,h+40); }
  if(tumblerGame.flashMiss>0){ tbCtx.fillStyle = 'rgba(255,60,60,'+(tumblerGame.flashMiss*0.32)+')'; tbCtx.fillRect(-20,-20,w+40,h+40); }
  tbCtx.restore();
}

/* ============ МОЗГ ============ */
function drawBrain(now){
  const w=brainCanvas.width, h=brainCanvas.height;
  const g=brainCtx;
  g.setTransform(1,0,0,1,0,0);
  g.clearRect(0,0,w,h);
  const sanity=clamp(player.sanity,0,100)/100;
  const t=now*0.001;
  const pulseSpeed=1.4+(1-sanity)*2.2;
  const pulseAmt=0.035+(1-sanity)*0.06;
  const pulse=1+Math.sin(t*pulseSpeed)*pulseAmt;
  const shakeAmp=(1-sanity)*1.6;
  const shakeX=Math.sin(t*23.7)*shakeAmp*(Math.random()<0.5?1:-1);
  const shakeY=Math.cos(t*19.3)*shakeAmp*(Math.random()<0.5?1:-1);
  const cx=w/2+shakeX;
  const cy=h/2+2+shakeY;
  let bright,mid,dark,glow;
  if(sanity>0.66){bright='#c088e8';mid='#9a55c8';dark='#4a2266';glow='rgba(180,110,220,0.45)';}
  else if(sanity>0.33){bright='#cc88b0';mid='#a05080';dark='#5a2040';glow='rgba(210,100,150,0.5)';}
  else {bright='#e07070';mid='#a03030';dark='#3a0808';glow='rgba(220,50,50,0.65)';}
  const glowGrad=g.createRadialGradient(cx,cy,0,cx,cy,w*0.55);
  glowGrad.addColorStop(0,glow); glowGrad.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=glowGrad; g.beginPath();g.arc(cx,cy,w*0.55,0,7);g.fill();
  g.save(); g.translate(cx,cy); g.scale(pulse,pulse);
  function brainPath(){
    g.beginPath();
    g.moveTo(0,-24);
    g.bezierCurveTo(-14,-26,-26,-18,-28,-6);
    g.bezierCurveTo(-30,2,-28,12,-22,18);
    g.bezierCurveTo(-16,24,-8,26,0,24);
    g.bezierCurveTo(8,26,16,24,22,18);
    g.bezierCurveTo(28,12,30,2,28,-6);
    g.bezierCurveTo(26,-18,14,-26,0,-24);
    g.closePath();
  }
  const bodyGrad=g.createRadialGradient(-6,-8,3,0,0,34);
  bodyGrad.addColorStop(0,bright); bodyGrad.addColorStop(0.55,mid); bodyGrad.addColorStop(1,dark);
  g.fillStyle=bodyGrad; brainPath();g.fill();
  g.strokeStyle=dark;g.lineWidth=1.6; brainPath();g.stroke();
  g.strokeStyle='rgba(0,0,0,0.42)'; g.lineWidth=1.5; g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(0,-22);g.quadraticCurveTo(1.5,0,0,22);g.stroke();
  g.beginPath();g.moveTo(-20,-14);g.quadraticCurveTo(-13,-10,-16,-4);g.stroke();
  g.beginPath();g.moveTo(-22,2);g.quadraticCurveTo(-14,5,-17,11);g.stroke();
  g.beginPath();g.moveTo(-12,-20);g.quadraticCurveTo(-8,-14,-12,-8);g.stroke();
  g.beginPath();g.moveTo(-13,8);g.quadraticCurveTo(-9,13,-12,18);g.stroke();
  g.beginPath();g.moveTo(14,-16);g.quadraticCurveTo(20,-10,16,-4);g.stroke();
  g.beginPath();g.moveTo(18,3);g.quadraticCurveTo(22,9,16,14);g.stroke();
  g.beginPath();g.moveTo(9,-21);g.quadraticCurveTo(5,-15,9,-9);g.stroke();
  g.beginPath();g.moveTo(10,10);g.quadraticCurveTo(14,15,10,20);g.stroke();
  g.fillStyle='rgba(255,255,255,0.16)';
  g.beginPath();g.ellipse(-11,-12,6,3.5,-0.45,0,7);g.fill();
  g.beginPath();g.ellipse(9,-13,3.5,2,0.4,0,7);g.fill();
  if(sanity<0.55){
    const dmg=(0.55-sanity)/0.55;
    g.strokeStyle='rgba(0,0,0,'+(0.55+dmg*0.4)+')'; g.lineWidth=1.5;
    g.beginPath(); g.moveTo(-18,-18);g.lineTo(-11,-8);g.lineTo(-15,2);g.lineTo(-7,12);g.lineTo(-12,21); g.stroke();
    if(dmg>0.4){ g.beginPath(); g.moveTo(14,-19);g.lineTo(9,-9);g.lineTo(15,1);g.lineTo(8,11); g.stroke(); }
  }
  if(sanity<0.3){
    const bloodAmp=(0.3-sanity)/0.3;
    const count=Math.floor(bloodAmp*8);
    for(let i=0;i<count;i++){
      const s=hash2(Math.floor(t*3)+i,i*7);
      const s2=hash2(i*13,Math.floor(t*3)+i);
      const bx=(s-0.5)*44; const by=(s2-0.5)*40;
      const r=1+hash2(i,i*3)*2.5;
      g.fillStyle='rgba(180,20,20,'+(0.55+Math.sin(t*4+i)*0.25)+')';
      g.beginPath();g.arc(bx,by,r,0,7);g.fill();
    }
  }
  g.restore();
  const pct=Math.round(player.sanity);
  brainPctEl.textContent=pct+'%';
  if(sanity>0.66){ brainPctEl.style.color='#a05fd6'; brainPctEl.style.textShadow='0 0 10px rgba(160,95,214,.6)'; }
  else if(sanity>0.33){ brainPctEl.style.color='#c070a0'; brainPctEl.style.textShadow='0 0 10px rgba(200,110,150,.7)'; }
  else { brainPctEl.style.color='#e06060'; brainPctEl.style.textShadow='0 0 12px rgba(220,60,60,.9)'; }
  brainPanelEl.classList.toggle('critical',sanity<0.22);
}

/* ============ ФАЙЛЫ ЗВУКОВ ============ */
const SAMPLE_FILES = [
  'boarSnort','pickup','deny','generator','heartbeat',
  'growl','roar','fnafScream','whisper','screech','deathScreech',
  'breathing','radioScream','distantBearRoar','distantDrum',
  'metalScrape','waterDrip','windHowl','win','lose'
];
const SAMPLE_VOLUMES = {
  distantBearRoar: 0.55,
  distantDrum:     0.45,
  windHowl:        0.55
};

/* ============ ЗВУК ============ */
const SFX={
  ctx:null,ready:false,samples:{},
  soundtrackEl:null, soundtrackTargetVol:0.35,
  init(){
    if(this.ready)return;
    try{
      this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      try{ this.ctx.resume(); }catch(e){}
      this.master=this.ctx.createGain();
      this.master.gain.value = 0.85 * (typeof SETTINGS!=='undefined' ? SETTINGS.sfx : 1);
      this.master.connect(this.ctx.destination);
      this.fearGain=this.ctx.createGain();
      this.fearGain.gain.value=0.0;
      this.fearGain.connect(this.master);
      this.ready=true;
      this.startAmbient();
      this.startSoundtrack();
      this.loadSamples();
      const resume = ()=>{ try{ if(this.ctx.state==='suspended') this.ctx.resume(); }catch(e){} };
      window.addEventListener('click', resume);
      window.addEventListener('keydown', resume);
      window.addEventListener('mousedown', resume);
      window.addEventListener('touchstart', resume);
      console.log('[SFX] audio context state:', this.ctx.state);
    }catch(e){console.warn('audio off', e);}
  },
  /* ─── ИСПРАВЛЕНО: звуки лежат рядом с index.html, без папки sounds/ ─── */
  loadSamples(){
    if(!this.ready) return;
    const exts = ['mp3','ogg','wav'];
    const basePath = '';
    SAMPLE_FILES.forEach(name => {
      let i = 0;
      const tryNext = () => {
        if(i >= exts.length){
          console.warn('[SFX] не найден файл:', name, '(пробовал .mp3/.ogg/.wav рядом с игрой)');
          return;
        }
        const url = basePath + name + '.' + exts[i++];
        fetch(url, {method:'GET'})
          .then(r => { if(!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
          .then(buf => {
            this.ctx.decodeAudioData(buf,
              decoded => { this.samples[name] = decoded; console.log('[SFX] loaded:', name); },
              err => { console.warn('[SFX] decode fail:', name, err); tryNext(); }
            );
          })
          .catch(err => { console.warn('[SFX] fetch fail:', url, err.message); tryNext(); });
      };
      tryNext();
    });
  },
  playSample(name, vol){
    if(!this.ready) return false;
    const buf = this.samples[name];
    if(!buf) return false;
    const c = this.ctx, t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = buf;
    const g = c.createGain();
    let baseVol = (vol === undefined ? 1 : vol);
    if(typeof SAMPLE_VOLUMES !== 'undefined' && SAMPLE_VOLUMES[name] !== undefined){
      baseVol *= SAMPLE_VOLUMES[name];
    }
    g.gain.value = Math.max(0, Math.min(1, baseVol));
    s.connect(g); g.connect(this.master);
    s.start(t);
    return true;
  },
  /* ─── ИСПРАВЛЕНО: не глотаем ошибки play() ─── */
  startSoundtrack(){
    if(this.soundtrackEl)return;
    const el=document.getElementById('soundtrack');
    if(!el)return;
    this.soundtrackEl=el;
    el.volume=0;
    el.loop=true;
    el.addEventListener('error', (e)=>{
      console.error('[Soundtrack] ошибка загрузки файла:', e.target && e.target.error);
    });
    const p=el.play();
    if(p&&p.catch)p.catch(err => console.warn('[Soundtrack] play() отклонён:', err));
  },
  setSoundtrackVolume(v){
    if(!this.soundtrackEl)return;
    this.soundtrackTargetVol = clamp(v * (typeof SETTINGS!=='undefined' ? SETTINGS.music : 1), 0, 1);
  },
  updateSoundtrackVolume(dt){
    if(!this.soundtrackEl)return;
    const cur=this.soundtrackEl.volume;
    const next=cur+(this.soundtrackTargetVol-cur)*Math.min(1,dt*2.5);
    try{this.soundtrackEl.volume=clamp(next,0,1);}catch(e){}
  },
  noiseBuf(){
    if(this._nb)return this._nb;
    const len=this.ctx.sampleRate*2;
    const b=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=b.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    this._nb=b;return b;
  },
  noise(dur,vol,freq,q,type,dest){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    const s=c.createBufferSource();s.buffer=this.noiseBuf();s.loop=true;
    const f=c.createBiquadFilter();f.type=type||'lowpass';f.frequency.value=freq;f.Q.value=q||1;
    const g=c.createGain();
    g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(f);f.connect(g);g.connect(dest||this.master);
    s.start(t);s.stop(t+dur+0.05);
  },
  tone(freq,dur,type,vol,slide,delay,dest){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime+(delay||0);
    const o=c.createOscillator();o.type=type||'sine';
    o.frequency.setValueAtTime(freq,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(15,slide),t+dur);
    const g=c.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol*1.5,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(dest||this.master);
    o.start(t);o.stop(t+dur+0.05);
  },
  startAmbient(){
    const c=this.ctx;
    this.ambGain=c.createGain();this.ambGain.gain.value=0.0;
    this.ambGain.connect(this.master);
    const o1=c.createOscillator();o1.type='sawtooth';o1.frequency.value=36;
    const o2=c.createOscillator();o2.type='sawtooth';o2.frequency.value=36.7;
    const o3=c.createOscillator();o3.type='triangle';o3.frequency.value=18;
    const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=130;f.Q.value=5;
    const g=c.createGain();g.gain.value=0.16;
    o1.connect(f);o2.connect(f);o3.connect(f);f.connect(g);g.connect(this.ambGain);
    o1.start();o2.start();o3.start();
    this.ambOsc=[o1,o2,o3];
    const s=c.createBufferSource();s.buffer=this.noiseBuf();s.loop=true;
    const wf=c.createBiquadFilter();wf.type='bandpass';wf.frequency.value=380;wf.Q.value=0.6;
    const wg=c.createGain();wg.gain.value=0.05;
    s.connect(wf);wf.connect(wg);wg.connect(this.ambGain);s.start();
    this.windGain=wg;
    const s2=c.createBufferSource();s2.buffer=this.noiseBuf();s2.loop=true;
    const bf=c.createBiquadFilter();bf.type='bandpass';bf.frequency.value=90;bf.Q.value=8;
    const bg=c.createGain();bg.gain.value=0.02;
    const lfo=c.createOscillator();lfo.frequency.value=0.09;
    const lfoGain=c.createGain();lfoGain.gain.value=0.025;
    lfo.connect(lfoGain);lfoGain.connect(bg.gain);lfo.start();
    s2.connect(bf);bf.connect(bg);bg.connect(this.ambGain);s2.start();
    this.breathGain=bg;
    this.ambGain.gain.linearRampToValueAtTime(0.75,c.currentTime+3);
  },
  setTension(v){
    if(!this.ready||!this.windGain)return;
    this.windGain.gain.value=0.045+v*0.16;
    if(this.ambOsc){
      this.ambOsc[0].frequency.value=36+v*16;
      this.ambOsc[1].frequency.value=36.7+v*16;
      this.ambOsc[2].frequency.value=18+v*8;
    }
    if(this.breathGain)this.breathGain.gain.value=0.015+v*0.09;
    if(this.fearGain)this.fearGain.gain.value=v*0.4;
  },
  step(){ this.noise(0.075,0.09,900,1.4,'bandpass'); },
  stepHeavy(){ this.noise(0.11,0.16,520,1.1,'bandpass'); },
  bearStep(vol){ this.noise(0.14,0.18*vol,320,1.3,'bandpass'); this.tone(62,0.1,'sine',0.13*vol,46); },
  boarSnort(){ this.tone(150,0.13,'sawtooth',0.11,72); this.noise(0.16,0.09,720,1.4,'bandpass'); },
  boarStep(vol){ this.noise(0.05,0.07*vol,820,1.6,'bandpass'); this.tone(78,0.04,'sine',0.05*vol,52); },
  pickup(){ this.tone(760,0.09,'sine',0.15,1100); this.tone(1180,0.13,'sine',0.09,1500,0.05); },
  click(){ this.tone(320,0.05,'square',0.07,240); },
  clickOff(){ this.tone(240,0.06,'square',0.06,150); },
  deny(){ this.tone(150,0.16,'square',0.10,90); },
  flare(){ this.noise(1.1,0.22,1800,0.6,'highpass'); this.tone(900,0.5,'sine',0.10,300); },
  hideEnter(){ this.tone(160,0.16,'sine',0.10,100); this.noise(0.3,0.12,460,1.1,'bandpass'); },
  hideExit(){ this.tone(220,0.12,'sine',0.08,260); },
  hideHit(){ this.tone(880,0.09,'sine',0.13,1200); this.tone(1320,0.14,'sine',0.09,1700,0.04); },
  hideMiss(){ this.tone(200,0.2,'sawtooth',0.14,80); this.noise(0.15,0.10,400,1.5,'lowpass'); },
  generator(){ this.tone(74,1.4,'sawtooth',0.20,110); this.noise(1.2,0.16,300,0.8,'lowpass'); },
  radioStatic(){ this.noise(0.4,0.07,2400,0.6,'bandpass'); },
  mapOpen(){ this.tone(520,0.1,'sine',0.08,700); this.noise(0.2,0.06,1800,1.5,'bandpass'); },
  mapClose(){ this.tone(380,0.1,'sine',0.06,250); },
  heartbeat(intense){
    const v=intense?0.28:0.15;
    this.tone(58,0.16,'sine',v,42);
    this.tone(52,0.19,'sine',v*0.8,36,0.22);
  },
  growl(v){
    v=v||1;
    this.tone(88*v,0.9,'sawtooth',0.32,34*v);
    this.tone(93*v,0.85,'sawtooth',0.24,40*v,0.04);
    this.tone(46*v,1.1,'triangle',0.28,26*v);
    this.noise(0.8,0.20,240,1.8,'lowpass');
  },
  roar(){
    this.tone(115,1.6,'sawtooth',0.42,38);
    this.tone(118,1.55,'sawtooth',0.32,44,0.05);
    this.noise(1.6,0.40,360,1.2,'lowpass');
    this.tone(58,1.9,'triangle',0.34,26);
  },
  fnafScream(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    const master=this.master;
    const baseFreqs=[110,163,220,330,466,622];
    baseFreqs.forEach((f,i)=>{
      const o=c.createOscillator();
      o.type = (i%2===0)?'sawtooth':'square';
      o.frequency.setValueAtTime(f*4, t);
      o.frequency.exponentialRampToValueAtTime(f*1.1, t+1.15);
      const g=c.createGain();
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.14,t+0.008);
      g.gain.exponentialRampToValueAtTime(0.0001,t+1.2);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t+1.25);
    });
    [2400,3100,3700,4300,5100].forEach((f,i)=>{
      const o=c.createOscillator();
      o.type='sawtooth';
      o.frequency.setValueAtTime(f,t+i*0.005);
      o.frequency.exponentialRampToValueAtTime(f*0.55,t+0.9);
      const g=c.createGain();
      g.gain.setValueAtTime(0.0001,t+i*0.005);
      g.gain.exponentialRampToValueAtTime(0.09,t+i*0.005+0.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t+i*0.005+1.0);
      o.connect(g); g.connect(master);
      o.start(t+i*0.005); o.stop(t+i*0.005+1.05);
    });
    [480,720,1040,1550,2230].forEach((f,i)=>{
      const o=c.createOscillator();
      o.type='triangle';
      o.frequency.setValueAtTime(f,t);
      o.frequency.exponentialRampToValueAtTime(f*0.7,t+0.35);
      const g=c.createGain();
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.11,t+0.004);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.4);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t+0.45);
    });
    this.noise(0.35, 0.42, 4200, 0.5, 'highpass');
    this.noise(0.6,  0.36, 800,  0.9, 'lowpass');
    this.noise(0.9, 0.22, 2600, 0.7, 'bandpass');
    this.noise(0.7, 0.18, 1400, 1.2, 'bandpass');
    const sub=c.createOscillator();
    sub.type='sine';
    sub.frequency.setValueAtTime(90,t);
    sub.frequency.exponentialRampToValueAtTime(24,t+0.9);
    const sg=c.createGain();
    sg.gain.setValueAtTime(0.0001,t);
    sg.gain.exponentialRampToValueAtTime(0.32,t+0.01);
    sg.gain.exponentialRampToValueAtTime(0.0001,t+1.0);
    sub.connect(sg); sg.connect(master);
    sub.start(t); sub.stop(t+1.05);
    const lfoO=c.createOscillator();
    lfoO.type='square'; lfoO.frequency.value=32;
    const lfoG=c.createGain(); lfoG.gain.value=18;
    const lfoCar=c.createOscillator();
    lfoCar.type='sawtooth'; lfoCar.frequency.value=1800;
    lfoO.connect(lfoG); lfoG.connect(lfoCar.frequency);
    const lfoGain=c.createGain();
    lfoGain.gain.setValueAtTime(0.0001,t);
    lfoGain.gain.exponentialRampToValueAtTime(0.06,t+0.02);
    lfoGain.gain.exponentialRampToValueAtTime(0.0001,t+0.65);
    lfoCar.connect(lfoGain); lfoGain.connect(master);
    lfoO.start(t); lfoCar.start(t);
    lfoO.stop(t+0.7); lfoCar.stop(t+0.7);
  },
  hurt(){ this.noise(0.28,0.32,700,1.0,'lowpass'); this.tone(180,0.3,'square',0.15,70); },
  whisper(){
    this.noise(1.4,0.08,1700,5.5,'bandpass');
    this.noise(1.1,0.05,2400,8,'bandpass',null);
    this.tone(220,0.7,'sine',0.04,180);
  },
  screech(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    [2400,2600,3100,3300,3800].forEach(f=>{
      const o=c.createOscillator();o.type='sawtooth';
      o.frequency.setValueAtTime(f,t);
      o.frequency.exponentialRampToValueAtTime(f*0.4,t+1.2);
      const g=c.createGain();
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.10,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+1.2);
      o.connect(g);g.connect(this.master);
      o.start(t);o.stop(t+1.3);
    });
    const o=c.createOscillator();o.type='sawtooth';
    o.frequency.setValueAtTime(140,t);
    o.frequency.exponentialRampToValueAtTime(48,t+1.2);
    const g=c.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.32,t+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+1.3);
    o.connect(g);g.connect(this.master);
    o.start(t);o.stop(t+1.4);
    this.noise(1.1,0.34,2800,0.5,'highpass');
    this.noise(0.9,0.26,600,0.9,'lowpass');
  },
  deathScreech(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    [120,90,70,55,42].forEach((f,i)=>{
      const o=c.createOscillator();o.type='sawtooth';
      o.frequency.setValueAtTime(f*3,t+i*0.15);
      o.frequency.exponentialRampToValueAtTime(f,t+i*0.15+1.6);
      const g=c.createGain();
      g.gain.setValueAtTime(0.0001,t+i*0.15);
      g.gain.exponentialRampToValueAtTime(0.20,t+i*0.15+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+i*0.15+1.7);
      o.connect(g);g.connect(this.master);
      o.start(t+i*0.15);o.stop(t+i*0.15+1.8);
    });
    this.noise(2.2,0.32,900,0.7,'lowpass');
    this.noise(2.0,0.22,3400,0.4,'highpass');
  },
  stinger(){
    this.tone(1800,0.35,'sawtooth',0.20,140);
    this.tone(2400,0.3,'sawtooth',0.14,180,0.03);
    this.noise(0.5,0.28,2800,0.6,'highpass');
    this.tone(62,1.0,'triangle',0.24,26);
  },
  treeCrack(){
    for(let i=0;i<8;i++){
      this.noise(0.08,0.14,600+Math.random()*800,2,'bandpass',null);
      this.tone(180+Math.random()*300,0.06,'square',0.06,100,i*0.09);
    }
    this.tone(48,1.2,'sawtooth',0.18,26,0.5);
    this.noise(1.0,0.20,220,1.0,'lowpass');
  },
  breathing(){ this.noise(0.6,0.15,180,2.5,'bandpass'); this.noise(0.5,0.10,240,2.5,'bandpass',null); },
  radioScream(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    const o=c.createOscillator();o.type='square';
    o.frequency.setValueAtTime(280,t);
    o.frequency.setValueAtTime(320,t+0.15);
    o.frequency.setValueAtTime(190,t+0.4);
    o.frequency.setValueAtTime(340,t+0.7);
    const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1200;f.Q.value=4;
    const g=c.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.14,t+0.05);
    g.gain.exponentialRampToValueAtTime(0.0001,t+1.1);
    o.connect(f);f.connect(g);g.connect(this.master);
    o.start(t);o.stop(t+1.2);
    this.noise(1.0,0.08,2000,1.5,'bandpass');
  },
  distantBearRoar(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    const o=c.createOscillator();o.type='sawtooth';
    o.frequency.setValueAtTime(72,t);
    o.frequency.exponentialRampToValueAtTime(48,t+2.4);
    const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=320;f.Q.value=3;
    const g=c.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.14,t+0.4);
    g.gain.exponentialRampToValueAtTime(0.09,t+1.4);
    g.gain.exponentialRampToValueAtTime(0.0001,t+2.6);
    o.connect(f);f.connect(g);g.connect(this.master);
    o.start(t);o.stop(t+2.7);
    const o2=c.createOscillator();o2.type='triangle';
    o2.frequency.setValueAtTime(58,t+0.3);
    o2.frequency.exponentialRampToValueAtTime(38,t+2.5);
    const g2=c.createGain();
    g2.gain.setValueAtTime(0.0001,t+0.3);
    g2.gain.exponentialRampToValueAtTime(0.08,t+0.7);
    g2.gain.exponentialRampToValueAtTime(0.0001,t+2.6);
    o2.connect(g2);g2.connect(this.master);
    o2.start(t+0.3);o2.stop(t+2.7);
    this.noise(2.0, 0.06, 220, 1.5, 'lowpass');
  },
  distantDrum(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    for(let i=0;i<4;i++){
      const d = i * 0.7;
      const o = c.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(88, t+d);
      o.frequency.exponentialRampToValueAtTime(42, t+d+0.35);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t+d);
      g.gain.exponentialRampToValueAtTime(0.16, t+d+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t+d+0.5);
      o.connect(g); g.connect(this.master);
      o.start(t+d); o.stop(t+d+0.55);
      this.noise(0.2, 0.06, 260, 1.4, 'lowpass');
    }
  },
  metalScrape(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    for(let i=0;i<3;i++){
      const f = 800 + i * 400 + Math.random()*300;
      const o = c.createOscillator(); o.type='sawtooth';
      o.frequency.setValueAtTime(f, t+i*0.12);
      o.frequency.exponentialRampToValueAtTime(f*2.4, t+i*0.12+0.5);
      const flt = c.createBiquadFilter(); flt.type='bandpass'; flt.frequency.value=f*1.5; flt.Q.value=8;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t+i*0.12);
      g.gain.exponentialRampToValueAtTime(0.07, t+i*0.12+0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t+i*0.12+0.55);
      o.connect(flt); flt.connect(g); g.connect(this.master);
      o.start(t+i*0.12); o.stop(t+i*0.12+0.6);
    }
  },
  waterDrip(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    for(let i=0;i<5;i++){
      const d = i * (0.6 + Math.random()*0.4);
      const o = c.createOscillator(); o.type='sine';
      const f0 = 1400 + Math.random()*400;
      o.frequency.setValueAtTime(f0, t+d);
      o.frequency.exponentialRampToValueAtTime(f0*0.4, t+d+0.16);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t+d);
      g.gain.exponentialRampToValueAtTime(0.06, t+d+0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t+d+0.2);
      o.connect(g); g.connect(this.master);
      o.start(t+d); o.stop(t+d+0.22);
    }
  },
  windHowl(){
    if(!this.ready)return;
    const c=this.ctx,t=c.currentTime;
    const o = c.createOscillator(); o.type='sawtooth';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(280, t+0.6);
    o.frequency.exponentialRampToValueAtTime(120, t+2.6);
    const flt = c.createBiquadFilter(); flt.type='lowpass'; flt.frequency.value=580; flt.Q.value=6;
    const lfo = c.createOscillator(); lfo.frequency.value=5.2;
    const lfoG = c.createGain(); lfoG.gain.value=80;
    lfo.connect(lfoG); lfoG.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.08,t+0.5);
    g.gain.exponentialRampToValueAtTime(0.05,t+1.8);
    g.gain.exponentialRampToValueAtTime(0.0001,t+2.8);
    o.connect(flt); flt.connect(g); g.connect(this.master);
    o.start(t); o.stop(t+2.9);
    lfo.start(t); lfo.stop(t+2.9);
    this.noise(2.5, 0.04, 900, 1.2, 'bandpass');
  },
  win(){ [523,659,784,1046].forEach((f,i)=>this.tone(f,0.5,'sine',0.16,null,i*0.16)); },
  lose(){ [220,180,140,90].forEach((f,i)=>this.tone(f,0.9,'sawtooth',0.16,f*0.6,i*0.22)); }
};

// Обёртка: если загружен файл — играем его, иначе процедурный синтез
SAMPLE_FILES.forEach(name => {
  const orig = SFX[name];
  if(typeof orig !== 'function') return;
  SFX[name] = function(...args){
    if(this.samples && this.samples[name]){
      const vol = (typeof args[0] === 'number' && args[0] > 0 && args[0] <= 3) ? Math.min(1, args[0]) : 1;
      return this.playSample(name, vol);
    }
    return orig.apply(this, args);
  };
});

/* ============ КАРТА ============ */
let map=new Uint8Array(MAP_W*MAP_H);
let mapCanvas=document.createElement('canvas');
let roadTiles=[];

const idx=(x,y)=>y*MAP_W+x;
function getTile(x,y){ if(x<0||y<0||x>=MAP_W||y>=MAP_H)return T_TREE; return map[idx(x,y)]; }
function setTile(x,y,t){ if(x<0||y<0||x>=MAP_W||y>=MAP_H)return; map[idx(x,y)]=t; }
function isSolid(x,y){ const t=getTile(x,y); return t===T_TREE||t===T_WALL; }
function isSolidPx(px,py){ return isSolid(Math.floor(px/TILE),Math.floor(py/TILE)); }

function clearRect(x,y,w,h){ for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)setTile(i,j,T_EMPTY); }
function carveLine(x0,y0,x1,y1,w){
  w=w||1;
  let x=x0,y=y0,guard=0;
  while((x!==x1||y!==y1)&&guard++<400){
    for(let dy=-w;dy<=w;dy++)for(let dx=-w;dx<=w;dx++){
      const t=getTile(x+dx,y+dy);
      if(t!==T_WALL&&t!==T_DOOR)setTile(x+dx,y+dy,T_EMPTY);
    }
    const dx=Math.sign(x1-x),dy=Math.sign(y1-y);
    if(dx!==0&&(dy===0||Math.abs(x1-x)>=Math.abs(y1-y)))x+=dx;
    else if(dy!==0)y+=dy;
    else if(dx!==0)x+=dx;
  }
}
function placeBuilding(x,y,w,h,doorX,doorY){
  clearRect(x-4,y-4,w+8,h+8);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const edge=(i===0||j===0||i===w-1||j===h-1);
    setTile(x+i,y+j,edge?T_WALL:T_FLOOR);
  }
  setTile(doorX,doorY,T_DOOR);
}
function buildArena(){
  ARENA.cx = ARENA.tx * TILE;
  ARENA.cy = ARENA.ty * TILE;
  ARENA.radiusPx = ARENA.radiusTiles * TILE;
  const r = ARENA.radiusTiles;
  for(let dy=-r-1; dy<=r+1; dy++){
    for(let dx=-r-1; dx<=r+1; dx++){
      const d2 = dx*dx + dy*dy;
      if(d2 <= r*r){ setTile(ARENA.tx+dx, ARENA.ty+dy, T_EMPTY); }
    }
  }
  const ringR = r + 1.4;
  for(let a=0; a<Math.PI*2; a+=Math.PI/32){
    const px = Math.round(ARENA.tx + Math.cos(a)*ringR);
    const py = Math.round(ARENA.ty + Math.sin(a)*ringR);
    const dx = px - ARENA.tx, dy = py - ARENA.ty;
    const ang = Math.atan2(dy, dx);
    const isGap = Math.abs(Math.sin(ang)) < 0.13 || Math.abs(Math.cos(ang)) < 0.13;
    if(!isGap) setTile(px, py, T_WALL);
  }
  ARENA.built = true;
}
function generateMap(){
  _seed=(crypto.getRandomValues(new Uint32Array(1))[0]||Date.now())>>>0;
  map.fill(T_TREE);
  roadTiles=[];
  let cx=MAP_W>>1,cy=MAP_H>>1;
  const steps=Math.floor(MAP_W*MAP_H*5.2);
  for(let i=0;i<steps;i++){
    const r=(srand()<0.34)?1:0;
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)
      if(dx*dx+dy*dy<=r*r+1)setTile(cx+dx,cy+dy,T_EMPTY);
    const d=Math.floor(srand()*4);
    if(d===0)cx++;else if(d===1)cx--;else if(d===2)cy++;else cy--;
    cx=clamp(cx,3,MAP_W-4);cy=clamp(cy,3,MAP_H-4);
  }
  const blobCount=Math.floor(MAP_W*MAP_H/220);
  for(let i=0;i<blobCount;i++){
    const x=4+Math.floor(srand()*(MAP_W-8)),y=4+Math.floor(srand()*(MAP_H-8));
    const r=3+Math.floor(srand()*8);
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)
      if(dx*dx+dy*dy<=r*r)setTile(x+dx,y+dy,T_EMPTY);
  }
  let rx=Math.floor(MAP_W/2);
  for(let y=MAP_H-5;y>=7;y--){
    for(let dx=-2;dx<=2;dx++){ setTile(rx+dx,y,T_EMPTY); if(dx>=-1&&dx<=1)roadTiles.push([rx+dx,y]); }
    if(y>MAP_H*0.22 && srand()<0.38)rx+=(srand()<0.5?-1:1);
    rx=clamp(rx,18,MAP_W-19);
  }
  const margin=14;
  const placed=[];
  const pickBuilding=(minX,maxX,minY,maxY,w,h)=>{
    for(let tries=0;tries<160;tries++){
      const x=minX+Math.floor(srand()*Math.max(1,maxX-minX-w+1));
      const y=minY+Math.floor(srand()*Math.max(1,maxY-minY-h+1));
      if(getTile(x,y)===T_WALL||getTile(x+w-1,y)===T_WALL)continue;
      let tooClose=false;
      for(const b of placed){ const d=dist(x+w/2,y+h/2,b.x+b.w/2,b.y+b.h/2); if(d<30){tooClose=true;break;} }
      if(tooClose)continue;
      return {x,y,w,h,dx:x+Math.floor(w/2),dy:y+h-1};
    }
    return {x:minX,y:minY,w,h,dx:minX+Math.floor(w/2),dy:minY+h-1};
  };
  const makeOne=(minX,maxX,minY,maxY)=>{
    const w=8+Math.floor(srand()*5); const h=7+Math.floor(srand()*5);
    const b=pickBuilding(minX,maxX,minY,maxY,w,h);
    placed.push(b); return b;
  };
  const qSplitX=Math.floor(MAP_W/2)+Math.floor(srand()*20-10);
  const qSplitY=Math.floor(MAP_H/2)+Math.floor(srand()*20-10);
  const buildings=[
    makeOne(margin,qSplitX-12,margin,qSplitY-12),
    makeOne(qSplitX+12,MAP_W-margin-12,margin,qSplitY-12),
    makeOne(margin,qSplitX-12,qSplitY+12,MAP_H-margin-12),
    makeOne(qSplitX+12,MAP_W-margin-12,qSplitY+12,MAP_H-margin-12)
  ];
  buildings.forEach(b=>placeBuilding(b.x,b.y,b.w,b.h,b.dx,b.dy));
  buildings.forEach(b=>{
    let best=null,bd=1e9;
    for(const rt of roadTiles){ const d=dist(b.dx,b.dy,rt[0],rt[1]); if(d<bd){bd=d;best=rt;} }
    if(best)carveLine(b.dx,b.dy,best[0],best[1],1);
  });
  const gateX=Math.floor(MAP_W/2-10+srand()*21);
  for(let i=gateX-7;i<=gateX+7;i++)setTile(i,4,T_WALL);
  setTile(gateX,4,T_DOOR);
  clearRect(gateX-3,2,7,2);
  clearRect(gateX-3,5,7,3);
  carveLine(gateX,7,gateX,10,1);
  const locNames=['ДОМ РЫБАКА','ДОМ ЕГЕРЕЙ','ГЕНЕРАТОРНАЯ','РАДИОВЫШКА'];
  const locSides=['СЕВЕРО-ЗАПАД','СЕВЕРО-ВОСТОК','ЮГО-ЗАПАД','ЮГО-ВОСТОК'];
  GENERATED_BUILDINGS=buildings.map(b=>({...b}));
  buildings.forEach((b,i)=>{
    LOCATIONS[i].x=b.dx; LOCATIONS[i].y=b.dy; LOCATIONS[i].side=locSides[i]; LOCATIONS[i].name=locNames[i];
  });
  LOCATIONS[4].x=gateX; LOCATIONS[4].y=4; LOCATIONS[4].side='СЕВЕР';
  const bushCount=Math.floor(MAP_W*MAP_H*0.04);
  for(let i=0;i<bushCount;i++){
    const x=1+Math.floor(srand()*(MAP_W-2)),y=1+Math.floor(srand()*(MAP_H-2));
    if(getTile(x,y)===T_EMPTY&&srand()<0.58)setTile(x,y,T_BUSH);
  }
  for(let p=0;p<3;p++){
    const wx=20+Math.floor(srand()*(MAP_W-40)),wy=20+Math.floor(srand()*(MAP_H-40));
    for(let dy=-5;dy<=5;dy++)for(let dx=-7;dx<=7;dx++)
      if(dx*dx/49+dy*dy/25<1&&getTile(wx+dx,wy+dy)===T_EMPTY)setTile(wx+dx,wy+dy,T_WATER);
  }
  for(let i=0;i<MAP_W;i++)setTile(i,0,T_TREE),setTile(i,MAP_H-1,T_TREE);
  for(let y=0;y<MAP_H;y++)setTile(0,y,T_TREE),setTile(MAP_W-1,y,T_TREE);
  const startX=Math.floor(MAP_W/2),startY=MAP_H-6;
  clearRect(startX-3,startY-2,7,5);
  carveLine(startX,startY,Math.floor(MAP_W/2),Math.max(7,startY-50),1);
  carveLine(startX,startY,ARENA.tx,ARENA.ty - ARENA.radiusTiles - 4, 1);
  const reach=floodFill(startX,startY);
  for(let y=0;y<MAP_H;y++)for(let x=0;x<MAP_W;x++){
    const t=getTile(x,y);
    if((t===T_EMPTY||t===T_BUSH||t===T_FLOOR||t===T_DOOR||t===T_WATER)&&!reach[idx(x,y)])
      setTile(x,y,T_TREE);
  }
  buildArena();
  buildMapCanvas();
}
function floodFill(sx,sy){
  const vis=new Uint8Array(MAP_W*MAP_H);
  const q=[idx(sx,sy)];vis[q[0]]=1;
  while(q.length){
    const c=q.pop();
    const x=c%MAP_W,y=(c/MAP_W)|0;
    const nb=[[1,0],[-1,0],[0,1],[0,-1]];
    for(let k=0;k<4;k++){
      const nx=x+nb[k][0],ny=y+nb[k][1];
      if(nx<0||ny<0||nx>=MAP_W||ny>=MAP_H)continue;
      const ni=idx(nx,ny);
      if(vis[ni])continue;
      if(isSolid(nx,ny))continue;
      vis[ni]=1;q.push(ni);
    }
  }
  return vis;
}
function buildMapCanvas(){
  mapCanvas.width=MAP_W*TILE;
  mapCanvas.height=MAP_H*TILE;
  const g=mapCanvas.getContext('2d');
  for(let y=0;y<MAP_H;y++){
    for(let x=0;x<MAP_W;x++){
      const t=getTile(x,y);
      const px=x*TILE,py=y*TILE;
      const n=hash2(x,y),n2=hash2(x+91,y+17);
      if(t===T_EMPTY||t===T_BUSH){
        g.fillStyle=n<0.33?'#141c11':(n<0.66?'#111810':'#16200f');
        g.fillRect(px,py,TILE,TILE);
        g.fillStyle='rgba(255,255,255,0.012)';
        for(let k=0;k<4;k++){ const a=hash2(x*7+k,y*13+k); g.fillRect(px+a*TILE,py+hash2(x+k,y*3+k)*TILE,2,2); }
        if(t===T_BUSH){
          g.fillStyle='#1a2c12';
          for(let k=0;k<5;k++){ const a=hash2(x*11+k,y*5+k),b=hash2(x*3+k,y*17+k); g.beginPath(); g.arc(px+6+a*(TILE-12),py+6+b*(TILE-12),5+n2*4,0,7); g.fill(); }
          g.fillStyle='#243a18'; g.beginPath();g.arc(px+TILE*0.5,py+TILE*0.45,6,0,7);g.fill();
        }
      }
      else if(t===T_TREE){
        g.fillStyle='#080d06';g.fillRect(px,py,TILE,TILE);
        const ox=(n-0.5)*7,oy=(n2-0.5)*7;
        g.fillStyle='#0f1a0a'; g.beginPath();g.arc(px+TILE/2+ox,py+TILE/2+oy,TILE*0.62,0,7);g.fill();
        g.fillStyle='#16260f'; g.beginPath();g.arc(px+TILE/2+ox-2,py+TILE/2+oy-2,TILE*0.46,0,7);g.fill();
        g.fillStyle='#1e3315'; g.beginPath();g.arc(px+TILE/2+ox-5,py+TILE/2+oy-5,TILE*0.27,0,7);g.fill();
      }
      else if(t===T_WALL){
        g.fillStyle='#2e2820';g.fillRect(px,py,TILE,TILE);
        g.fillStyle='#3a3228';g.fillRect(px+2,py+2,TILE-4,TILE-4);
        g.strokeStyle='rgba(0,0,0,0.45)';g.lineWidth=1; g.strokeRect(px+2.5,py+2.5,TILE-5,TILE-5);
        g.fillStyle='rgba(0,0,0,0.22)';
        for(let k=0;k<3;k++)g.fillRect(px+3,py+8+k*9,TILE-6,1);
      }
      else if(t===T_FLOOR){
        g.fillStyle=n<0.5?'#1c1813':'#191510';g.fillRect(px,py,TILE,TILE);
        g.strokeStyle='rgba(0,0,0,0.35)'; g.strokeRect(px+0.5,py+0.5,TILE-1,TILE-1);
        g.fillStyle='rgba(255,255,255,0.014)'; g.fillRect(px+4,py+4,3,3);
      }
      else if(t===T_DOOR){
        g.fillStyle='#241a0e';g.fillRect(px,py,TILE,TILE);
        g.fillStyle='#3d2c14';g.fillRect(px+3,py+3,TILE-6,TILE-6);
        g.fillStyle='#6b5228'; g.beginPath();g.arc(px+TILE-9,py+TILE/2,2.2,0,7);g.fill();
      }
      else if(t===T_WATER){
        g.fillStyle='#0a1620';g.fillRect(px,py,TILE,TILE);
        g.fillStyle='rgba(60,120,150,0.09)'; g.fillRect(px,py+(n*20),TILE,6);
      }
    }
  }
}

/* ============ ПОИСК ПУТИ ============ */
class MinHeap{
  constructor(){this.a=[];}
  push(n){const a=this.a;a.push(n);let i=a.length-1; while(i>0){const p=(i-1)>>1;if(a[p].f<=a[i].f)break;const t=a[p];a[p]=a[i];a[i]=t;i=p;}}
  pop(){const a=this.a;const top=a[0];const last=a.pop(); if(a.length){a[0]=last;let i=0; for(;;){let l=2*i+1,r=l+1,m=i; if(l<a.length&&a[l].f<a[m].f)m=l; if(r<a.length&&a[r].f<a[m].f)m=r; if(m===i)break;const t=a[m];a[m]=a[i];a[i]=t;i=m;}} return top;}
  get size(){return this.a.length;}
}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const _g=new Float32Array(MAP_W*MAP_H);
const _cf=new Int32Array(MAP_W*MAP_H);
const _cl=new Uint8Array(MAP_W*MAP_H);
function findPath(sx,sy,tx,ty,maxIter){
  maxIter=maxIter||7000;
  if(tx<0||ty<0||tx>=MAP_W||ty>=MAP_H)return null;
  if(isSolid(tx,ty))return null;
  _g.fill(Infinity);_cf.fill(-1);_cl.fill(0);
  const heap=new MinHeap();
  const s=idx(sx,sy),goal=idx(tx,ty);
  _g[s]=0; heap.push({i:s,f:Math.hypot(tx-sx,ty-sy)});
  let found=false,iter=0;
  while(heap.size&&iter++<maxIter){
    const cur=heap.pop();
    const ci=cur.i;
    if(_cl[ci])continue;
    _cl[ci]=1;
    if(ci===goal){found=true;break;}
    const cx=ci%MAP_W,cy=(ci/MAP_W)|0;
    for(let d=0;d<8;d++){
      const dx=DIRS[d][0],dy=DIRS[d][1];
      const nx=cx+dx,ny=cy+dy;
      if(nx<0||ny<0||nx>=MAP_W||ny>=MAP_H)continue;
      if(isSolid(nx,ny))continue;
      if(dx&&dy&&(isSolid(cx+dx,cy)||isSolid(cx,cy+dy)))continue;
      const ni=idx(nx,ny);
      if(_cl[ni])continue;
      const cost=(dx&&dy)?1.4142:1;
      const ng=_g[ci]+cost;
      if(ng<_g[ni]){ _g[ni]=ng;_cf[ni]=ci; heap.push({i:ni,f:ng+Math.hypot(nx-tx,ny-ty)*1.06}); }
    }
  }
  if(!found)return null;
  const path=[];
  let cur=goal;
  while(cur!==-1&&cur!==s){path.push({x:cur%MAP_W,y:(cur/MAP_W)|0});cur=_cf[cur];}
  path.reverse();
  return path;
}

/* ============ СОСТОЯНИЕ ============ */
const G={ state:'title', time:0, dt:0, shake:0, dmgFlash:0, stingFlash:0, deaths:0, hidesUsed:0, boarsStunned:0, fov:1, fogPhase:0, scareActive:false, scareT:0, scareDuration:0, scareCooldown:8, lastBiteScare:-999, eventT:0, ambientEventT:12 };
const player={ x:0,y:0,angle:-Math.PI/2,radius:9, hp:100,maxHp:100, stamina:100,maxStamina:100, battery:100, sanity:100, flashlight:true, speed:118, runSpeed:196, moving:false, sprinting:false, noise:0, medkits:1, batteries:0, flares:2, hasKey:false, hasFuel:false, hasRadio:false, stepTimer:0, hidden:false, hiddenTimer:0, hidePosition:null, invuln:0, exhausted:false, fear:0 };
const flickerState = { nextT: 6 + Math.random() * 12, activeT: 0, duration: 0, intensity: 0, seedPhase: 0 };
let bears=[]; let boars=[]; let items=[]; let structures=[]; let flareObjects=[]; let particles=[]; let footprintTrails=[]; let explored=null; let lastMinimapPaint=0;
let objectives=[]; let currentObjective=null; let objectivesDone={}; let collectedNotes=[];

function initObjectives(){
  objectivesDone={};
  objectives=[
    {id:'key',   text:'Ключ — в Доме рыбака (северо-запад)', tx:13,ty:12},
    {id:'fuel',  text:'Топливо — в Доме егерей (северо-восток)', tx:60,ty:12},
    {id:'gen',   text:'Запустить генератор в Генераторной', tx:13,ty:60, req:['key','fuel']},
    {id:'radio', text:'Передать сигнал с Радиовышки', tx:60,ty:60, req:['gen']},
    {id:'escape',text:'Сбежать через Северные ворота', tx:37,ty:3, req:['radio']}
  ];
  updateObjective();
}
function updateObjective(){
  currentObjective=null;
  for(const o of objectives){
    if(objectivesDone[o.id])continue;
    if(o.req&&!o.req.every(r=>objectivesDone[r]))continue;
    currentObjective=o;break;
  }
  renderObjectives();
}
function completeObjective(id){
  if(objectivesDone[id])return;
  objectivesDone[id]=true;
  const o=objectives.find(x=>x.id===id);
  if(o)message('✓ '+o.text,'#7fd68a');
  SFX.pickup();
  updateObjective();
  const done=Object.keys(objectivesDone).length;
  bears.forEach(b=>{ b.baseSpeed+=5;b.speed=b.baseSpeed; b.sightRange+=16;b.hearingRange+=22; });
  boars.forEach(b=>{ b.baseSpeed+=4;b.speed=b.baseSpeed; b.sightRange+=12;b.hearingRange+=16; });
  if(done>=3)message('Лес становится тише... они знают, что ты близко.','#c98a2a');
  if(done===5)message('ВСЁ ГОТОВО. БЕГИ К СЕВЕРНЫМ ВОРОТАМ.','#e0a83a');
}
function renderObjectives(){
  const el=document.getElementById('objList'); el.innerHTML='';
  objectives.forEach(o=>{
    const d=document.createElement('div');
    d.className='obj'+(objectivesDone[o.id]?' done':(currentObjective&&currentObjective.id===o.id?' active':''));
    d.textContent=o.text;
    el.appendChild(d);
  });
}
function message(text,color){
  const box=document.getElementById('messages');
  const d=document.createElement('div');
  d.className='msg';
  if(color)d.style.color=color;
  d.textContent=text;
  box.appendChild(d);
  setTimeout(()=>{d.style.transition='opacity .6s';d.style.opacity='0';setTimeout(()=>d.remove(),650);},3600);
  while(box.children.length>4)box.removeChild(box.firstChild);
}
function addItem(type,x,y,extra){
  const base={
    key:{name:'Ключ от генераторной',icon:'🗝',r:22},
    fuel:{name:'Канистра с топливом',icon:'⛽',r:22},
    battery:{name:'Батарея',icon:'🔋',r:20},
    medkit:{name:'Аптечка',icon:'✚',r:20},
    flare:{name:'Фальшфейер',icon:'🧨',r:20},
    note:{name:'Записка',icon:'📄',r:22},
    pill:{name:'Транквилизатор',icon:'💊',r:20}
  }[type];
  items.push({type,x,y,r:base.r,name:base.name,icon:base.icon,taken:false,extra:extra||null,phase:Math.random()*6.28});
}
function freeSpot(cx,cy,rad){
  for(let tries=0;tries<80;tries++){
    const a=Math.random()*6.283,d=Math.random()*rad;
    const tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d);
    if(!isSolid(tx,ty)&&getTile(tx,ty)!==T_WATER)return{x:tx*TILE+TILE/2,y:ty*TILE+TILE/2,tx,ty};
  }
  return{x:cx*TILE+TILE/2,y:cy*TILE+TILE/2,tx:cx,ty:cy};
}
function freeSpotAvoid(cx,cy,rad,avoidX,avoidY,minDist){
  for(let tries=0;tries<200;tries++){
    const a=Math.random()*6.283,d=Math.random()*rad;
    const tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d);
    if(isSolid(tx,ty)||getTile(tx,ty)===T_WATER)continue;
    const s={x:tx*TILE+TILE/2,y:ty*TILE+TILE/2,tx,ty};
    if(dist(s.x,s.y,avoidX,avoidY)<minDist)continue;
    return s;
  }
  return freeSpot(cx,cy,rad);
}

const NOTE_DATA=[
  {t:'ЖУРНАЛ РЕЙНДЖЕРА · 12 ОКТЯБРЯ', b:`Группа №4 не вышла на связь в 19:40.\nМаршрут простой, вдоль ручья.\n\nНашли рюкзак в 400 метрах от тропы.\nРюкзак разорван. Не ножом. Когтями.`},
  {t:'ЗАПИСКА · ПОЧЕРК ДЕТСКИЙ', b:`мама мы в доме рыбака\nмедведь стучит в дверь\nон стучит как человек\n\nпожалуйста приезжайте`},
  {t:'ТЕХНИЧЕСКАЯ ЗАПИСКА', b:`ТОПЛИВО — в ДОМЕ ЕГЕРЕЙ.\nКЛЮЧ — в ДОМЕ РЫБАКА.\nГЕНЕРАТОР — в ГЕНЕРАТОРНОЙ.\n\nБез света ты не дойдёшь.`},
  {t:'ЗАПИСЬ НА ДИКТОФОН', b:`"...я слышу его. Он не рычит. Он ДЫШИТ.\nЯ в кустах. Я не двигаюсь.\n\nОно прошло в полуметре."`},
  {t:'ПОСЛЕДНЯЯ ЗАПИСКА', b:`СВЕТ не спасёт. БЕГ не спасёт.\nСпасёт только ТИШИНА.`},
  {t:'ДНЕВНИК · ЕГЕРЬ МОРОЗОВ', b:`Я работаю здесь 23 года.\n\nНо вчера я видел, как один из них СТОЯЛ.\nОн ждал, когда погаснет свет.`},
  {t:'ПРЕДУПРЕЖДЕНИЕ', b:`1. Не светить фонарём в лес.\n2. Не бежать.\n3. Если слышишь дыхание — замри.\n4. ЗАПАСНОЙ ВЫХОД — СЕВЕРНЫЕ ВОРОТА.`},
  {t:'КАРТА ОТ РУКИ', b:`ДОМ РЫБАКА — СЗ\nДОМ ЕГЕРЕЙ — СВ\nГЕНЕРАТОРНАЯ — ЮЗ\nРАДИОВЫШКА — ЮВ\nСЕВЕРНЫЕ ВОРОТА — СЕВЕР`},
  {t:'МЕДИЦИНСКАЯ СПРАВКА', b:`Диагноз: острая тревожная реакция.\nРекомендовано: покинуть зону.`},
  {t:'ОТЧЁТ О ПОВЕДЕНИИ', b:`Наблюдение за медведем (B-7):\n\n— Преследует источник света.\n— Открывает двери.\n— Оно учится.`}
];

function spawnBear(tx,ty,tier){
  const b={
    x:tx*TILE+TILE/2, y:ty*TILE+TILE/2,
    angle:Math.random()*6.283, radius:16,
    speed: tier===2?78:(tier===1?66:56),
    baseSpeed: tier===2?78:(tier===1?66:56),
    state:'patrol', path:null, pathIdx:0, repathT:0,
    target:null, lastKnown:null, lostT:0,
    attackCD:0, growlCD:rnd(3,10), stepT:0, tier:tier,
    sightRange: tier===2?520:(tier===1?440:380),
    fov: 1.05,
    hearingRange: tier===2?330:(tier===1?290:250),
    alert:0, wanderT:0, homeX:tx, homeY:ty, stunT:0,
    breathPhase:Math.random()*6.28, inScare:false
  };
  bears.push(b); return b;
}
function spawnBoar(tx,ty,tier){
  const b={
    x:tx*TILE+TILE/2, y:ty*TILE+TILE/2,
    angle:Math.random()*6.283, radius:11,
    speed: tier===1?118:102,
    baseSpeed: tier===1?118:102,
    state:'patrol', path:null, pathIdx:0, repathT:0,
    target:null, lastKnown:null, lostT:0,
    attackCD:0, snortCD:rnd(2,7), stepT:0, tier:tier,
    sightRange: tier===1?230:195, fov: 0.9,
    hearingRange: tier===1?230:200,
    alert:0, wanderT:0, homeX:tx, homeY:ty, stunT:0,
    breathPhase:Math.random()*6.28, isBoar:true
  };
  boars.push(b); return b;
}
function canSeePlayerBoar(b){
  if(player.hidden)return false;
  const d=dist(b.x,b.y,player.x,player.y);
  if(d>b.sightRange)return false;
  const a=Math.atan2(player.y-b.y,player.x-b.x);
  if(Math.abs(angDiff(b.angle,a))>b.fov/2&&d>70)return false;
  const steps=Math.ceil(d/14);
  for(let i=1;i<steps;i++){
    const t=i/steps;
    if(isSolidPx(b.x+(player.x-b.x)*t,b.y+(player.y-b.y)*t))return false;
  }
  return true;
}
function canHearPlayerBoar(b){
  if(player.hidden&&player.hiddenTimer>0.35)return false;
  const d=dist(b.x,b.y,player.x,player.y);
  const eff=b.hearingRange*(0.4+player.noise*0.6);
  return d<eff&&player.noise>0.2;
}
function attackPlayerBoar(b){
  b.attackCD=0.55; b.stunT=7;
  G.boarsStunned = (G.boarsStunned||0) + 1;
  if(player.invuln>0||player.hidden)return;
  if(escapeGame.active||fuelGame.active||tumblerGame.active||lpGame.active||bossGame.active)return;
  const dmg=6+b.tier*3;
  player.hp-=dmg; player.invuln=0.35;
  player.sanity=Math.max(0,player.sanity-4);
  G.shake=Math.max(G.shake,10);
  G.dmgFlash=Math.max(G.dmgFlash,0.4);
  SFX.hurt();SFX.boarSnort();
  spawnBlood(player.x,player.y);
  const a=Math.atan2(player.y-b.y,player.x-b.x);
  moveWithCollision(player,Math.cos(a)*14,Math.sin(a)*14);
  updateHUD();
  if(player.hp<=0){player.hp=0;die('Кабаны затоптали тебя.');}
}
function updateBoars(dt){
  for(const b of boars){
    const dToPlayer=dist(b.x,b.y,player.x,player.y);
    let flareNear=null;
    for(const f of flareObjects){ if(dist(f.x,f.y,b.x,b.y)<130){flareNear=f;break;} }
    if(b.stunT>0)b.stunT-=dt;
    const sees=canSeePlayerBoar(b);
    const hears=canHearPlayerBoar(b);
    if(flareNear){
      b.state='flee'; b.target={x:b.x+(b.x-flareNear.x),y:b.y+(b.y-flareNear.y)}; b.lostT=3.0;
    }else if(sees){
      if(b.state!=='chase'&&b.state!=='attack')SFX.boarSnort();
      b.state='chase'; b.lastKnown={x:player.x,y:player.y}; b.lostT=3.0;b.alert=1;
    }else if(hears){
      b.state='investigate'; b.lastKnown={x:player.x+rnd(-30,30),y:player.y+rnd(-30,30)}; b.lostT=4.0;b.alert=Math.min(1,b.alert+0.4);
    }else{
      if(b.state==='chase'||b.state==='investigate'){ b.lostT-=dt;if(b.lostT<=0){b.state='search';b.lostT=3.0;} }
      else if(b.state==='search'){ b.lostT-=dt;if(b.lostT<=0){b.state='patrol';b.alert=0;} }
    }
    b.repathT-=dt;
    if(b.state==='chase'&&b.lastKnown){
      if(b.repathT<=0){ bearRepath(b,Math.floor(b.lastKnown.x/TILE),Math.floor(b.lastKnown.y/TILE)); b.repathT=0.35; }
      if(dToPlayer<b.radius+player.radius+14&&b.attackCD<=0&&b.stunT<=0)attackPlayerBoar(b);
    }else if(b.state==='investigate'&&b.lastKnown){
      if(b.repathT<=0){ bearRepath(b,Math.floor(b.lastKnown.x/TILE),Math.floor(b.lastKnown.y/TILE)); b.repathT=0.6; }
      if(dist(b.x,b.y,b.lastKnown.x,b.lastKnown.y)<40){b.state='search';b.lostT=3.0;}
    }else if(b.state==='search'){
      if(b.repathT<=0){
        const a=Math.random()*6.283;
        const tx=clamp(Math.floor(b.x/TILE+Math.cos(a)*8),2,MAP_W-3);
        const ty=clamp(Math.floor(b.y/TILE+Math.sin(a)*8),2,MAP_H-3);
        bearRepath(b,tx,ty);b.repathT=1.1;
      }
    }else if(b.state==='flee'){
      if(b.repathT<=0&&b.target){ bearRepath(b,Math.floor(b.target.x/TILE),Math.floor(b.target.y/TILE)); b.repathT=0.5; }
    }else{
      if(b.repathT<=0||!b.path){
        const a=Math.random()*6.283,r=rnd(5,14);
        const tx=clamp(Math.floor(b.homeX+Math.cos(a)*r),2,MAP_W-3);
        const ty=clamp(Math.floor(b.homeY+Math.sin(a)*r),2,MAP_H-3);
        bearRepath(b,tx,ty);b.repathT=rnd(2.0,4.5);
      }
    }
    let speed=b.speed;
    if(b.state==='chase')speed*=1.4;
    if(b.state==='flee')speed*=1.65;
    if(b.state==='investigate')speed*=1.18;
    if(b.stunT>0)speed=0;
    const ox=b.x, oy=b.y;
    if(b.path&&b.pathIdx<b.path.length&&b.stunT<=0){
      const wp=b.path[b.pathIdx];
      const wx=wp.x*TILE+TILE/2, wy=wp.y*TILE+TILE/2;
      const d=dist(b.x,b.y,wx,wy);
      if(d<12){b.pathIdx++;}
      else{ const a=Math.atan2(wy-b.y,wx-b.x); b.angle+=angDiff(b.angle,a)*Math.min(1,dt*8); moveWithCollision(b,Math.cos(a)*speed*dt,Math.sin(a)*speed*dt); }
    }else if(b.state==='chase'&&b.stunT<=0){
      const a=Math.atan2(player.y-b.y,player.x-b.x);
      b.angle+=angDiff(b.angle,a)*Math.min(1,dt*8);
      moveWithCollision(b,Math.cos(a)*speed*dt,Math.sin(a)*speed*dt);
    }
    const movedDist=dist(ox,oy,b.x,b.y);
    b.stepT-=dt;
    if(movedDist>0.4&&b.stepT<=0){
      b.stepT= b.state==='chase'?0.22:0.34;
      footprintTrails.push({x:b.x,y:b.y,life:14,maxLife:14,angle:b.angle,tier:b.tier,small:true});
      const dP=dist(b.x,b.y,player.x,player.y);
      if(dP<380)SFX.boarStep(clamp(1-dP/380,0.1,0.8));
    }
    b.snortCD-=dt;
    if(b.snortCD<=0){
      const dP=dist(b.x,b.y,player.x,player.y);
      if(dP<650)SFX.boarSnort();
      b.snortCD=rnd(3,8)-(b.state==='chase'?2:0);
    }
    if(b.attackCD>0)b.attackCD-=dt;
    b.breathPhase+=dt*(b.state==='chase'?5:2);
  }
  for(let i=0;i<boars.length;i++){
    for(let j=i+1;j<boars.length;j++){
      const a=boars[i],b=boars[j];
      const d=dist(a.x,a.y,b.x,b.y);
      const minD=a.radius+b.radius+2;
      if(d<minD&&d>0.001){
        const nx=(b.x-a.x)/d,ny=(b.y-a.y)/d,push=(minD-d)*0.5;
        moveWithCollision(a,-nx*push,-ny*push);
        moveWithCollision(b,nx*push,ny*push);
      }
    }
    for(const bear of bears){
      const a=boars[i];
      const d=dist(a.x,a.y,bear.x,bear.y);
      const minD=a.radius+bear.radius+2;
      if(d<minD&&d>0.001){
        const nx=(bear.x-a.x)/d,ny=(bear.y-a.y)/d,push=(minD-d)*0.5;
        moveWithCollision(a,-nx*push,-ny*push);
        moveWithCollision(bear,nx*push,ny*push);
      }
    }
  }
}

/* ============ JUMPSCARE ============ */
function triggerJumpscare(kind, force){
  if(G.scareActive)return;
  if(!force && G.time < G.scareCooldown)return;
  G.scareActive=true; G.scareT=0;
  G.scareDuration = 1.1; G.scareKind=kind;
  SFX.fnafScream();
  if(kind==='roar'){SFX.stinger();}
  else {SFX.growl(1.2);}
  G.shake=42;G.dmgFlash=0.85;
  document.getElementById('jumpscare').classList.add('on');
  drawJumpscare(kind,0);
  player.sanity=Math.max(0,player.sanity-10);
  updateHUD();
  animateJumpscare();
  G.scareCooldown = G.time + 8 + Math.random()*6;
}
function animateJumpscare(){
  const js=document.getElementById('jumpscare');
  const start=performance.now();
  const dur=G.scareDuration*1000;
  function frame(now){
    const t=(now-start)/dur;
    if(t>=1){js.classList.remove('on');G.scareActive=false;return;}
    drawJumpscare(G.scareKind, t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function drawJumpscare(kind, t){
  const w=jsCanvas.width=W, h=jsCanvas.height=H;
  jsctx.setTransform(1,0,0,1,0,0);
  jsctx.clearRect(0,0,w,h);
  const flash = t<0.08 ? (1-t/0.08) : 0;
  jsctx.fillStyle='#000';jsctx.fillRect(0,0,w,h);
  const scale = 0.6 + t*1.8;
  const cx=w/2, cy=h/2;
  const faceSize=Math.min(w,h)*0.5*scale;
  jsctx.save();jsctx.translate(cx,cy);
  jsctx.fillStyle='#1c0a06';
  jsctx.beginPath();
  for(let i=0;i<64;i++){
    const a=(i/64)*Math.PI*2;
    const noise=(Math.sin(i*2.7+performance.now()*0.008)*0.08)+(Math.random()-0.5)*0.06;
    const r=faceSize*(0.9+noise);
    const x=Math.cos(a)*r*1.05; const y=Math.sin(a)*r*0.95;
    if(i===0)jsctx.moveTo(x,y);else jsctx.lineTo(x,y);
  }
  jsctx.closePath();jsctx.fill();
  jsctx.fillStyle='#100705'; jsctx.beginPath();
  jsctx.ellipse(0,faceSize*0.15,faceSize*0.62,faceSize*0.58,0,0,7); jsctx.fill();
  const eyeGlow=1-t*0.5;
  for(const s of [1,-1]){
    const ex=s*faceSize*0.32, ey=-faceSize*0.12;
    const grad=jsctx.createRadialGradient(ex,ey,0,ex,ey,faceSize*0.28);
    grad.addColorStop(0,'rgba(255,240,200,'+(0.95*eyeGlow)+')');
    grad.addColorStop(0.2,'rgba(255,80,20,'+(0.85*eyeGlow)+')');
    grad.addColorStop(0.5,'rgba(200,10,0,'+(0.7*eyeGlow)+')');
    grad.addColorStop(1,'rgba(60,0,0,0)');
    jsctx.fillStyle=grad;
    jsctx.beginPath();jsctx.arc(ex,ey,faceSize*0.28,0,7);jsctx.fill();
    jsctx.fillStyle='#000'; jsctx.beginPath();
    jsctx.ellipse(ex,ey,faceSize*0.03,faceSize*0.15,0,0,7); jsctx.fill();
  }
  jsctx.fillStyle='#0a0000'; jsctx.beginPath();
  const mouthW=faceSize*0.55;
  const mouthH=faceSize*(0.35+t*0.35);
  jsctx.moveTo(-mouthW,faceSize*0.42);
  jsctx.quadraticCurveTo(0,faceSize*0.42+mouthH,mouthW,faceSize*0.42);
  jsctx.quadraticCurveTo(0,faceSize*0.42+mouthH*0.5,-mouthW,faceSize*0.42);
  jsctx.closePath();jsctx.fill();
  jsctx.fillStyle='#e0d0b0';
  const teethCount=9;
  for(let i=0;i<teethCount;i++){
    const px=(-mouthW)+(i/(teethCount-1))*mouthW*2;
    const baseY=faceSize*0.42;
    const toothH=faceSize*(0.14+Math.random()*0.08);
    jsctx.beginPath(); jsctx.moveTo(px-3,baseY);jsctx.lineTo(px,baseY+toothH);jsctx.lineTo(px+3,baseY); jsctx.closePath();jsctx.fill();
  }
  jsctx.restore();
  if(flash>0){jsctx.fillStyle='rgba(255,240,220,'+flash+')';jsctx.fillRect(0,0,w,h);}
  jsctx.fillStyle='rgba(120,0,0,'+(0.15+t*0.2)+')';jsctx.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=3){ jsctx.fillStyle='rgba(0,0,0,'+(0.08+Math.random()*0.05)+')'; jsctx.fillRect(0,y,w,1); }
}
function triggerAmbientEvent(){
  if(G.scareActive)return;
  const roll=Math.random();
  const fearBoost=1-player.sanity/120;
  if(roll<0.22){SFX.treeCrack();message('Где-то в лесу с треском упало дерево.','#8a7a5a');}
  else if(roll<0.45){
    SFX.whisper();
    const phrases=['...беги...','...оно слышит...','...не оборачивайся...','...ты следующий...','...оно уже здесь...','...смотри...','...сзади...'];
    showWhisper(phrases[Math.floor(Math.random()*phrases.length)]);
  }
  else if(roll<0.70){SFX.breathing();if(Math.random()<0.6)showWhisper('...дышит...');}
  else if(roll<0.88){SFX.radioScream();showWhisper('...помогите...');}
  else {SFX.growl(0.5);}
  G.ambientEventT = 12 + Math.random()*22 - fearBoost*12;
}
function showWhisper(text){
  const el=document.getElementById('whisper');
  el.textContent=text;
  el.classList.remove('on');
  void el.offsetWidth;
  el.classList.add('on');
}

/* ============ РАНДОМНЫЕ СТРАШНЫЕ ЗВУКИ ============ */
const SCARY_SOUNDS = [
  {id:'distantBearRoar', weight: 18, sanity: 4, minDist: 0},
  {id:'distantDrum',     weight: 10, sanity: 4, minDist: 0},
  {id:'metalScrape',     weight: 12, sanity: 5, minDist: 0},
  {id:'waterDrip',       weight: 8,  sanity: 2, minDist: 0},
  {id:'windHowl',        weight: 12, sanity: 5, minDist: 0}
];
let _scaryNextT = 0;
let _scaryAccum = 0;
function pickWeightedSound(){
  let total = 0;
  for(const s of SCARY_SOUNDS) total += s.weight;
  let r = Math.random() * total;
  for(const s of SCARY_SOUNDS){ r -= s.weight; if(r <= 0) return s; }
  return SCARY_SOUNDS[0];
}
function updateScarySounds(dt){
  if(bossGame.active) return;
  if(lpGame.active || tumblerGame.active || fuelGame.active || escapeGame.active || hideGame.active) return;
  if(G.state !== 'play') return;
  if(player.hidden) return;
  if(player.sanity >= 70){ _scaryNextT = 0; return; }
  if(_scaryNextT <= 0){ _scaryNextT = 4 + Math.random() * 8; return; }
  _scaryNextT -= dt;
  if(_scaryNextT <= 0){
    const sound = pickWeightedSound();
    if(SFX[sound.id]){
      SFX[sound.id]();
      if(sound.sanity > 0) player.sanity = Math.max(0, player.sanity - sound.sanity);
      if(Math.random() < 0.35){
        const phrases = ['...ты слышал?...','...оно близко...','...не двигайся...','...я тоже слышал...','...за спиной...','...слушай...','...оно зовёт...','...тише...'];
        showWhisper(phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }
    const fearBoost = 1 - player.sanity / 100;
    _scaryNextT = 5 + Math.random() * 12 - fearBoost * 4;
    if(_scaryNextT < 3) _scaryNextT = 3;
  }
}

/* ============ МЕРЦАНИЕ ФОНАРЯ ============ */
function updateFlashlightFlicker(dt){
  if(!player.flashlight || player.battery <= 0 || player.hidden) return;
  if(bossGame.active) return;
  flickerState.seedPhase += dt;
  if(flickerState.activeT > 0){
    flickerState.activeT -= dt;
    const p = flickerState.activeT / flickerState.duration;
    flickerState.intensity = Math.max(0, Math.abs(Math.sin(flickerState.seedPhase * 38)) * p);
    if(Math.random() < 0.35) flickerState.intensity *= 0.15;
    return;
  }
  flickerState.intensity = 0;
  flickerState.nextT -= dt;
  if(flickerState.nextT <= 0){
    const lowBattery = player.battery < 25 ? 1 : 0;
    const lowSanity = player.sanity < 40 ? 1 : 0;
    const severe = Math.random() < (0.15 + lowBattery*0.25 + lowSanity*0.2);
    flickerState.duration = severe ? (0.45 + Math.random()*0.45) : (0.12 + Math.random()*0.16);
    flickerState.activeT = flickerState.duration;
    if(severe){ SFX.clickOff(); setTimeout(()=>{ if(player.flashlight && player.battery>0) SFX.click(); }, 90); }
    else { SFX.click(); }
    const base = 8 + Math.random() * 14;
    const penalty = lowBattery * 4 + lowSanity * 3;
    flickerState.nextT = Math.max(2.5, base - penalty);
  }
}

/* ============ БОСС: АЛЬФА ============ */
const bossGame = { active:false, boss:null, pillars:[], hitCooldown:0, arenaCenterX:0, arenaCenterY:0, arenaRadius:460, introT:0 };
function startBossFight(){
  if(bossGame.active) return;
  bossGame.active = true;
  const cx = ARENA.cx, cy = ARENA.cy;
  bossGame.arenaCenterX = cx; bossGame.arenaCenterY = cy;
  bossGame.arenaRadius = ARENA.radiusPx - 40;
  bossGame.pillars = []; bossGame.hitCooldown = 0; bossGame.introT = 0;
  bossGame.boss = {
    x: cx, y: cy - 220, radius: 44,
    hp: 1400, maxHp: 1400, stage: 1, angle: 0,
    state: 'intro', stateT: 0, attackCD: 2.2,
    stunT: 0, hitFlash: 0, breathPhase: 0,
    dashVX: 0, dashVY: 0, targetX: cx, targetY: cy,
    tripleCount: 0, _nextAttack: null, jumpZ: 0
  };
  player.x = cx; player.y = cy + 220;
  player.hp = Math.max(player.hp, 60);
  player.battery = 100; player.flashlight = true;
  player.sanity = Math.max(60, player.sanity);
  player.flares = Math.max(player.flares, 2);
  const bar = document.getElementById('bossBar');
  if(bar){ bar.classList.add('on'); bar.classList.remove('stage2'); }
  const hint = document.getElementById('bossHint');
  if(hint) hint.classList.add('on');
  G.shake = 30;
  SFX.roar(); SFX.screech();
  message('АЛЬФА ВЫШЕЛ НА ТРОПУ.', '#e06060');
  setTimeout(()=>{ if(bossGame.active) message('ЛКМ рядом — удар. Фальшфейер — мощный урон.', '#e0c86a'); }, 2200);
  updateBossHUD();
}
function endBossFight(win){
  if(!bossGame.active) return;
  bossGame.active = false;
  bossGame.boss = null; bossGame.pillars = [];
  const bar = document.getElementById('bossBar'); if(bar) bar.classList.remove('on');
  const hint = document.getElementById('bossHint'); if(hint) hint.classList.remove('on');
  if(win){ message('АЛЬФА ПАЛ. ТРОПА СВОБОДНА.','#7fd68a'); SFX.pickup(); setTimeout(()=>winGame(), 1800); }
}
function updateBossHUD(){
  const bar = document.getElementById('bossBar');
  if(!bar) return;
  if(!bossGame.active || !bossGame.boss){ bar.classList.remove('on'); return; }
  const b = bossGame.boss;
  const pct = clamp(b.hp / b.maxHp * 100, 0, 100);
  const fill = document.getElementById('bossBarFill'); if(fill) fill.style.width = pct + '%';
  const stage = document.getElementById('bossStage'); if(stage) stage.textContent = b.stage === 2 ? 'СТАДИЯ 2 · ЯРОСТЬ' : 'СТАДИЯ 1';
  bar.classList.toggle('stage2', b.stage === 2);
}
function damageBoss(amount){
  if(!bossGame.active) return;
  const b = bossGame.boss;
  if(!b || b.hp <= 0) return;
  b.hp -= amount; b.hitFlash = 1;
  G.shake = Math.max(G.shake, 10);
  SFX.hideHit();
  updateBossHUD();
  if(b.hp <= 0){ b.hp = 0; b.state = 'dead'; b.stateT = 0; G.shake = 40; SFX.deathScreech(); message('АЛЬФА ПОВЕРЖЕН.','#e0c86a'); }
}
function chooseBossAttack(){
  const b = bossGame.boss;
  if(!b) return;
  const pool = ['dash','shockwave','summon','roar','jumpSlam','sideArms','meteorRain','spikes'];
  if(b.stage === 2) pool.push('darkness','triple','quake','tornado','jumpSlam','sideArms','meteorRain');
  const pick = pool[Math.floor(Math.random()*pool.length)];
  b.state = 'telegraph'; b.stateT = 0; b._nextAttack = pick;
}
function updateBoss(dt){
  if(!bossGame.active) return;
  const b = bossGame.boss;
  if(!b) return;
  bossGame.introT += dt;
  if(bossGame.hitCooldown > 0) bossGame.hitCooldown -= dt;
  b.breathPhase += dt * (b.stage === 2 ? 4.5 : 3);
  if(b.hitFlash > 0) b.hitFlash = Math.max(0, b.hitFlash - dt*3);
  if(b.state === 'dead'){ b.stateT += dt; if(b.stateT > 2.2) endBossFight(true); return; }
  if(b.stage === 1 && b.hp <= b.maxHp * 0.5){
    b.stage = 2; b.state = 'roar'; b.stateT = 0; b.stunT = 1.2;
    G.shake = 40; G.dmgFlash = 0.5;
    SFX.fnafScream(); SFX.roar();
    message('АЛЬФА В ЯРОСТИ!','#e06060');
    if(dist(b.x, b.y, player.x, player.y) < 220 && player.invuln <= 0){
      player.hp -= 20; player.invuln = 1.0; G.dmgFlash = 1; SFX.hurt();
      if(player.hp <= 0){ player.hp = 0; die('Ярость Альфы испепелила тебя.'); return; }
    }
    updateBossHUD();
    return;
  }
  if(b.stunT > 0){ b.stunT -= dt; return; }
  b.angle = Math.atan2(player.y - b.y, player.x - b.x);
  b.stateT += dt;
  const baseSpeed = b.stage === 2 ? 170 : 130;
  switch(b.state){
    case 'intro': { if(b.stateT > 1.2){ b.state = 'idle'; b.stateT = 0; b.attackCD = 0.6; } break; }
    case 'idle': {
      const dx = player.x - b.x, dy = player.y - b.y;
      const dd = Math.hypot(dx, dy) || 1;
      const stopDist = b.radius + player.radius + 2;
      if(dd > stopDist){ const step = Math.min(dd - stopDist, baseSpeed * dt); b.x += dx/dd * step; b.y += dy/dd * step; }
      if(dd < b.radius + player.radius + 6 && player.invuln <= 0){
        player.hp -= 5; player.invuln = 0.55; G.dmgFlash = 0.5; G.shake = Math.max(G.shake, 12); SFX.hurt();
        if(player.hp <= 0){ player.hp = 0; die('Альфа растоптал тебя.'); return; }
      }
      b.attackCD -= dt;
      if(b.attackCD <= 0) chooseBossAttack();
      break;
    }
    case 'telegraph': {
      if(b.stateT > 0.65){
        const next = b._nextAttack;
        b.state = next || 'idle'; b.stateT = 0; b.tripleCount = 0;
        b._shockPlayed = false; b._summoned = false; b._roared = false; b._dark = false; b._quaked = false;
        if(next === 'dash'){
          const a = Math.atan2(player.y - b.y, player.x - b.x);
          const sp = b.stage === 2 ? 620 : 520;
          b.dashVX = Math.cos(a) * sp; b.dashVY = Math.sin(a) * sp;
        }
        b._nextAttack = null;
      }
      break;
    }
    case 'dash': {
      b.x += b.dashVX * dt; b.y += b.dashVY * dt;
      if(dist(b.x, b.y, player.x, player.y) < b.radius + player.radius + 6 && player.invuln <= 0){
        player.hp -= 22; player.invuln = 0.85; G.dmgFlash = 1; G.shake = 26; SFX.hurt();
        const a = Math.atan2(player.y - b.y, player.x - b.x);
        moveWithCollision(player, Math.cos(a)*50, Math.sin(a)*50);
        if(player.hp <= 0){ player.hp = 0; die('Альфа разорвал тебя в рывке.'); return; }
      }
      if(b.stateT > 0.75){ b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.5 : 0.9; }
      break;
    }
    case 'shockwave': {
      if(b.stateT > 0.4 && b.stateT < 0.65){
        const d = dist(b.x, b.y, player.x, player.y);
        if(d < 200 && player.invuln <= 0){
          player.hp -= 26; player.invuln = 0.9; G.dmgFlash = 1; G.shake = 32; SFX.hurt();
          const a = Math.atan2(player.y - b.y, player.x - b.x);
          moveWithCollision(player, Math.cos(a)*80, Math.sin(a)*80);
          if(player.hp <= 0){ player.hp = 0; die('Ударная волна разорвала тебя.'); return; }
        }
        G.shake = Math.max(G.shake, 22);
        if(!b._shockPlayed){ SFX.roar(); b._shockPlayed = true; }
      }
      if(b.stateT > 0.9){ b._shockPlayed = false; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.7 : 1.1; }
      break;
    }
    case 'summon': {
      if(b.stateT > 0.35 && !b._summoned){
        b._summoned = true;
        const n = b.stage === 2 ? 3 : 2;
        for(let i = 0; i < n; i++){
          const a = Math.random() * Math.PI * 2;
          const tx = Math.floor((b.x + Math.cos(a) * 130) / TILE);
          const ty = Math.floor((b.y + Math.sin(a) * 130) / TILE);
          if(!isSolid(tx, ty) && getTile(tx, ty) !== T_WATER){ spawnBear(tx, ty, 0); }
        }
        SFX.treeCrack();
        message('Альфа зовёт стаю.','#c98a2a');
      }
      if(b.stateT > 1.0){ b._summoned = false; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.9 : 1.4; }
      break;
    }
    case 'roar': {
      if(b.stateT > 0.25 && b.stateT < 0.5 && !b._roared){
        b._roared = true;
        SFX.roar(); SFX.screech();
        const d = dist(b.x, b.y, player.x, player.y);
        if(d < 340){ player.sanity = Math.max(0, player.sanity - 22); G.shake = Math.max(G.shake, 24); G.stingFlash = 0.75; }
      }
      if(b.stateT > 0.85){ b._roared = false; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.5 : 0.9; }
      break;
    }
    case 'darkness': {
      if(b.stateT > 0.2 && !b._dark){
        b._dark = true;
        player.flashlight = false;
        player.battery = Math.max(0, player.battery - 25);
        message('ТЬМА!','#8a2626');
        SFX.screech(); SFX.stinger();
        G.stingFlash = 0.8;
      }
      if(b.stateT > 1.1){ b._dark = false; b.state = 'idle'; b.stateT = 0; b.attackCD = 0.9; }
      break;
    }
    case 'triple': {
      if(b.stateT > 0.15 && b.tripleCount === 0){ b.tripleCount = 1; const a = Math.atan2(player.y - b.y, player.x - b.x); b.dashVX = Math.cos(a) * 480; b.dashVY = Math.sin(a) * 480; }
      else if(b.stateT > 0.55 && b.tripleCount === 1){ b.tripleCount = 2; const a = Math.atan2(player.y - b.y, player.x - b.x); b.dashVX = Math.cos(a) * 520; b.dashVY = Math.sin(a) * 520; }
      else if(b.stateT > 0.95 && b.tripleCount === 2){ b.tripleCount = 3; const a = Math.atan2(player.y - b.y, player.x - b.x); b.dashVX = Math.cos(a) * 560; b.dashVY = Math.sin(a) * 560; }
      b.x += b.dashVX * dt; b.y += b.dashVY * dt;
      if(dist(b.x, b.y, player.x, player.y) < b.radius + player.radius + 6 && player.invuln <= 0){
        player.hp -= 16; player.invuln = 0.55; G.dmgFlash = 0.75; G.shake = 18; SFX.hurt();
        if(player.hp <= 0){ player.hp = 0; die('Альфа растерзал тебя.'); return; }
      }
      if(b.stateT > 1.45){ b.tripleCount = 0; b.state = 'idle'; b.stateT = 0; b.attackCD = 0.55; }
      break;
    }
    case 'quake': {
      if(b.stateT > 0.25 && !b._quaked){
        b._quaked = true;
        bossGame.pillars = [];
        for(let i = 0; i < 5; i++){
          const a = Math.random() * Math.PI * 2;
          const r = 90 + Math.random() * 160;
          bossGame.pillars.push({ x: player.x + Math.cos(a) * r, y: player.y + Math.sin(a) * r, radius: 42, warnT: 0.85, hit: false, hitT: 0 });
        }
        SFX.treeCrack();
      }
      for(const p of bossGame.pillars){
        if(p.hit) continue;
        p.warnT -= dt;
        if(p.warnT <= 0){
          p.hit = true; p.hitT = 0.35; SFX.roar();
          if(dist(p.x, p.y, player.x, player.y) < p.radius && player.invuln <= 0){
            player.hp -= 20; player.invuln = 0.7; G.dmgFlash = 0.85; G.shake = 20; SFX.hurt();
            if(player.hp <= 0){ player.hp = 0; die('Земля поглотила тебя.'); return; }
          }
        }
      }
      for(let i = bossGame.pillars.length - 1; i >= 0; i--){
        const p = bossGame.pillars[i];
        if(p.hit) p.hitT -= dt;
        if(p.hit && p.hitT <= 0) bossGame.pillars.splice(i,1);
      }
      if(b.stateT > 1.9){ bossGame.pillars = []; b._quaked = false; b.state = 'idle'; b.stateT = 0; b.attackCD = 0.9; }
      break;
    }
    case 'jumpSlam': {
      if(b.stateT < 0.02){
        b.jumpStartX = b.x; b.jumpStartY = b.y;
        b.jumpTargetX = player.x; b.jumpTargetY = player.y;
        b.jumpDuration = 1.5; b.jumpZ = 0; b._landed = false;
      }
      const t = b.stateT / b.jumpDuration;
      if(t <= 0.65){
        const tt = t / 0.65;
        b.x = b.jumpStartX + (b.jumpTargetX - b.jumpStartX) * tt * 0.7;
        b.y = b.jumpStartY + (b.jumpTargetY - b.jumpStartY) * tt * 0.7;
        b.jumpZ = Math.sin(tt * Math.PI) * 260;
      } else {
        const tt = (t - 0.65) / 0.35;
        b.x = b.jumpStartX + (b.jumpTargetX - b.jumpStartX) * (0.7 + tt * 0.3);
        b.y = b.jumpStartY + (b.jumpTargetY - b.jumpStartY) * (0.7 + tt * 0.3);
        b.jumpZ = Math.sin((1 - tt) * Math.PI) * 260;
        if(tt >= 1 && !b._landed){
          b._landed = true; b.jumpZ = 0; G.shake = 40;
          SFX.roar(); SFX.treeCrack();
          const d = dist(b.x, b.y, player.x, player.y);
          if(d < 140 && player.invuln <= 0){
            player.hp -= 30; player.invuln = 0.9; G.dmgFlash = 1; SFX.hurt();
            if(player.hp <= 0){ player.hp = 0; die('Альфа раздавил тебя прыжком.'); return; }
          }
        }
      }
      if(b.stateT > b.jumpDuration + 0.4){ b._landed = false; b.jumpZ = 0; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.5 : 0.9; }
      break;
    }
    case 'sideArms': {
      if(b.stateT < 0.02){
        const rnd = Math.random();
        b.armSides = rnd < 0.3 ? [0, 1] : [rnd < 0.65 ? 0 : 1];
        b.armY = player.y;
        b.arms = b.armSides.map(s => ({ side: s, warnT: 1.1, active: false, activeT: 0, hit: false, x: 0, y: b.armY }));
      }
      const totalT = 2.4;
      for(const arm of b.arms){
        if(!arm.active){
          arm.warnT -= dt;
          if(arm.warnT <= 0){ arm.active = true; arm.activeT = 0; SFX.roar(); SFX.treeCrack(); }
        } else {
          arm.activeT += dt;
          const dir = arm.side === 0 ? -1 : 1;
          const startX = b.x + dir * (bossGame.arenaRadius + 160);
          const endX = b.x + dir * (bossGame.arenaRadius - 220);
          const prog = Math.min(1, arm.activeT / 0.45);
          arm.x = startX + (endX - startX) * prog;
          arm.y = b.armY;
          if(!arm.hit){
            const dx = Math.abs(player.x - arm.x);
            const dy = Math.abs(player.y - arm.y);
            if(dx < 90 && dy < 55 && player.invuln <= 0){
              player.hp -= 26; player.invuln = 0.9; G.dmgFlash = 1; G.shake = 32; SFX.hurt();
              arm.hit = true;
              if(player.hp <= 0){ player.hp = 0; die('Лапа Альфы раздавила тебя.'); return; }
            }
          }
        }
      }
      if(b.stateT > totalT){ b.arms = null; b.armSides = null; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.6 : 1.0; }
      break;
    }
    case 'meteorRain': {
      if(b.stateT < 0.02){
        b.meteors = [];
        const n = b.stage === 2 ? 10 : 7;
        for(let i=0;i<n;i++){
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * (bossGame.arenaRadius * 0.9);
          b.meteors.push({ x: ARENA.cx + Math.cos(a) * r, y: ARENA.cy + Math.sin(a) * r, warnT: 0.8 + i * 0.14, fallZ: 520, hit: false, hitT: 0, rot: Math.random() * 6.28 });
        }
      }
      for(const m of b.meteors){
        if(m.hit) continue;
        m.warnT -= dt;
        if(m.warnT <= 0){
          m.fallZ -= 1000 * dt;
          m.rot += dt * 4;
          if(m.fallZ <= 0){
            m.fallZ = 0; m.hit = true; m.hitT = 0.4;
            SFX.roar();
            G.shake = Math.max(G.shake, 14);
            if(dist(m.x, m.y, player.x, player.y) < 60 && player.invuln <= 0){
              player.hp -= 18; player.invuln = 0.5; G.dmgFlash = 0.6; SFX.hurt();
              if(player.hp <= 0){ player.hp = 0; die('Камнепад раздавил тебя.'); return; }
            }
          }
        }
      }
      for(let i=b.meteors.length-1; i>=0; i--){ if(b.meteors[i].hit) b.meteors[i].hitT -= dt; if(b.meteors[i].hit && b.meteors[i].hitT <= 0) b.meteors.splice(i,1); }
      if(b.stateT > (b.stage === 2 ? 3.0 : 2.6)){ b.meteors = null; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.7 : 1.1; }
      break;
    }
    case 'tornado': {
      if(b.stateT < 0.02){ b.spinAngle = 0; b.spinDuration = 2.6; }
      b.spinAngle += dt * 14;
      const dx = b.x - player.x, dy = b.y - player.y;
      const dd = Math.hypot(dx, dy) || 1;
      if(dd > b.radius + player.radius + 10){ const pullSpeed = 200; moveWithCollision(player, dx/dd * pullSpeed * dt, dy/dd * pullSpeed * dt); }
      if(dd > 90){ b.x += dx/dd * 70 * dt; b.y += dy/dd * 70 * dt; }
      if(dd < b.radius + player.radius + 6 && player.invuln <= 0){
        player.hp -= 10; player.invuln = 0.5; G.dmgFlash = 0.6; G.shake = 14; SFX.hurt();
        if(player.hp <= 0){ player.hp = 0; die('Вихрь Альфы поглотил тебя.'); return; }
      }
      if(b.stateT > b.spinDuration){ b.state = 'idle'; b.stateT = 0; b.attackCD = 0.9; }
      break;
    }
    case 'spikes': {
      if(b.stateT < 0.02){
        b.spikes = [];
        const a = Math.atan2(player.y - b.y, player.x - b.x);
        for(let i=0;i<8;i++){ const d = 60 + i * 68; b.spikes.push({ x: b.x + Math.cos(a) * d, y: b.y + Math.sin(a) * d, warnT: 0.3 + i * 0.12, rise: 0, active: false }); }
      }
      for(const s of b.spikes){
        if(!s.active){ s.warnT -= dt; if(s.warnT <= 0){ s.active = true; SFX.treeCrack(); } }
        else {
          s.rise = Math.min(1, s.rise + dt * 5);
          if(s.rise > 0.35 && s.rise < 0.75){
            if(dist(s.x, s.y, player.x, player.y) < 42 && player.invuln <= 0){
              player.hp -= 20; player.invuln = 0.6; G.dmgFlash = 0.8; G.shake = 18; SFX.hurt();
              if(player.hp <= 0){ player.hp = 0; die('Шипы земли пронзили тебя.'); return; }
            }
          }
        }
      }
      if(b.stateT > 2.1){ b.spikes = null; b.state = 'idle'; b.stateT = 0; b.attackCD = b.stage === 2 ? 0.6 : 1.0; }
      break;
    }
    default: { b.state = 'idle'; b.stateT = 0; b.attackCD = 0.5; break; }
  }
  const ad = dist(player.x, player.y, bossGame.arenaCenterX, bossGame.arenaCenterY);
  if(ad > bossGame.arenaRadius){
    const a = Math.atan2(player.y - bossGame.arenaCenterY, player.x - bossGame.arenaCenterX);
    const nx = bossGame.arenaCenterX + Math.cos(a) * bossGame.arenaRadius;
    const ny = bossGame.arenaCenterY + Math.sin(a) * bossGame.arenaRadius;
    if(!collides(nx, ny, player.radius)){ player.x = nx; player.y = ny; }
    else { player.x -= Math.cos(a) * 4; player.y -= Math.sin(a) * 4; }
    if(!G._arenaMsg || G.time - G._arenaMsg > 6){ G._arenaMsg = G.time; message('ВЫХОДА НЕТ. ТОЛЬКО БОЙ.','#e06060'); }
  }
  const bd = dist(b.x, b.y, bossGame.arenaCenterX, bossGame.arenaCenterY);
  if(bd > bossGame.arenaRadius + 60){
    const a = Math.atan2(b.y - bossGame.arenaCenterY, b.x - bossGame.arenaCenterX);
    b.x = bossGame.arenaCenterX + Math.cos(a) * (bossGame.arenaRadius - 40);
    b.y = bossGame.arenaCenterY + Math.sin(a) * (bossGame.arenaRadius - 40);
  }
  updateBossHUD();
}
function drawBoss(){
  const b = bossGame.boss;
  if(!b) return;
  if(b.state === 'jumpSlam' && b.jumpTargetX !== undefined){
    const tLeft = 1 - Math.min(1, b.stateT / b.jumpDuration);
    const rPulse = 140 + Math.sin(performance.now()*0.02) * 12;
    ctx.strokeStyle = 'rgba(220,40,40,' + (0.5 + tLeft*0.5) + ')';
    ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(b.jumpTargetX, b.jumpTargetY, rPulse, 0, 7); ctx.stroke();
    const jg = ctx.createRadialGradient(b.jumpTargetX, b.jumpTargetY, 0, b.jumpTargetX, b.jumpTargetY, rPulse);
    jg.addColorStop(0, 'rgba(255,60,40,' + (0.28 + tLeft*0.4) + ')'); jg.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = jg; ctx.beginPath(); ctx.arc(b.jumpTargetX, b.jumpTargetY, rPulse, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,80,60,' + (0.6 + tLeft*0.4) + ')'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.jumpTargetX - 30, b.jumpTargetY); ctx.lineTo(b.jumpTargetX + 30, b.jumpTargetY);
    ctx.moveTo(b.jumpTargetX, b.jumpTargetY - 30); ctx.lineTo(b.jumpTargetX, b.jumpTargetY + 30);
    ctx.stroke();
  }
  if(b.arms){
    for(const arm of b.arms){
      if(!arm.active){
        const pulse = 0.5 + Math.sin(performance.now()*0.03) * 0.5;
        ctx.strokeStyle = 'rgba(255,40,40,' + (0.5 + pulse * 0.5) + ')';
        ctx.lineWidth = 6; ctx.setLineDash([14, 10]);
        ctx.beginPath(); ctx.moveTo(ARENA.cx - bossGame.arenaRadius - 100, arm.y); ctx.lineTo(ARENA.cx + bossGame.arenaRadius + 100, arm.y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255,120,80,' + (0.4 + pulse*0.4) + ')'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ARENA.cx - bossGame.arenaRadius - 100, arm.y - 40); ctx.lineTo(ARENA.cx + bossGame.arenaRadius + 100, arm.y - 40);
        ctx.moveTo(ARENA.cx - bossGame.arenaRadius - 100, arm.y + 40); ctx.lineTo(ARENA.cx + bossGame.arenaRadius + 100, arm.y + 40);
        ctx.stroke();
      } else {
        ctx.save(); ctx.translate(arm.x, arm.y);
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.ellipse(0, 20, 95, 40, 0, 0, 7); ctx.fill();
        const pawDir = arm.side === 0 ? 1 : -1;
        ctx.scale(pawDir, 1);
        ctx.fillStyle = '#3a1a10'; ctx.beginPath(); ctx.ellipse(0, 0, 90, 55, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#4a2015'; ctx.beginPath(); ctx.ellipse(-8, -4, 70, 40, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#5a2818';
        for(let i=0;i<4;i++){ const fx = -30 + i * 22; ctx.beginPath(); ctx.arc(fx, 30, 16, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#e8dcc0';
        for(let i=0;i<4;i++){ const fx = -30 + i * 22; ctx.beginPath(); ctx.moveTo(fx - 6, 40); ctx.lineTo(fx, 68); ctx.lineTo(fx + 6, 40); ctx.closePath(); ctx.fill(); }
        ctx.strokeStyle = 'rgba(255,60,40,0.9)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(0, 0, 92, 57, 0, 0, 7); ctx.stroke();
        ctx.restore();
      }
    }
  }
  if(b.meteors){
    for(const m of b.meteors){
      if(!m.hit){
        if(m.warnT > 0){
          const pulse = 0.4 + Math.sin(performance.now()*0.03) * 0.4;
          ctx.fillStyle = 'rgba(255,40,40,' + (pulse * 0.3) + ')'; ctx.beginPath(); ctx.arc(m.x, m.y, 55, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,60,60,' + (0.6 + pulse*0.4) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(m.x, m.y, 55, 0, 7); ctx.stroke();
        } else {
          const scale = 1 - m.fallZ / 520 * 0.4;
          ctx.save(); ctx.translate(m.x, m.y);
          ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 0, 40*scale, 14*scale, 0, 0, 7); ctx.fill();
          const fg = ctx.createRadialGradient(0, -m.fallZ*0.4, 0, 0, -m.fallZ*0.4, 60);
          fg.addColorStop(0, 'rgba(255,180,60,0.9)'); fg.addColorStop(0.5, 'rgba(255,80,20,0.5)'); fg.addColorStop(1, 'rgba(255,0,0,0)');
          ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, -m.fallZ*0.4, 60, 0, 7); ctx.fill();
          ctx.restore();
        }
      } else {
        const t = m.hitT / 0.4;
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 80);
        grad.addColorStop(0, 'rgba(255,220,120,' + t + ')'); grad.addColorStop(0.6, 'rgba(255,100,20,' + (t*0.6) + ')'); grad.addColorStop(1, 'rgba(180,30,0,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(m.x, m.y, 80, 0, 7); ctx.fill();
      }
    }
  }
  if(b.spikes){
    for(const s of b.spikes){
      if(!s.active){
        const pulse = 0.5 + Math.sin(performance.now()*0.04) * 0.5;
        ctx.fillStyle = 'rgba(255,60,40,' + (0.2 + pulse * 0.25) + ')'; ctx.beginPath(); ctx.arc(s.x, s.y, 30, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,80,60,' + (0.5 + pulse*0.5) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(s.x, s.y, 30, 0, 7); ctx.stroke();
      } else {
        const h = s.rise * 80;
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(s.x, s.y + 4, 26, 10, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#4a3828';
        ctx.beginPath(); ctx.moveTo(s.x - 22, s.y + 6); ctx.lineTo(s.x, s.y - h); ctx.lineTo(s.x + 22, s.y + 6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#6a5040'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = 'rgba(255,120,60,' + (0.15 + s.rise*0.3) + ')';
        ctx.beginPath(); ctx.moveTo(s.x - 10, s.y + 2); ctx.lineTo(s.x, s.y - h + 8); ctx.lineTo(s.x + 10, s.y + 2); ctx.closePath(); ctx.fill();
      }
    }
  }
  for(const p of bossGame.pillars){
    if(!p.hit && p.warnT > 0){
      const pulse = 0.4 + Math.sin(performance.now()*0.03) * 0.4;
      ctx.strokeStyle = 'rgba(255,60,40,' + pulse + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(255,40,20,' + (pulse * 0.15) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, 7); ctx.fill();
    } else if(p.hit && p.hitT > 0){
      const t = p.hitT / 0.35;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius*1.6);
      grad.addColorStop(0, 'rgba(255,180,60,' + (0.9*t) + ')'); grad.addColorStop(1, 'rgba(180,30,0,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius*1.6, 0, 7); ctx.fill();
    }
  }
  if(b.state === 'dead'){
    const t = Math.min(1, b.stateT / 2.2);
    ctx.save(); ctx.globalAlpha = 1 - t * 0.7;
    ctx.fillStyle = '#3a1010'; ctx.beginPath(); ctx.arc(b.x, b.y, b.radius * (1 + t*0.3), 0, 7); ctx.fill();
    ctx.restore();
    return;
  }
  if(b.state === 'telegraph'){
    const pulse = 0.5 + Math.sin(performance.now()*0.025) * 0.5;
    const grad = ctx.createRadialGradient(b.x, b.y, b.radius*0.8, b.x, b.y, b.radius*2.4);
    grad.addColorStop(0, 'rgba(220,40,40,' + (0.45*pulse) + ')'); grad.addColorStop(1, 'rgba(220,40,40,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.radius*2.4, 0, 7); ctx.fill();
  }
  if(b.state === 'tornado'){
    const spAng = performance.now() * 0.02;
    for(let i=0;i<6;i++){
      const aa = spAng + i * Math.PI/3;
      const rr = b.radius * (1.2 + Math.sin(performance.now()*0.01 + i) * 0.3);
      ctx.strokeStyle = 'rgba(180,60,40,' + (0.5 - i*0.05) + ')'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(b.x, b.y, rr + i*8, aa, aa + 1.4); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(220,80,40,0.15)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.radius*2, 0, 7); ctx.fill();
  }
  const zOff = b.jumpZ || 0;
  ctx.fillStyle = 'rgba(0,0,0,' + (0.65 - zOff/600) + ')';
  ctx.beginPath();
  ctx.ellipse(b.x, b.y + b.radius*0.7, b.radius*1.5 * (1 + zOff/400), b.radius*0.65 * (1 + zOff/400), 0, 0, 7);
  ctx.fill();
  if(zOff > 0){ ctx.save(); ctx.translate(0, -zOff); }
  const breathe = 1 + Math.sin(b.breathPhase) * 0.06;
  const bodyColor = b.hitFlash > 0 ? '#a04030' : (b.stage === 2 ? '#4a1010' : '#2a1010');
  ctx.fillStyle = bodyColor; ctx.beginPath(); ctx.arc(b.x, b.y, b.radius * breathe, 0, 7); ctx.fill();
  ctx.strokeStyle = b.stage === 2 ? '#6a2018' : '#3a1810'; ctx.lineWidth = 3;
  for(let i = 0; i < 28; i++){
    const a = (i/28) * Math.PI * 2 + b.breathPhase * 0.4;
    const r1 = b.radius * 0.9;
    const r2 = b.radius * 1.18 * (0.9 + Math.sin(i*7 + performance.now()*0.003) * 0.1);
    ctx.beginPath(); ctx.moveTo(b.x + Math.cos(a)*r1, b.y + Math.sin(a)*r1); ctx.lineTo(b.x + Math.cos(a)*r2, b.y + Math.sin(a)*r2); ctx.stroke();
  }
  const hx = b.x + Math.cos(b.angle) * b.radius * 0.68;
  const hy = b.y + Math.sin(b.angle) * b.radius * 0.68;
  ctx.fillStyle = b.stage === 2 ? '#5a1818' : '#2c1810';
  ctx.beginPath(); ctx.arc(hx, hy, b.radius * 0.68, 0, 7); ctx.fill();
  const perpX = -Math.sin(b.angle), perpY = Math.cos(b.angle);
  ctx.fillStyle = '#1a0e08';
  [1,-1].forEach(s=>{ ctx.beginPath(); ctx.arc(hx + perpX*s*b.radius*0.52, hy + perpY*s*b.radius*0.52, b.radius*0.3, 0, 7); ctx.fill(); });
  const eyeColor = b.stage === 2 ? '#ff1010' : '#ff4020';
  const eyeGlow = (b.state === 'telegraph' || b.state === 'dash' || b.state === 'triple') ? 1 : 0.65;
  [1,-1].forEach(s=>{
    const ex = hx + Math.cos(b.angle)*b.radius*0.42 + perpX*s*b.radius*0.22;
    const ey = hy + Math.sin(b.angle)*b.radius*0.42 + perpY*s*b.radius*0.22;
    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 16);
    eg.addColorStop(0, 'rgba(255,90,40,' + eyeGlow + ')'); eg.addColorStop(1, 'rgba(255,20,0,0)');
    ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, 16, 0, 7); ctx.fill();
    ctx.fillStyle = eyeColor; ctx.beginPath(); ctx.arc(ex, ey, 3.4, 0, 7); ctx.fill();
  });
  const mouthX = hx + Math.cos(b.angle) * b.radius * 0.45;
  const mouthY = hy + Math.sin(b.angle) * b.radius * 0.45;
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(mouthX, mouthY, b.radius * 0.26, b.radius * 0.17, b.angle, 0, 7); ctx.fill();
  ctx.fillStyle = '#e8dcc0';
  [1,-1].forEach(s=>{
    const tx = mouthX + perpX * s * b.radius * 0.16;
    const ty = mouthY + perpY * s * b.radius * 0.16;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(b.angle) * 7, ty + Math.sin(b.angle) * 7 + 4); ctx.lineTo(tx + perpX*s*3, ty + perpY*s*3); ctx.closePath(); ctx.fill();
  });
  if(zOff > 0){ ctx.restore(); }
  const barW = 110, barH = 8;
  const bx = b.x - barW/2;
  const by = b.y - b.radius - 34 - zOff;
  ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
  ctx.strokeStyle = b.stage === 2 ? '#e06060' : '#c9a227'; ctx.lineWidth = 1.5; ctx.strokeRect(bx - 2.5, by - 2.5, barW + 5, barH + 5);
  ctx.fillStyle = b.stage === 2 ? '#c92a2a' : '#c9a227'; ctx.fillRect(bx, by, barW * (b.hp / b.maxHp), barH);
  if(b.stunT > 0){ ctx.fillStyle = '#fff0a0'; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('★', b.x, by - 8); }
}

function clearAllOverlays(){
  ['title','dead','win','pause','slots','achievements','settings'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.remove('show'); });
  ['inv','noteView','mapView'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.remove('show'); });
  ['hideMinigame','escapeMinigame','fuelMinigame','lockpickMinigame','tumblerMinigame'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.remove('on'); });
  lpGame.active=false; lpGame.itemRef=null;
  tumblerGame.active=false; tumblerGame.generatorRef=null;
  bossGame.active=false; bossGame.boss=null; bossGame.pillars=[];
  const _bb = document.getElementById('bossBar'); if(_bb) _bb.classList.remove('on');
  const _bh = document.getElementById('bossHint'); if(_bh) _bh.classList.remove('on');
  const js=document.getElementById('jumpscare'); if(js) js.classList.remove('on');
  const ho=document.getElementById('hideOverlay'); if(ho) ho.classList.remove('on');
  const wh=document.getElementById('whisper'); if(wh) wh.classList.remove('on');
  const dmg=document.getElementById('dmg'); if(dmg) dmg.style.opacity='0';
  const sting=document.getElementById('sting'); if(sting) sting.style.opacity='0';
  const pulse=document.getElementById('pulse'); if(pulse) pulse.style.opacity='0';
  G.scareActive=false; G.dmgFlash=0; G.stingFlash=0; G.shake=0;
  hideGame.active=false; escapeGame.active=false; fuelGame.active=false;
  player.hidden=false; player.hidePosition=null;
  try{
    ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; ctx.setTransform(1,0,0,1,0,0);
    lctx.globalCompositeOperation='source-over'; lctx.globalAlpha=1; lctx.setTransform(1,0,0,1,0,0);
  }catch(e){}
}
function initGame(){
  clearAllOverlays();
  generateMap();
  items=[];bears=[];boars=[];structures=[];flareObjects=[];particles=[];footprintTrails=[];
  const sx=Math.floor(MAP_W/2),sy=MAP_H-6;
  player.x=sx*TILE+TILE/2; player.y=sy*TILE+TILE/2;
  player.angle=-Math.PI/2;
  player.hp=100;player.stamina=100;player.battery=100;player.sanity=100;
  player.flashlight=true;
  player.medkits=1;player.batteries=0;player.flares=2;
  player.hasKey=false;player.hasFuel=false;player.hasRadio=false;
  player.invuln=0;player.hidden=false;player.hidePosition=null;player.hiddenTimer=0;
  player.exhausted=false;player.fear=0;
  collectedNotes=[];
  G.time=0;G.shake=0;G.dmgFlash=0;G.stingFlash=0;
  G.scareActive=false;G.scareCooldown=8; G.scareT=0;
  G.ambientEventT=10; G.lastBiteScare=-999; G.boarsStunned=0;
  _scaryNextT = 0; _scaryAccum = 0;
  flickerState.nextT = 6 + Math.random() * 12; flickerState.activeT = 0; flickerState.intensity = 0; flickerState.seedPhase = 0;
  endHideGame();
  if(escapeGame.active)endEscapeGame(false);

  let s=freeSpot(LOCATIONS[0].x,LOCATIONS[0].y,3);addItem('key',s.x,s.y);
  s=freeSpot(LOCATIONS[1].x,LOCATIONS[1].y,3);addItem('fuel',s.x,s.y);
  const spawnRel=(type,fractions,rad,extra)=>{
    fractions.forEach(p=>{
      const q=freeSpot(Math.floor(p[0]*MAP_W),Math.floor(p[1]*MAP_H),rad||5);
      addItem(type,q.x,q.y,extra);
    });
  };
  spawnRel('battery',[[0.16,0.34],[0.44,0.16],[0.26,0.55],[0.56,0.36],[0.14,0.26],[0.48,0.62],[0.36,0.26],[0.64,0.50],[0.40,0.72]]);
  spawnRel('medkit',[[0.33,0.44],[0.22,0.18],[0.46,0.46],[0.11,0.36],[0.58,0.28],[0.42,0.62]]);
  spawnRel('flare',[[0.24,0.24],[0.54,0.40],[0.18,0.62],[0.40,0.11],[0.62,0.55],[0.72,0.30]]);
  spawnRel('pill',[[0.35,0.35],[0.13,0.20],[0.55,0.25],[0.24,0.47],[0.62,0.66]]);
  const noteSpots=[[0.14,0.10],[0.54,0.09],[0.34,0.55],[0.20,0.27],[0.42,0.40],[0.11,0.53],[0.60,0.15],[0.27,0.15],[0.45,0.55],[0.33,0.22]];
  noteSpots.forEach((p,i)=>{
    const q=freeSpot(Math.floor(p[0]*MAP_W),Math.floor(p[1]*MAP_H),4);
    addItem('note',q.x,q.y,NOTE_DATA[i%NOTE_DATA.length]);
  });
  structures.push({type:'generator',x:LOCATIONS[2].x*TILE+16,y:LOCATIONS[2].y*TILE+16,r:56,used:false,name:'Генератор'});
  structures.push({type:'radio',x:LOCATIONS[3].x*TILE+16,y:LOCATIONS[3].y*TILE+16,r:56,used:false,name:'Передатчик'});
  structures.push({type:'gate',x:LOCATIONS[4].x*TILE+16,y:LOCATIONS[4].y*TILE+16,r:70,used:false,name:'Северные ворота'});
  const lockers=GENERATED_BUILDINGS.map(b=>({x:b.x+1,y:b.y+1}));
  lockers.forEach(l=>{
    const wx=l.x*TILE+TILE/2, wy=l.y*TILE+TILE/2;
    if(!isSolidPx(wx,wy)) structures.push({type:'locker',x:wx,y:wy,r:38,name:'Шкаф',occupied:false});
  });
  const bushHideTarget=24;
  let bushPlaced=0, bushTries=0;
  while(bushPlaced<bushHideTarget && bushTries<3000){
    bushTries++;
    const tx=4+Math.floor(Math.random()*(MAP_W-8));
    const ty=4+Math.floor(Math.random()*(MAP_H-8));
    if(getTile(tx,ty)!==T_BUSH)continue;
    const wx=tx*TILE+TILE/2, wy=ty*TILE+TILE/2;
    if(isSolidPx(wx,wy))continue;
    if(dist(wx,wy,player.x,player.y)<220)continue;
    let ok=true;
    for(const st of structures){ if(dist(st.x,st.y,wx,wy)<110){ok=false;break;} }
    if(!ok)continue;
    structures.push({type:'bush',x:wx,y:wy,r:34,name:'Куст',occupied:false});
    bushPlaced++;
  }
  const bearSpots=[[0.18,0.18],[0.52,0.42],[0.28,0.55],[0.42,0.26],[0.15,0.42],[0.60,0.62],[0.22,0.44],[0.70,0.20],[0.34,0.70]].map(p=>[Math.floor(p[0]*MAP_W),Math.floor(p[1]*MAP_H)]);
  bearSpots.forEach((p,i)=>{
    let tier=0;
    if(i>=5)tier=1;
    if(i>=7)tier=2;
    const b=spawnBear(p[0],p[1],tier);
    if(dist(b.x,b.y,player.x,player.y)<600){
      const s2=freeSpotAvoid(p[0],p[1],8,player.x,player.y,600);
      b.x=s2.x;b.y=s2.y;b.homeX=s2.tx;b.homeY=s2.ty;
    }
  });
  const boarPacks=[
    {cx:0.22,cy:0.32,n:3,tier:0},
    {cx:0.55,cy:0.48,n:3,tier:0},
    {cx:0.35,cy:0.68,n:2,tier:1},
    {cx:0.62,cy:0.22,n:2,tier:1}
  ];
  boarPacks.forEach(pack=>{
    for(let k=0;k<pack.n;k++){
      let ok=false,tx=0,ty=0;
      for(let tries=0;tries<80;tries++){
        tx=clamp(Math.floor(pack.cx*MAP_W)+Math.floor(rnd(-7,7)),3,MAP_W-4);
        ty=clamp(Math.floor(pack.cy*MAP_H)+Math.floor(rnd(-7,7)),3,MAP_H-4);
        if(isSolid(tx,ty)||getTile(tx,ty)===T_WATER)continue;
        const wx=tx*TILE+TILE/2,wy=ty*TILE+TILE/2;
        if(dist(wx,wy,player.x,player.y)<500)continue;
        ok=true;break;
      }
      if(ok)spawnBoar(tx,ty,pack.tier);
    }
  });
  explored=new Uint8Array(MAP_W*MAP_H);
  initObjectives();
  markExplored(player.x,player.y,220);
  updateHUD();
  message('Национальный парк «Медвежий ручей». 03:47.','#c9a227');
  message('В шкафу и кустах — тайминг-клики для рассудка.','#7a9a6a');
  message('Осторожно: кабаны быстрые и ходят стаями.','#c98a2a');
}
function markExplored(wx,wy,radius){
  const tx0=Math.max(0,Math.floor((wx-radius)/TILE));
  const ty0=Math.max(0,Math.floor((wy-radius)/TILE));
  const tx1=Math.min(MAP_W-1,Math.floor((wx+radius)/TILE));
  const ty1=Math.min(MAP_H-1,Math.floor((wy+radius)/TILE));
  const r2=radius*radius;
  for(let ty=ty0;ty<=ty1;ty++){
    for(let tx=tx0;tx<=tx1;tx++){
      const cx=tx*TILE+TILE/2,cy=ty*TILE+TILE/2;
      if((cx-wx)*(cx-wx)+(cy-wy)*(cy-wy)<r2)explored[idx(tx,ty)]=1;
    }
  }
}

/* ============ ВВОД ============ */
const keys={};
const mouse={x:0,y:0,down:false};
window.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(lpGame.active){ if(e.code==='Escape'){ endLockpickGame(false); } e.preventDefault(); e.stopPropagation(); return; }
  if(tumblerGame.active){ if(e.code==='Escape'){ endTumblerGame(false); } e.preventDefault(); e.stopPropagation(); return; }
  if(fuelGame.active){ if(e.code==='Escape'){ endFuelGame(false); } e.preventDefault(); e.stopPropagation(); return; }
  if(escapeGame.active){
    if(!e.repeat){ if(['KeyQ','KeyE','KeyZ','KeyR','KeyF'].includes(e.code)) escapeGamePress(e.code); }
    e.preventDefault(); e.stopPropagation(); return;
  }
  if(hideGame.active && e.code==='Space'){ hideGameClick(); e.preventDefault(); return; }
  if(e.code==='Tab'||e.code==='KeyI'){
    if(!hideGame.active&&!escapeGame.active&&!fuelGame.active&&!lpGame.active&&!tumblerGame.active&&!bossGame.active){
      if(G.state==='inv'){toggleInv(false);}
      else if(G.state==='play'){toggleInv(true);}
    }
    e.preventDefault();return;
  }
  if(e.code==='Escape'||e.code==='KeyR'){
    if(G.state==='map'){toggleMap(false);e.preventDefault();return;}
    if(G.state==='note'){closeNote();e.preventDefault();return;}
    if(G.state==='inv'){toggleInv(false);e.preventDefault();return;}
    if(G.state==='slots'||G.state==='achievements'||G.state==='settings'){setState('title');e.preventDefault();return;}
    if(G.state==='play'){
      if(e.code==='KeyR' && !hideGame.active){toggleMap(true);}
      else{setState('pause');}
      e.preventDefault();return;
    }
    if(G.state==='pause'){setState('play');e.preventDefault();return;}
    return;
  }
  if(G.state!=='play')return;
  if(e.code==='KeyF'){toggleFlashlight();e.preventDefault();}
  if(e.code==='KeyE'){interact();e.preventDefault();}
  if(e.code==='KeyQ'){useMedkit();e.preventDefault();}
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
canvas.addEventListener('mousedown',e=>{
  if(hideGame.active)return;
  if(lpGame.active)return;
  if(e.button === 0 && bossGame.active && bossGame.boss){
    const b = bossGame.boss;
    if(b.hp > 0){
      const wx = e.clientX + player.x - W/2;
      const wy = e.clientY + player.y - H/2;
      const dToBoss = dist(wx, wy, b.x, b.y);
      const dFromPlayer = dist(b.x, b.y, player.x, player.y);
      if(dToBoss < b.radius + 44){
        if(dFromPlayer < 135){
          if(bossGame.hitCooldown <= 0){ damageBoss(34); bossGame.hitCooldown = 0.48; SFX.stepHeavy(); }
        } else if(dFromPlayer < 340 && player.flares > 0){
          player.flares--; throwFlareTo(b.x, b.y); damageBoss(130); updateHUD();
          message('Фальшфейер обжёг Альфу!','#e0a83a');
        } else if(dFromPlayer >= 340){ message('Слишком далеко. Подойди ближе.','#8a9a7a'); }
      }
      e.preventDefault(); return;
    }
  }
  if(e.button===0 && tumblerGame.active){ tbHandleClick(e.clientX, e.clientY); e.preventDefault(); return; }
  if(e.button===0 && G.state==='play' && !player.hidden && !escapeGame.active && !fuelGame.active){
    const wx = e.clientX + player.x - W/2;
    const wy = e.clientY + player.y - H/2;
    if(player.flares > 0){ throwFlareTo(wx, wy); e.preventDefault(); return; }
  }
  mouse.down=true;
});
canvas.addEventListener('mouseup',()=>{mouse.down=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('mousedown', e=>{
  if(!hideGame.active) return;
  if(e.button===0 || e.button===2){ hideGameClick(); e.preventDefault(); e.stopPropagation(); }
}, true);
document.addEventListener('contextmenu', e=>{ if(hideGame.active){ e.preventDefault(); } });
document.addEventListener('mousedown', e=>{
  if(!fuelGame.active) return;
  if(e.button!==0) return;
  const el=document.getElementById('fuelCanvas'); if(!el) return;
  const rect=el.getBoundingClientRect();
  const scaleX=el.width/rect.width, scaleY=el.height/rect.height;
  const cx=(e.clientX-rect.left)*scaleX, cy=(e.clientY-rect.top)*scaleY;
  const px=fuelGame.panelX, py=fuelGame.panelY, cw=fuelGame.cellW, ch=fuelGame.cellH;
  if(cw>0 && cx>=px && cx<px+cw*4 && cy>=py && cy<py+ch*4){
    const col=Math.floor((cx-px)/cw), row=Math.floor((cy-py)/ch);
    fuelGameCellClick(row*4+col);
  }
  e.preventDefault(); e.stopPropagation();
}, true);
document.addEventListener('mousemove', e=>{
  if(lpGame.active){ lpHandleMouse(e.clientX, e.clientY); return; }
  if(!fuelGame.active){ if(fuelGame.hoverIdx!==-1) fuelGame.hoverIdx=-1; return; }
  const el=document.getElementById('fuelCanvas'); if(!el) return;
  const rect=el.getBoundingClientRect();
  const scaleX=el.width/rect.width, scaleY=el.height/rect.height;
  const cx=(e.clientX-rect.left)*scaleX, cy=(e.clientY-rect.top)*scaleY;
  const px=fuelGame.panelX, py=fuelGame.panelY, cw=fuelGame.cellW, ch=fuelGame.cellH;
  if(cw>0 && cx>=px && cx<px+cw*4 && cy>=py && cy<py+ch*4){
    const col=Math.floor((cx-px)/cw), row=Math.floor((cy-py)/ch);
    fuelGame.hoverIdx=row*4+col;
  } else { fuelGame.hoverIdx=-1; }
});

function toggleMap(show){
  if(show&&G.state==='play'){ G.state='map'; drawFullMap(); document.getElementById('mapView').classList.add('show'); SFX.mapOpen(); }
  else if(!show&&G.state==='map'){ G.state='play'; document.getElementById('mapView').classList.remove('show'); SFX.mapClose(); }
}
function drawFullMap(){
  const topReserve = 70; const botReserve = 90; const sideReserve = 40;
  const availW = window.innerWidth - sideReserve * 2;
  const availH = window.innerHeight - topReserve - botReserve;
  const size = Math.min(availW, availH);
  const cv = document.getElementById('mapCanvas');
  cv.width = size; cv.height = size;
  const mc = cv.getContext('2d');
  const scale = size / (MAP_W * TILE);
  mc.fillStyle = '#08090a'; mc.fillRect(0, 0, size, size);
  mc.save(); mc.scale(scale, scale); mc.drawImage(mapCanvas, 0, 0); mc.restore();
  mc.fillStyle = 'rgba(0,0,0,0.15)'; mc.fillRect(0,0,size,size);
  mc.strokeStyle = 'rgba(140,130,90,0.08)'; mc.lineWidth = 1;
  for(let i=0;i<=10;i++){
    const p = (i/10)*size;
    mc.beginPath();mc.moveTo(p,0);mc.lineTo(p,size);mc.stroke();
    mc.beginPath();mc.moveTo(0,p);mc.lineTo(size,p);mc.stroke();
  }
  const arx = ARENA.cx * scale, ary = ARENA.cy * scale, arr = ARENA.radiusPx * scale;
  mc.strokeStyle = 'rgba(180,40,40,0.7)'; mc.lineWidth = 2; mc.beginPath(); mc.arc(arx, ary, arr, 0, 7); mc.stroke();
  mc.fillStyle = 'rgba(180,40,40,0.12)'; mc.beginPath(); mc.arc(arx, ary, arr, 0, 7); mc.fill();
  for(const loc of LOCATIONS){
    const lx = loc.x * TILE * scale;
    const ly = loc.y * TILE * scale;
    const pulse = 0.85 + Math.sin(performance.now()*0.003 + loc.x)*0.15;
    mc.fillStyle = 'rgba(201,162,39,'+(0.28*pulse)+')'; mc.beginPath(); mc.arc(lx, ly, 18, 0, 7); mc.fill();
    mc.fillStyle = '#c9a227'; mc.beginPath(); mc.arc(lx, ly, 7, 0, 7); mc.fill();
    mc.fillStyle = '#1a1408'; mc.beginPath(); mc.arc(lx, ly, 3, 0, 7); mc.fill();
    mc.font = 'bold 13px Courier New'; mc.textAlign = 'center'; mc.textBaseline = 'middle';
    const tw = mc.measureText(loc.name).width;
    const labelY = ly - 30;
    mc.fillStyle = 'rgba(15,14,10,0.94)'; mc.fillRect(lx - tw/2 - 12, labelY - 12, tw + 24, 24);
    mc.strokeStyle = 'rgba(201,162,39,0.75)'; mc.lineWidth = 1.2; mc.strokeRect(lx - tw/2 - 12, labelY - 12, tw + 24, 24);
    mc.fillStyle = '#e0c86a'; mc.fillText(loc.name, lx, labelY);
  }
  const px = player.x * scale, py = player.y * scale;
  mc.fillStyle = 'rgba(127,214,138,0.28)'; mc.beginPath(); mc.arc(px, py, 20, 0, 7); mc.fill();
  mc.fillStyle = '#7fd68a'; mc.beginPath(); mc.arc(px, py, 7, 0, 7); mc.fill();
  mc.strokeStyle = '#e8ffd8'; mc.lineWidth = 2.5;
  mc.beginPath(); mc.moveTo(px, py); mc.lineTo(px + Math.cos(player.angle) * 22, py + Math.sin(player.angle) * 22); mc.stroke();
  mc.strokeStyle = 'rgba(120,130,110,0.7)'; mc.lineWidth = 1; mc.strokeRect(0.5, 0.5, size - 1, size - 1);
}
function toggleFlashlight(){
  if(player.battery<=0){SFX.deny();message('Батарея разряжена.','#c95a5a');return;}
  player.flashlight=!player.flashlight;
  player.flashlight?SFX.click():SFX.clickOff();
  updateHUD();
}
function useBattery(){
  if(player.batteries<=0){ SFX.deny(); message('Нет батареек.','#c95a5a'); return; }
  if(player.battery>=100){ SFX.deny(); message('Батарея фонаря уже заряжена.','#8a9a7a'); return; }
  player.batteries--; player.battery=100;
  SFX.pickup();
  message('Батарейка установлена. Заряд фонаря: 100%','#a8d8a8');
  updateHUD();
}
function useMedkit(){
  if(player.medkits<=0){SFX.deny();message('Нет аптечек.','#c95a5a');return;}
  if(player.hp>=player.maxHp){SFX.deny();message('Здоровье в норме.','#8a9a7a');return;}
  player.medkits--;
  player.hp=Math.min(player.maxHp,player.hp+45);
  SFX.pickup();
  message('Аптечка использована. +45 HP','#7fd68a');
  updateHUD();
}
function throwFlareTo(tx, ty){
  if(player.flares<=0){ SFX.deny(); return; }
  const maxDist = 200;
  let dx = tx - player.x, dy = ty - player.y;
  const d = Math.hypot(dx, dy);
  if(d > maxDist){ tx = player.x + dx/d * maxDist; ty = player.y + dy/d * maxDist; }
  if(isSolidPx(tx, ty)){
    let found = false;
    for(let radius = 4; radius <= 72 && !found; radius += 4){
      for(let a = 0; a < Math.PI*2; a += Math.PI/8){
        const nx = tx + Math.cos(a)*radius;
        const ny = ty + Math.sin(a)*radius;
        if(!isSolidPx(nx, ny)){ tx=nx; ty=ny; found=true; break; }
      }
    }
    if(!found){ tx = player.x; ty = player.y; }
  }
  player.flares--;
  flareObjects.push({x:tx, y:ty, life:26, maxLife:26, phase:0});
  SFX.flare();
  message('Фальшфейер зажжён. Он отпугивает их.','#e0a83a');
  updateHUD();
}
function interact(){
  if(player.hidden){exitHide();return;}
  if(escapeGame.active||fuelGame.active||lpGame.active||tumblerGame.active||bossGame.active)return;
  let best=null,bd=52;
  for(const it of items){
    if(it.taken)continue;
    const d=dist(it.x,it.y,player.x,player.y);
    if(d<bd){bd=d;best={kind:'item',obj:it};}
  }
  for(const st of structures){
    const d=dist(st.x,st.y,player.x,player.y);
    if(d<st.r&&d<bd){bd=d;best={kind:'struct',obj:st};}
  }
  if(!best)return;
  if(best.kind==='item'){
    const it=best.obj;
    if(it.type==='key' && !player.hasKey){ startLockpickGame(it); return; }
    it.taken=true; SFX.pickup();
    if(it.type==='key'){player.hasKey=true;message('Получено: Ключ от генераторной','#e0c86a');completeObjective('key');}
    else if(it.type==='fuel'){player.hasFuel=true;message('Получено: Канистра с топливом','#e0c86a');completeObjective('fuel');}
    else if(it.type==='battery'){player.batteries++;message('Получено: Батарея','#a8d8a8');}
    else if(it.type==='medkit'){player.medkits++;message('Получено: Аптечка','#a8d8a8');}
    else if(it.type==='flare'){player.flares++;message('Получено: Фальшфейер','#a8d8a8');}
    else if(it.type==='pill'){player.sanity=Math.min(100,player.sanity+38);message('Транквилизатор. Рассудок восстановлен.','#c8a8e0');}
    else if(it.type==='note'){
      collectedNotes.push({title:it.extra.t,body:it.extra.b});
      message('Записка добавлена в инвентарь.','#e0c86a');
      openNote(it.extra);
    }
    updateHUD();
    return;
  }
  const st=best.obj;
  if(st.type==='generator'){
    if(st.used){SFX.deny();message('Генератор уже работает.','#8a9a7a');return;}
    if(!player.hasKey){SFX.deny();message('Нужен ключ от генераторной.','#c95a5a');return;}
    if(!player.hasFuel){SFX.deny();message('Нужна канистра с топливом.','#c95a5a');return;}
    if(fuelGame.active||tumblerGame.active)return;
    startTumblerGame(st);
  }
  else if(st.type==='radio'){
    if(st.used){SFX.deny();return;}
    if(!objectivesDone['gen']){SFX.deny();message('Нет питания. Нужен генератор.','#c95a5a');return;}
    st.used=true; SFX.pickup(); SFX.radioStatic();
    message('СИГНАЛ ПЕРЕДАН. «...приём, это рейнджер Ворон...»','#7fd68a');
    completeObjective('radio');
    setTimeout(()=>{if(G.state==='play'){SFX.radioScream();showWhisper('...ты не выйдешь...');}},1600);
    setTimeout(()=>{if(G.state==='play')message('Вертолёт будет через 6 минут. К СЕВЕРНЫМ ВОРОТАМ.','#c9a227');},3200);
  }
  else if(st.type==='gate'){
    if(!objectivesDone['radio']){SFX.deny();message('Ворота заперты. Сначала передай сигнал.','#c95a5a');return;}
    if(escapeGame.active)return;
    startEscapeGame();
  }
  else if(st.type==='locker'||st.type==='bush'){enterHide(st);}
}
function enterHide(st){
  player.hidden=true;
  player.hidePosition={x:player.x,y:player.y};
  player.x=st.x;player.y=st.y;
  player.hiddenTimer=0;
  SFX.hideEnter();
  document.getElementById('hideOverlay').classList.add('on');
  document.getElementById('hideTxt').textContent='[E] ВЫЙТИ ИЗ УКРЫТИЯ · [ЛКМ/ПКМ/SPACE] УСПОКОИТЬСЯ';
  message('Ты спрятался. Кликай в такт, чтобы успокоить рассудок.','#7a9a6a');
  bears.forEach(b=>{
    if(b.state==='chase'){
      const sees=canSeePlayer(b);
      if(!sees){ b.state='search';b.lostT=3.2; b.lastKnown={x:st.x+rnd(-40,40),y:st.y+rnd(-40,40)}; }
    }
  });
  boars.forEach(b=>{
    if(b.state==='chase'){
      const sees=canSeePlayerBoar(b);
      if(!sees){ b.state='search';b.lostT=2.5; b.lastKnown={x:st.x+rnd(-30,30),y:st.y+rnd(-30,30)}; }
    }
  });
  startHideGame();
}
function exitHide(){
  if(!player.hidden)return;
  player.hidden=false;
  if(player.hidePosition){
    let nx=player.hidePosition.x,ny=player.hidePosition.y;
    if(!collides(nx,ny,player.radius)){player.x=nx;player.y=ny;}
    else{
      for(let a=0;a<6.28;a+=0.4){
        const tx=player.hidePosition.x+Math.cos(a)*20;
        const ty=player.hidePosition.y+Math.sin(a)*20;
        if(!collides(tx,ty,player.radius)){player.x=tx;player.y=ty;break;}
      }
    }
  }
  player.hidePosition=null;
  SFX.hideExit();
  document.getElementById('hideOverlay').classList.remove('on');
  endHideGame();
}

/* ============ СОХРАНЕНИЕ (4 СЛОТА) ============ */
const SAVE_SLOT_COUNT = 4;
let currentSlot = 1;
function saveKeyForSlot(n){ return 'medvezhiy_ruchey_save_v2_slot_' + n; }
function getSaveData(n){
  try{ const raw = localStorage.getItem(saveKeyForSlot(n)); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
}
function saveGame(silent){
  if(!explored)return false;
  try{
    const save={
      version:3,time:G.time,
      player:{x:player.x,y:player.y,angle:player.angle,hp:player.hp,stamina:player.stamina,battery:player.battery,sanity:player.sanity,flashlight:player.flashlight,medkits:player.medkits,batteries:player.batteries,flares:player.flares,hasKey:player.hasKey,hasFuel:player.hasFuel,hasRadio:player.hasRadio},
      objectivesDone:objectivesDone,
      structures:structures.map(st=>({type:st.type,x:st.x,y:st.y,used:!!st.used})),
      items:items.map(it=>({type:it.type,x:it.x,y:it.y,taken:!!it.taken,extra:it.extra})),
      notes:collectedNotes,
      explored:Array.from(explored),
      savedAt:Date.now()
    };
    localStorage.setItem(saveKeyForSlot(currentSlot),JSON.stringify(save));
    if(!silent)showSaveStatus('ИГРА СОХРАНЕНА');
    return true;
  }catch(e){console.warn('save failed',e);if(!silent)showSaveStatus('ОШИБКА СОХРАНЕНИЯ','#e07070');return false;}
}
function loadGame(){
  try{
    const raw=localStorage.getItem(saveKeyForSlot(currentSlot));
    if(!raw)return false;
    const save=JSON.parse(raw);
    if(!save||!save.player)return false;
    initGame();
    Object.assign(player,save.player);
    objectivesDone=save.objectivesDone||{};
    updateObjective();
    if(Array.isArray(save.structures))save.structures.forEach(ss=>{
      const st=structures.find(x=>x.type===ss.type&&Math.abs(x.x-ss.x)<2&&Math.abs(x.y-ss.y)<2);
      if(st)st.used=!!ss.used;
    });
    if(Array.isArray(save.items))save.items.forEach(si=>{
      const it=items.find(x=>x.type===si.type&&Math.abs(x.x-si.x)<2&&Math.abs(x.y-si.y)<2);
      if(it)it.taken=!!si.taken;
    });
    collectedNotes=Array.isArray(save.notes)?save.notes:[];
    if(Array.isArray(save.explored)&&save.explored.length===MAP_W*MAP_H)explored=new Uint8Array(save.explored);
    G.time=Number(save.time)||0;
    player.hidden=false;player.hidePosition=null;player.invuln=1.5;
    updateHUD();drawMinimap();
    setState('play');
    message('Сохранение загружено. Будь осторожен.','#7fd68a');
    return true;
  }catch(e){console.warn('load failed',e);showSaveStatus('СОХРАНЕНИЕ ПОВРЕЖДЕНО','#e07070');return false;}
}
function showSaveStatus(text,color){
  const el=document.getElementById('saveStatus');
  if(!el)return;
  el.textContent=text;el.style.color=color||'#7fd68a';el.style.opacity='1';
  clearTimeout(G._saveMsgT);G._saveMsgT=setTimeout(()=>el.style.opacity='0',1800);
}
function renderSlots(){
  const grid = document.getElementById('slotsGrid');
  grid.innerHTML = '';
  for(let i=1;i<=SAVE_SLOT_COUNT;i++){
    const data = getSaveData(i);
    const card = document.createElement('div');
    card.className = 'slotCard' + (data ? '' : ' empty');
    let html = '<div>';
    html += '<div class="slotNum">СЛОТ ' + i + '</div>';
    if(data){
      const t = Number(data.time) || 0;
      const mm = String(Math.floor(t/60)).padStart(2,'0');
      const ss = String(Math.floor(t%60)).padStart(2,'0');
      const done = Object.keys(data.objectivesDone||{}).length;
      const hp = Math.round(data.player && data.player.hp || 0);
      const sn = Math.round(data.player && data.player.sanity || 0);
      html += '<div class="slotName">СОХРАНЕНИЕ</div>';
      html += '<div class="slotInfo">Время: ' + mm + ':' + ss + '<br>Задач: ' + done + ' / 5<br>HP: ' + hp + ' · Рассудок: ' + sn + '</div>';
    } else {
      html += '<div class="slotName">ПУСТО</div>';
      html += '<div class="slotInfo">Нажми, чтобы начать новую игру</div>';
    }
    html += '</div>';
    if(data) html += '<div class="slotDel" data-slot="'+i+'">УДАЛИТЬ</div>';
    card.innerHTML = html;
    card.addEventListener('click', (e)=>{
      if(e.target.classList && e.target.classList.contains('slotDel')) return;
      startSlot(i);
    });
    const delBtn = card.querySelector('.slotDel');
    if(delBtn){
      delBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        if(confirm('Удалить сохранение из слота ' + i + '?')){
          localStorage.removeItem(saveKeyForSlot(i));
          renderSlots();
        }
      });
    }
    grid.appendChild(card);
  }
}
function startSlot(i){
  currentSlot = i;
  const data = getSaveData(i);
  SFX.init();
  if(data){ loadGame(); }
  else {
    initGame();
    G.hidesUsed = 0;
    setState('play');
    drawMinimap();
    saveGame(true);
    setTimeout(()=>{ if(G.state==='play') SFX.treeCrack(); }, 10000);
  }
}
function renderAchievements(){
  const a = getAchievements();
  const list = document.getElementById('achList');
  list.innerHTML = '';
  let unlocked = 0;
  ACH_DEFS.forEach(def=>{
    const isU = !!a[def.id];
    if(isU) unlocked++;
    const d = document.createElement('div');
    d.className = 'ach' + (isU ? ' unlocked' : ' locked');
    d.innerHTML = '<div class="achIcon">'+def.icon+'</div>'+'<div class="achTxt"><b>'+def.name+'</b><span>'+def.desc+'</span></div>';
    list.appendChild(d);
  });
  document.getElementById('achCounter').textContent = unlocked + ' / ' + ACH_DEFS.length;
}
function checkWinAchievements(){
  unlockAchievement('first_escape');
  if(collectedNotes.length >= NOTE_DATA.length) unlockAchievement('all_notes');
  if(player.sanity < 20) unlockAchievement('sanity_low');
  if(player.sanity > 90) unlockAchievement('sanity_high');
  if(G.time < 300) unlockAchievement('speedrun');
  if((G.boarsStunned||0) >= 5) unlockAchievement('boar_hunter');
}
function applySettings(){
  if(SFX.master){ try{ SFX.master.gain.value = 0.85 * SETTINGS.sfx; }catch(e){} }
  const setSfx = document.getElementById('setSfx');
  const setMusic = document.getElementById('setMusic');
  const setSfxVal = document.getElementById('setSfxVal');
  const setMusicVal = document.getElementById('setMusicVal');
  if(setSfx) setSfx.value = Math.round(SETTINGS.sfx*100);
  if(setMusic) setMusic.value = Math.round(SETTINGS.music*100);
  if(setSfxVal) setSfxVal.textContent = Math.round(SETTINGS.sfx*100) + '%';
  if(setMusicVal) setMusicVal.textContent = Math.round(SETTINGS.music*100) + '%';
}

/* ============ UI ============ */
function setState(s){
  G.state=s;
  document.getElementById('hud').classList.toggle('hidden',!(s==='play'));
  document.getElementById('pause').classList.toggle('show',s==='pause');
  document.getElementById('title').classList.toggle('show',s==='title');
  document.getElementById('dead').classList.toggle('show',s==='dead');
  document.getElementById('win').classList.toggle('show',s==='win');
  document.getElementById('slots').classList.toggle('show',s==='slots');
  document.getElementById('achievements').classList.toggle('show',s==='achievements');
  document.getElementById('settings').classList.toggle('show',s==='settings');
  if(s!=='play'){
    document.getElementById('inv').classList.remove('show');
    document.getElementById('jumpscare').classList.remove('on');
    document.getElementById('whisper').classList.remove('on');
    document.getElementById('mapView').classList.remove('show');
    G.scareActive=false;
    if(hideGame.active){endHideGame();}
    if(escapeGame.active){ escapeGame.active=false; const el=document.getElementById('escapeMinigame'); if(el)el.classList.remove('on'); }
    if(fuelGame.active){ fuelGame.active=false; const el=document.getElementById('fuelMinigame'); if(el)el.classList.remove('on'); }
    if(lpGame.active){ lpGame.active=false; lpGame.itemRef=null; const el=document.getElementById('lockpickMinigame'); if(el)el.classList.remove('on'); }
    if(tumblerGame.active){ tumblerGame.active=false; tumblerGame.generatorRef=null; const el=document.getElementById('tumblerMinigame'); if(el)el.classList.remove('on'); }
    if(bossGame.active){
      bossGame.active=false; bossGame.boss=null; bossGame.pillars=[];
      const bar=document.getElementById('bossBar'); if(bar) bar.classList.remove('on');
      const hint=document.getElementById('bossHint'); if(hint) hint.classList.remove('on');
    }
  } else {
    document.getElementById('jumpscare').classList.remove('on');
    document.getElementById('hideOverlay').classList.remove('on');
    document.getElementById('whisper').classList.remove('on');
    document.getElementById('dmg').style.opacity='0';
    document.getElementById('sting').style.opacity='0';
    document.getElementById('pulse').style.opacity='0';
    ['hideMinigame','escapeMinigame','fuelMinigame','lockpickMinigame','tumblerMinigame'].forEach(id=>{ const el=document.getElementById(id); if(el) el.classList.remove('on'); });
    G.scareActive=false; G.dmgFlash=0; G.stingFlash=0; G.shake=0;
    try{ ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; lctx.globalCompositeOperation='source-over'; lctx.globalAlpha=1; }catch(e){}
  }
  // Громкость музыки управляется в главном цикле loop() — см. патч в loop().
}
function toggleInv(show){
  if(show&&G.state==='play'){G.state='inv';renderInventory();document.getElementById('inv').classList.add('show');}
  else if(!show&&G.state==='inv'){G.state='play';document.getElementById('inv').classList.remove('show');}
}
function renderInventory(){
  const grid=document.getElementById('invGrid');
  const slots=[];
  if(player.hasKey)slots.push({icon:'🗝',nm:'Ключ от генераторной',ct:'1'});
  if(player.hasFuel)slots.push({icon:'⛽',nm:'Канистра с топливом',ct:'1'});
  slots.push({icon:'🔋',nm:'Батареи',ct:String(player.batteries),usable:player.batteries>0,hint:'ЛКМ — зарядить фонарь',action:()=>useBattery()});
  slots.push({icon:'✚',nm:'Аптечки',ct:String(player.medkits),usable:player.medkits>0,hint:'ЛКМ — вылечиться (+45)',action:()=>useMedkit()});
  slots.push({icon:'🧨',nm:'Фальшфейеры',ct:String(player.flares),usable:player.flares>0,hint:'ЛКМ в игре — поставить',action:()=>{ throwFlareTo(player.x + Math.cos(player.angle)*70, player.y + Math.sin(player.angle)*70); }});
  collectedNotes.forEach((note,i)=>slots.push({icon:'📄',nm:'Записка '+(i+1),ct:'НАЖМИ, ЧТОБЫ ПРОЧИТАТЬ',note:note}));
  while(slots.length<10)slots.push(null);
  grid.innerHTML='';
  slots.slice(0,10).forEach(slot=>{
    const d=document.createElement('div');
    let cls='invSlot';
    if(!slot)cls+=' empty';
    else if(slot.note)cls+=' noteSlot';
    else if(slot.usable)cls+=' useSlot';
    d.className=cls;
    if(slot){
      d.innerHTML='<div class="ic">'+slot.icon+'</div>'+'<div class="nm">'+slot.nm+'</div>'+'<div class="ct">'+(slot.hint||slot.ct)+'</div>';
      if(slot.note){ d.addEventListener('click',()=>openNote({t:slot.note.title,b:slot.note.body})); }
      else if(slot.usable && slot.action){ d.addEventListener('click',()=>{ slot.action(); updateHUD(); renderInventory(); }); }
    }
    grid.appendChild(d);
  });
}
function openNote(data){
  G.noteReturnState=G.state==='inv'?'inv':'play';
  G.state='note';
  document.getElementById('noteTitle').textContent=data.t;
  document.getElementById('noteBody').textContent=data.b;
  document.getElementById('noteView').classList.add('show');
  if(Math.random()<0.4)setTimeout(()=>SFX.whisper(),800);
}
function closeNote(){
  document.getElementById('noteView').classList.remove('show');
  G.state=G.noteReturnState||'play';
  if(G.state==='inv'){renderInventory();document.getElementById('inv').classList.add('show');}
}
function updateHUD(){
  document.getElementById('hpFill').style.width=clamp(player.hp,0,100)+'%';
  document.getElementById('btFill').style.width=clamp(player.battery,0,100)+'%';
  document.getElementById('snFill').style.width=clamp(player.sanity,0,100)+'%';
  document.getElementById('hpTxt').textContent=Math.round(player.hp);
  document.getElementById('btTxt').textContent=Math.round(player.battery);
  document.getElementById('snTxt').textContent=Math.round(player.sanity);
  document.getElementById('iFlash').textContent=player.flashlight?'ВКЛ':'ВЫКЛ';
  document.getElementById('iFlash').style.color=player.flashlight?'#e0c86a':'#6d7560';
  document.getElementById('iBatt').textContent=player.batteries;
  document.getElementById('iMed').textContent=player.medkits;
  document.getElementById('iFlare').textContent=player.flares;
  document.getElementById('hpBar').classList.toggle('low',player.hp<30);
  document.getElementById('btBar').classList.toggle('low',player.battery<20);
  document.getElementById('snBar').classList.toggle('low',player.sanity<30);
  const t=Math.floor(G.time);
  document.getElementById('iTime').textContent = String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
  const flIcon = document.getElementById('flashlightIcon');
  if(flIcon){
    const pct = clamp(player.battery, 0, 100);
    flIcon.style.background = 'conic-gradient(#e0c86a 0% '+pct+'%, rgba(255,255,255,.08) '+pct+'% 100%)';
    flIcon.classList.toggle('off', !player.flashlight);
    flIcon.classList.toggle('low', pct < 20 && pct > 0);
    const pctEl = document.getElementById('flPct'); if(pctEl) pctEl.textContent = Math.round(pct) + '%';
  }
  const sbBar = document.getElementById('staminaBar');
  if(sbBar){
    const st = clamp(player.stamina, 0, 100);
    const sbFill = document.getElementById('sbFill'); if(sbFill) sbFill.style.width = st + '%';
    const low = st < 25;
    sbBar.classList.toggle('low', low);
    sbBar.classList.toggle('exhausted', player.exhausted || st <= 0);
    sbBar.classList.add('visible');
    const sbLbl = document.getElementById('sbLbl');
    if(sbLbl){
      if(low && !player.exhausted) sbLbl.textContent = 'УСТАЛ';
      else if(player.exhausted) sbLbl.textContent = 'ИСТОЩЁН';
      else sbLbl.textContent = 'ВЫНОСЛИВОСТЬ';
    }
  }
}
function collides(x,y,r){
  const minX=Math.floor((x-r)/TILE),maxX=Math.floor((x+r)/TILE);
  const minY=Math.floor((y-r)/TILE),maxY=Math.floor((y+r)/TILE);
  for(let ty=minY;ty<=maxY;ty++)for(let tx=minX;tx<=maxX;tx++) if(isSolid(tx,ty))return true;
  return false;
}
function moveWithCollision(e,dx,dy){
  const r=e.radius;
  if(!collides(e.x+dx,e.y,r))e.x+=dx;
  if(!collides(e.x,e.y+dy,r))e.y+=dy;
}
function castRay(px,py,dx,dy,maxD){
  const step=2;
  let d=0;
  while(d<maxD){
    d+=step;
    const x=px+dx*d,y=py+dy*d;
    if(isSolidPx(x,y))return Math.max(0,d-step*0.5);
  }
  return maxD;
}
let visPoly=[];
function computeVisibility(px,py,radius){
  const RAYS=480;
  visPoly.length=0;
  for(let i=0;i<=RAYS;i++){
    const a=(i/RAYS)*Math.PI*2;
    const dx=Math.cos(a),dy=Math.sin(a);
    const d=castRay(px,py,dx,dy,radius);
    visPoly.push(px+dx*d,py+dy*d);
  }
}
function updatePlayer(dt){
  let mx=0,my=0;
  if(!player.hidden && !escapeGame.active && !fuelGame.active && !lpGame.active && !tumblerGame.active && !bossGame.active){
    if(keys['KeyW']||keys['ArrowUp'])my-=1;
    if(keys['KeyS']||keys['ArrowDown'])my+=1;
    if(keys['KeyA']||keys['ArrowLeft'])mx-=1;
    if(keys['KeyD']||keys['ArrowRight'])mx+=1;
  }
  if(bossGame.active && !player.hidden){
    if(keys['KeyW']||keys['ArrowUp'])my-=1;
    if(keys['KeyS']||keys['ArrowDown'])my+=1;
    if(keys['KeyA']||keys['ArrowLeft'])mx-=1;
    if(keys['KeyD']||keys['ArrowRight'])mx+=1;
  }
  const moving=(mx!==0||my!==0);
  player.moving=moving;
  const dx=mouse.x-W/2, dy=mouse.y-H/2;
  if(Math.hypot(dx,dy)>8&&!player.hidden)player.angle=Math.atan2(dy,dx);
  const wantSprint=(keys['ShiftLeft']||keys['ShiftRight'])&&moving&&player.stamina>1&&!player.exhausted;
  player.sprinting=wantSprint;
  let sp=wantSprint?player.runSpeed:player.speed;
  const ct=getTile(Math.floor(player.x/TILE),Math.floor(player.y/TILE));
  if(ct===T_WATER)sp*=0.55;
  if(ct===T_BUSH)sp*=0.72;
  if(player.sanity<30)sp*=0.9;
  if(moving){
    const len=Math.hypot(mx,my);
    moveWithCollision(player,mx/len*sp*dt,my/len*sp*dt);
    player.stepTimer-=dt*(wantSprint?2.1:1.35);
    if(player.stepTimer<=0){
      player.stepTimer=0.42;
      if(ct===T_WATER)SFX.noise(0.12,0.10,600,1.0,'bandpass');
      else if(wantSprint)SFX.stepHeavy();
      else SFX.step();
      spawnDust(player.x,player.y);
    }
  }
  if(wantSprint){ player.stamina=Math.max(0,player.stamina-24*dt); if(player.stamina<=0)player.exhausted=true; }
  else{ player.stamina=Math.min(player.maxStamina,player.stamina+16*dt); if(player.stamina>22)player.exhausted=false; }
  let noise=0;
  if(moving)noise=wantSprint?1.0:(ct===T_BUSH?0.22:0.5);
  if(player.hidden)noise=0;
  player.noise=lerp(player.noise,noise,dt*6);
  if(player.flashlight&&player.battery>0){
    player.battery=Math.max(0,player.battery-3.0*dt);
    if(player.battery<=0){ player.flashlight=false; SFX.clickOff(); message('Фонарь погас.','#c95a5a'); updateHUD(); }
  }
  let sanityDelta=0;
  const nearFlare=flareObjects.some(f=>dist(f.x,f.y,player.x,player.y)<170);
  const anyBearClose=bears.some(b=>dist(b.x,b.y,player.x,player.y)<420&&(b.state==='chase'||b.state==='attack'));
  const anyBoarClose=boars.some(b=>dist(b.x,b.y,player.x,player.y)<300&&(b.state==='chase'||b.state==='attack'));
  if(anyBearClose)sanityDelta-=5.5;
  if(anyBoarClose)sanityDelta-=3.0;
  if(!player.flashlight||player.battery<=0)sanityDelta-=0.85;
  if(nearFlare)sanityDelta+=4.0;
  if(objectivesDone['gen'])sanityDelta+=1.2;
  if(!player.hidden){ player.sanity=clamp(player.sanity+sanityDelta*dt,0,100); }
  player.fear = clamp(1 - player.sanity/100, 0, 1);
  if(player.invuln>0)player.invuln-=dt;
  markExplored(player.x,player.y,200);
  if(player.sanity<50&&Math.random()<dt*0.18&&!player.hidden){
    SFX.whisper();
    if(Math.random()<0.55){
      const msgs=['...не оглядывайся...','...оно рядом...','...дыши тише...','...я вижу тебя...','...беги...','...сзади...','...оно знает...'];
      showWhisper(msgs[Math.floor(Math.random()*msgs.length)]);
    }
  }
  if(player.hidden)player.hiddenTimer+=dt;
  updateHUD();
}
function spawnDust(x,y){
  for(let i=0;i<2;i++){ particles.push({ x:x+rnd(-6,6),y:y+rnd(-6,6), vx:rnd(-14,14),vy:rnd(-14,14), life:rnd(0.3,0.6),maxLife:0.6, color:'rgba(160,150,120,' }); }
}
function spawnBlood(x,y){
  for(let i=0;i<8;i++){ particles.push({ x:x+rnd(-8,8),y:y+rnd(-8,8), vx:rnd(-50,50),vy:rnd(-50,50), life:rnd(0.4,1.1),maxLife:1.1, color:'rgba(140,20,20,' }); }
}
function canSeePlayer(b){
  if(player.hidden)return false;
  const d=dist(b.x,b.y,player.x,player.y);
  if(d>b.sightRange)return false;
  const a=Math.atan2(player.y-b.y,player.x-b.x);
  if(Math.abs(angDiff(b.angle,a))>b.fov/2&&d>90)return false;
  const steps=Math.ceil(d/12);
  for(let i=1;i<steps;i++){
    const t=i/steps;
    const px=b.x+(player.x-b.x)*t;
    const py=b.y+(player.y-b.y)*t;
    if(isSolidPx(px,py))return false;
  }
  const lit=(player.flashlight&&player.battery>0)||flareObjects.some(f=>dist(f.x,f.y,player.x,player.y)<160);
  if(!lit&&d>240)return false;
  return true;
}
function canHearPlayer(b){
  if(player.hidden&&player.hiddenTimer>0.4)return false;
  const d=dist(b.x,b.y,player.x,player.y);
  const eff=b.hearingRange*(0.35+player.noise*0.65);
  return d<eff&&player.noise>0.15;
}
function bearRepath(b,tx,ty){
  const bx=Math.floor(b.x/TILE),by=Math.floor(b.y/TILE);
  const p=findPath(bx,by,tx,ty);
  if(p&&p.length){b.path=p;b.pathIdx=0;}
  else{b.path=null;}
}
function separateBears(dt){
  for(let i=0;i<bears.length;i++){
    for(let j=i+1;j<bears.length;j++){
      const a=bears[i],b=bears[j];
      const d=dist(a.x,a.y,b.x,b.y);
      const minD=a.radius+b.radius+4;
      if(d<minD&&d>0.001){
        const nx=(b.x-a.x)/d,ny=(b.y-a.y)/d;
        const push=(minD-d)*0.5;
        moveWithCollision(a,-nx*push,-ny*push);
        moveWithCollision(b,nx*push,ny*push);
      }
    }
  }
}
function updateBears(dt){
  for(const b of bears){
    const dToPlayer=dist(b.x,b.y,player.x,player.y);
    let flareNear=null;
    for(const f of flareObjects){ if(dist(f.x,f.y,b.x,b.y)<150){flareNear=f;break;} }
    if(b.stunT>0)b.stunT-=dt;
    const sees=canSeePlayer(b);
    const hears=canHearPlayer(b);
    if(flareNear){
      b.state='flee'; b.target={x:b.x+(b.x-flareNear.x),y:b.y+(b.y-flareNear.y)}; b.lostT=3.5;
    } else if(sees){
      if(b.state!=='chase'&&b.state!=='attack'){ SFX.growl(1);G.stingFlash=Math.max(G.stingFlash,0.5); }
      b.state='chase'; b.lastKnown={x:player.x,y:player.y}; b.lostT=4.5; b.alert=1;
    } else if(hears){
      b.state='investigate'; b.lastKnown={x:player.x+rnd(-40,40),y:player.y+rnd(-40,40)}; b.lostT=5.5; b.alert=Math.min(1,b.alert+0.4);
    } else {
      if(b.state==='chase'||b.state==='investigate'){ b.lostT-=dt; if(b.lostT<=0){b.state='search';b.lostT=4.0;} }
      else if(b.state==='search'){ b.lostT-=dt; if(b.lostT<=0){b.state='patrol';b.alert=0;} }
    }
    b.repathT-=dt;
    if(b.state==='chase'&&b.lastKnown){
      if(b.repathT<=0){ bearRepath(b,Math.floor(b.lastKnown.x/TILE),Math.floor(b.lastKnown.y/TILE)); b.repathT=0.4; }
      if(dToPlayer<b.radius+player.radius+16&&b.attackCD<=0)attackPlayer(b);
    } else if(b.state==='investigate'&&b.lastKnown){
      if(b.repathT<=0){ bearRepath(b,Math.floor(b.lastKnown.x/TILE),Math.floor(b.lastKnown.y/TILE)); b.repathT=0.7; }
      if(dist(b.x,b.y,b.lastKnown.x,b.lastKnown.y)<50){b.state='search';b.lostT=3.5;}
    } else if(b.state==='search'){
      if(b.repathT<=0){
        const a=Math.random()*6.283;
        const tx=clamp(Math.floor(b.x/TILE+Math.cos(a)*7),2,MAP_W-3);
        const ty=clamp(Math.floor(b.y/TILE+Math.sin(a)*7),2,MAP_H-3);
        bearRepath(b,tx,ty); b.repathT=1.4;
      }
    } else if(b.state==='flee'){
      if(b.repathT<=0&&b.target){ bearRepath(b,Math.floor(b.target.x/TILE),Math.floor(b.target.y/TILE)); b.repathT=0.6; }
    } else {
      if(b.repathT<=0||!b.path){
        const a=Math.random()*6.283,r=rnd(6,16);
        const tx=clamp(Math.floor(b.homeX+Math.cos(a)*r),2,MAP_W-3);
        const ty=clamp(Math.floor(b.homeY+Math.sin(a)*r),2,MAP_H-3);
        bearRepath(b,tx,ty); b.repathT=rnd(2.5,5.5);
      }
    }
    let speed=b.speed;
    if(b.state==='chase')speed*=1.28;
    if(b.state==='flee')speed*=1.5;
    if(b.state==='investigate')speed*=1.12;
    if(b.stunT>0)speed*=0.25;
    const ox=b.x, oy=b.y;
    if(b.path&&b.pathIdx<b.path.length){
      const wp=b.path[b.pathIdx];
      const wx=wp.x*TILE+TILE/2, wy=wp.y*TILE+TILE/2;
      const d=dist(b.x,b.y,wx,wy);
      if(d<14){b.pathIdx++;}
      else{ const a=Math.atan2(wy-b.y,wx-b.x); b.angle+=angDiff(b.angle,a)*Math.min(1,dt*6); moveWithCollision(b,Math.cos(a)*speed*dt,Math.sin(a)*speed*dt); }
    } else {
      if(b.state==='chase'){ const a=Math.atan2(player.y-b.y,player.x-b.x); b.angle+=angDiff(b.angle,a)*Math.min(1,dt*6); moveWithCollision(b,Math.cos(a)*speed*dt,Math.sin(a)*speed*dt); }
    }
    const movedDist=dist(ox,oy,b.x,b.y);
    b.stepT-=dt;
    if(movedDist>0.5&&b.stepT<=0){
      b.stepT= b.state==='chase'?0.42:0.72;
      footprintTrails.push({x:b.x,y:b.y,life:22,maxLife:22,angle:b.angle,tier:b.tier});
      const dP=dist(b.x,b.y,player.x,player.y);
      if(dP<420){ const v=clamp(1-dP/420,0.15,1); SFX.bearStep(v); }
    }
    b.growlCD-=dt;
    if(b.growlCD<=0){
      const vol=b.state==='chase'?1:0.55;
      const dP=dist(b.x,b.y,player.x,player.y);
      if(dP<700)SFX.growl(vol);
      b.growlCD=rnd(4,11)-(b.state==='chase'?3:0);
    }
    if(b.attackCD>0)b.attackCD-=dt;
    b.breathPhase+=dt*(b.state==='chase'?4:1.5);
    if(dToPlayer<90&&Math.random()<dt*0.4)SFX.breathing();
  }
  separateBears(dt);
}
function attackPlayer(b){
  b.attackCD=1.35;
  if(player.invuln>0)return;
  if(escapeGame.active||fuelGame.active||lpGame.active||tumblerGame.active)return;
  const dmg=22+b.tier*7;
  player.hp-=dmg; player.invuln=0.85;
  player.sanity=Math.max(0,player.sanity-16);
  G.shake=22;G.dmgFlash=1;
  SFX.hurt();SFX.roar();
  spawnBlood(player.x,player.y);
  const isDead = player.hp <= 0;
  if(isDead || (G.time - G.lastBiteScare) > 4){
    triggerJumpscare('roar', true);
    G.lastBiteScare = G.time;
    G.shake = Math.max(G.shake, 55);
  }
  const a=Math.atan2(player.y-b.y,player.x-b.x);
  moveWithCollision(player,Math.cos(a)*34,Math.sin(a)*34);
  updateHUD();
  if(player.hp<=0){player.hp=0;die('Тебя разорвали в темноте.');}
  else { const msgs=['Когти прошлись по спине!','Удар в плечо!','Ты едва увернулся — но не полностью.']; message(msgs[Math.floor(Math.random()*msgs.length)],'#e06060'); }
}
function updateItems(dt){
  for(const it of items)if(!it.taken)it.phase+=dt*2.4;
  for(let i=flareObjects.length-1;i>=0;i--){ const f=flareObjects[i]; f.life-=dt;f.phase+=dt*9; if(f.life<=0)flareObjects.splice(i,1); }
  for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx*dt;p.y+=p.vy*dt; p.vx*=0.94;p.vy*=0.94; p.life-=dt; if(p.life<=0)particles.splice(i,1); }
  for(let i=footprintTrails.length-1;i>=0;i--){ const f=footprintTrails[i]; f.life-=dt; if(f.life<=0)footprintTrails.splice(i,1); }
}
function updateEffects(dt){
  G.shake=Math.max(0,G.shake-dt*46);
  G.dmgFlash=Math.max(0,G.dmgFlash-dt*1.7);
  G.stingFlash=Math.max(0,G.stingFlash-dt*1.5);
  document.getElementById('dmg').style.opacity=G.dmgFlash*0.85;
  document.getElementById('sting').style.opacity=G.stingFlash*0.75;
  const pulseEl=document.getElementById('pulse');
  if(player.hp<35){ const t=(35-player.hp)/35; const p=(Math.sin(G.time*5)+1)*0.5; pulseEl.style.opacity=t*0.6*p; } else { pulseEl.style.opacity=0; }
  const bearTension=Math.max(
    bears.reduce((acc,b)=>{ const d=dist(b.x,b.y,player.x,player.y); return Math.max(acc, clamp(1-d/500,0,1) * (b.state==='chase'?1.4:1)); },0),
    boars.reduce((acc,b)=>{ const d=dist(b.x,b.y,player.x,player.y); return Math.max(acc, clamp(1-d/420,0,1) * (b.state==='chase'?1.15:0.7)); },0),
    bossGame.active ? 1.2 : 0
  );
  const tension=Math.max(bearTension, player.fear);
  SFX.setTension(tension*0.9);
  const fear=player.fear;
  if(fear>0.35||bears.some(b=>b.state==='chase'&&dist(b.x,b.y,player.x,player.y)<400) || bossGame.active){
    if(!G._hbT)G._hbT=0;
    G._hbT-=dt;
    if(G._hbT<=0){ SFX.heartbeat(fear>0.65); G._hbT=lerp(1.15,0.42,fear); }
  }
  if(!G._rsT)G._rsT=0;
  G._rsT-=dt;
  if(G._rsT<=0){
    const radio=structures.find(s=>s.type==='radio');
    if(radio&&!radio.used&&dist(radio.x,radio.y,player.x,player.y)<250) SFX.radioStatic();
    G._rsT=rnd(2.5,5.5);
  }
  G.ambientEventT-=dt;
  if(G.ambientEventT<=0&&G.state==='play'&&!player.hidden&&!bossGame.active){triggerAmbientEvent();}
  G.fogPhase+=dt*0.03;
}
function die(reason){
  if(G.state==='dead')return;
  G.deaths++;
  SFX.lose();SFX.deathScreech();
  if(hideGame.active)endHideGame();
  if(escapeGame.active)endEscapeGame(false);
  if(fuelGame.active)endFuelGame(false);
  if(lpGame.active)endLockpickGame(false);
  if(tumblerGame.active)endTumblerGame(false);
  if(bossGame.active)endBossFight(false);
  document.getElementById('deadSub').textContent=reason;
  document.getElementById('deadStats').innerHTML = `Продержался: <b style="color:#c9a227">${Math.floor(G.time/60)} мин ${Math.floor(G.time%60)} сек</b><br> Выполнено задач: <b style="color:#c9a227">${Object.keys(objectivesDone).length} / 5</b>`;
  setTimeout(()=>setState('dead'),1600);
  G.state='dead';
}
function winGame(){
  SFX.win();
  if(hideGame.active)endHideGame();
  if(escapeGame.active){ escapeGame.active=false; const el=document.getElementById('escapeMinigame'); if(el)el.classList.remove('on'); }
  if(fuelGame.active){ fuelGame.active=false; const el=document.getElementById('fuelMinigame'); if(el)el.classList.remove('on'); }
  document.getElementById('winStats').innerHTML = `Время: <b style="color:#7fd68a">${Math.floor(G.time/60)} мин ${Math.floor(G.time%60)} сек</b><br> Выполнено задач: <b style="color:#7fd68a">5 / 5</b><br> Рассудок на финише: <b style="color:#7fd68a">${Math.round(player.sanity)}%</b><br> Укрытий использовано: <b style="color:#7fd68a">${G.hidesUsed||0}</b>`;
  checkWinAchievements();
  setState('win');
}
function render(){
  const camX=player.x-W/2;
  const camY=player.y-H/2;
  let sx=0,sy=0;
  if(G.shake>0){sx=rnd(-G.shake,G.shake);sy=rnd(-G.shake,G.shake);}
  ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=1;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.translate(-camX+sx,-camY+sy);
  const vx0=Math.max(0,Math.floor(camX/TILE)-1);
  const vy0=Math.max(0,Math.floor(camY/TILE)-1);
  const vx1=Math.min(MAP_W,Math.ceil((camX+W)/TILE)+1);
  const vy1=Math.min(MAP_H,Math.ceil((camY+H)/TILE)+1);
  if(vx1>vx0&&vy1>vy0){ ctx.drawImage(mapCanvas, vx0*TILE,vy0*TILE,(vx1-vx0)*TILE,(vy1-vy0)*TILE, vx0*TILE,vy0*TILE,(vx1-vx0)*TILE,(vy1-vy0)*TILE); }
  if(ARENA.built){
    const acx = ARENA.cx, acy = ARENA.cy, ar = ARENA.radiusPx;
    const floorG = ctx.createRadialGradient(acx, acy, ar*0.1, acx, acy, ar);
    floorG.addColorStop(0, '#1a1a1c'); floorG.addColorStop(0.6, '#141214'); floorG.addColorStop(1, '#0a0808');
    ctx.fillStyle = floorG; ctx.beginPath(); ctx.arc(acx, acy, ar, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(80,60,50,0.25)'; ctx.lineWidth = 1.5;
    for(let i=0;i<24;i++){
      const a = (i * 137.5) * Math.PI / 180;
      const r1 = ar * (0.2 + (i%5)*0.14);
      const r2 = ar * (0.5 + (i%7)*0.07);
      ctx.beginPath(); ctx.moveTo(acx + Math.cos(a)*r1, acy + Math.sin(a)*r1); ctx.lineTo(acx + Math.cos(a+0.3)*r2, acy + Math.sin(a+0.3)*r2); ctx.stroke();
    }
    ctx.strokeStyle = '#3a2e22'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(acx, acy, ar - 10, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,90,60,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(acx, acy, ar - 20, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.arc(acx, acy, ar - 2, 0, 7); ctx.stroke();
    for(let i=0;i<16;i++){
      const a = i * Math.PI/8;
      const rx = acx + Math.cos(a) * (ar - 12);
      const ry = acy + Math.sin(a) * (ar - 12);
      const pulse = 0.5 + Math.sin(performance.now()*0.002 + i) * 0.5;
      ctx.fillStyle = 'rgba(200,140,60,' + (0.25 + pulse*0.35) + ')';
      ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 7); ctx.fill();
    }
  }
  for(const f of footprintTrails){
    const t=f.life/f.maxLife;
    const sc=f.small?0.5:1;
    ctx.save(); ctx.translate(f.x,f.y);ctx.rotate(f.angle);
    ctx.fillStyle='rgba(20,10,5,'+(t*0.55)+')';
    ctx.beginPath();ctx.ellipse(-3*sc,-4*sc,3.5*sc,2.2*sc,0,0,7);ctx.fill();
    ctx.beginPath();ctx.ellipse(-3*sc,4*sc,3.5*sc,2.2*sc,0,0,7);ctx.fill();
    ctx.restore();
  }
  for(const p of particles){ ctx.fillStyle=p.color+(p.life/p.maxLife*0.55)+')'; ctx.fillRect(p.x-1,p.y-1,2,2); }
  for(const it of items){
    if(it.taken)continue;
    const bob=Math.sin(it.phase)*4;
    const pulse=0.85+Math.sin(it.phase*2)*0.15;
    let glowColor, ringColor;
    if(it.type==='note'){glowColor='rgba(230,210,140,';ringColor='rgba(230,210,140,0.9)';}
    else if(it.type==='key'){glowColor='rgba(255,220,90,';ringColor='rgba(255,220,90,0.95)';}
    else if(it.type==='fuel'){glowColor='rgba(255,120,60,';ringColor='rgba(255,140,80,0.95)';}
    else if(it.type==='medkit'){glowColor='rgba(140,255,140,';ringColor='rgba(140,255,140,0.9)';}
    else if(it.type==='battery'){glowColor='rgba(255,240,120,';ringColor='rgba(255,240,120,0.9)';}
    else if(it.type==='flare'){glowColor='rgba(255,90,40,';ringColor='rgba(255,120,60,0.9)';}
    else if(it.type==='pill'){glowColor='rgba(200,140,255,';ringColor='rgba(200,140,255,0.9)';}
    else {glowColor='rgba(180,210,255,';ringColor='rgba(180,210,255,0.9)';}
    const R=52*pulse;
    const g=ctx.createRadialGradient(it.x,it.y+bob,0,it.x,it.y+bob,R);
    g.addColorStop(0,glowColor+'0.55)'); g.addColorStop(0.45,glowColor+'0.22)'); g.addColorStop(1,glowColor+'0)');
    ctx.fillStyle=g; ctx.beginPath();ctx.arc(it.x,it.y+bob,R,0,7);ctx.fill();
    ctx.strokeStyle=ringColor; ctx.lineWidth=2; ctx.beginPath();ctx.arc(it.x,it.y+bob,20*pulse,0,7);ctx.stroke();
    ctx.fillStyle='rgba(10,12,10,0.75)'; ctx.beginPath();ctx.arc(it.x,it.y+bob,16,0,7);ctx.fill();
    ctx.strokeStyle=ringColor; ctx.lineWidth=1; ctx.beginPath();ctx.arc(it.x,it.y+bob,16,0,7);ctx.stroke();
    ctx.font='24px serif'; ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(it.icon,it.x,it.y+bob+1);
  }
  for(const st of structures){
    if(st.type==='generator'){
      ctx.fillStyle=st.used?'#3a5a3a':'#4a4030'; ctx.fillRect(st.x-18,st.y-18,36,36);
      ctx.strokeStyle=st.used?'#6ad66a':'#7a6a4a'; ctx.lineWidth=2;ctx.strokeRect(st.x-18,st.y-18,36,36);
      ctx.fillStyle=st.used?'#7fff7f':'#5a5040'; ctx.beginPath();ctx.arc(st.x,st.y,5,0,7);ctx.fill();
      if(st.used){ ctx.fillStyle='rgba(120,255,120,'+(0.4+Math.sin(G.time*7)*0.25)+')'; ctx.beginPath();ctx.arc(st.x,st.y,10,0,7);ctx.fill(); }
    }
    else if(st.type==='radio'){
      ctx.strokeStyle=st.used?'#6ad6a0':'#6a6a7a'; ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(st.x-14,st.y+16);ctx.lineTo(st.x,st.y-18);ctx.lineTo(st.x+14,st.y+16);ctx.stroke();
      ctx.beginPath();ctx.moveTo(st.x-8,st.y+16);ctx.lineTo(st.x-8,st.y+2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(st.x+8,st.y+16);ctx.lineTo(st.x+8,st.y+2);ctx.stroke();
      if(st.used){ ctx.fillStyle='rgba(110,255,170,'+(0.35+Math.sin(G.time*4)*0.25)+')'; ctx.beginPath();ctx.arc(st.x,st.y-18,7,0,7);ctx.fill(); }
    }
    else if(st.type==='gate'){
      const unlocked=objectivesDone['radio'];
      ctx.strokeStyle=unlocked?'#c9a227':'#6a4a3a'; ctx.lineWidth=3; ctx.strokeRect(st.x-30,st.y-22,60,44);
      ctx.fillStyle=unlocked?'rgba(201,162,39,0.18)':'rgba(0,0,0,0.3)'; ctx.fillRect(st.x-30,st.y-22,60,44);
      ctx.fillStyle=unlocked?'#e0c86a':'#7a5a4a'; ctx.font='11px Courier New';ctx.textAlign='center'; ctx.fillText(unlocked?'ОТКРЫТО':'ЗАПЕРТО',st.x,st.y+4);
    }
    else if(st.type==='locker'){
      ctx.fillStyle='#3a2a1a'; ctx.fillRect(st.x-14,st.y-18,28,36);
      ctx.strokeStyle='#5a3f20';ctx.lineWidth=2; ctx.strokeRect(st.x-14,st.y-18,28,36);
      ctx.fillStyle='#7a5a30'; ctx.fillRect(st.x-2,st.y-16,4,32);
      ctx.fillStyle='#c9a227'; ctx.beginPath();ctx.arc(st.x+5,st.y+2,1.6,0,7);ctx.fill();
      ctx.beginPath();ctx.arc(st.x-5,st.y+2,1.6,0,7);ctx.fill();
    }
    else if(st.type==='bush'){
      const near=dist(st.x,st.y,player.x,player.y)<90;
      const wobble=Math.sin(G.time*1.4+st.x*0.12)*1.2;
      ctx.save(); ctx.translate(st.x+wobble, st.y);
      ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath();ctx.ellipse(0,8,24,8,0,0,7);ctx.fill();
      ctx.fillStyle= near ? '#26431a' : '#1a2e12';
      for(let k=0;k<8;k++){ const a=k*(Math.PI*2/8); const rx=Math.cos(a)*16, ry=Math.sin(a)*10; ctx.beginPath();ctx.arc(rx, ry-2, 11, 0, 7);ctx.fill(); }
      ctx.fillStyle= near ? '#32571f' : '#243d18';
      for(let k=0;k<6;k++){ const a=k*(Math.PI*2/6)+0.4; const rx=Math.cos(a)*11, ry=Math.sin(a)*7; ctx.beginPath();ctx.arc(rx, ry-6, 10, 0, 7);ctx.fill(); }
      ctx.fillStyle= near ? '#4e8231' : '#35571f'; ctx.beginPath();ctx.arc(0,-13,7,0,7);ctx.fill();
      ctx.restore();
    }
  }
  for(const f of flareObjects){
    const t=f.life/f.maxLife;
    const intensity=(0.5+Math.sin(f.phase)*0.3)*Math.min(1,t*3);
    const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,80);
    g.addColorStop(0,'rgba(255,180,60,'+(0.5*intensity)+')'); g.addColorStop(0.4,'rgba(255,110,20,'+(0.22*intensity)+')'); g.addColorStop(1,'rgba(255,60,0,0)');
    ctx.fillStyle=g; ctx.beginPath();ctx.arc(f.x,f.y,80,0,7);ctx.fill();
    ctx.fillStyle='#fff0a0'; ctx.beginPath();ctx.arc(f.x,f.y,4+intensity*2,0,7);ctx.fill();
  }
  if(bossGame.active && bossGame.boss) drawBoss();
  for(const b of bears){
    const d=dist(b.x,b.y,player.x,player.y);
    if(d>720)continue;
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath();ctx.ellipse(b.x,b.y+b.radius*0.6,b.radius*1.15,b.radius*0.55,0,0,7);ctx.fill();
    const breathe=1+Math.sin(b.breathPhase)*0.05;
    const bodyColor=b.state==='chase'?'#3a1a10':'#241a14';
    ctx.fillStyle=bodyColor; ctx.beginPath();ctx.arc(b.x,b.y,b.radius*breathe,0,7);ctx.fill();
    const hx=b.x+Math.cos(b.angle)*b.radius*0.72;
    const hy=b.y+Math.sin(b.angle)*b.radius*0.72;
    ctx.fillStyle=b.state==='chase'?'#4a2216':'#2e2118'; ctx.beginPath();ctx.arc(hx,hy,b.radius*0.62,0,7);ctx.fill();
    const perpX=-Math.sin(b.angle),perpY=Math.cos(b.angle);
    ctx.fillStyle='#1c1410';
    [1,-1].forEach(s=>{ ctx.beginPath(); ctx.arc(hx+perpX*s*b.radius*0.42,hy+perpY*s*b.radius*0.42,b.radius*0.24,0,7); ctx.fill(); });
    const eyeGlow=b.state==='chase'||b.state==='attack';
    ctx.fillStyle=eyeGlow?'#ff3020':'#8a6a3a';
    const ex=hx+Math.cos(b.angle)*b.radius*0.42;
    const ey=hy+Math.sin(b.angle)*b.radius*0.42;
    [1,-1].forEach(s=>{ ctx.beginPath(); ctx.arc(ex+perpX*s*4.5,ey+perpY*s*4.5,2.1,0,7); ctx.fill(); });
    if(b.state==='chase'){ ctx.fillStyle='rgba(255,40,20,0.9)'; ctx.font='bold 17px Courier New';ctx.textAlign='center'; ctx.fillText('!',b.x,b.y-b.radius-10); }
    else if(b.state==='investigate'){ ctx.fillStyle='rgba(255,180,40,0.85)'; ctx.font='bold 15px Courier New';ctx.textAlign='center'; ctx.fillText('?',b.x,b.y-b.radius-10); }
  }
  for(const b of boars){
    const d=dist(b.x,b.y,player.x,player.y);
    if(d>720)continue;
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath();ctx.ellipse(b.x,b.y+b.radius*0.6,b.radius*1.05,b.radius*0.5,0,0,7);ctx.fill();
    const breathe=1+Math.sin(b.breathPhase)*0.06;
    const bodyColor=b.state==='chase'?'#3a2418':'#241a12';
    ctx.fillStyle=bodyColor; ctx.beginPath();ctx.arc(b.x,b.y,b.radius*breathe,0,7);ctx.fill();
    const hx=b.x+Math.cos(b.angle)*b.radius*0.78;
    const hy=b.y+Math.sin(b.angle)*b.radius*0.78;
    ctx.fillStyle=b.state==='chase'?'#4a2c1a':'#2c2014'; ctx.beginPath();ctx.arc(hx,hy,b.radius*0.58,0,7);ctx.fill();
    const perpX=-Math.sin(b.angle),perpY=Math.cos(b.angle);
    ctx.fillStyle='#1a1208';
    [1,-1].forEach(s=>{ ctx.beginPath(); ctx.arc(hx+perpX*s*b.radius*0.38,hy+perpY*s*b.radius*0.38,b.radius*0.22,0,7); ctx.fill(); });
    const sx2=hx+Math.cos(b.angle)*b.radius*0.5;
    const sy2=hy+Math.sin(b.angle)*b.radius*0.5;
    ctx.fillStyle='#3a2818'; ctx.beginPath();ctx.ellipse(sx2,sy2,b.radius*0.28,b.radius*0.2,b.angle,0,7);ctx.fill();
    ctx.fillStyle='#e8dcc0';
    [1,-1].forEach(s=>{
      const tx1=sx2+perpX*s*b.radius*0.22;
      const ty1=sy2+perpY*s*b.radius*0.22;
      ctx.beginPath(); ctx.moveTo(tx1,ty1);
      ctx.lineTo(tx1+Math.cos(b.angle)*b.radius*0.35+perpX*s*2,ty1+Math.sin(b.angle)*b.radius*0.35+perpY*s*2);
      ctx.lineTo(tx1+perpX*s*3,ty1+perpY*s*3); ctx.closePath();ctx.fill();
    });
    const eyeGlow=b.state==='chase'||b.state==='attack';
    ctx.fillStyle=eyeGlow?'#ff3020':'#8a4a2a';
    const ex=hx+Math.cos(b.angle)*b.radius*0.35;
    const ey=hy+Math.sin(b.angle)*b.radius*0.35;
    [1,-1].forEach(s=>{ ctx.beginPath(); ctx.arc(ex+perpX*s*3.5,ey+perpY*s*3.5,1.6,0,7); ctx.fill(); });
    if(b.stunT>0){
      const a=performance.now()*0.006;
      ctx.save(); ctx.translate(b.x, b.y-b.radius-14); ctx.rotate(a);
      ctx.fillStyle='rgba(255,220,90,0.9)'; ctx.font='bold 14px Courier New'; ctx.textAlign='center';ctx.textBaseline='middle'; ctx.fillText('★',0,0);
      ctx.restore();
      ctx.fillStyle='rgba(255,220,90,0.85)'; ctx.font='bold 10px Courier New'; ctx.textAlign='center'; ctx.fillText('ОГЛУШЁН',b.x,b.y-b.radius-24);
    } else if(b.state==='chase'){ ctx.fillStyle='rgba(255,40,20,0.9)'; ctx.font='bold 14px Courier New';ctx.textAlign='center'; ctx.fillText('!',b.x,b.y-b.radius-10); }
    else if(b.state==='investigate'){ ctx.fillStyle='rgba(255,180,40,0.85)'; ctx.font='bold 12px Courier New';ctx.textAlign='center'; ctx.fillText('?',b.x,b.y-b.radius-10); }
  }
  ctx.globalAlpha=player.hidden?0.35:1;
  ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.beginPath();ctx.ellipse(player.x,player.y+6,11,6,0,0,7);ctx.fill();
  ctx.fillStyle=player.invuln>0?'#c05050':'#4a5a3a'; ctx.beginPath();ctx.arc(player.x,player.y,player.radius,0,7);ctx.fill();
  ctx.strokeStyle='#8a9a6a';ctx.lineWidth=1.5; ctx.beginPath();ctx.arc(player.x,player.y,player.radius,0,7);ctx.stroke();
  ctx.fillStyle='#b8c49a';
  ctx.beginPath();
  ctx.moveTo(player.x+Math.cos(player.angle)*13,player.y+Math.sin(player.angle)*13);
  ctx.lineTo(player.x+Math.cos(player.angle+2.4)*7,player.y+Math.sin(player.angle+2.4)*7);
  ctx.lineTo(player.x+Math.cos(player.angle-2.4)*7,player.y+Math.sin(player.angle-2.4)*7);
  ctx.closePath();ctx.fill();
  ctx.globalAlpha=1;
  ctx.restore();
  const pScreenX=player.x-camX+sx;
  const pScreenY=player.y-camY+sy;
  const lightRadius=(player.flashlight&&player.battery>0)?560:90;
  computeVisibility(player.x,player.y,lightRadius);
  lctx.setTransform(1,0,0,1,0,0);
  lctx.globalCompositeOperation='source-over';
  lctx.fillStyle='#000'; lctx.fillRect(0,0,W,H);
  let flScale = 1;
  if(flickerState.intensity > 0){ flScale = 1 - flickerState.intensity * 0.92; if(flScale < 0.05) flScale = 0.05; }
  const flashlightOn=player.flashlight&&player.battery>0&&!player.hidden&&flScale>0.15;
  lctx.save();
  lctx.beginPath();
  lctx.moveTo(pScreenX,pScreenY);
  for(let i=0;i<visPoly.length;i+=2) lctx.lineTo(visPoly[i]-camX+sx,visPoly[i+1]-camY+sy);
  lctx.closePath();
  lctx.clip();
  if(!flashlightOn){
    lctx.globalCompositeOperation='source-over';
    const vision=130;
    const vg0=lctx.createRadialGradient(pScreenX,pScreenY,0,pScreenX,pScreenY,vision);
    vg0.addColorStop(0,   'rgba(255,255,255,0.85)');
    vg0.addColorStop(0.25,'rgba(255,255,255,0.62)');
    vg0.addColorStop(0.50,'rgba(255,255,255,0.34)');
    vg0.addColorStop(0.72,'rgba(255,255,255,0.14)');
    vg0.addColorStop(0.88,'rgba(255,255,255,0.04)');
    vg0.addColorStop(1,   'rgba(0,0,0,0)');
    lctx.fillStyle=vg0;
    lctx.beginPath(); lctx.arc(pScreenX,pScreenY,vision,0,Math.PI*2); lctx.fill();
  } else {
    lctx.globalCompositeOperation='lighter';
    const ambient=0.035+(objectivesDone['gen']?0.02:0);
    const ag=lctx.createRadialGradient(pScreenX,pScreenY,0,pScreenX,pScreenY,125);
    ag.addColorStop(0,'rgba(125,130,140,'+ambient+')'); ag.addColorStop(0.42,'rgba(70,78,90,'+(ambient*0.62)+')'); ag.addColorStop(1,'rgba(0,0,0,0)');
    lctx.fillStyle=ag; lctx.fillRect(pScreenX-135,pScreenY-135,270,270);
    const nearVision = 160 * (0.5 + flScale * 0.5);
    const nv = lctx.createRadialGradient(pScreenX,pScreenY,0,pScreenX,pScreenY,nearVision);
    nv.addColorStop(0,   'rgba(220,225,205,'+(0.85*flScale)+')');
    nv.addColorStop(0.30,'rgba(200,205,185,'+(0.58*flScale)+')');
    nv.addColorStop(0.60,'rgba(170,175,155,'+(0.28*flScale)+')');
    nv.addColorStop(0.85,'rgba(140,145,125,'+(0.10*flScale)+')');
    nv.addColorStop(1,   'rgba(0,0,0,0)');
    lctx.fillStyle=nv; lctx.beginPath(); lctx.arc(pScreenX,pScreenY,nearVision,0,Math.PI*2); lctx.fill();
    const range = 430 * (0.94 + 0.06 * Math.sin(G.time * 18)) * flScale;
    const spread = 0.44;
    lctx.save(); lctx.translate(pScreenX,pScreenY); lctx.rotate(player.angle);
    lctx.beginPath(); lctx.moveTo(0,0); lctx.arc(0,0,range,-spread,spread); lctx.closePath();
    const a0 = 1.0 * flScale; const a1 = 0.72 * flScale; const a2 = 0.30 * flScale;
    const fg=lctx.createRadialGradient(0,0,0,0,0,range);
    fg.addColorStop(0,'rgba(255,248,220,'+a0+')'); fg.addColorStop(0.35,'rgba(255,240,190,'+a1+')'); fg.addColorStop(0.7,'rgba(255,225,160,'+a2+')'); fg.addColorStop(1,'rgba(255,210,140,0)');
    lctx.fillStyle=fg; lctx.fill();
    lctx.restore();
  }
  lctx.globalCompositeOperation='lighter';
  for(const f of flareObjects){
    const t=Math.min(1,f.life/f.maxLife*3);
    const fsx=f.x-camX+sx,fsy=f.y-camY+sy;
    const r=170;
    const fg2=lctx.createRadialGradient(fsx,fsy,0,fsx,fsy,r);
    fg2.addColorStop(0,'rgba(255,190,90,'+(0.95*t)+')'); fg2.addColorStop(0.4,'rgba(255,130,40,'+(0.5*t)+')'); fg2.addColorStop(1,'rgba(255,60,0,0)');
    lctx.fillStyle=fg2; lctx.beginPath();lctx.arc(fsx,fsy,r,0,7);lctx.fill();
  }
  if(objectivesDone['gen']){
    const gen=structures.find(s=>s.type==='generator');
    if(gen){
      const gsx=gen.x-camX+sx,gsy=gen.y-camY+sy;
      const gg=lctx.createRadialGradient(gsx,gsy,0,gsx,gsy,260);
      gg.addColorStop(0,'rgba(150,200,150,0.35)'); gg.addColorStop(1,'rgba(0,0,0,0)');
      lctx.fillStyle=gg; lctx.beginPath();lctx.arc(gsx,gsy,260,0,7);lctx.fill();
    }
  }
  lctx.restore();
  lctx.globalCompositeOperation='source-over';
  ctx.globalCompositeOperation='multiply';
  ctx.drawImage(lightCanvas,0,0);
  ctx.globalCompositeOperation='source-over';
  const vg=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.85);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.82)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=0.055+Math.sin(G.fogPhase)*0.02;
  ctx.fillStyle='#3a4038'; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=1;
  if(player.sanity<60){
    const t=(60-player.sanity)/60;
    ctx.save(); ctx.globalAlpha=t*0.35;
    ctx.fillStyle='#1a0a1a';
    const off=Math.sin(G.time*3.1)*8*t;
    ctx.fillRect(off,0,W,H);
    ctx.globalAlpha=t*0.13; ctx.fillStyle='#8a1a3a'; ctx.fillRect(-off,0,W,H);
    ctx.restore();
  }
  if(player.hp<50){
    const t=(50-player.hp)/50;
    const bg=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.78);
    bg.addColorStop(0,'rgba(0,0,0,0)'); bg.addColorStop(1,'rgba(140,0,0,'+(t*0.55)+')');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  }
}
function drawMinimap(){
  const mmW=minimapCanvas.width,mmH=minimapCanvas.height;
  const scale=Math.min(mmW/MAP_W,mmH/MAP_H);
  const offX=(mmW-MAP_W*scale)/2, offY=(mmH-MAP_H*scale)/2;
  mmctx.setTransform(1,0,0,1,0,0);
  mmctx.fillStyle='#050706'; mmctx.fillRect(0,0,mmW,mmH);
  for(let ty=0;ty<MAP_H;ty++){
    for(let tx=0;tx<MAP_W;tx++){
      if(!explored[idx(tx,ty)])continue;
      const t=getTile(tx,ty);
      let col='#1a2218';
      if(t===T_TREE)col='#0e1a0b';
      else if(t===T_WALL)col='#4a4038';
      else if(t===T_FLOOR)col='#2a2418';
      else if(t===T_DOOR)col='#8a6a2a';
      else if(t===T_WATER)col='#16262e';
      else if(t===T_BUSH)col='#1a2812';
      mmctx.fillStyle=col;
      mmctx.fillRect(offX+tx*scale,offY+ty*scale,Math.ceil(scale),Math.ceil(scale));
    }
  }
  for(const st of structures){
    const tx=st.x/TILE, ty=st.y/TILE;
    if(!explored[idx(Math.floor(tx),Math.floor(ty))])continue;
    if(st.type==='generator'){ mmctx.fillStyle=st.used?'#7fff7f':'#c9a227'; mmctx.beginPath();mmctx.arc(offX+tx*scale,offY+ty*scale,3,0,7);mmctx.fill(); }
    else if(st.type==='radio'){ mmctx.fillStyle=st.used?'#7fffbf':'#c9a227'; mmctx.beginPath();mmctx.arc(offX+tx*scale,offY+ty*scale,3,0,7);mmctx.fill(); }
    else if(st.type==='gate'){ mmctx.fillStyle=objectivesDone['radio']?'#7fff7f':'#c95a5a'; mmctx.fillRect(offX+tx*scale-3,offY+ty*scale-2,6,4); }
    else if(st.type==='locker'){ mmctx.fillStyle='#8a6a30'; mmctx.fillRect(offX+tx*scale-2,offY+ty*scale-2,4,4); }
    else if(st.type==='bush'){ mmctx.fillStyle='#3a6a28'; mmctx.beginPath(); mmctx.arc(offX+tx*scale,offY+ty*scale,2.2,0,7); mmctx.fill(); }
  }
  const px=offX+(player.x/TILE)*scale, py=offY+(player.y/TILE)*scale;
  mmctx.fillStyle='#e0c86a'; mmctx.beginPath();mmctx.arc(px,py,3.5,0,7);mmctx.fill();
  mmctx.strokeStyle='#fff0a0';mmctx.lineWidth=1;
  mmctx.beginPath(); mmctx.moveTo(px,py); mmctx.lineTo(px+Math.cos(player.angle)*8,py+Math.sin(player.angle)*8); mmctx.stroke();
  mmctx.strokeStyle='rgba(120,130,110,0.5)'; mmctx.lineWidth=1;
  mmctx.strokeRect(0.5,0.5,mmW-1,mmH-1);
}
function updatePrompt(){
  const el=document.getElementById('prompt');
  if(G.state!=='play'){el.style.display='none';return;}
  if(player.hidden){ el.style.display='block'; el.innerHTML='<span class="key">E</span>Выйти из укрытия'; return; }
  if(escapeGame.active||fuelGame.active||lpGame.active||tumblerGame.active||bossGame.active){el.style.display='none';return;}
  let best=null,bd=52;
  for(const it of items){
    if(it.taken)continue;
    const d=dist(it.x,it.y,player.x,player.y);
    if(d<bd){bd=d;best={txt:(it.type==='note'?'Прочитать: ':'Подобрать: ')+it.name};}
  }
  for(const st of structures){
    const d=dist(st.x,st.y,player.x,player.y);
    if(d<st.r&&d<bd){
      bd=d;
      if(st.type==='generator')best={txt:st.used?'Генератор работает':'Вскрыть замок генераторной'};
      else if(st.type==='radio')best={txt:st.used?'Сигнал передан':'Передать сигнал'};
      else if(st.type==='gate')best={txt:objectivesDone['radio']?'Взломать замок [Q/E/Z/R/F]':'Ворота заперты'};
      else if(st.type==='locker')best={txt:'Спрятаться в шкафу'};
      else if(st.type==='bush')best={txt:'Спрятаться в кустах'};
    }
  }
  if(best){el.style.display='block';el.innerHTML='<span class="key">E</span>'+best.txt;}
  else el.style.display='none';
}

/* ============ ГЛАВНЫЙ ЦИКЛ ============ */
let lastTime=performance.now();
function loop(now){
  requestAnimationFrame(loop);
  let dt=(now-lastTime)/1000;
  lastTime=now;
  dt=Math.min(dt,0.05);

  /* ─── ИСПРАВЛЕНО: громкость музыки работает на всех экранах ─── */
  if(SFX.ready && SFX.soundtrackEl){
    if(G.state==='title')       SFX.setSoundtrackVolume(0.40);
    else if(G.state==='play')   SFX.setSoundtrackVolume(bossGame.active ? 0.60 : 0.35);
    else if(G.state==='dead')   SFX.setSoundtrackVolume(0.10);
    else if(G.state==='win')    SFX.setSoundtrackVolume(0.55);
    else                        SFX.setSoundtrackVolume(0.20);
    SFX.updateSoundtrackVolume(dt);
  }

  if(G.state!=='title'){ drawBrain(now); }
  if(G.state==='play'){
    if(lpGame.active){ updateLockpickGame(dt); render(); }
    else if(tumblerGame.active){ updateTumblerGame(dt); render(); }
    else {
      G.time+=dt;
      updateFlashlightFlicker(dt);
      updatePlayer(dt);
      updateBears(dt);
      updateBoars(dt);
      if(bossGame.active) updateBoss(dt);
      updateScarySounds(dt);
      updateItems(dt);
      updateEffects(dt);
      if(hideGame.active)updateHideGame(dt);
      if(escapeGame.active)updateEscapeGame(dt);
      if(fuelGame.active)updateFuelGame(dt);
      if(!G._autoSaveT)G._autoSaveT=30;
      G._autoSaveT-=dt;
      if(G._autoSaveT<=0){saveGame(true);G._autoSaveT=30;showSaveStatus('АВТОСОХРАНЕНИЕ');}
      updatePrompt();
      render();
      lastMinimapPaint-=dt;
      if(lastMinimapPaint<=0){drawMinimap();lastMinimapPaint=0.28;}
    }
  }
  else if(G.state==='pause'||G.state==='inv'||G.state==='note'||G.state==='map'){
    render();
    if(G.state==='map'){
      if(!G._mapT)G._mapT=0;
      G._mapT-=dt;
      if(G._mapT<=0){drawFullMap();G._mapT=0.08;}
    }
  }
}

/* ============ КНОПКИ ============ */
loadSettings();
applySettings();
document.getElementById('playBtn').onclick=()=>{ SFX.init(); renderSlots(); setState('slots'); };
document.getElementById('slotsBackBtn').onclick=()=>{ setState('title'); };
document.getElementById('achBtn').onclick=()=>{ renderAchievements(); setState('achievements'); };
document.getElementById('achBackBtn').onclick=()=>{ setState('title'); };
document.getElementById('setBtn').onclick=()=>{ applySettings(); setState('settings'); };
document.getElementById('setBackBtn').onclick=()=>{ saveSettings(); setState('title'); };
const _setSfxEl = document.getElementById('setSfx');
if(_setSfxEl){ _setSfxEl.addEventListener('input',()=>{ SETTINGS.sfx = clamp(parseInt(_setSfxEl.value,10)/100, 0, 1); applySettings(); saveSettings(); }); }
const _setMusicEl = document.getElementById('setMusic');
if(_setMusicEl){ _setMusicEl.addEventListener('input',()=>{ SETTINGS.music = clamp(parseInt(_setMusicEl.value,10)/100, 0, 1); applySettings(); saveSettings(); }); }
document.getElementById('saveBtn').onclick=()=>saveGame(false);
document.getElementById('retryBtn').onclick=()=>{ initGame();G.hidesUsed=0;setState('play');drawMinimap(); };
document.getElementById('againBtn').onclick=()=>{ initGame();G.hidesUsed=0;setState('play');drawMinimap(); };
document.getElementById('quitBtn').onclick=()=>{setState('title');};
const _origEnterHide=enterHide;
enterHide=function(st){G.hidesUsed=(G.hidesUsed||0)+1;_origEnterHide(st);};
requestAnimationFrame(loop);
window.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play')saveGame(true);});
window.addEventListener('beforeunload',()=>{if(G.state==='play'||G.state==='pause')saveGame(true);});

})();
})();