'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePosStore } from '@/store/posStore';
import type { UserRole } from '@/lib/rbac';
import type { UserInfo } from '@/store/posStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const setUser = usePosStore(s => s.setUser);

  const handleDemoLogin = (rol: UserRole) => {
    const demoNames: Record<UserRole, string> = {
      admin: 'Demo Administrador',
      gerente: 'Demo Gerente',
      cajero: 'Demo Cajero',
      bodeguero: 'Demo Bodeguero',
    };
    const demoUser: UserInfo = {
      nombre: demoNames[rol],
      email: `demo.${rol}@milanpos.com`,
      rol,
    };
    setUser(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      // useAuth hook will update the store automatically
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel: Marketing/Illustration */}
      <div className="login-left">
        <div className="left-content">
          <h1>Facturación Electrónica para tu punto de Venta o Restaurante</h1>
          <p>
            Ya estamos listos para que comiences a facturar electrónicamente con validación previa, 
            de acuerdo a la última reglamentación de la DIAN.
          </p>
          <button className="btn-outline-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">DESCÚBRELA YA</button>
          
          <div className="login-illustration">
             <img 
               src="https://vendty.com/wp-content/uploads/2021/04/computador-vendty.png" 
               alt="Illustration" 
               style={{ width: '100%', height: 'auto' }}
             />
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="login-right">
        <div className="right-content">
          <img 
            src="https://pos.vendty.com/assets/img/logo.png" 
            alt="Vendty Logo" 
            className="login-logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://vendty.com/wp-content/uploads/2019/08/Vendty-Logo-Color.png';
            }}
          />
          
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">¿Olvidaste tu clave? · Crear una cuenta</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

            <div className="login-footer">
              <div className="footer-links">
                <a href="#">¿Olvidaste tu clave?</a>
                <a href="#">Crear una cuenta</a>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="whatsapp-help">
            ¿Tienes problema para logearte? Contáctanos por WhatsApp a este número:<br />
            <a href="https://wa.me/573053107953">+57 3053107953</a>
            <br /><br />
            ¿Necesitas ayuda? Contacta con nuestro equipo de soporte <a href="#">aquí</a>
          </div>

          {/* Modo Demo (Testing) */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px', textAlign: 'center', letterSpacing: '2px' }}>MODO DEMO</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button type="button" onClick={() => handleDemoLogin('admin')} 
                style={{ fontSize: '13px', padding: '8px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Admin
              </button>
              <button type="button" onClick={() => handleDemoLogin('cajero')} 
                style={{ fontSize: '13px', padding: '8px 20px', background: '#62cb31', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cajero
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
