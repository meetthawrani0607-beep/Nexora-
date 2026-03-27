'use client';
import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ScrollReveal, { StaggerContainer, StaggerChild } from './components/ScrollReveal';

const Hero3D = dynamic(() => import('./components/Hero3D'), { ssr: false });

const WHATSAPP_NUMBER = '916387227658';
const TARGET_EMAIL = 'punittripathi025@gmail.com'; // Form submissions will be sent silently to this inbox

// ─── Particle Background ───────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let mouseX = 0, mouseY = 0;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(37,99,235,', 'rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(255,255,255,'];

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = this.x - mouseX, dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 0.8;
          this.y += (dy / dist) * force * 0.8;
        }
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color + this.opacity + ')';
        ctx!.fill();
      }
    }

    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="particles-canvas" />;
}

// ─── Navbar ───────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-[#1E293B]' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src="/nexora-logo.png" alt="Nexora" className="h-10 w-auto object-contain" />
          <span className="text-white font-black text-3xl tracking-tight">Nexora</span>
        </a>

        <div className={`nav-links ${mobileOpen ? 'active' : ''} hidden md:flex items-center gap-8`}>
          {[
            { href: '#services', icon: 'fa-cube', label: 'Services' },
            { href: '#why', icon: 'fa-bolt', label: 'Why Us' },
            { href: '#portfolio', icon: 'fa-briefcase', label: 'Portfolio' },
            { href: '#testimonials', icon: 'fa-quote-right', label: 'Testimonials' },
          ].map(item => (
            <a key={item.href} href={item.href} className="text-[#94A3B8] hover:text-white transition-colors text-sm font-medium">
              <i className={`fas ${item.icon} mr-1.5 text-xs`}></i>{item.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary !py-2.5 !px-6 !text-sm !rounded-lg">
            Contact Us <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation"
        >
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0F19]/95 backdrop-blur-xl border-t border-[#1E293B] p-6 flex flex-col gap-4">
          {['Services', 'Why Us', 'Portfolio', 'Testimonials', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileOpen(false)}
              className="text-[#94A3B8] hover:text-white transition-colors py-2">{item}</a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-primary text-center">Contact Us</a>
        </div>
      )}
    </nav>
  );
}

// ─── Stats Counter ───────────────────────
function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{count}{suffix}</div>
      <div className="text-[#64748B] text-sm">{label}</div>
    </div>
  );
}

// ─── Floating WhatsApp Button ───────────────────────
function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Nexora! I\'m interested in your services. Let\'s discuss a project.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
}

