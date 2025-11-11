// HomeView.tsx
"use client";
import { useRouter } from "next/navigation";
import { User, Stethoscope, UserPlus } from "lucide-react";
import styles from "./home.module.scss";

export default function HomeView() {
    
  const router = useRouter();
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Welcome to WeCureIT</h1>
            <p className={styles.subtitle}>
              Select your portal to get started
            </p>
          </div>

          {/* Cards Grid */}
          <div className={styles.cardsGrid}>
            
            {/* Patient Login Card */}
            <div className={`${styles.card} ${styles.patient}`} 
              >
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <User size={60} className={styles.icon} />
                <h3 className={styles.cardTitle}>Patient Portal</h3>
                <p className={styles.cardDescription}>
                  Book visits and manage your records easily
                </p>
                <button
                  className={styles.cardButton}
                  onClick={(e) => { e.preventDefault();  
                    router.push('/patient/login');
                }}
                >
                  Login as Patient →
                </button>
              </div>
            </div>

            {/* Doctor Login Card */}
            <div className={`${styles.card} ${styles.doctor}`}
             >
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <Stethoscope size={60} className={styles.icon} />
                <h3 className={styles.cardTitle}>Doctor Portal</h3>
                <p className={styles.cardDescription}>
                  Keep track of your schedule and patient notes
                </p>
                <button
                  className={styles.cardButton}
                  onClick={() => router.push('/doctor/login/')}
                >
                  Login as Doctor →
                </button>
              </div>
            </div>

          </div>

          {/* Register Card */}
          <div className={styles.registerSection}>
            <div className={`${styles.registerCard} ${styles.patient}`}>
              <div className={styles.registerContent}>
                <UserPlus size={40} className={styles.registerIcon} />
                <div className={styles.registerText}>
                  <h4 className={styles.registerTitle}>New Patient?</h4>
                  <p className={styles.registerDescription}>
                    Create an account to get started
                  </p>
                </div>
                <button
                  className={styles.registerButton}
                    onClick={() => router.push("patient/register")}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.featuresTitle}>Why Choose WeCureIT?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Multi-Facility Access</h4>
              <p className={styles.featureDescription}>
                Access doctors across all partnered healthcare facilities
              </p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Instant Booking</h4>
              <p className={styles.featureDescription}>
                Real-time availability and immediate appointment confirmation
              </p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Smart Health Connect</h4>
              <p className={styles.featureDescription}>
                Seamlessly link with doctors and manage appointments with ease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            &copy; 2025 WeCureIT. All rights reserved.
          </p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms of Service</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}