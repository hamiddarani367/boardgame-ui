"use client";

import { useEffect, useRef } from "react";

const SCENE_DURATION = 15000;
const CATAN_REVEAL_INTERVAL = 200;
const MONOPOLY_MOVE_INTERVAL = 2500;

export default function GameSceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ==================== Risk ====================
    const continentColors = [
      "#d4a373", "#7f8c5b", "#b5838d", "#6d6875", "#a98467", "#52796f", "#c9ada7"
    ];
    const continents = [
      { cx: 0.25, cy: 0.3, rx: 0.15, ry: 0.2 },
      { cx: 0.3, cy: 0.65, rx: 0.1, ry: 0.2 },
      { cx: 0.55, cy: 0.35, rx: 0.15, ry: 0.2 },
      { cx: 0.5, cy: 0.7, rx: 0.18, ry: 0.15 },
      { cx: 0.75, cy: 0.4, rx: 0.2, ry: 0.25 },
      { cx: 0.85, cy: 0.8, rx: 0.08, ry: 0.1 },
    ];
    const riskTerritories: { points: { x: number; y: number }[]; color: string }[] = [];
    for (const cont of continents) {
      const pts: { x: number; y: number }[] = [];
      const n = 8 + Math.floor(Math.random() * 8);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
        const r = 1 - Math.random() * 0.3;
        pts.push({ x: cont.cx + Math.cos(a) * cont.rx * r, y: cont.cy + Math.sin(a) * cont.ry * r });
      }
      riskTerritories.push({ points: pts, color: continentColors[riskTerritories.length % continentColors.length] });
    }
    for (let i = 0; i < 12; i++) {
      const cx = Math.random(), cy = Math.random();
      const pts: { x: number; y: number }[] = [];
      const s = 4 + Math.floor(Math.random() * 5);
      const rad = 0.02 + Math.random() * 0.04;
      for (let j = 0; j < s; j++) {
        const a = (j / s) * Math.PI * 2;
        pts.push({ x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad });
      }
      riskTerritories.push({ points: pts, color: continentColors[Math.floor(Math.random() * continentColors.length)] });
    }

    const riskUnits: { x: number; y: number; tx: number; ty: number; col: string; sz: number; sp: number }[] = [];
    for (let i = 0; i < 80; i++) {
      riskUnits.push({
        x: Math.random(), y: Math.random(), tx: Math.random(), ty: Math.random(),
        col: ["#e63946", "#457b9d", "#2a9d8f", "#f4a261", "#9b5de5"][Math.floor(Math.random() * 5)],
        sz: 0.003 + Math.random() * 0.005, sp: 0.0003 + Math.random() * 0.0007,
      });
    }

    // ==================== Catan ====================
    const hexRadius = 0.08;
    const catanHexes: { x: number; y: number; res: number; rev: boolean }[] = [];
    const resCols = ["#228B22", "#FFD700", "#CD853F", "#808080", "#90EE90"];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const x = 0.1 + c * (hexRadius * 1.75) + (r % 2) * (hexRadius * 0.875);
        const y = 0.1 + r * (hexRadius * 1.5);
        catanHexes.push({ x, y, res: Math.floor(Math.random() * 5), rev: false });
      }
    }
    let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
    catanHexes.forEach(h => { if (h.x < mnX) mnX = h.x; if (h.x > mxX) mxX = h.x; if (h.y < mnY) mnY = h.y; if (h.y > mxY) mxY = h.y; });
    const offX = 0.5 - (mnX + mxX) / 2, offY = 0.5 - (mnY + mxY) / 2;
    catanHexes.forEach(h => { h.x += offX; h.y += offY; });
    let catanLastRev = 0;

    // ==================== Tehranopoly ====================
    const tehranDistricts = [
      { name: "شروع", price: 0, color: "#E67E22", icon: "🚩" },
      { name: "ولیعصر", price: 60, color: "#8B4513" },
      { name: "صندوق", price: 0, color: "#F1C40F", icon: "🎁" },
      { name: "انقلاب", price: 60, color: "#8B4513" },
      { name: "مالیات", price: 0, color: "#E74C3C", icon: "💰" },
      { name: "شریعتی", price: 100, color: "#A52A2A" },
      { name: "مطهری", price: 100, color: "#A52A2A" },
      { name: "شانس", price: 0, color: "#F1C40F", icon: "❓" },
      { name: "بهشتی", price: 120, color: "#FFB6C1" },
      { name: "ونک", price: 140, color: "#FFB6C1" },
      { name: "زندان", price: 0, color: "#95A5A6", icon: "🔒" },
      { name: "تجریش", price: 160, color: "#FFA07A" },
      { name: "سعادت‌آباد", price: 180, color: "#FFA07A" },
      { name: "پاسداران", price: 200, color: "#FFD700" },
      { name: "نیاوران", price: 220, color: "#FFD700" },
      { name: "شانس", price: 0, color: "#F1C40F", icon: "❓" },
      { name: "جردن", price: 240, color: "#98FB98" },
      { name: "امیرآباد", price: 260, color: "#98FB98" },
      { name: "صندوق", price: 0, color: "#F1C40F", icon: "🎁" },
      { name: "تهرانپارس", price: 280, color: "#87CEEB" },
      { name: "افسریه", price: 300, color: "#87CEEB" },
      { name: "پارکینگ", price: 0, color: "#95A5A6", icon: "🅿️" },
      { name: "نارمک", price: 320, color: "#4169E1" },
      { name: "یوسف‌آباد", price: 340, color: "#4169E1" },
      { name: "شانس", price: 0, color: "#F1C40F", icon: "❓" },
      { name: "قیطریه", price: 360, color: "#8E44AD" },
      { name: "زعفرانیه", price: 400, color: "#8E44AD" },
      { name: "شهرک غرب", price: 450, color: "#C0392B" },
    ];

    interface MonopolyCell {
      x: number; y: number; w: number; h: number;
      district: typeof tehranDistricts[0]; index: number;
    }
    const monoCells: MonopolyCell[] = [];
    const bm = 0.04, cw = 0.1, ch = 0.16, cps = 7;
    for (let i = 0; i < cps; i++) {
      monoCells.push({ x: bm + i * ((1 - 2*bm - cw) / (cps-1)), y: bm, w: cw, h: ch, district: tehranDistricts[i], index: i });
    }
    for (let i = 0; i < cps; i++) {
      monoCells.push({ x: 1 - bm - ch, y: bm + cw + i * ((1 - 2*bm - 2*cw - ch) / (cps-1)), w: ch, h: cw, district: tehranDistricts[cps + i], index: cps + i });
    }
    for (let i = 0; i < cps; i++) {
      monoCells.push({ x: 1 - bm - cw - i * ((1 - 2*bm - cw) / (cps-1)), y: 1 - bm - ch, w: cw, h: ch, district: tehranDistricts[2*cps + i], index: 2*cps + i });
    }
    for (let i = 0; i < cps; i++) {
      monoCells.push({ x: bm, y: 1 - bm - ch - cw - i * ((1 - 2*bm - 2*cw - ch) / (cps-1)), w: ch, h: cw, district: tehranDistricts[3*cps + i], index: 3*cps + i });
    }

    const players = [
      { col: "#E74C3C", idx: 0 }, { col: "#3498DB", idx: 0 }, { col: "#2ECC71", idx: 0 }, { col: "#F1C40F", idx: 0 },
    ];
    let diceRes: [number, number] = [1, 1];
    let diceRolling = false;
    let diceStart = 0;
    let monoLastMove = 0;
    const chanceCards = ["🎉 به پارکینگ رایگان برو!", "💸 ۵۰ هزار تومان جریمه", "🎁 ۱۰۰ هزار تومان جایزه", "🔙 سه قدم به عقب", "🏦 پرداخت مالیات ۲۰ هزار تومان", "🚔 به زندان برو!"];
    let activeCard: string | null = null;
    let cardTimer = 0;

    // ==================== تابع رسم تاس ====================
    const drawDice = (c2d: CanvasRenderingContext2D, x: number, y: number, val: number, size: number) => {
      const w = size, h = size, r = size * 0.15;
      c2d.save();
      c2d.translate(x, y);
      c2d.fillStyle = "rgba(255,255,255,0.95)";
      c2d.strokeStyle = "#1e1e1e";
      c2d.lineWidth = Math.max(1, size * 0.05);
      c2d.beginPath();
      c2d.moveTo(-w/2 + r, -h/2); c2d.lineTo(w/2 - r, -h/2); c2d.arcTo(w/2, -h/2, w/2, -h/2 + r, r);
      c2d.lineTo(w/2, h/2 - r); c2d.arcTo(w/2, h/2, w/2 - r, h/2, r); c2d.lineTo(-w/2 + r, h/2);
      c2d.arcTo(-w/2, h/2, -w/2, h/2 - r, r); c2d.lineTo(-w/2, -h/2 + r); c2d.arcTo(-w/2, -h/2, -w/2 + r, -h/2, r);
      c2d.closePath(); c2d.fill(); c2d.stroke();
      c2d.fillStyle = "#111";
      const dots: Record<number, [number,number][]> = {
        1:[[0,0]], 2:[[-0.25,-0.25],[0.25,0.25]], 3:[[-0.25,-0.25],[0,0],[0.25,0.25]],
        4:[[-0.25,-0.25],[0.25,-0.25],[-0.25,0.25],[0.25,0.25]],
        5:[[-0.25,-0.25],[0.25,-0.25],[0,0],[-0.25,0.25],[0.25,0.25]],
        6:[[-0.25,-0.25],[0.25,-0.25],[-0.25,0],[0.25,0],[-0.25,0.25],[0.25,0.25]]
      };
      (dots[val] || []).forEach(([dx, dy]) => {
        c2d.beginPath(); c2d.arc(dx * w, dy * h, size * 0.12, 0, Math.PI * 2); c2d.fill();
      });
      c2d.restore();
    };

    // ==================== Brass ====================
    const factories: { x: number; y: number; w: number; h: number; chimneys: number }[] = [];
    for (let i = 0; i < 6; i++) {
      factories.push({
        x: 0.08 + Math.random() * 0.84,
        y: 0.15 + Math.random() * 0.6,
        w: 0.07 + Math.random() * 0.05,
        h: 0.05 + Math.random() * 0.04,
        chimneys: 1 + Math.floor(Math.random() * 3),
      });
    }
    const canals: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < 4; i++) {
      canals.push({
        x1: Math.random() * 0.8 + 0.1, y1: Math.random() * 0.4 + 0.3,
        x2: Math.random() * 0.8 + 0.1, y2: Math.random() * 0.4 + 0.3,
      });
    }
    let trainProgress = 0;
    const gears: { x: number; y: number; r: number; rot: number; sp: number }[] = [];
    for (let i = 0; i < 3; i++) {
      gears.push({ x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.7, r: 0.04 + Math.random() * 0.05, rot: Math.random() * Math.PI * 2, sp: (Math.random() - 0.5) * 0.015 });
    }

    // ==================== تنظیم Canvas ====================
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);
    resize();
    const startTime = Date.now();

    // ==================== حلقه اصلی ====================
    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const elapsed = Date.now() - startTime;
      const cyclePos = Math.floor(elapsed / SCENE_DURATION) % 4;
      const scene = cyclePos === 0 ? "risk" : cyclePos === 1 ? "catan" : cyclePos === 2 ? "tehranopoly" : "brass";

      // ---------- Risk ----------
      if (scene === "risk") {
        ctx.fillStyle = "#1b2b40"; ctx.fillRect(0, 0, w, h);
        riskTerritories.forEach(t => {
          ctx.beginPath(); ctx.moveTo(t.points[0].x * w, t.points[0].y * h);
          for (let i = 1; i < t.points.length; i++) ctx.lineTo(t.points[i].x * w, t.points[i].y * h);
          ctx.closePath(); ctx.fillStyle = t.color; ctx.fill();
          ctx.strokeStyle = "#3a3a2a"; ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.002); ctx.stroke();
        });
        const sf = Math.min(w, h) * 0.001;
        riskUnits.forEach(u => {
          const dx = u.tx - u.x, dy = u.ty - u.y, dist = Math.sqrt(dx*dx+dy*dy);
          if (dist > 0.005) { u.x += (dx/dist) * u.sp * sf; u.y += (dy/dist) * u.sp * sf; }
          else { u.tx = Math.random(); u.ty = Math.random(); }
          ctx.beginPath(); ctx.arc(u.x * w, u.y * h, u.sz * Math.min(w, h), 0, Math.PI*2);
          ctx.fillStyle = u.col; ctx.fill();
        });
        const fs = Math.min(w, h) * 0.06;
        ctx.font = `bold ${fs}px 'Courier New', monospace`; ctx.fillStyle = "#f0e6d2"; ctx.textAlign = "center";
        ctx.fillText("R I S K", w/2, h/2 - fs*0.3);
        ctx.font = `${fs*0.5}px 'Courier New', monospace`; ctx.fillText("قلمروها در انتظار فتح توست", w/2, h/2 + fs*0.5);
      }

      // ---------- Catan ----------
      else if (scene === "catan") {
        ctx.fillStyle = "#2E4A2E";
        ctx.fillRect(0, 0, w, h);
        const now = Date.now();
        if (elapsed % SCENE_DURATION < 100) {
          catanHexes.forEach(h => (h.rev = false));
          catanLastRev = now;
        }
        if (now - catanLastRev > CATAN_REVEAL_INTERVAL) {
          const unrevealed = catanHexes.filter(h => !h.rev);
          if (unrevealed.length > 0) {
            const next = unrevealed[Math.floor(Math.random() * unrevealed.length)];
            next.rev = true;
            catanLastRev = now;
          }
        }
        catanHexes.forEach(hex => {
          if (!hex.rev) return;
          const cx = hex.x * w;
          const cy = hex.y * h;
          const r = hexRadius * Math.min(w, h);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * 60 * Math.PI) / 180;
            const vx = cx + r * Math.cos(angle);
            const vy = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.fillStyle = resCols[hex.res];
          ctx.fill();
          ctx.strokeStyle = "#5a4a2a";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        const fs = Math.min(w, h) * 0.06;
        ctx.font = `bold ${fs}px 'Courier New', monospace`;
        ctx.fillStyle = "#f5deb3";
        ctx.textAlign = "center";
        ctx.fillText("C A T A N", w / 2, h / 2 - fs * 0.3);
        ctx.font = `${fs * 0.5}px 'Courier New', monospace`;
        ctx.fillText("جزیره‌ای که هر بار از نو کشف می‌شود", w / 2, h / 2 + fs * 0.5);
      }

      // ---------- Tehranopoly ----------
      else if (scene === "tehranopoly") {
        ctx.fillStyle = "#FDEBD0"; ctx.fillRect(0, 0, w, h);
        for (let i=0;i<8;i++) { ctx.fillStyle=`rgba(0,100,0,${0.02+i*0.005})`; ctx.fillRect(w*(0.05+i*0.12), h*(0.1+i*0.08), w*0.1, h*0.06); }
        monoCells.forEach(cell => {
          const x=cell.x*w, y=cell.y*h, cw=cell.w*w, ch=cell.h*h, d=cell.district;
          ctx.fillStyle=d.color; ctx.fillRect(x,y,cw,ch); ctx.strokeStyle="#1A1A1A"; ctx.lineWidth=1.5; ctx.strokeRect(x,y,cw,ch);
          ctx.fillStyle=d.color; ctx.fillRect(x,y,cw,ch*0.25);
          ctx.fillStyle="#FFF"; ctx.font=`bold ${Math.min(cw,ch)*0.18}px 'Segoe UI'`; ctx.textAlign="center"; ctx.fillText(d.name, x+cw/2, y+ch*0.2);
          if (d.price>0) { ctx.font=`${Math.min(cw,ch)*0.12}px 'Segoe UI'`; ctx.fillText(`${d.price}K`, x+cw/2, y+ch*0.55); if(d.price>200){ctx.fillStyle="#2ECC71"; ctx.fillRect(x+cw*0.7, y+ch*0.65, cw*0.2, ch*0.15); ctx.fillStyle="#27AE60"; ctx.fillRect(x+cw*0.75, y+ch*0.6, cw*0.1, ch*0.25);}}
          else if(d.icon){ ctx.font=`${Math.min(cw,ch)*0.3}px 'Segoe UI'`; ctx.fillText(d.icon, x+cw/2, y+ch*0.6); }
        });
        const now = Date.now();
        
        // پرتاب تاس هر ۲.۵ ثانیه
        if (!diceRolling && now - monoLastMove > MONOPOLY_MOVE_INTERVAL) { 
          diceRolling = true; 
          diceStart = now; 
          diceRes = [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)]; 
          monoLastMove = now; 
        }
        
        // همیشه تاس‌ها رو نشون بده
        const diceSize = Math.min(w, h) * 0.09;
        const gap = diceSize * 0.4;
        const centerX = w * 0.5;
        const centerY = h * 0.5;
        const dice1X = centerX - diceSize/2 - gap/2;
        const dice1Y = centerY;
        const dice2X = centerX + diceSize/2 + gap/2;
        const dice2Y = centerY;
        
        if (diceRolling) {
          if (now - diceStart < 600) {
            const rotatingVal1 = Math.ceil(Math.random() * 6);
            const rotatingVal2 = Math.ceil(Math.random() * 6);
            drawDice(ctx, dice1X, dice1Y, rotatingVal1, diceSize);
            drawDice(ctx, dice2X, dice2Y, rotatingVal2, diceSize);
          } else {
            drawDice(ctx, dice1X, dice1Y, diceRes[0], diceSize);
            drawDice(ctx, dice2X, dice2Y, diceRes[1], diceSize);
            const steps = diceRes[0] + diceRes[1]; 
            players.forEach(p => { p.idx = (p.idx + steps) % monoCells.length; }); 
            diceRolling = false;
            const landed = monoCells[players[0].idx];
            if (landed.district.name === "شانس" || landed.district.name === "صندوق") { 
              activeCard = chanceCards[Math.floor(Math.random() * chanceCards.length)]; 
              cardTimer = now; 
            }
          }
        } else {
          // نمایش آخرین نتیجه وقتی تاس نمی‌چرخه
          drawDice(ctx, dice1X, dice1Y, diceRes[0], diceSize);
          drawDice(ctx, dice2X, dice2Y, diceRes[1], diceSize);
        }
        
        const offs=[{dx:-0.03,dy:-0.03},{dx:0.03,dy:-0.03},{dx:-0.03,dy:0.03},{dx:0.03,dy:0.03}];
        players.forEach((p,i)=>{ const cell=monoCells[p.idx]; const cx=cell.x*w+cell.w*w/2+offs[i].dx*w, cy=cell.y*h+cell.h*h/2+offs[i].dy*h;
          ctx.beginPath(); ctx.arc(cx,cy,Math.min(w,h)*0.018,0,Math.PI*2); ctx.fillStyle=p.col; ctx.fill(); ctx.strokeStyle="#FFF"; ctx.lineWidth=2; ctx.stroke(); });
        if(activeCard && now-cardTimer<2000){ ctx.fillStyle="rgba(0,0,0,0.7)"; ctx.fillRect(w*0.2,h*0.25,w*0.6,h*0.15); ctx.fillStyle="#FFF"; ctx.font=`bold ${Math.min(w,h)*0.04}px 'Segoe UI'`; ctx.textAlign="center"; ctx.fillText(activeCard,w/2,h*0.33); } else activeCard=null;
        ctx.fillStyle="#2C3E50"; ctx.font=`bold ${Math.min(w,h)*0.07}px 'Segoe UI'`; ctx.textAlign="center"; ctx.fillText("Tehranopoly",w/2,h*0.04);
      }

      // ---------- Brass ----------
      else if (scene === "brass") {
        const now = Date.now();

        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        skyGrad.addColorStop(0, "#0d0d0d");
        skyGrad.addColorStop(0.5, "#1a1410");
        skyGrad.addColorStop(1, "#2c1810");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 5; i++) {
          const cloudX = ((now * 0.01 + i * 200) % (w + 200)) - 100;
          const cloudY = h * 0.05 + i * h * 0.08;
          ctx.fillStyle = "rgba(20, 20, 20, 0.6)";
          ctx.beginPath();
          ctx.arc(cloudX, cloudY, 40, 0, Math.PI * 2);
          ctx.arc(cloudX + 30, cloudY - 15, 35, 0, Math.PI * 2);
          ctx.arc(cloudX + 60, cloudY, 45, 0, Math.PI * 2);
          ctx.arc(cloudX + 35, cloudY + 10, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        if (Math.floor(now / 3000) % 3 === 0) {
          const boltX = w * 0.3 + Math.random() * w * 0.4;
          ctx.strokeStyle = "rgba(255, 255, 200, 0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(boltX, 0);
          ctx.lineTo(boltX - 20, h * 0.15);
          ctx.lineTo(boltX + 10, h * 0.15);
          ctx.lineTo(boltX - 15, h * 0.35);
          ctx.stroke();
          const glow = ctx.createRadialGradient(boltX, h * 0.2, 10, boltX, h * 0.2, 100);
          glow.addColorStop(0, "rgba(255, 255, 200, 0.3)");
          glow.addColorStop(1, "rgba(255, 255, 200, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, w, h);
        }

        for (let i = 0; i < 15; i++) {
          const mistX = (Math.sin(now * 0.0005 + i) * 0.5 + 0.5) * w;
          const mistY = h * 0.7 + Math.cos(now * 0.0008 + i) * h * 0.1;
          ctx.fillStyle = `rgba(100, 90, 80, ${0.15 + Math.sin(now * 0.001 + i) * 0.1})`;
          ctx.beginPath();
          ctx.arc(mistX, mistY, 40 + Math.sin(now * 0.002 + i) * 20, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = 0; i < 30; i++) {
          const seed = i * 137.5;
          const px = ((now * 0.02 + seed) % w + w) % w;
          const py = ((now * 0.03 + seed * 1.3) % h + h) % h;
          const isSpark = i < 10;
          ctx.fillStyle = isSpark
            ? `rgba(255, ${150 + Math.random() * 100}, 0, ${0.5 + Math.random() * 0.5})`
            : `rgba(40, 40, 40, ${0.3 + Math.random() * 0.4})`;
          ctx.beginPath();
          ctx.arc(px, py, isSpark ? 1.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          if (isSpark) {
            ctx.fillStyle = "rgba(255, 200, 0, 0.3)";
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        canals.forEach(c => {
          ctx.beginPath();
          ctx.moveTo(c.x1 * w, c.y1 * h);
          ctx.lineTo(c.x2 * w, c.y2 * h);
          ctx.strokeStyle = "#2a4a5a";
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.strokeStyle = "#4a7a9a";
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -now * 0.02;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = "rgba(200, 220, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 10]);
          ctx.lineDashOffset = -now * 0.01;
          ctx.stroke();
          ctx.setLineDash([]);
          const boatProgress = (now * 0.01 + c.x1) % 1;
          const bx = c.x1 * w + (c.x2 * w - c.x1 * w) * boatProgress;
          const by = c.y1 * h + (c.y2 * h - c.y1 * h) * boatProgress;
          ctx.fillStyle = "#4a3520";
          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.beginPath();
        ctx.moveTo(0, 0.55 * h);
        ctx.lineTo(w, 0.55 * h);
        ctx.strokeStyle = "#4a3a2a";
        ctx.lineWidth = 4;
        ctx.stroke();
        for (let i = 0; i < 25; i++) {
          const sleeperX = (i * w / 24);
          ctx.fillStyle = "#3a2a1a";
          ctx.fillRect(sleeperX - 1.5, 0.545 * h, 4, 0.01 * h);
        }
        ctx.strokeStyle = "#8a7a6a";
        ctx.lineWidth = 1;
        for (let offset = -3; offset <= 3; offset += 6) {
          ctx.beginPath();
          ctx.moveTo(0, 0.55 * h + offset);
          ctx.lineTo(w, 0.55 * h + offset);
          ctx.stroke();
        }

        trainProgress = (trainProgress + 0.003) % 1;
        const trainX = trainProgress * w;
        const trainY = 0.5 * h;
        for (let i = 1; i <= 2; i++) {
          const wagonX = trainX - i * 50;
          ctx.fillStyle = "#2a1a0a";
          ctx.fillRect(wagonX, trainY - 8, 40, 12);
          ctx.strokeStyle = "#4a3a2a";
          ctx.lineWidth = 1;
          ctx.strokeRect(wagonX, trainY - 8, 40, 12);
          for (let j = 0; j < 5; j++) {
            ctx.fillStyle = `rgb(${20 + Math.random() * 20}, ${15 + Math.random() * 10}, ${10 + Math.random() * 10})`;
            ctx.beginPath();
            ctx.arc(wagonX + 5 + j * 8, trainY - 3, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = "#1a0a00";
        ctx.fillRect(trainX, trainY - 12, 45, 18);
        ctx.strokeStyle = "#4a3a2a";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(trainX, trainY - 12, 45, 18);
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(trainX + 5, trainY - 15, 15, 20);
        ctx.fillStyle = "#f39c12";
        ctx.fillRect(trainX + 25, trainY - 18, 10, 8);
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.arc(trainX + 10, trainY + 8, 6, 0, Math.PI * 2);
        ctx.arc(trainX + 30, trainY + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 4; i++) {
          const smokeX = trainX - 20 + i * 8;
          const smokeY = trainY - 20 - (now * 0.03 + i * 5) % 30;
          const smokeAlpha = 0.3 - (i * 0.05);
          ctx.fillStyle = `rgba(150, 150, 150, ${smokeAlpha})`;
          ctx.beginPath();
          ctx.arc(smokeX, smokeY, 5 + i * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        factories.forEach((f, idx) => {
          const fx = f.x * w;
          const fy = f.y * h;
          const fw = f.w * w;
          const fh = f.h * h;

          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(fx + 2, fy + 2, fw, fh);

          const bodyGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
          bodyGrad.addColorStop(0, "#4a3520");
          bodyGrad.addColorStop(0.5, "#3d2b1f");
          bodyGrad.addColorStop(1, "#2a1a10");
          ctx.fillStyle = bodyGrad;
          ctx.fillRect(fx, fy, fw, fh);
          ctx.strokeStyle = "#1a1a1a";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(fx, fy, fw, fh);

          for (let wy = fy + fh * 0.2; wy < fy + fh * 0.8; wy += fh * 0.3) {
            for (let wx = fx + fw * 0.1; wx < fx + fw * 0.9; wx += fw * 0.4) {
              const windowGlow = Math.sin(now * 0.005 + idx + wx) * 0.5 + 0.5;
              ctx.fillStyle = `rgba(255, ${150 + windowGlow * 100}, 0, ${0.4 + windowGlow * 0.6})`;
              ctx.fillRect(wx, wy, fw * 0.2, fh * 0.15);
            }
          }

          for (let j = 0; j < f.chimneys; j++) {
            const cx = fx + fw / (f.chimneys + 1) * (j + 1);
            const chimneyBase = fy - 5;

            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(cx - 4, chimneyBase - 20, 8, 20);

            const chimneyGrad = ctx.createLinearGradient(cx, chimneyBase, cx, chimneyBase - 20);
            chimneyGrad.addColorStop(0, "#5a4a3a");
            chimneyGrad.addColorStop(1, "#3a2a1a");
            ctx.fillStyle = chimneyGrad;
            ctx.fillRect(cx - 3, chimneyBase - 18, 6, 18);

            for (let s = 0; s < 3; s++) {
              const sparkX = cx + (Math.sin(now * 0.01 + j * 2 + s) * 8);
              const sparkY = chimneyBase - 25 - (now * 0.05 + s * 3) % 30;
              if (sparkY > fy - 50) {
                ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, ${0.6 + Math.random() * 0.4})`;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 1.5 + Math.random(), 0, Math.PI * 2);
                ctx.fill();
              }
            }

            for (let k = 0; k < 5; k++) {
              const smokeX = cx + Math.sin(now * 0.002 + k) * 8;
              const smokeY = chimneyBase - 20 - (k * 12) - (now * 0.03) % 20;
              const smokeSize = 4 + k * 3;
              ctx.fillStyle = `rgba(80, 80, 80, ${0.3 - k * 0.04})`;
              ctx.beginPath();
              ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        gears.forEach(g => {
          g.rot += g.sp;
          const cx = g.x * w;
          const cy = g.y * h;
          const r = g.r * Math.min(w, h);

          ctx.save();
          ctx.translate(cx + 1, cy + 1);
          ctx.rotate(g.rot);
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7, r * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(g.rot);

          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const toothGrad = ctx.createLinearGradient(
              Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5,
              Math.cos(a) * r, Math.sin(a) * r
            );
            toothGrad.addColorStop(0, "#8a7a6a");
            toothGrad.addColorStop(1, "#4a3a2a");
            ctx.fillStyle = toothGrad;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7, r * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#2a1a0a";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
          centerGrad.addColorStop(0, "#aaa");
          centerGrad.addColorStop(0.5, "#666");
          centerGrad.addColorStop(1, "#333");
          ctx.fillStyle = centerGrad;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#1a1a1a";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = "#0a0a0a";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        const fs = Math.min(w, h) * 0.08;
        const textGrad = ctx.createLinearGradient(w/2 - 100, h/2 - fs, w/2 + 100, h/2);
        textGrad.addColorStop(0, "#b8a88a");
        textGrad.addColorStop(0.3, "#f0e6d2");
        textGrad.addColorStop(0.5, "#d4c4a8");
        textGrad.addColorStop(0.7, "#8a7a6a");
        textGrad.addColorStop(1, "#b8a88a");
        ctx.font = `bold ${fs}px 'Georgia', serif`;
        ctx.fillStyle = textGrad;
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = fs * 0.3;
        ctx.textAlign = "center";
        ctx.fillText("B R A S S", w/2, h/2);
        ctx.shadowBlur = 0;
        ctx.font = `italic ${fs * 0.35}px 'Georgia', serif`;
        ctx.fillStyle = "#b8a88a";
        ctx.fillText("Birmingham, 1770", w/2, h/2 + fs * 0.6);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="w-full h-[50vh] md:h-[calc(100dvh-145px)] relative overflow-hidden bg-[#1b2b40]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}