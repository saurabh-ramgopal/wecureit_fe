"use client";
import { useState } from "react";
import { Mail, Lock, Phone, Calendar, User, Eye, EyeOff, ArrowRight, ArrowLeft, Footprints } from "lucide-react";
import styles from "./RegisterCard.module.scss";

interface RegisterCardProps {
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit?: (data: RegisterFormData) => void;
  loading?: boolean;
}

interface RegisterFormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  name: string; 
}

export default function RegisterCard({
  logo,
  title = "Create Account",
  description = "Join us and start your healthcare journey",
  onSubmit,
  loading
}: RegisterCardProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 // Step 1 or 2
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    name: "",
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const passwordsMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isStep1Valid = () => {
    return (
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.confirmPassword &&
      isPasswordStrong(formData.password) &&
      passwordsMatch() &&
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone)
    );
  };

  const isStep2Valid = () => {
    return (
      formData.dob &&
      formData.gender &&
      formData.name 
    );
  };

  const handleNext = () => {
    if (isStep1Valid()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!isStep2Valid()) return;

  if (onSubmit) {
    onSubmit(formData); // pass data to parent
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            {logo && <div className={styles.logo}>{logo}</div>}
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
            
            {/* Step Indicator */}
         <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
                <span className={styles.stepNumber}>1</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
                <span className={styles.stepNumber}>2</span>
            </div>
            </div>

          </div>

          <form className={styles.body} onSubmit={handleSubmit}>
            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <>
                 <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.icon} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {!isValidEmail(formData.email) && formData.email.length > 0 && (
                    <span className={styles.error}>
                      Please enter a valid email.
                    </span>
                  )}
                </div>
                 <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <div className={styles.inputWrapper}>
                    <Phone className={styles.icon} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit phone number"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                   {!isValidPhone(formData.phone) && formData.phone.length > 0 && (
                    <span className={styles.error}>
                      Please enter a valid 10-digit phone number.
                    </span>
                  )}
                 
                </div>
                  <div className={styles.inputGroup}>
                  <label>Password</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.icon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password (min 8 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                  {formData.password.length > 0 &&
                    !isPasswordStrong(formData.password) && (
                      <span className={styles.error}>
                        Password must be at least 8 characters.
                      </span>
                    )}
                </div>

                <div className={styles.inputGroup}>
                  <label>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.icon} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                  {formData.confirmPassword.length > 0 && !passwordsMatch() && (
                    <span className={styles.error}>Passwords do not match.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep1Valid()}
                  className={styles.nextButton}
                >
                  Next <ArrowRight className={styles.buttonIcon} />
                </button>
              </>
            )}

            {/* STEP 2: Security */}
            {step === 2 && (
              <>
               <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.icon} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Date of Birth</label>
                  <div className={styles.inputWrapper}>
                    <Calendar className={styles.icon} />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Gender</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.icon} />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className={styles.backButton}
                  >
                    <ArrowLeft className={styles.buttonIcon} /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !isStep2Valid()}
                    className={styles.registerButton}
                  >
                    {loading ? "Creating Account…" : "Register"}
                  </button>
                </div>
              </>
            )}

            <div className={styles.footer}>
              <h6>
                Already have an account?{" "}
                <a href="/patient/login" className={styles.link}>
                  Login here
                </a>
              </h6>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}