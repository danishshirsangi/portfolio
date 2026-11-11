import React, { useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  { number: "01", title: "AI Meeting Assistant", category: "WINDOWS DESKTOP APP", summary: "Meetings leave behind a lot of useful thinking. This tool makes it easier to find again.", repo: "https://github.com/danishshirsangi/ai-meeting-assistant-windows", detail: "Record microphone and system audio, transcribe locally with faster-whisper, then ask Gemini questions about the transcript. It works after recording, rather than listening for questions live.", color: "orange", glyph: "✳" },
  { number: "02", title: "AquaTruck", category: "ANDROID · IN PROGRESS", summary: "A mobile toolkit for the people and moving parts behind water delivery.", repo: "https://github.com/danishshirsangi/aquatruck", detail: "An Android app for water transport operations: background truck tracking, driver attendance, delivery proof, and manager workflows. The repository metadata also uses the name AquaTrack.", color: "blue", glyph: "↗" },
];

function Project({ project }) {
  const [open, setOpen] = useState(false);
  return <article data-reveal-scale className={`project project--${project.color} ${open ? "is-open" : ""}`}>
    <button className="project__hit" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${project.title} details`}>
      <div className="project__art" aria-hidden="true"><span className="art__orbit"/><span className="art__shape">{project.glyph}</span><span className="art__index">DS / {project.number}</span><span className="art__arrow"><ArrowUpRight/></span></div>
      <div className="project__head"><span className="micro">{project.category}</span><span className="micro">{project.number} / 02</span></div>
      <h3>{project.title}<span className="project__plus">{open ? "−" : "+"}</span></h3>
      <p>{project.summary}</p>
      <span className="project__prompt">{open ? "CLOSE NOTES" : "OPEN PROJECT NOTES"}<ArrowDownRight size={15}/></span>
    </button>
    {open && <div className="project__detail"><p>{project.detail}</p><a href={project.repo} target="_blank" rel="noreferrer">EXPLORE ON GITHUB <ArrowUpRight size={14}/></a></div>}
  </article>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);
  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const reveal = gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=560", scrub: 0.7, pin: true, anticipatePin: 1 },
    });
    const prism = pageRef.current.querySelector(".hero__flare-art");
    const prismStyle = window.getComputedStyle(prism);
    const hero = pageRef.current.querySelector(".hero");
    const marker = document.createElement("i");
    marker.style.cssText = `position:absolute;width:0;height:0;right:${prismStyle.getPropertyValue("--flare-rest-right")};bottom:${prismStyle.getPropertyValue("--flare-rest-bottom")};`;
    hero.appendChild(marker);
    const heroRect = hero.getBoundingClientRect();
    const prismRect = prism.getBoundingClientRect();
    const restPoint = marker.getBoundingClientRect();
    marker.remove();
    const prismOffsetX = restPoint.left - heroRect.left - prismRect.width - (heroRect.width - prismRect.width) / 2;
    const prismOffsetY = restPoint.top - heroRect.top - prismRect.height - (heroRect.height - prismRect.height) / 2;
    reveal.fromTo(prism, { x: 0, y: 0 }, {
      x: prismOffsetX,
      y: prismOffsetY,
      duration: 0.52,
      ease: "none",
    }, 0.04)
      .to(".hero__scroll-cue", { autoAlpha: 0, y: -18, duration: 0.12 }, 0)
      .fromTo(".hero__eyebrow", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.09)
      .fromTo(".hero h1", { autoAlpha: 0, y: 55, scale: 0.92, clipPath: "inset(0 0 28% 0)" }, { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0)", duration: 0.35 }, 0.18)
      .fromTo(".hero__aside, .hero__note", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.24 }, 0.44)
      .fromTo(".hero__bottom", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.58);

    gsap.utils.toArray("[data-reveal]", pageRef.current).forEach(element => {
      const isHeading = element.matches("h2, h3");
      gsap.fromTo(element, {
        autoAlpha: 0,
        y: isHeading ? 48 : 32,
        scale: isHeading ? 0.94 : 1,
        clipPath: isHeading ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        clipPath: "inset(0 0 0 0)",
        duration: 1,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 94%", end: "top 58%", scrub: 0.7 },
      });
    });
    gsap.utils.toArray("[data-reveal-scale]", pageRef.current).forEach(element => {
      gsap.fromTo(element, {
        autoAlpha: 0,
        y: 42,
        scale: 0.82,
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 96%", end: "top 62%", scrub: 0.8 },
      });
    });
  }, { scope: pageRef });
  const handlePointer = e => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", `${((e.clientX-r.left)/r.width)*100}%`);
    e.currentTarget.style.setProperty("--py", `${((e.clientY-r.top)/r.height)*100}%`);
    e.currentTarget.style.setProperty("--rx", `${((e.clientY-r.top)/r.height-.5)*-6}deg`);
    e.currentTarget.style.setProperty("--ry", `${((e.clientX-r.left)/r.width-.5)*7}deg`);
  };
  const handleLeave = e => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
  const closeMenu = () => setMenuOpen(false);
  return <div className="site-shell" ref={pageRef}>
    <a className="skip" href="#main">Skip to content</a>
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Danish Shirsangi home"><span className="brand__mark">d<span>.</span></span><span className="brand__name">DANISH SHIRSANGI</span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(v=>!v)} aria-label={menuOpen?"Close navigation":"Open navigation"}>{menuOpen?<X/>:<Menu/>}</button>
      <nav className={menuOpen?"nav nav--open":"nav"}><a href="#work" onClick={closeMenu}>WORK</a><a href="#services" onClick={closeMenu}>WHAT I DO</a><a href="#about" onClick={closeMenu}>OFF THE CLOCK</a><a className="nav__contact" href="#contact" onClick={closeMenu}>SAY HELLO <ArrowUpRight size={14}/></a></nav>
    </header>
    <main id="main">
      <section className="hero" id="home" onPointerMove={handlePointer} onPointerLeave={handleLeave}>
        <div className="hero__grain" aria-hidden="true"/><div className="hero__glow" aria-hidden="true"/>
        <div className="hero__scroll-cue"><span>SCROLL TO REVEAL</span><ArrowDown size={16}/></div>
        <div className="hero__eyebrow"><span className="live-dot"/> DESIGN · CODE · DATA</div>
        <h1>Ideas should<br/>feel <em>alive.</em></h1>
        <div className="hero__aside"><p>I’m Danish — I design, build, and make useful things across the web, Android, and data.</p><a href="#work" className="round-link" aria-label="Explore my work"><ArrowDown/></a></div>
        <div className="hero__flare-art" aria-hidden="true"><div className="flare-art__rings"><i/><i/><i/></div><div className="flare-art__beam flare-art__beam--horizontal"/><div className="flare-art__beam flare-art__beam--vertical"/><div className="flare-art__prism"><span className="flare-art__facet"/><span className="flare-art__spark">✳</span></div><span className="flare-art__shard flare-art__shard--one"/><span className="flare-art__shard flare-art__shard--two"/><span className="flare-art__label">A LITTLE LIGHT<br/>GOES A LONG WAY</span></div>
        <div className="hero__bottom"><span>DESIGN · BUILD · FIGURE IT OUT</span><a href="#work">KEEP EXPLORING <ArrowDown size={13}/></a><span>WEB · ANDROID · DATA</span></div>
        <div className="hero__note">AVAILABLE FOR<br/>SELECT PROJECTS <span>↗</span></div>
      </section>
      <div className="ticker" aria-label="What I make"><div className="ticker__track">{Array.from({length:4},(_,i)=><span key={i}>WEB DESIGN <i>✳</i> ANDROID APPS <i>✳</i> DATA STORIES <i>✳</i> SIDE PROJECTS <i>✳</i></span>)}</div></div>
      <section className="work section" id="work"><div className="section__top" data-reveal><span className="micro">01 / CURRENT OBSESSIONS</span><span className="micro">PERSONAL PROJECTS, IN PROGRESS</span></div><div className="work__intro"><h2 data-reveal>Things I’m<br/>putting <em>out there.</em></h2><p data-reveal>Small ideas, real problems, lots of learning along the way. Tap a project to see what it does.</p></div><div className="project-grid">{projects.map(p=><Project key={p.number} project={p}/>)}</div></section>
      <section className="services section" id="services"><div className="section__top" data-reveal><span className="micro">02 / OPEN TO FREELANCE</span><span className="micro">GOOD PEOPLE, GOOD PROBLEMS</span></div><div className="services__layout"><h2 data-reveal>Let’s make<br/>it <em>work.</em></h2><div className="services__right"><p className="services__lead" data-reveal>Have a thing you want to make clearer, more useful, or just more you? I can help take it from “what if” to working.</p><div className="service-list"><a data-reveal-scale href="mailto:danishshirsangi@gmail.com?subject=Web%20design"><span>01</span><h3>Web design</h3><span className="service__desc">Digital places with a point of view.</span><ArrowUpRight/></a><a data-reveal-scale href="mailto:danishshirsangi@gmail.com?subject=Android%20app%20development"><span>02</span><h3>Android apps</h3><span className="service__desc">Useful tools, built for real life.</span><ArrowUpRight/></a><a data-reveal-scale href="mailto:danishshirsangi@gmail.com?subject=Data%20analytics"><span>03</span><h3>Data analytics</h3><span className="service__desc">Find the story inside the numbers.</span><ArrowUpRight/></a></div></div></div></section>
      <section className="about section" id="about"><div className="section__top" data-reveal><span className="micro">03 / WHEN THE LAPTOP CLOSES</span><span className="micro">CURIOSITY IS THE COMMON THREAD</span></div><div className="about__layout"><h2 data-reveal>Always down<br/>a new <em>rabbit hole.</em></h2><div className="about__copy"><p data-reveal>Based in Bangalore and Belgaum, India. Usually somewhere between sketching an interface, figuring out an Android build, and asking “what does the data say?”</p><p data-reveal>Outside a project: collecting places for the next trip, vibe coding an idea that probably started at midnight, or fully locked into a game.</p><div className="hobbies" data-reveal-scale><span>TRAVELLING <b>↗</b></span><span>VIBE CODING <b>⌘</b></span><span>GAMING <b>✳</b></span><span>MUCH MORE <b>＋</b></span></div></div></div></section>
      <section className="contact" id="contact" onPointerMove={handlePointer} onPointerLeave={handleLeave}><div className="contact__top" data-reveal><span className="micro">04 / YOUR TURN</span><span className="micro">BANGALORE · BELGAUM, INDIA</span></div><div className="contact__main"><p data-reveal>GOT A GOOD ONE?</p><h2 data-reveal>Let’s make<br/><em>something.</em></h2><a data-reveal-scale className="contact__email" href="mailto:danishshirsangi@gmail.com">danishshirsangi@gmail.com <ArrowUpRight/></a></div><div className="contact__bottom"><div className="contact__details" data-reveal><a href="tel:+919611587292">+91 96115 87292</a><span><MapPin size={14}/> Bangalore & Belgaum, India</span></div><div className="contact__social" data-reveal-scale><a href="https://github.com/danishshirsangi" target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a><a href="https://www.linkedin.com/in/danish-shirsangi" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><a href="mailto:danishshirsangi@gmail.com" aria-label="Email"><Mail/></a></div></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#home"><span className="brand__mark">d<span>.</span></span><span className="brand__name">DANISH SHIRSANGI</span></a><span>MADE WITH CURIOSITY · BANGALORE + BELGAUM, INDIA</span><a href="#home">BACK TO TOP ↑</a></footer>
  </div>;
}
