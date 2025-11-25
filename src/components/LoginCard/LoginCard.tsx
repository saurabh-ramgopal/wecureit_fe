"use client";

import React, { useState } from "react";
import styles from "./LoginCard.module.scss";
import { Eye, EyeOff, Mail , Lock} from "lucide-react";
type LoginCardProps = {
  title: string;
  description?: string;
  logo?: React.ReactNode;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  onBack?: () => void;
};

const LoginCard: React.FC<LoginCardProps> = ({  logo, title, description, onSubmit , loading , email,  password, onEmailChange, onPasswordChange, onBack}) => {
  const [showPassword, setShowPassword] = useState(false);
  

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
              {logo && <div className={styles.logo}>{logo}</div>}
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>

            <form className={styles.body} onSubmit={(e) => { e.preventDefault(); onSubmit();}}>
            {/* Email input */}
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.icon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                   onChange={(e) => onEmailChange(e.target.value)}
                  required
                />
              </div>
              {!isValidEmail(email) && email.length > 0 && (
                <span className={styles.error}>Please enter a valid email.</span>
              )}
            </div>

            {/* Password input */}
            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || !isValidEmail(email)}
              className={styles.loginButton}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>
           {onBack && (
            <button 
              className={styles.backButton} 
              onClick={onBack}
              type="button"
            >
              ⬅ Back to Home
            </button>
          )}
           </div>
         
        </div>
        </div>
  );
};

export default LoginCard;