// ─── Projects Data ───────────────────────
const projects = [
  {
    id: 'lumina',
    title: 'Lumina Analytics',
    subtitle: 'AI-Powered SaaS Dashboard',
    tag: 'Web App',
    gradient: 'from-[#2563EB] to-[#06B6D4]',
    color: '#2563EB',
    client: 'Lumina Corp',
    duration: '14 Weeks',
    year: '2025',
    overview: 'Lumina Corp needed a real-time analytics platform to help enterprise clients visualize complex data sets. We built a full-stack SaaS dashboard with AI-driven insights, interactive charts, and role-based access control.',
    challenge: 'The existing system was slow, outdated, and couldn\'t handle more than 10,000 concurrent users. Data visualization was static and non-interactive.',
    solution: 'We rebuilt the entire platform from scratch using Next.js, WebSocket for real-time updates, and integrated machine learning models for predictive analytics.',
    approach: [
      { phase: 'Discovery & Research', desc: 'Stakeholder interviews, user research, competitive analysis, and technical audit of the legacy system.', duration: '2 Weeks' },
      { phase: 'UX/UI Design', desc: 'Wireframes, interactive prototypes, design system creation, and usability testing with real users.', duration: '3 Weeks' },
      { phase: 'Frontend Development', desc: 'Component-driven architecture with Next.js, real-time charts with D3.js, and responsive layouts.', duration: '4 Weeks' },
      { phase: 'Backend & AI Integration', desc: 'REST + WebSocket APIs, PostgreSQL database, ML model integration for predictive insights.', duration: '3 Weeks' },
      { phase: 'Testing & Launch', desc: 'Load testing, security audit, CI/CD pipeline setup, and phased rollout to 50K+ users.', duration: '2 Weeks' },
    ],
    techStack: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Python', 'TensorFlow', 'AWS', 'Docker'],
    results: [
      { metric: '340%', label: 'Increase in Conversions' },
      { metric: '50K+', label: 'Daily Active Users' },
      { metric: '2.1s', label: 'Avg Load Time' },
      { metric: '99.9%', label: 'Uptime Achieved' },
    ],
    pricing: { tier: 'Premium', range: '₹3,00,000 – ₹5,00,000', includes: ['Full-Stack Web App', 'AI/ML Integration', 'Real-Time Dashboard', 'Cloud Deployment', 'Ongoing Maintenance'] },
  },
  {
    id: 'novabank',
    title: 'NovaBank',
    subtitle: 'Next-Gen Mobile Banking',
    tag: 'Mobile App',
    gradient: 'from-[#7C3AED] to-[#EC4899]',
    color: '#7C3AED',
    client: 'NovaBank',
    duration: '20 Weeks',
    year: '2025',
    overview: 'NovaBank wanted to launch a modern mobile banking app targeting millennials and Gen Z. We designed and developed a sleek, secure app with biometric authentication, instant transfers, and spending analytics.',
    challenge: 'Legacy banking apps were complex and unintuitive. NovaBank needed to stand out with a consumer-grade UX while maintaining bank-level security compliance.',
    solution: 'We created a React Native cross-platform app with biometric login, real-time notifications, AI-powered budgeting tools, and seamless UPI integration.',
    approach: [
      { phase: 'Market Research', desc: 'Analysis of 15+ banking apps, user persona development, and feature prioritization workshops.', duration: '2 Weeks' },
      { phase: 'UX Design & Prototyping', desc: 'User flow mapping, wireframes, high-fidelity mockups, and interactive prototype with Figma.', duration: '4 Weeks' },
      { phase: 'App Development', desc: 'React Native cross-platform development, biometric auth, real-time transaction processing.', duration: '8 Weeks' },
      { phase: 'Security & Compliance', desc: 'PCI DSS compliance, end-to-end encryption, penetration testing, and RBI regulatory review.', duration: '3 Weeks' },
      { phase: 'Beta Launch & Iteration', desc: 'Closed beta with 5K users, feedback collection, performance optimization, and public launch.', duration: '3 Weeks' },
    ],
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Razorpay', 'AWS Lambda', 'Figma'],
    results: [
      { metric: '100K+', label: 'Downloads in 3 Months' },
      { metric: '4.8★', label: 'App Store Rating' },
      { metric: '45%', label: 'Reduction in Support Tickets' },
      { metric: '12s', label: 'Avg Session Duration' },
    ],
    pricing: { tier: 'Premium', range: '₹4,00,000 – ₹6,00,000', includes: ['Cross-Platform Mobile App', 'Biometric Auth', 'Payment Integration', 'Analytics Dashboard', 'Security Audit'] },
  },
  {
    id: 'synthai',
    title: 'SynthAI',
    subtitle: 'AI Startup Brand & Website',
    tag: 'Branding',
    gradient: 'from-[#06B6D4] to-[#10B981]',
    color: '#06B6D4',
    client: 'SynthAI',
    duration: '8 Weeks',
    year: '2026',
    overview: 'SynthAI, an emerging AI startup, needed a complete brand identity and a high-converting landing page to attract investors and early adopters. We delivered a futuristic brand system and a website that converts.',
    challenge: 'As a new startup with no brand presence, SynthAI needed to establish credibility quickly in a crowded AI market and attract Series A funding.',
    solution: 'We developed a complete brand identity (logo, color system, typography, guidelines) and a conversion-optimized website with interactive demos and investor-ready content.',
    approach: [
      { phase: 'Brand Strategy', desc: 'Brand positioning workshop, competitor analysis, vision & mission refinement, and tone of voice definition.', duration: '1 Week' },
      { phase: 'Visual Identity', desc: 'Logo design (50+ concepts), color palette, typography selection, iconography, and brand guidelines document.', duration: '2 Weeks' },
      { phase: 'Website Design', desc: 'Landing page wireframes, hero section ideation, social proof strategy, and CTA optimization.', duration: '2 Weeks' },
      { phase: 'Development & Launch', desc: 'Next.js website development, animations with Framer Motion, SEO optimization, and launch.', duration: '3 Weeks' },
    ],
    techStack: ['Next.js', 'Framer Motion', 'Figma', 'Adobe Illustrator', 'Vercel', 'Google Analytics'],
    results: [
      { metric: '200%', label: 'Increase in Investor Leads' },
      { metric: '15K', label: 'Waitlist Sign-ups' },
      { metric: '3.2s', label: 'Avg Time on Page' },
      { metric: '$2M', label: 'Series A Raised' },
    ],
    pricing: { tier: 'Growth', range: '₹75,000 – ₹1,50,000', includes: ['Brand Identity Design', 'Logo & Guidelines', 'Landing Page', 'SEO Optimization', '5 Revision Rounds'] },
  },
  {
    id: 'elara',
    title: 'Élara Commerce',
    subtitle: 'Luxury E-Commerce Platform',
    tag: 'E-Commerce',
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    color: '#F59E0B',
    client: 'Élara',
    duration: '16 Weeks',
    year: '2025',
    overview: 'Élara, a luxury fashion brand, wanted an e-commerce platform that matched the elegance of their products. We built a bespoke shopping experience with AI-powered recommendations, AR try-on, and seamless checkout.',
    challenge: 'Off-the-shelf e-commerce solutions felt generic and couldn\'t convey the luxury brand experience Élara demanded. Cart abandonment was at 78%.',
    solution: 'We custom-built a headless e-commerce platform with Shopify backend, Next.js storefront, AI product recommendations, and an AR try-on feature.',
    approach: [
      { phase: 'Brand Immersion', desc: 'Deep dive into Élara\'s brand values, customer profiles, and competitive luxury e-commerce landscape.', duration: '1 Week' },
      { phase: 'UX Research & Design', desc: 'Customer journey mapping, checkout flow optimization, product page A/B testing strategies.', duration: '3 Weeks' },
      { phase: 'Storefront Development', desc: 'Headless Shopify + Next.js, product pages, cart system, and payment integration (Stripe + UPI).', duration: '6 Weeks' },
      { phase: 'AI & AR Features', desc: 'Product recommendation engine, AR try-on using Three.js, and personalized homepage.', duration: '4 Weeks' },
      { phase: 'Launch & Optimization', desc: 'Performance optimization, A/B tests, analytics setup, and conversion rate optimization.', duration: '2 Weeks' },
    ],
    techStack: ['Next.js', 'Shopify Headless', 'Three.js', 'Stripe', 'Algolia', 'Cloudflare', 'Vercel'],
    results: [
      { metric: '150%', label: 'Revenue Increase' },
      { metric: '38%', label: 'Reduction in Cart Abandonment' },
      { metric: '4.2x', label: 'Higher Avg Order Value' },
      { metric: '60%', label: 'Increase in Repeat Purchases' },
    ],
    pricing: { tier: 'Premium', range: '₹2,50,000 – ₹4,50,000', includes: ['Custom E-Commerce Platform', 'AI Recommendations', 'AR Try-On Feature', 'Payment Integration', 'Analytics & CRO'] },
  },
];

