import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShieldCheck, TrendingUp, Bot, GraduationCap, FileCheck, MessageSquare, Lock, FileText, AudioLines, Users, ChevronDown, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import usePageMeta from '../hooks/usePageMeta';
import './landingpage.css';

/* ──────────────────── Data ──────────────────── */

const features = [
  {
    icon: BookOpen,
    title: 'Centralized Material Repository',
    description:
      'Ditch the scattered WhatsApp groups. Browse and read your departmental courses and lecture notes organized strictly by course codes without needing to download anything.',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Duplicate Prevention',
    description:
      'Upload a material once, and our system hashes it to prevent multiple students from uploading the same PDF. Moderators ensure high-quality, verified content across the faculty.',
  },
  {
    icon: TrendingUp,
    title: 'Lightweight Progress LMS',
    description:
      'Mark materials as completed, track your study streaks, and see visual progress bars to motivate you to keep reviewing your semester\'s lectures daily.',
  },
  {
    icon: Bot,
    title: 'Buhari — The AI Study Assistant',
    description:
      'Interact with Buhari, our integrated AI tutor. Generate 3-paragraph summaries, create flashcards for quick revision, and answer 10-question quizzes based strictly on your PDF.',
  },
];

const useCases = [
  {
    icon: GraduationCap,
    title: 'Master Your Major',
    description:
      "Whether you're in Chemistry, Physics, or Computer Science, your dashboard adapts to your classes. Access only the materials relevant to your exact level and department.",
    cta: 'Laser-focused study.',
  },
  {
    icon: FileCheck,
    title: 'Test Your Knowledge',
    description:
      'Use the Buhari AI Tutor to automatically generate custom quizzes and interactive flashcards from any uploaded lecture note. Learn from empathetic explanations when you make mistakes.',
    cta: 'Boost your retention.',
  },
  {
    icon: MessageSquare,
    title: 'Ask Contextual Questions',
    description:
      'Need a complex science formula explained simpler? Chat with Buhari directly on the PDF reader. The AI answers using only the provided text to avoid hallucinations.',
    cta: "A tutor that's always on.",
  },
];

const testimonials = [
  {
    quote: 'Edukate UIL changed how I study. No more scrolling wildly through WhatsApp to find old CHM 101 notes.',
    source: '100L Chemistry Student',
    color: '#0A4D9C',
    initial: 'C',
  },
  {
    quote: "Buhari AI's flashcards are a lifesaver. I passed PHY 201 just by reviewing the AI-generated questions.",
    source: '200L Physics Student',
    color: '#008080',
    initial: 'P',
  },
  {
    quote: "The progress tracker actually forces me to read daily. It's built exactly for us.",
    source: '300L Mathematics Student',
    color: '#1E88E5',
    initial: 'M',
  },
  {
    quote: 'Finally, a central system where we know the materials are verified and duplicate-free.',
    source: 'Faculty Moderator',
    color: '#0D47A1',
    initial: 'F',
  },
];

const faqs = [
  {
    q: 'What makes Edukate UIL different from WhatsApp groups?',
    a: 'Edukate UIL provides a centralized, deduplicated repository for your exact department and level, complete with built-in AI study tools. No more scrolling through endless chat messages to find files.',
  },
  {
    q: 'Who is Buhari?',
    a: 'Buhari is your inbuilt AI Study Assistant. It can read your lecture notes and automatically generate summaries, flashcards, and quizzes to help you learn faster and test your knowledge.',
  },
  {
    q: 'How does the duplicate-prevention system work?',
    a: "When a student uploads a new material, our backend hashes the file. If that exact file exists in the faculty's database, the upload is rejected. If it's new, it goes to moderators for approval.",
  },
  {
    q: 'Can I download the materials to read offline?',
    a: 'Yes! While we offer an enhanced reading experience directly on the website with AI integrations, you can also download the PDFs for offline study.',
  },
  {
    q: 'Is Edukate UIL free to use?',
    a: 'Yes, this platform is built entirely for the Faculty of Physical Sciences students to ensure everyone has access to quality educational tools.',
  },
];

/* ──────────────────── Accordion Item ──────────────────── */

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`landing-accordion-item ${open ? 'open' : ''}`}>
      <button
        className="landing-accordion-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown size={18} className={`landing-accordion-icon ${open ? 'rotated' : ''}`} />
      </button>
      <div className="landing-accordion-body" style={{ maxHeight: open ? '300px' : '0' }}>
        <p className="landing-accordion-content">{answer}</p>
      </div>
    </div>
  );
}

