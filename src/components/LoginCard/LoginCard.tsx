"use client";

import React, { useState } from "react";
import styles from "./LoginCard.module.scss";
import { Eye, EyeOff, Mail , Lock} from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginCardProps = {
  title: string;
  description?: string;
  logo?: React.ReactNode;
  onSubmit: (formData: LoginFormData) => void;
  loading?: boolean;
};

const LoginCard: React.FC<LoginCardProps> = ({  logo, title, description, onSubmit , loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload
    if (!email || !password || !isValidEmail(email)) return;
    
    const formData: LoginFormData = {
      email: email,
      password: password,
    };
    
    onSubmit(formData);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
              {logo && <div className={styles.logo}>{logo}</div>}
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>

            <form className={styles.body} onSubmit={handleSubmit}>
            {/* Email input */}
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.icon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
