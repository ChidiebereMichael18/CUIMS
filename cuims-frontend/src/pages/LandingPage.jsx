import { Link } from 'react-router-dom';
import './LandingPage.css';

const TESTIMONIALS = [
  { name: "Dr. Sarah Mitchell", role: "Faculty Administrator", quote: "CUIMS completely transformed our placements. Tracking student progress has never been easier." },
  { name: "David Kim", role: "Computer Science Student", quote: "The streamlined application process made finding an internship completely stress-free." },
  { name: "Michael Chen", role: "HR Director, TechCorp", quote: "Having a unified platform to review applicants and approve weekly logs saves us countless hours." },
  { name: "Emily Clark", role: "University Supervisor", quote: "Reviewing logs and managing interns from across departments is incredibly seamless now." },
  { name: "Alex Johnson", role: "Engineering Intern", quote: "I love being able to submit my reports directly online without losing track of paper forms!" }
];

const REVERSE_TESTIMONIALS = [...TESTIMONIALS].reverse();
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar segment */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <img src="/cuims-logo.png" alt="CUIMS Logo" style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0, borderRadius: '50%' }} />
          <em className="logo-text">CUIMS</em>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">Cavendish University Uganda</div>
          <h1 className="hero-title">
            Empowering your <em>Internship</em> <br />experience.
          </h1>
          <p className="hero-subtitle">
            The complete management system for students, supervisors, and administrators. 
            Track applications, submit weekly reports, and manage placements effortlessly in one unified platform.
          </p>
          
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg shine-effect">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Portal
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Students Placed</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-num">150+</span>
              <span className="stat-label">Partner Companies</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Streamlined Tracking</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card mockup-card main-mockup">
            <div className="mockup-header">
              <div className="mockup-dots"><span></span><span></span><span></span></div>
              <div className="mockup-title">StudentDashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-line skeleton-title"></div>
              <div className="mockup-line skeleton-text w-3/4"></div>
              <div className="mockup-line skeleton-text w-1/2"></div>
              <div className="mockup-grid">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            </div>
          </div>
          <div className="glass-card mockup-card floating-mockup">
            <div className="mockup-body mockup-compact">
              <div className="badge-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Application Accepted
              </div>
              <div className="mockup-line skeleton-text w-full mt-2"></div>
              <div className="mockup-line skeleton-text w-2/3"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Showcase */}
      <section className="features-section">
        <h2 className="section-title text-center">Built for everyone</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3>For Students</h3>
            <p>Browse active internship listings, apply seamlessly, and submit your weekly progress reports online.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3>For Supervisors</h3>
            <p>Post opportunities, review applicants, and monitor interns' progress with detailed weekly logs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3>For Administrators</h3>
            <p>Manage the entire university program. Approve supervisors, oversee activities, and analyze engagement.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-title text-center">How CUIMS Works</h2>
          <div className="steps-wrapper">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3>Create an Account</h3>
              <p>Sign up using your university credentials or register as a partner company.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3>Find or Post Roles</h3>
              <p>Students browse available positions, while supervisors post new internship opportunities.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3>Track Progress</h3>
              <p>Submit weekly reports, gather supervisor feedback, and complete your placement successfully.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Marquee Section */}
      <section className="testimonials-section">
        <div className="testimonials-header">
          <h2 className="section-title text-center">Trusted by our community</h2>
          <p className="text-center" style={{ color: 'var(--gray-500)', maxWidth: 600, margin: '0 auto' }}>
            Join hundreds of students, supervisors, and administrators managing their internships the modern way.
          </p>
        </div>
        
        <div className="marquee-container">
          <div className="marquee-overlay left"></div>
          <div className="marquee-overlay right"></div>
          
          {/* Row 1: Scrolling Left */}
          <div className="marquee-row">
            <div className="marquee-track track-left">
              <div className="marquee-group">
                {TESTIMONIALS.map((t, idx) => (
                  <div className="marquee-card" key={`r1-a-${idx}`}>
                    <div className="marquee-card-header">
                      <div className="author-avatar">{t.name[0]}</div>
                      <div className="author-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </div>
                    <p className="testimonial-text">"{t.quote}"</p>
                  </div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {TESTIMONIALS.map((t, idx) => (
                  <div className="marquee-card" key={`r1-b-${idx}`}>
                    <div className="marquee-card-header">
                      <div className="author-avatar">{t.name[0]}</div>
                      <div className="author-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </div>
                    <p className="testimonial-text">"{t.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Row 2: Scrolling Right */}
          <div className="marquee-row">
            <div className="marquee-track track-right">
              <div className="marquee-group">
                {REVERSE_TESTIMONIALS.map((t, idx) => (
                  <div className="marquee-card" key={`r2-a-${idx}`}>
                    <div className="marquee-card-header">
                      <div className="author-avatar" style={{backgroundColor: '#e0e7ff', color: '#3730a3'}}>{t.name[0]}</div>
                      <div className="author-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </div>
                    <p className="testimonial-text">"{t.quote}"</p>
                  </div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {REVERSE_TESTIMONIALS.map((t, idx) => (
                  <div className="marquee-card" key={`r2-b-${idx}`}>
                    <div className="marquee-card-header">
                      <div className="author-avatar" style={{backgroundColor: '#e0e7ff', color: '#3730a3'}}>{t.name[0]}</div>
                      <div className="author-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </div>
                    <p className="testimonial-text">"{t.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <img src="/cuims-logo.png" alt="CUIMS Logo" style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0, borderRadius: '50%' }} />
              <em className="logo-text">CUIMS</em>
            </div>
            <p className="footer-description">
              The complete management system for Cavendish University students, supervisors, and administrators.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-link-column">
              <h4>Platform</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/internships">Browse Placements</Link>
            </div>
            <div className="footer-link-column">
              <h4>Legal</h4>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cavendish University Internship Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
