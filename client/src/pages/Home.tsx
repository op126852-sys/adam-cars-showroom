import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Gauge,
  Globe2,
  Instagram,
  Menu,
  MoveRight,
  Play,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

type Car = {
  id: number;
  name: string;
  edition: string;
  price: string;
  specs: string;
  image: string;
  tone: string;
};

const cars: Car[] = [
  {
    id: 1,
    name: "Apex GT",
    edition: "V8 / 2026",
    price: "$142,800",
    specs: "620 hp · 3.1 sec 0–60",
    image:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1800&q=85",
    tone: "#c2ff3f",
  },
  {
    id: 2,
    name: "Nocturne S",
    edition: "AWD / 2026",
    price: "$98,400",
    specs: "480 hp · 3.8 sec 0–60",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=85",
    tone: "#e8e3db",
  },
  {
    id: 3,
    name: "Arc E",
    edition: "Dual motor / 2026",
    price: "$76,900",
    specs: "402 mi range · 3.6 sec 0–60",
    image:
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1800&q=85",
    tone: "#8eb5ff",
  },
  {
    id: 4,
    name: "Summit X",
    edition: "Terrain / 2026",
    price: "$89,600",
    specs: "510 hp · 7 seats",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1800&q=85",
    tone: "#ff9c72",
  },
];

const stats = [
  { value: "620", label: "horsepower", suffix: "HP" },
  { value: "3.1", label: "zero to sixty", suffix: "SEC" },
  { value: "402", label: "electric range", suffix: "MI" },
];

function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function moveSpotlight(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={moveSpotlight} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}