/* ──────────────────── Social Icons ──────────────────── */

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ──────────────────── Main Component ──────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  usePageMeta({
    title: 'Edukate UIL — Faculty of Physical Sciences Learning Platform',
    description: 'Edukate UIL is the centralized learning platform for the Faculty of Physical Sciences. Access lecture materials, AI tutoring by Buhari, and track your academic progress.',
  });

  const { isAuthenticated, isOnboarded } = useApp();

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isOnboarded, navigate]);

  return (
    <div className="landing-page">
      {/* ─── Navbar ─── */}
      <nav className="landing-nav" role="navigation" aria-label="Main navigation">
        <div className="landing-nav-inner container">
          <div className="landing-nav-brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0D9488" />
              <path d="M8 22V10C8 10 10 8 16 8C22 8 24 10 24 10V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 22C8 22 10 20 16 20C22 20 24 22 24 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 8V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="14" r="1.5" fill="white" opacity="0.8" />
              <circle cx="20" cy="14" r="1.5" fill="white" opacity="0.8" />
            </svg>
            <span>Edukate UIL</span>
          </div>

          <div className="landing-nav-links">
            <a href="#overview" className="landing-nav-link active">Features</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
            <div className="landing-nav-socials">
              <a href="#" aria-label="Discord"><DiscordIcon /></a>
              <a href="#" aria-label="X / Twitter"><XIcon /></a>
            </div>
            <button className="landing-nav-cta" onClick={() => navigate('/auth')}>
              Login / Sign Up
            </button>
          </div>

          <button
            className="landing-nav-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="landing-nav-mobile">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <button className="landing-nav-cta" onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}>
              Login / Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <header className="landing-hero">
        <h1 className="landing-hero-title animate-fade-in-up">
          Master Your Courses <br />
          <span className="landing-gradient-text">with Edukate UIL</span>
        </h1>
        <p className="landing-hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          The centralized learning platform for the Faculty of Physical Sciences. Access lecture materials, track your progress, and study smarter with Buhari, your AI tutor.
        </p>
        <div className="landing-hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button className="landing-btn-primary" onClick={() => navigate('/auth')}>
            Start Learning
          </button>
          <a href="#overview" className="landing-hero-link">Explore Features</a>
        </div>
      </header>

      <main>
        {/* ─── Features ─── */}
        <section id="overview" className="landing-features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="landing-section-title">Built for Academic Success</h2>
          <div className="landing-features-list container">
            {features.map((f, i) => (
              <div key={f.title} className={`landing-feature-row ${i % 2 === 1 ? 'reverse' : ''}`}>
                <div className="landing-feature-text">
                  <f.icon size={28} strokeWidth={1.5} />
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
                <div className="landing-feature-visual">
                  <div className="landing-feature-visual-inner">
                    <f.icon size={40} strokeWidth={1.5} />
                    <span>{f.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Use Cases ─── */}
        <section className="landing-usecases" aria-labelledby="usecases-heading">
          <h2 id="usecases-heading" className="landing-section-title">How students excel with Edukate UIL</h2>
          <div className="landing-usecases-grid container">
            {useCases.map(uc => (
              <article key={uc.title} className="landing-usecase-card">
                <div className="landing-usecase-icon">
                  <uc.icon size={24} strokeWidth={1.5} />
                </div>
                <h3>{uc.title}</h3>
                <p>{uc.description}</p>
                <p className="landing-usecase-cta">{uc.cta}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="landing-testimonials" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="landing-section-title">What students are saying</h2>
          <div className="landing-testimonials-track">
            <div className="landing-testimonials-scroll">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="landing-testimonial-card">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <div className="landing-testimonial-author">
                    <span className="landing-testimonial-avatar" style={{ background: t.color }}>
                      {t.initial}
                    </span>
                    <span className="landing-testimonial-name">{t.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Privacy ─── */}
        <section className="landing-privacy" aria-labelledby="privacy-heading">
          <div className="container landing-privacy-inner">
            <h2 id="privacy-heading">We value academic integrity and ensure a spam-free environment</h2>
            <p>
              Every material uploaded to Edukate UIL goes through our Smart Duplicate Prevention system and moderator review queue to ensure high quality. Your study data and interactions with Buhari AI remain private to you.
            </p>
            <div className="landing-privacy-visual" aria-hidden="true">
              <div className="landing-privacy-ring landing-privacy-ring-outer" />
              <div className="landing-privacy-ring landing-privacy-ring-inner" />
              <div className="landing-privacy-lock">
                <Lock size={28} strokeWidth={1.5} />
              </div>
              <FileText size={20} strokeWidth={1.5} className="landing-privacy-orbit-1" />
              <AudioLines size={20} strokeWidth={1.5} className="landing-privacy-orbit-2" />
              <Users size={20} strokeWidth={1.5} className="landing-privacy-orbit-3" />
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="landing-faq" aria-labelledby="faq-heading">
          <div className="container landing-faq-inner">
            <h2 id="faq-heading">Got questions?</h2>
            <p className="landing-faq-sub">Here are some answers regarding Edukate UIL.</p>
            <div className="landing-accordion">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="landing-footer-wave" aria-hidden="true" />
        <div className="container landing-footer-content">
          <p>Built for the Faculty of Physical Sciences. An initiative by <strong>Buhari</strong>.</p>
          <p className="landing-footer-copy">&copy; {new Date().getFullYear()} Edukate UIL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