// ─── Project Detail Modal ───────────────────────
function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const tabs = [
    { id: 'overview', icon: 'fa-file-alt', label: 'Overview' },
    { id: 'approach', icon: 'fa-project-diagram', label: 'Approach' },
    { id: 'results', icon: 'fa-chart-line', label: 'Results' },
    { id: 'pricing', icon: 'fa-tag', label: 'Pricing' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0B0F19]/85 backdrop-blur-md"></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F1320] border border-[#1E293B] shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: `0 0 80px ${project.color}15` }}
      >
        {/* Header */}
        <div className={`relative p-8 pb-6 border-b border-[#1E293B] overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.06]`}></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-white/70 mb-3">{project.tag}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h2>
                <p className="text-[#94A3B8] mt-1">{project.subtitle}</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl bg-[#131825] border border-[#1E293B] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[#EF4444] transition-all cursor-pointer shrink-0">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2 text-[#94A3B8]"><i className="fas fa-building text-xs" style={{ color: project.color }}></i>{project.client}</span>
              <span className="flex items-center gap-2 text-[#94A3B8]"><i className="fas fa-clock text-xs" style={{ color: project.color }}></i>{project.duration}</span>
              <span className="flex items-center gap-2 text-[#94A3B8]"><i className="fas fa-calendar text-xs" style={{ color: project.color }}></i>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1E293B] px-8 gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px cursor-pointer
                ${activeTab === tab.id
                  ? 'text-white border-current'
                  : 'text-[#64748B] border-transparent hover:text-[#94A3B8]'}`}
              style={activeTab === tab.id ? { color: project.color } : {}}
            >
              <i className={`fas ${tab.icon} text-xs`}></i>{tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><i className="fas fa-lightbulb text-sm" style={{ color: project.color }}></i>Project Overview</h3>
                <p className="text-[#94A3B8] leading-relaxed">{project.overview}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><i className="fas fa-exclamation-triangle text-[#F59E0B] text-sm"></i>The Challenge</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{project.challenge}</p>
                </div>
                <div className="glass-card p-6">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><i className="fas fa-check-circle text-[#10B981] text-sm"></i>Our Solution</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{project.solution}</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-[#131825] border border-[#1E293B] text-[#94A3B8] text-xs font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Approach Tab */}
          {activeTab === 'approach' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><i className="fas fa-route text-sm" style={{ color: project.color }}></i>Our Approach & Plan</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#1E293B] to-transparent hidden md:block"></div>
                <div className="space-y-6">
                  {project.approach.map((phase, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold relative z-10 transition-all"
                        style={{ backgroundColor: project.color + '20', color: project.color }}>
                        {i + 1}
                      </div>
                      <div className="glass-card p-5 flex-1 group-hover:border-opacity-40 transition-all" style={{ borderColor: project.color + '20' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{phase.phase}</h4>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#131825] text-[#64748B] border border-[#1E293B]">{phase.duration}</span>
                        </div>
                        <p className="text-[#94A3B8] text-sm leading-relaxed">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><i className="fas fa-trophy text-sm" style={{ color: project.color }}></i>Key Results & Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {project.results.map((r, i) => (
                  <div key={i} className="glass-card p-6 text-center group hover:-translate-y-1 transition-all">
                    <p className="text-3xl font-black mb-2" style={{ color: project.color }}>{r.metric}</p>
                    <p className="text-[#64748B] text-xs">{r.label}</p>
                  </div>
                ))}
              </div>
              <div className="glass-card p-6">
                <h4 className="text-white font-semibold mb-3">Project Impact</h4>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  This project demonstrated how thoughtful design combined with cutting-edge technology can deliver measurable business outcomes. 
                  The {project.client} team continues to see compounding returns on their investment, with the platform serving as a foundation for future growth.
                </p>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><i className="fas fa-tag text-sm" style={{ color: project.color }}></i>Project Pricing</h3>
              <div className="glass-card p-8 text-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.04]`}></div>
                <div className="relative">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: project.color + '20', color: project.color }}>{project.pricing.tier} Tier</span>
                  <p className="text-4xl font-black text-white mb-2">{project.pricing.range}</p>
                  <p className="text-[#64748B] text-sm mb-8">Estimated investment for a similar project</p>
                  <div className="max-w-sm mx-auto text-left space-y-3 mb-8">
                    {project.pricing.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-[#94A3B8] text-sm">
                        <i className="fas fa-check text-[#10B981] text-xs shrink-0"></i>{item}
                      </div>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/916387227658?text=${encodeURIComponent(`Hi Nexora! I'm interested in a project similar to "${project.title}". Let's discuss!`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#20BD5A] hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>Discuss This Project
                  </a>
                </div>
              </div>
              <p className="text-center text-[#64748B] text-xs mt-4">
                <i className="fas fa-info-circle mr-1"></i>Final pricing depends on project scope, features, and timeline. Contact us for a custom quote.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-[#131825] border border-[#1E293B]">
            <div>
              <p className="text-white font-semibold text-sm">Want something similar?</p>
              <p className="text-[#64748B] text-xs">Let's discuss your project requirements</p>
            </div>
            <a href="#contact" onClick={onClose} className="btn-primary !py-2.5 !px-6 !text-sm shrink-0">
              Contact Us <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────
export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', projectType: '', message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    // Build WhatsApp message
    const whatsappMessage = `🚀 *New Project Inquiry — Nexora*\n\n👤 *Name:* ${formData.name}\n📧 *Email:* ${formData.email}\n📱 *Phone:* ${formData.phone || 'Not provided'}\n📂 *Project Type:* ${formData.projectType}\n\n💬 *Message:*\n${formData.message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    // Send email silently via FormSubmit.co
    fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `New Lead: ${formData.projectType} from ${formData.name}`,
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone || "Not provided",
        "Project Type": formData.projectType,
        Message: formData.message
      })
    }).catch(err => console.error("Email delivery failed", err));

    // Show success briefly, then redirect
    setFormStatus('success');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
      setFormStatus('idle');
    }, 1500);
  };

  const services = [
    { icon: 'fa-laptop-code', title: 'Web Development', desc: 'High-performance, scalable web applications built with modern technology stacks.' },
    { icon: 'fa-pen-ruler', title: 'UI/UX Design', desc: 'Intuitive, research-driven interfaces that delight users and convert visitors.' },
    { icon: 'fa-layer-group', title: 'Branding', desc: 'Cohesive brand identities that resonate with audiences and stand the test of time.' },
    { icon: 'fa-bullhorn', title: 'Digital Marketing', desc: 'Data-driven strategies that maximize reach, engagement, and ROI at every stage.' },
    { icon: 'fa-robot', title: 'AI Solutions', desc: 'Intelligent automation and AI-powered tools that future-proof your business.' },
    { icon: 'fa-mobile-alt', title: 'Mobile Apps', desc: 'Native and cross-platform mobile experiences that users love and come back to.' },
  ];

  const whyUs = [
    { icon: 'fa-bolt', title: 'Lightning Fast Execution', desc: 'Agile sprints, rapid prototyping, and on-time delivery.' },
    { icon: 'fa-crosshairs', title: 'Conversion-Focused Design', desc: 'Every pixel optimized to turn visitors into customers.' },
    { icon: 'fa-rocket', title: 'Future-Ready Tech', desc: 'Cutting-edge frameworks, AI, and cloud-native architecture.' },
    { icon: 'fa-gem', title: 'Premium Support', desc: 'Dedicated account managers and 24/7 monitoring.' },
  ];

  const testimonials = [
    { name: 'Arjun Kapoor', role: 'CEO, TechVista Inc.', text: '"Nexora completely transformed our digital presence. The new platform increased our conversions by 340% in just three months."', initials: 'AK' },
    { name: 'Sarah Mitchell', role: 'Founder, Bloom Health', text: '"Working with Nexora felt like having an in-house team of superstars. They nailed our brand identity."', initials: 'SM' },
    { name: 'Raj Patel', role: 'CTO, DataForge Labs', text: '"From strategy to execution, Nexora delivered beyond expectations. Our AI-powered dashboard is now our competitive edge."', initials: 'RP' },
    { name: 'Lisa Chen', role: 'VP Design, Orbit Studio', text: '"The attention to detail is unmatched. Beautiful, functional, and scalable design system."', initials: 'LC' },
    { name: 'Marcus King', role: 'Co-Founder, Apex Ventures', text: '"Nexora didn\'t just build us a website — they built us a growth engine. Revenue is up 200%."', initials: 'MK' },
    { name: 'Elena Novak', role: 'Director, Pulse Media', text: '"Professional, innovative, and relentless. Launched in record time with a premium product."', initials: 'EN' },
  ];

  return (
    <main className="relative overflow-hidden">
      <ParticleCanvas />

      <Navbar />

      <WhatsAppFloat />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden" id="hero">
        {/* 3D Background */}
        <Hero3D />

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2563EB] rounded-full opacity-[0.07] blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#7C3AED] rounded-full opacity-[0.07] blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#06B6D4] rounded-full opacity-[0.05] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131825]/60 backdrop-blur-xl border border-[#1E293B] text-sm text-[#94A3B8] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            Now accepting new projects for 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tight"
          >
            Build Beyond<br /><span className="text-gradient">Tomorrow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We craft powerful digital experiences that elevate brands into the future — blending design, technology, and strategy into one seamless force.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#contact" className="btn-primary text-lg px-10 py-4">
              <span>Contact Us</span> <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#portfolio" className="btn-secondary text-lg px-10 py-4">
              <i className="fas fa-play text-sm"></i> View Work
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 py-16 border-y border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter target={200} suffix="+" label="Projects Delivered" />
          <StatCounter target={50} suffix="+" label="Happy Clients" />
          <StatCounter target={98} suffix="%" label="Client Satisfaction" />
          <StatCounter target={5} suffix="+" label="Years Experience" />
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative z-10 py-24 px-6" id="services">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Our <span className="text-gradient">Services</span></h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">End-to-end digital solutions engineered for scale, performance, and unforgettable experiences.</p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <StaggerChild key={i}>
                <div className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB20] to-[#7C3AED20] flex items-center justify-center mb-6 group-hover:from-[#2563EB40] group-hover:to-[#7C3AED40] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all">
                    <i className={`fas ${s.icon} text-2xl text-gradient`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{s.desc}</p>
                </div>
              </StaggerChild>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="relative z-10 py-24 px-6" id="why">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#7C3AED] rounded-full opacity-[0.04] blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#7C3AED] text-sm font-semibold tracking-widest uppercase">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Why <span className="text-gradient">Nexora</span>?</h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">We don't just build products — we engineer competitive advantages.</p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyUs.map((w, i) => (
              <div key={i} className="glass-card p-8 flex gap-6 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#7C3AED20] to-[#06B6D420] flex items-center justify-center group-hover:from-[#7C3AED40] group-hover:to-[#06B6D440] transition-all">
                  <i className={`fas ${w.icon} text-2xl text-[#7C3AED]`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{w.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section className="relative z-10 py-24 px-6" id="portfolio">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Featured <span className="text-gradient">Projects</span></h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">Click on any project to explore the full case study, approach, and pricing.</p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer" onClick={() => setSelectedProject(p)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-20 group-hover:opacity-35 transition-all duration-500`}></div>
                <div className="absolute inset-0 bg-[#0B0F19]/60 group-hover:bg-[#0B0F19]/40 transition-all duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-white/70 mb-4">{p.tag}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-[#94A3B8] mb-4">{p.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ color: p.color }}>
                    View Case Study <i className="fas fa-arrow-right text-xs"></i>
                  </span>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative z-10 py-24 px-6" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#7C3AED] text-sm font-semibold tracking-widest uppercase">Client Love</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">What Our <span className="text-gradient">Clients Say</span></h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-8">
                <div className="flex text-[#FBBF24] gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star text-sm"></i>)}
                </div>
                <p className="text-[#94A3B8] mb-6 leading-relaxed italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold">{t.initials}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-[#64748B] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CONTACT US SECTION ===== */}
      <section className="relative z-10 py-24 px-6" id="contact">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#2563EB] rounded-full opacity-[0.04] blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7C3AED] rounded-full opacity-[0.04] blur-[120px]"></div>
        </div>
        <div className="max-w-5xl mx-auto relative">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[#25D366] text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Contact <span className="text-gradient">Us</span></h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">Fill out the form and we'll connect with you on WhatsApp instantly.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#25D36620] flex items-center justify-center">
                  <i className="fab fa-whatsapp text-[#25D366] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                  <p className="text-[#94A3B8] text-sm">+91 63872 27658</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-sm font-medium hover:underline mt-1 inline-block">
                    Chat Now →
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#2563EB20] flex items-center justify-center">
                  <i className="fas fa-envelope text-[#2563EB] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-[#94A3B8] text-sm">hello@nexora.agency</p>
                </div>
              </div>

              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#7C3AED20] flex items-center justify-center">
                  <i className="fas fa-clock text-[#7C3AED] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Response Time</h4>
                  <p className="text-[#94A3B8] text-sm">Usually within 1 hour</p>
                </div>
              </div>

              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#06B6D420] flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-[#06B6D4] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Location</h4>
                  <p className="text-[#94A3B8] text-sm">India (Serving Globally)</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="glass-card p-8 md:p-10">
                {formStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-[#25D36620] flex items-center justify-center mx-auto mb-6 animate-pulse-glow" style={{ boxShadow: '0 0 40px rgba(37, 211, 102, 0.2)' }}>
                      <i className="fab fa-whatsapp text-[#25D366] text-4xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Redirecting to WhatsApp!</h3>
                    <p className="text-[#94A3B8]">Opening WhatsApp with your project details...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-[#94A3B8] mb-2">Full Name *</label>
                        <input type="text" required className="input-field" placeholder="John Doe"
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-[#94A3B8] mb-2">Email *</label>
                        <input type="email" required className="input-field" placeholder="john@example.com"
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-[#94A3B8] mb-2">Phone</label>
                        <input type="tel" className="input-field" placeholder="+91 98765 43210"
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-[#94A3B8] mb-2">Project Type *</label>
                        <select required className="input-field"
                          value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
                          <option value="">Select type</option>
                          <option>Web Development</option>
                          <option>UI/UX Design</option>
                          <option>Branding</option>
                          <option>Digital Marketing</option>
                          <option>AI Solutions</option>
                          <option>Mobile App</option>
                          <option>E-Commerce</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#94A3B8] mb-2">Tell us about your project *</label>
                      <textarea required rows={4} className="input-field resize-none" placeholder="Describe your project requirements, timeline, and budget..."
                        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>

                    <button type="submit" disabled={formStatus === 'loading'}
                      className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      {formStatus === 'loading' ? (
                        <><i className="fas fa-spinner fa-spin"></i>Sending...</>
                      ) : (
                        <><i className="fab fa-whatsapp text-xl"></i>Send via WhatsApp</>
                      )}
                    </button>

                    <p className="text-center text-[#64748B] text-xs mt-3">
                      <i className="fas fa-shield-alt mr-1"></i>Your information is secure and never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB08] to-[#7C3AED08]"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
              <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">Let's discuss your project over a quick WhatsApp chat. We respond within the hour.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Nexora! I\'d like to discuss a project.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-lg bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all">
                  <i className="fab fa-whatsapp text-xl"></i>Chat on WhatsApp
                </a>
                <a href="mailto:hello@nexora.agency" className="btn-secondary text-lg px-10 py-4">
                  <i className="fas fa-envelope mr-2"></i>Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-[#1E293B] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/nexora-logo.png" alt="Nexora" className="h-10 w-auto object-contain" />
                <span className="text-white font-black text-3xl tracking-tight">Nexora</span>
              </div>
              <p className="text-[#64748B] text-sm leading-relaxed mb-6">Crafting the digital future, one experience at a time.</p>
              <div className="flex gap-4">
                {[
                  { icon: 'fa-whatsapp', href: `https://wa.me/${WHATSAPP_NUMBER}` },
                  { icon: 'fa-x-twitter', href: '#' },
                  { icon: 'fa-linkedin-in', href: '#' },
                  { icon: 'fa-instagram', href: '#' },
                ].map(social => (
                  <a key={social.icon} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-[#131825] border border-[#1E293B] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[#7C3AED] transition-all ${social.icon === 'fa-whatsapp' ? 'hover:!border-[#25D366] hover:!text-[#25D366]' : ''}`}>
                    <i className={`fab ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Services', links: ['Web Development', 'UI/UX Design', 'Branding', 'Digital Marketing', 'AI Solutions'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
              { title: 'Resources', links: ['Case Studies', 'Documentation', 'Open Source', 'Support'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <div className="flex flex-col gap-3">
                  {col.links.map(link => (
                    <a key={link} href={link === 'Contact' ? '#contact' : '#'} className="text-[#64748B] text-sm hover:text-white transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#64748B] text-sm">© 2026 Nexora. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-[#64748B] text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#64748B] text-sm hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