function AppMark() {
  return (
    <span className="app-mark" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export default function Home() {
  const [activeCar, setActiveCar] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<"test-drive" | "inventory" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-kicker, .hero-title-line, .hero-copy, .hero-actions, .hero-stats",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        ".hero-visual",
        { scale: 1.08, opacity: 0.3 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
      );
      gsap.to(".hero-visual img", {
        yPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      const track = galleryTrackRef.current;
      const gallery = galleryRef.current;
      if (track && gallery && window.innerWidth > 700) {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "top top",
            end: () => `+=${getDistance() + window.innerHeight * 0.85}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element: HTMLElement) => {
        gsap.fromTo(
          element,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
          },
        );
      });
    }, heroRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitTestDrive = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Request received — your concierge will be in touch.");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="Adam Cars home">
          <AppMark />
          <span>ADAM <em>CARS</em></span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => scrollTo("collection")}>Collection</button>
          <button onClick={() => scrollTo("philosophy")}>The Adam way</button>
          <button onClick={() => scrollTo("experience")}>Ownership</button>
        </nav>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Search" onClick={() => setModal("inventory")}><Search size={17} /></button>
          <button className="outline-button small" onClick={() => setModal("test-drive")}>Book a drive <ArrowUpRight size={14} /></button>
          <button className="mobile-menu" onClick={() => setMobileOpen((open) => !open)} aria-label="Open menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav">
          <button onClick={() => scrollTo("collection")}>Collection <ArrowRight size={16} /></button>
          <button onClick={() => scrollTo("philosophy")}>The Adam way <ArrowRight size={16} /></button>
          <button onClick={() => scrollTo("experience")}>Ownership <ArrowRight size={16} /></button>
          <button onClick={() => setModal("test-drive")}>Book a private drive <ArrowRight size={16} /></button>
        </div>
      )}

      <main id="top">
        <section ref={heroRef} className="hero-section">
          <div className="hero-grain" />
          <div className="hero-content container-wide">
            <div className="hero-copy-block">
              <div className="eyebrow hero-kicker"><span className="eyebrow-line" /> EST. 2008 · CURATED PERFORMANCE</div>
              <h1 className="hero-title">
                <span className="hero-title-line">Arrive</span>
                <span className="hero-title-line italic">different.</span>
              </h1>
              <p className="hero-copy">A considered collection of rare performance, grand touring, and electric vehicles — selected for the way they make you feel.</p>
              <div className="hero-actions">
                <button className="lime-button" onClick={() => scrollTo("collection")}>Explore the collection <ArrowDownRight size={17} /></button>
                <button className="text-button" onClick={() => setModal("test-drive")}><span className="play-icon"><Play size={11} fill="currentColor" /></span> Watch the Adam film</button>
              </div>
            </div>
            <div className="hero-visual-wrap">
              <div className="hero-visual">
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=90" alt="Silver performance car on an open road" />
                <div className="hero-image-shade" />
                <div className="hero-visual-caption"><span>01</span><span>THE OPEN ROAD, RECONSIDERED</span></div>
              </div>
              <div className="floating-spec-card">
                <div className="spec-ring"><Gauge size={17} /><span>GT</span></div>
                <div><strong>Apex GT</strong><small>620 HP · 3.1 sec</small></div>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
          <div className="hero-footer container-wide">
            <div className="hero-stats">
              {stats.map((stat) => <div className="hero-stat" key={stat.label}><strong>{stat.value}<sup>{stat.suffix}</sup></strong><span>{stat.label}</span></div>)}
            </div>
            <button className="scroll-cue" onClick={() => scrollTo("collection")}><span>SCROLL TO DISCOVER</span><ChevronDown size={17} /></button>
            <div className="hero-location"><Globe2 size={14} /><span>New York · London · Dubai</span></div>
          </div>
        </section>

        <section id="collection" className="collection-intro section-pad container-wide">
          <div className="section-index">01 <span>/</span> 04</div>
          <div className="collection-heading reveal-up"><p className="eyebrow">THE COLLECTION</p><h2>Not for everyone.<br /><span>For someone.</span></h2></div>
          <div className="collection-intro-bottom reveal-up"><p>From hand-built icons to the next generation of electric performance, every vehicle in our collection earns its place.</p><button className="circle-link" onClick={() => setModal("inventory")} aria-label="View all vehicles"><ArrowUpRight size={21} /></button></div>
        </section>

        <section ref={galleryRef} className="gallery-section" aria-label="Featured vehicles">
          <div ref={galleryTrackRef} className="gallery-track">
            <article className="gallery-lead-panel">
              <span className="eyebrow">01 — FEATURED NOW</span>
              <h3>Make your<br /><i>own rules.</i></h3>
              <p>A collection of vehicles with the presence to change the room — and the performance to change your plans.</p>
              <button className="line-button" onClick={() => setModal("inventory")}>View all vehicles <MoveRight size={16} /></button>
            </article>
            {cars.map((car, index) => (
              <button key={car.id} className={`vehicle-card ${activeCar === index ? "is-active" : ""}`} onClick={() => setActiveCar(index)} style={{ "--card-tone": car.tone } as CSSProperties}>
                <div className="vehicle-image"><img src={car.image} alt={car.name} /><span className="vehicle-index">0{index + 1}</span><span className="vehicle-arrow"><ArrowUpRight size={18} /></span></div>
                <div className="vehicle-info"><div><span className="eyebrow">{car.edition}</span><h4>{car.name}</h4></div><div className="vehicle-price"><span>{car.price}</span><small>{car.specs}</small></div></div>
              </button>
            ))}
            <div className="gallery-end-panel"><Sparkles size={22} /><h3>Find the<br /><i>one.</i></h3><button className="lime-button small" onClick={() => setModal("inventory")}>Open the finder <ArrowRight size={15} /></button></div>
          </div>
          <div className="gallery-progress"><span>DRAG / SCROLL</span><div><i style={{ width: `${25 + activeCar * 15}%` }} /></div><span>04</span></div>
        </section>

        <section id="philosophy" className="philosophy-section section-pad container-wide">
          <div className="section-index">02 <span>/</span> 04</div>
          <div className="philosophy-grid">
            <div className="philosophy-copy reveal-up"><p className="eyebrow">THE ADAM WAY</p><h2>Selection is<br /><span>an art form.</span></h2><p className="body-copy">We do not believe in rows of options. We believe in a point of view. Every Adam car is sourced, inspected, and presented with a level of intention that makes the decision feel effortless.</p><button className="text-button underline" onClick={() => setModal("inventory")}>Our sourcing standards <ArrowUpRight size={15} /></button></div>
            <SpotlightCard className="philosophy-card reveal-up"><div className="philosophy-card-top"><span>ADAM / 2008—2026</span><span>01</span></div><div className="orbit-mark"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-dot" /></div><p>Move with<br /><i>intent.</i></p><div className="philosophy-card-bottom"><span>THE FEELING<br />BEFORE THE FIGURES.</span><ArrowUpRight size={18} /></div></SpotlightCard>
          </div>
        </section>

        <section id="experience" className="experience-section">
          <div className="experience-image"><img src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=2200&q=85" alt="Driving along a coastal road at sunset" /><div className="experience-overlay" /></div>
          <div className="experience-content container-wide"><div className="section-index light">03 <span>/</span> 04</div><div className="experience-copy reveal-up"><p className="eyebrow">OWNERSHIP, ELEVATED</p><h2>The drive<br /><i>starts here.</i></h2><p>Private viewings. Unhurried test drives. Concierge delivery to wherever the road begins.</p><button className="lime-button" onClick={() => setModal("test-drive")}>Book a private drive <CalendarDays size={16} /></button></div><div className="experience-note"><span>01</span><p>“The best car is not the fastest one. It is the one you cannot stop thinking about.”</p><small>— Adam, founder</small></div></div>
        </section>

        <section className="services-section section-pad container-wide">
          <div className="section-index">04 <span>/</span> 04</div><div className="services-heading reveal-up"><p className="eyebrow">AFTER THE SALE</p><h2>Keep the<br /><span>feeling.</span></h2></div>
          <div className="services-list reveal-up">
            {[{ n: "01", title: "Concierge delivery", copy: "Your car, hand-delivered. Anywhere in the world." }, { n: "02", title: "Adam atelier", copy: "Specialist care for the cars that deserve more." }, { n: "03", title: "The road book", copy: "Routes, stays, and experiences worth driving to." }].map((item) => <button className="service-row" key={item.n} onClick={() => toast.success(`${item.title} — our concierge team can help.`)}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><ArrowUpRight size={18} /></button>)}
          </div>
        </section>

        <section className="newsletter-section"><div className="container-wide newsletter-inner"><div><p className="eyebrow">THE ADAM EDIT</p><h2>Take the long way.</h2><p>New arrivals, road stories, and the occasional reason to leave early.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); toast.success("You're on the list. Welcome to the Adam Edit."); }}><label htmlFor="email">Email address</label><div><input id="email" type="email" required placeholder="you@example.com" /><button type="submit" aria-label="Subscribe"><ArrowUpRight size={20} /></button></div><small>By subscribing, you agree to receive the Adam Edit.</small></form></div></section>

        <footer className="footer"><div className="container-wide footer-top"><button className="brand" onClick={() => scrollTo("top")}><AppMark /><span>ADAM <em>CARS</em></span></button><div className="footer-links"><div><span>Explore</span><button onClick={() => scrollTo("collection")}>Collection</button><button onClick={() => setModal("inventory")}>Vehicle finder</button><button onClick={() => setModal("test-drive")}>Book a drive</button></div><div><span>Visit</span><button onClick={() => toast("Showroom visits are by appointment.")}>New York</button><button onClick={() => toast("Showroom visits are by appointment.")}>London</button><button onClick={() => toast("Showroom visits are by appointment.")}>Dubai</button></div><div><span>Follow</span><button onClick={() => toast("Instagram opening soon.")}>Instagram <Instagram size={14} /></button><button onClick={() => toast("Journal opening soon.")}>Journal <ArrowUpRight size={14} /></button></div></div></div><div className="container-wide footer-bottom"><span>© 2026 ADAM CARS</span><span>PERFORMANCE, CURATED.</span><span>Privacy / Terms</span></div></footer>
      </main>

      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button>{modal === "test-drive" ? <>{!submitted ? <><p className="eyebrow">PRIVATE APPOINTMENT</p><h2>Meet your<br /><i>next car.</i></h2><p className="modal-copy">Tell us what has caught your eye. A member of the Adam concierge team will reply within one business day.</p><form className="drive-form" onSubmit={submitTestDrive}><input required placeholder="Your name" /><input required type="email" placeholder="Email address" /><select defaultValue=""><option value="" disabled>Choose a vehicle</option>{cars.map((car) => <option key={car.id}>{car.name}</option>)}</select><button className="lime-button" type="submit">Request a private drive <ArrowRight size={16} /></button></form></> : <div className="success-state"><div className="success-mark"><Zap size={20} /></div><p className="eyebrow">YOU'RE ON THE LIST</p><h2>We’ll make<br /><i>it memorable.</i></h2><p className="modal-copy">Thanks for reaching out. Keep an eye on your inbox — your Adam concierge is already on it.</p><button className="outline-button" onClick={() => { setModal(null); setSubmitted(false); }}>Back to the collection <ArrowRight size={15} /></button></div>}</> : <><p className="eyebrow">VEHICLE FINDER</p><h2>What moves<br /><i>you?</i></h2><p className="modal-copy">Start with a feeling. Our full collection is available by appointment at the Adam showroom.</p><div className="finder-options">{["Performance", "Grand touring", "Electric", "Adventure"].map((label) => <button key={label} onClick={() => { setModal(null); toast.success(`${label} collection selected.`); scrollTo("collection"); }}>{label}<ArrowUpRight size={16} /></button>)}</div><button className="line-button modal-line" onClick={() => { setModal(null); scrollTo("collection"); }}>Browse the featured collection <MoveRight size={16} /></button></>}</div></div>}
    </div>
  );
}
