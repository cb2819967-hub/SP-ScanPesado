import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    try {
      await login(credentials);
      const redirectTo = location.state?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-layout">
      <section className="login-panel">
        <div className="login-card">
          <img src="/img/logo.png" alt="SP Scan Pesado" className="logo" />
          <h1 className="login-brand">SP SCAN PESADO</h1>
          <p className="login-subtitle">Sistema de verificación vehicular</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Correo electrónico</span>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input type="email" name="email" placeholder="usuario@ejemplo.com" required />
              </div>
            </label>
            <label className="field">
              <span>Contraseña</span>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" required />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error ? <div className="error-banner">{error}</div> : null}
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Validando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
