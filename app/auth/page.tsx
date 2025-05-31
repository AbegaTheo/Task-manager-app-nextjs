'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import styles from "./Auth.module.css";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
      redirect: false,
    });
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      toast.error("Erreur lors de la connexion");
    } else {
      toast.success("Connexion réussie !");
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (registerData.password !== registerData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      toast.success("Inscription réussie !");
      setIsLogin(true);
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de l'inscription");
      toast.error(data.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <main className={styles.body}>
      <div
        className={`${styles.container} ${styles.body} ${
          isLogin ? styles["active-login"] : styles["active-sign-up"]
        }`}
      >
        {/* Section de bienvenue */}
        <div className={styles["welcome-section"]}>
          <h1 className={styles.welcome}>Bienvenue ! ❤️</h1>
          <p>
            Rejoignez notre communauté et profitez d'un accès transparent à des
            fonctionnalités exclusives
          </p>
          <br />
          <p>
            Créez un compte pour commencer à gérer vos tâches et rester
            organisé.
          </p>
        </div>
        {/* Formulaires */}
        <div className={styles["forms-container"]}>
          {/* Formulaire Login */}
          <div className={`${styles["form-container"]} ${styles.login}`}>
            <h2>Se connecter</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.icon} />
                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <span
                  className={styles.toggleIcon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit">Se connecter</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <p>
              Vous n'avez pas de compte ?{" "}
              <span
                className={styles["switch-form"]}
                onClick={() => setIsLogin(false)}
              >
                S'inscrire
              </span>
            </p>
          </div>
          {/* Formulaire Register */}
          <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
            <h2>S'inscrire</h2>
            <form onSubmit={handleRegister}>
              <div className={styles.inputGroup}>
                <FaUser className={styles.icon} />
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.icon} />
                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
                <span
                  className={styles.toggleIcon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <span
                  className={styles.toggleIcon}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit">S'inscrire</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <p>
              Vous avez déjà un compte ?{" "}
              <span
                className={styles["switch-form"]}
                onClick={() => setIsLogin(true)}
              >
                Se connecter
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}