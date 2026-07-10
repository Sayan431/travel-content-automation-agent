import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal:        #1a7c6e;
    --teal-mid:    #1fa88e;
    --teal-bright: #22c9a8;
    --teal-solid:  #155f54;
    --orange:      #e8602e;
    --orange-mid:  #f07240;
    --white:       #ffffff;
    --cream:       #f6f4ef;
    --off-white:   #fafaf8;
    --ink:         #0f1c18;
    --ink2:        #1e2d28;
    --muted:       #4a6058;
    --blue-solid:  #1a6bab;
    --blue-mid:    #2b8ad4;
  }

  html, body {
    overflow-x: hidden;
    background: var(--off-white);
  }

  /* ─── HEADER / NAV ─── */
  .tm-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;

    height: 78px;
    padding: 0 8%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    background: rgba(21, 95, 84, 0.96);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    border-bottom: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 28px rgba(0,0,0,0.16);

    transition:
      background 0.35s ease,
      box-shadow 0.35s ease,
      backdrop-filter 0.35s ease,
      -webkit-backdrop-filter 0.35s ease;
  }

  .tm-nav.scrolled {
    background: rgba(21, 95, 84, 0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    box-shadow: none;
  }

  .tm-logo {
    display: flex;
    align-items: center;
    gap: 0.65rem;

    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: 0.01em;
    text-shadow: 0 3px 18px rgba(0,0,0,0.35);
  }

  .tm-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 7px;
    background: var(--orange);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    font-weight: 900;
  }

  .tm-nav-center {
    display: flex;
    align-items: center;
    gap: 2.1rem;
  }

  .tm-nav-center a,
  .tm-nav-admin {
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    font-weight: 800;
    color: rgba(255,255,255,0.92);
    text-decoration: none;
    text-shadow: 0 2px 14px rgba(0,0,0,0.3);
    transition: color 0.25s ease, transform 0.25s ease;
  }

  .tm-nav-center a:hover,
  .tm-nav-admin:hover {
    color: var(--teal-bright);
    transform: translateY(-1px);
  }

  .tm-nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .tm-plan-btn {
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
    background: var(--orange);
    border: 1px solid var(--orange);
    border-radius: 4px;
    padding: 0.9rem 1.45rem;
    text-decoration: none;
    transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  }

  .tm-plan-btn:hover {
    background: var(--orange-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(232,96,46,0.28);
  }

  /* ─── HERO ─── */
  .tm-hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .tm-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(1.05);
    animation: heroZoom 14s ease-out forwards;
    filter: brightness(1.05) saturate(1.2);
  }

  @keyframes heroZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.0); }
  }

  .tm-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(21, 95, 84, 0.42) 0%,
      rgba(26, 124, 110, 0.26) 30%,
      rgba(21, 95, 84, 0.48) 68%,
      rgba(5, 40, 30, 0.82) 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 2rem;
  }

  .tm-hero-tag {
    font-family: 'Outfit', sans-serif;
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--teal-bright);
    margin-bottom: 1.2rem;
    opacity: 0;
    text-shadow: 0 4px 16px rgba(0,0,0,0.65);
    animation: fadeUp 0.8s 0.4s forwards;
  }

  .tm-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 12vw, 11rem);
    line-height: 0.9;
    letter-spacing: 0.04em;
    color: #fff;
    opacity: 0;
    animation: fadeUp 0.9s 0.65s forwards;
  }

  .tm-hero-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 900;
    color: #ffffff;
    margin-top: 1rem;
    letter-spacing: 0.04em;
    opacity: 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.72);
    animation: fadeUp 0.9s 0.85s forwards;
  }

  .tm-hero-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 900;
    color: #ffffff;
    margin-top: 0.8rem;
    letter-spacing: 0.02em;
    opacity: 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.72);
    animation: fadeUp 0.9s 1.0s forwards;
  }

  .tm-hero-cta {
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    opacity: 0;
    animation: fadeUp 0.9s 1.2s forwards;
  }

  .btn-primary {
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.95rem 2.4rem;
    background: var(--teal-mid);
    color: #ffffff;
    border: 2px solid var(--teal-mid);
    cursor: pointer;
    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
    box-shadow: 0 4px 20px rgba(26,124,110,0.35);
  }

  .btn-primary:hover {
    background: var(--teal-bright);
    border-color: var(--teal-bright);
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(26,124,110,0.5);
  }

  .btn-secondary {
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.95rem 2.4rem;
    background: rgba(255,255,255,0.08);
    color: #fff;
    border: 2px solid rgba(255,255,255,0.5);
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
    backdrop-filter: blur(6px);
  }

  .btn-secondary:hover {
    border-color: #fff;
    background: rgba(255,255,255,0.18);
    transform: translateY(-3px);
  }

  .tm-hero-scroll {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    opacity: 0;
    animation: fadeUp 1s 1.6s forwards;
  }

  .tm-hero-scroll span {
    font-family: 'Outfit', sans-serif;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }

  .scroll-line {
    width: 1.5px;
    height: 44px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(0.6); }
  }

  /* ─── STATS STRIP ─── */
  .tm-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100vw;
  }

  .tm-strip-item {
    padding: 2.6rem 3rem;
    text-align: center;
    background: var(--teal-solid);
    border-right: 1px solid rgba(255,255,255,0.12);
    cursor: default;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }

  .tm-strip-item:last-child {
    border-right: none;
    background: var(--orange);
  }

  .tm-strip-item h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.08em;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .tm-strip-item p {
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.82);
    text-transform: uppercase;
  }

  /* ─── GALLERY ─── */
  .tm-gallery {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    grid-template-rows: 480px 380px;
    width: 100vw;
    gap: 4px;
    background: var(--teal-solid);
  }

  .gcard {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .gcard:nth-child(1) {
    grid-row: 1 / 3;
  }

  .gcard img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
    filter: brightness(1.0) saturate(1.15);
  }

  .gcard:hover img {
    transform: scale(1.07);
    filter: brightness(1.06) saturate(1.25);
  }

  .gcard-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 55%);
    transition: background 0.4s;
  }

  .gcard:hover .gcard-overlay {
    background: linear-gradient(to top, rgba(26,124,110,0.88) 0%, rgba(0,0,0,0.08) 65%);
  }

  .gcard-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 1.8rem;
    transform: translateY(6px);
    transition: transform 0.35s ease;
  }

  .gcard:hover .gcard-label {
    transform: translateY(0);
  }

  .gcard-label h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    letter-spacing: 0.1em;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .gcard-label p {
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: rgba(255,255,255,0.9);
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.35s 0.05s, transform 0.35s 0.05s;
  }

  .gcard:hover .gcard-label p {
    opacity: 1;
    transform: translateY(0);
  }

  .gcard-tag {
    position: absolute;
    top: 1.2rem;
    left: 1.4rem;
    font-family: 'Outfit', sans-serif;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
    background: var(--orange);
    padding: 0.3rem 0.7rem;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 0.3s, transform 0.3s;
  }

  .gcard:hover .gcard-tag {
    opacity: 1;
    transform: translateY(0);
  }

  /* ─── HIGHLIGHTS ─── */
  .tm-highlights {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100vw;
    background: var(--teal-solid);
  }

  .tm-highlights-col {
    padding: 5rem 6rem;
    border-right: 1px solid rgba(255,255,255,0.12);
    position: relative;
    overflow: hidden;
  }

  .tm-highlights-col:last-child {
    border-right: none;
  }

  .tm-highlights-col h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    letter-spacing: 0.08em;
    color: #fff;
    margin-bottom: 2.5rem;
    position: relative;
    display: inline-block;
  }

  .tm-highlights-col h2::after {
    content: '';
    position: absolute;
    bottom: -0.6rem;
    left: 0;
    width: 3rem;
    height: 3px;
    background: var(--teal-bright);
    border-radius: 2px;
  }

  .tm-highlights-col ul {
    list-style: none;
  }

  .tm-highlights-col li {
    font-family: 'Outfit', sans-serif;
    font-size: 0.97rem;
    font-weight: 600;
    color: rgba(255,255,255,0.82);
    padding: 0.9rem 0.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 0.9rem;
    transition: color 0.25s, padding-left 0.25s, background 0.25s;
    cursor: default;
    border-radius: 6px;
  }

  .tm-highlights-col li::before {
    content: '';
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--teal-bright);
    flex-shrink: 0;
    transition: transform 0.25s;
  }

  .tm-highlights-col li:hover {
    color: #fff;
    padding-left: 1.1rem;
    background: rgba(255,255,255,0.07);
  }

  .tm-highlights-col li:hover::before {
    transform: scale(1.6);
  }

  /* ─── ITINERARY ─── */
  .tm-itinerary {
    width: 100vw;
    background:
      radial-gradient(circle at top left, rgba(34,201,168,0.14), transparent 32%),
      radial-gradient(circle at bottom right, rgba(232,96,46,0.12), transparent 34%),
      var(--cream);
    padding: 6rem;
  }

  .tm-itinerary > h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.2rem;
    letter-spacing: 0.1em;
    color: var(--teal-solid);
    margin-bottom: 0.4rem;
  }

  .tm-itinerary > p {
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 3.5rem;
  }

  .itin-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
    overflow: visible;
    border-radius: 22px;
  }

  .itin-row {
    display: grid;
    grid-template-columns: 122px 1fr;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(21,95,84,0.12);
    box-shadow: 0 16px 38px rgba(15,28,24,0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }

  .itin-row:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 48px rgba(15,28,24,0.14);
  }

  .itin-day {
    color: #fff;
    padding: 1.4rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .itin-day span:first-child {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.7);
  }

  .itin-day span:last-child {
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    font-weight: 900;
    color: #fff;
    margin-top: 2px;
    text-align: center;
    letter-spacing: 0.04em;
  }

  .itin-acts {
    padding: 1.25rem 1.5rem;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    line-height: 1.75;
    transition: background 0.25s;
  }

  .itin-acts span {
    display: block;
    padding: 0.14rem 0;
    color: var(--ink2);
    font-weight: 700;
  }

  .itin-acts span::before {
    content: '● ';
    font-weight: 900;
    font-size: 0.55rem;
  }

  .itin-row.dest-amsterdam .itin-day { background: linear-gradient(145deg, var(--teal-solid), var(--teal-mid)); }
  .itin-row.dest-amsterdam .itin-acts { background: rgba(233,248,244,0.96); }
  .itin-row.dest-amsterdam .itin-acts span::before { color: var(--teal-mid); }

  .itin-row.dest-keukenhof .itin-day { background: linear-gradient(145deg, #2e7d32, #43a047); }
  .itin-row.dest-keukenhof .itin-acts { background: rgba(237,247,238,0.96); }
  .itin-row.dest-keukenhof .itin-acts span::before { color: #2e7d32; }

  .itin-row.dest-giethoorn .itin-day { background: linear-gradient(145deg, #b45309, #f59e0b); }
  .itin-row.dest-giethoorn .itin-acts { background: rgba(254,248,238,0.98); }
  .itin-row.dest-giethoorn .itin-acts span::before { color: #b45309; }

  .itin-row.dest-scheveningen .itin-day { background: linear-gradient(145deg, var(--blue-solid), var(--blue-mid)); }
  .itin-row.dest-scheveningen .itin-acts { background: rgba(234,243,251,0.98); }
  .itin-row.dest-scheveningen .itin-acts span::before { color: var(--blue-mid); }

  .itin-row.dest-paris .itin-day { background: linear-gradient(145deg, #9b1b4f, #d9467d); }
  .itin-row.dest-paris .itin-acts { background: rgba(253,240,245,0.98); }
  .itin-row.dest-paris .itin-acts span::before { color: #9b1b4f; }

  .itin-row.dest-mini .itin-day { background: linear-gradient(145deg, var(--orange), var(--orange-mid)); }
  .itin-row.dest-mini .itin-acts { background: rgba(255,243,238,0.98); }
  .itin-row.dest-mini .itin-acts span::before { color: var(--orange); }

  .itin-row.dest-depart .itin-day { background: linear-gradient(145deg, #374151, #111827); }
  .itin-row.dest-depart .itin-acts { background: rgba(243,244,246,0.98); }
  .itin-row.dest-depart .itin-acts span::before { color: #374151; }

  .itin-final {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, var(--teal-solid), var(--teal-mid), var(--orange));
    color: #fff;
    text-align: center;
    padding: 1.4rem 2rem;
    border-radius: 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    box-shadow: 0 18px 42px rgba(21,95,84,0.18);
  }

  /* ─── PLATFORM CARDS ─── */
  .tm-platform {
    width: 100vw;
    background: var(--off-white);
    padding: 7rem 6rem;
    text-align: center;
  }

  .tm-platform > h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.5rem;
    letter-spacing: 0.1em;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .tm-platform > p {
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4rem;
  }

  .tm-platform-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    max-width: 1100px;
    margin: 0 auto;
    border: 2px solid var(--teal-solid);
    overflow: hidden;
  }

  .pcard {
    padding: 3.5rem 3rem;
    text-align: left;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
    border-right: 1px solid rgba(0,0,0,0.08);
  }

  .pcard:last-child {
    border-right: none;
  }

  .pcard:hover {
    transform: scale(1.015);
    z-index: 1;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  }

  .pcard-teal { background: var(--teal-solid); }
  .pcard-orange { background: var(--orange); }

  .pcard-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5.5rem;
    line-height: 1;
    position: absolute;
    top: 1.2rem;
    right: 2rem;
    color: rgba(255,255,255,0.08);
    user-select: none;
    transition: color 0.4s;
  }

  .pcard:hover .pcard-num {
    color: rgba(255,255,255,0.15);
  }

  .pcard h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: rgba(255,255,255,0.65);
  }

  .pcard h4 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.3rem;
    letter-spacing: 0.06em;
    color: #fff;
    margin-bottom: 2rem;
  }

  .pcard ul {
    list-style: none;
    margin-bottom: 2.5rem;
  }

  .pcard li {
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.8);
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: color 0.2s, padding-left 0.2s;
  }

  .pcard-btn {
    display: inline-block;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.85rem 2.2rem;
    color: #fff;
    border: 2px solid rgba(255,255,255,0.6);
    background: transparent;
    transition: background 0.25s, border-color 0.25s, transform 0.2s;
  }

  .pcard-btn:hover {
    background: rgba(255,255,255,0.18);
    border-color: #fff;
    transform: translateY(-2px);
  }

  /* ─── FOOTER ─── */
  .tm-footer {
    width: 100vw;
    background: var(--teal-solid);
    color: #fff;
  }

  .tm-footer-newsletter {
    background: var(--teal);
    padding: 3.2rem 8%;
    text-align: center;
  }

  .tm-footer-newsletter h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 3vw, 2.5rem);
    color: #fff;
    margin-bottom: 0.7rem;
  }

  .tm-footer-newsletter p {
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    color: rgba(255,255,255,0.82);
    margin-bottom: 1.6rem;
  }

  .newsletter-form {
    display: flex;
    justify-content: center;
    gap: 0.7rem;
    flex-wrap: wrap;
  }

  .newsletter-form input {
    width: 240px;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(21,95,84,0.35);
    color: #fff;
    border-radius: 4px;
    outline: none;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
  }

  .newsletter-form input::placeholder {
    color: rgba(255,255,255,0.68);
  }

  .newsletter-form button {
    padding: 0.9rem 1.4rem;
    background: var(--orange);
    border: none;
    border-radius: 4px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    cursor: pointer;
  }

  .tm-footer-main {
    padding: 5rem 8% 3rem;
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1.25fr;
    gap: 4rem;
  }

  .tm-footer-brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
  }

  .tm-footer-brand span:first-child {
    width: 34px;
    height: 34px;
    border-radius: 7px;
    background: var(--orange);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .tm-footer-col p,
  .tm-footer-col a,
  .tm-footer-contact li {
    font-family: 'Outfit', sans-serif;
    font-size: 0.92rem;
    line-height: 1.7;
    color: rgba(255,255,255,0.82);
    text-decoration: none;
  }

  .tm-footer-col h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    color: #fff;
    margin-bottom: 1.2rem;
  }

  .tm-footer-col ul {
    list-style: none;
  }

  .tm-footer-col li {
    margin-bottom: 0.85rem;
  }

  .tm-footer-col a:hover {
    color: var(--teal-bright);
  }

  .tm-socials {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }

  .tm-socials a {
    width: 34px;
    height: 34px;
    border-radius: 4px;
    background: rgba(255,255,255,0.06);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 900;
  }

  .tm-footer-contact li {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
  }

  .tm-footer-contact strong {
    color: var(--teal-bright);
  }

  .footer-mini-form {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .footer-mini-form input {
    flex: 1;
    min-width: 0;
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: #fff;
  }

  .footer-mini-form button {
    padding: 0.8rem 1rem;
    border-radius: 4px;
    border: none;
    background: var(--orange);
    color: #fff;
    font-weight: 900;
    cursor: pointer;
  }

  .tm-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 1.2rem 8%;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.58);
  }

  .tm-footer-bottom span {
    color: var(--teal-bright);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1000px) {
    .tm-nav {
      padding: 0 1.5rem;
    }

    .tm-nav-center {
      display: none;
    }

    .tm-footer-main {
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }
  }

  @media (max-width: 700px) {
    .tm-nav {
      height: 72px;
    }

    .tm-logo {
      font-size: 1.05rem;
    }

    .tm-logo-mark {
      width: 30px;
      height: 30px;
    }

    .tm-nav-admin {
      display: none;
    }

    .tm-plan-btn {
      padding: 0.75rem 1rem;
      font-size: 0.68rem;
    }

    .tm-strip,
    .tm-highlights,
    .itin-grid,
    .tm-platform-grid,
    .tm-footer-main {
      grid-template-columns: 1fr;
    }

    .tm-gallery {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    .gcard,
    .gcard:nth-child(1) {
      grid-row: auto;
      height: 360px;
    }

    .tm-highlights-col,
    .tm-itinerary,
    .tm-platform {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .tm-footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

export default function Home() {
  const navRef = useRef(null);
  const [itinerary, setItinerary] = useState([]);

  // Fallback static days shown if API is unreachable
  const FALLBACK = [
    { id: 1, day_label: "Day 1–2", destination: "Amsterdam",    color_class: "dest-amsterdam",    sort_order: 1, activities: ["Arrival & Canal Tour", "Van Gogh Museum", "Jordaan District Walk"] },
    { id: 2, day_label: "Day 3",   destination: "Keukenhof",    color_class: "dest-keukenhof",    sort_order: 2, activities: ["Tulip Gardens", "Flower Exhibitions", "Dutch Countryside"] },
    { id: 3, day_label: "Day 4",   destination: "Giethoorn",    color_class: "dest-giethoorn",    sort_order: 3, activities: ["Village Boat Tour", "Traditional Architecture", "Local Lunch"] },
    { id: 4, day_label: "Day 5",   destination: "Scheveningen", color_class: "dest-scheveningen", sort_order: 4, activities: ["Beach & Pier", "Seafood Dining", "Coastal Views"] },
    { id: 5, day_label: "Day 6–8", destination: "Paris",        color_class: "dest-paris",        sort_order: 5, activities: ["Eiffel Tower Visit", "Louvre Museum", "Champs-Élysées & Seine Cruise"] },
    { id: 6, day_label: "Day 9",   destination: "Mini Europe",  color_class: "dest-mini",         sort_order: 6, activities: ["Brussels City Tour", "Mini Europe Park", "Belgian Chocolates"] },
    { id: 7, day_label: "Day 10",  destination: "Departure",    color_class: "dest-depart",       sort_order: 7, activities: ["Last-minute Shopping", "Airport Transfer"] },
  ];

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "https://travel-content-automation-agent.onrender.com/api";
    fetch(`${baseUrl}/itinerary/`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setItinerary(data); })
      .catch(() => {/* use fallback */});
  }, []);

  const days = itinerary.length > 0 ? itinerary : FALLBACK;

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 40);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <nav className="tm-nav" ref={navRef}>
        <Link to="/" className="tm-logo">
          <span className="tm-logo-mark">⌁</span>
          <span>Travel Muse</span>
        </Link>

        {/* <div className="tm-nav-center">
          <Link to="/">Destinations⌄</Link>
          <Link to="/">Experiences</Link>
          <Link to="/blogs">Blog</Link>
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
        </div> */}

        <div className="tm-nav-actions">
          <Link to="/login" className="tm-nav-admin">Admin</Link>
          <Link to="/blogs" className="tm-plan-btn">Blog</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="tm-hero">
        <img
          className="tm-hero-img"
          src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1800&q=80"
          alt="Amsterdam canal houses"
        />

        <div className="tm-hero-overlay">
          <p className="tm-hero-tag">
            Amsterdam · Paris · Culture · Tourism · Events
          </p>

          <h1 className="tm-hero-title">European Dream</h1>

          <p className="tm-hero-subtitle">10-Day Luxury Journey</p>

          <p className="tm-hero-desc">
            Amsterdam · Paris · Keukenhof · Scheveningen · Giethoorn · Mini Europe
          </p>

          <div className="tm-hero-cta">
            <Link to="/blogs" className="btn-primary">Explore Blogs</Link>
            <Link to="/login" className="btn-secondary">Admin Dashboard</Link>
          </div>
        </div>

        <div className="tm-hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* STRIP */}
      <div className="tm-strip">
        <div className="tm-strip-item">
          <h3>10 Days</h3>
          <p>Netherlands, Belgium &amp; France</p>
        </div>

        <div className="tm-strip-item">
          <h3>Min 9 People</h3>
          <p>3–5 Families</p>
        </div>
      </div>

      {/* GALLERY */}
      <section className="tm-gallery">
        <div className="gcard">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80"
            alt="Paris Eiffel Tower"
          />
          <div className="gcard-overlay" />
          <span className="gcard-tag">Featured</span>
          <div className="gcard-label">
            <h3>Paris</h3>
            <p>Eiffel Tower · Louvre Museum · Seine River · Montmartre · French Cuisine</p>
          </div>
        </div>

        <div className="gcard">
          <img
            src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80"
            alt="Amsterdam canal"
          />
          <div className="gcard-overlay" />
          <span className="gcard-tag">City Guide</span>
          <div className="gcard-label">
            <h3>Amsterdam</h3>
            <p>Canal Cruise · Van Gogh Museum · Jordaan District · Dutch Culture</p>
          </div>
        </div>

        <div className="gcard">
          <img
            src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80"
            alt="Paris street"
          />
          <div className="gcard-overlay" />
          <span className="gcard-tag">Culture</span>
          <div className="gcard-label">
            <h3>Keukenhof</h3>
            <p>Tulip Gardens · Flower Exhibitions · Spring Tourism</p>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="tm-highlights">
        <div className="tm-highlights-col">
          <h2>Amsterdam Highlights</h2>
          <ul>
            <li>Canal Ring Cruise</li>
            <li>Anne Frank House</li>
            <li>Van Gogh Museum</li>
            <li>Dam Square</li>
            <li>Jordaan District</li>
            <li>Dutch Cuisine Experience</li>
          </ul>
        </div>

        <div className="tm-highlights-col">
          <h2>Paris Highlights</h2>
          <ul>
            <li>Eiffel Tower Visit</li>
            <li>Louvre Museum</li>
            <li>Seine River Cruise</li>
            <li>Champs-Élysées Shopping</li>
            <li>Montmartre &amp; Sacré-Cœur</li>
            <li>French Food &amp; Café Culture</li>
          </ul>
        </div>
      </section>

      {/* ITINERARY — dynamic from API */}
      <section className="tm-itinerary">
        <h2>Detailed {days.length > 0 ? `${days.reduce((acc, d) => {
          const m = d.day_label.match(/(\d+)/g);
          return m ? Math.max(acc, Number(m[m.length - 1])) : acc;
        }, 0)}-Day` : "10-Day"} Itinerary</h2>
        <p>Day-by-day breakdown of your European Dream journey</p>

        <div className="itin-grid">
          {days.map((day) => (
            <div key={day.id} className={`itin-row ${day.color_class}`}>
              <div className="itin-day">
                <span>{day.day_label}</span>
                <span>{day.destination}</span>
              </div>
              <div className="itin-acts">
                {(day.activities || []).map((act, i) => (
                  <span key={i}>{act}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="itin-final">
            ✦ {days.length > 0 ? `${days.reduce((acc, d) => {
              const m = d.day_label.match(/(\d+)/g);
              return m ? Math.max(acc, Number(m[m.length - 1])) : acc;
            }, 0)} unforgettable days` : "10 unforgettable days"} across Europe ✦
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="tm-platform">
        <h2>Platform Options</h2>
        <p>Choose your experience</p>

        <div className="tm-platform-grid">
          <div className="pcard pcard-teal">
            <span className="pcard-num">01</span>
            <h3>Public Travel Site</h3>
            <h4>Paris &amp; Amsterdam Blogs</h4>

            <ul>
              <li>Approved blogs appear publicly</li>
              <li>Clean article formatting</li>
              <li>SEO title and meta description</li>
              <li>Travel-news focused content</li>
              <li>Brochure-style visual layout</li>
            </ul>

            <Link to="/blogs" className="pcard-btn">View Blogs</Link>
          </div>

          <div className="pcard pcard-orange">
            <span className="pcard-num">02</span>
            <h3>Admin Dashboard</h3>
            <h4>AI Content Review</h4>

            <ul>
              <li>Fetch RSS and generate blogs</li>
              <li>Review pending AI content</li>
              <li>Accept or reject each blog</li>
              <li>Prepare social media posts</li>
              <li>Mock/real posting workflow ready</li>
            </ul>

            <Link to="/login" className="pcard-btn">Open Dashboard</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tm-footer">
        <div className="tm-footer-newsletter">
          <h2>Get travel inspiration in your inbox</h2>
          <p>No spam, ever. Curated European stories and travel ideas only.</p>

          <div className="newsletter-form">
            <input type="text" placeholder="Your first name" />
            <input type="email" placeholder="Your email address" />
            <button type="button">Subscribe →</button>
          </div>
        </div>

        <div className="tm-footer-main">
          <div className="tm-footer-col">
            <div className="tm-footer-brand">
              <span>⌁</span>
              <span>Travel Muse</span>
            </div>
            <p>
              Curating slow travel experiences in Amsterdam and Paris for those
              who seek depth over distance.
            </p>

            <div className="tm-socials">
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Facebook">f</a>
            </div>
          </div>

          <div className="tm-footer-col">
            <h3>Destinations</h3>
            <ul>
              <li><Link to="/">Amsterdam</Link></li>
              <li><Link to="/">Paris</Link></li>
              <li><Link to="/">All Destinations</Link></li>
              <li><Link to="/">Experiences</Link></li>
            </ul>
          </div>

          <div className="tm-footer-col">
            <h3>Company</h3>
            <ul>
              <li><Link to="/">Our Story</Link></li>
              <li><Link to="/blogs">Travel Blog</Link></li>
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="tm-footer-col">
            <h3>Get in Touch</h3>
            <ul className="tm-footer-contact">
              <li><strong>⌖</strong> Amsterdam, Netherlands</li>
              <li><strong>✉</strong> hello@travelmuse.com</li>
              <li><strong>☎</strong> +31 20 123 4567</li>
            </ul>

            <div className="footer-mini-form">
              <input type="email" placeholder="Your email" />
              <button type="button">Join</button>
            </div>
          </div>
        </div>

        <div className="tm-footer-bottom">
          <p>© 2026 Travel Muse. All rights reserved.</p>
          <p>Crafted with care for slow travellers everywhere.</p>
        </div>
      </footer>
    </>
  );
}



