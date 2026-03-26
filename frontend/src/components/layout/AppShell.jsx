import { ChevronDown, ChevronUp, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { useAuth } from '../../utils/auth.js';
import { Modal } from '../ui/Modal.jsx';

export function AppShell() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        role={user?.rol}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className={`main-panel ${collapsed ? 'expanded' : ''}`}>
        <header className="topbar">
          <button type="button" className="sidebar-icon topbar-trigger" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>

          <div className="user-menu">
            <button type="button" className="user-chip user-chip-button" onClick={() => setUserMenuOpen((current) => !current)}>
              <div>
                <strong>{user?.nombre}</strong>
                <span>{user?.rol === 'ADMIN' ? 'Administrador' : 'Tecnico'}</span>
              </div>
              {userMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {userMenuOpen ? (
              <div className="user-dropdown">
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                >
                  <LogOut size={15} />
                  Cerrar sesion
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <Outlet />
      </main>

      <Modal open={logoutConfirmOpen} title="Confirmar salida" onClose={() => setLogoutConfirmOpen(false)}>
        <div className="confirm-box">
          <p>¿Seguro que deseas cerrar sesion?</p>
          <div className="confirm-actions">
            <button type="button" className="ghost-button" onClick={() => setLogoutConfirmOpen(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="primary-button danger-button"
              onClick={() => {
                setLogoutConfirmOpen(false);
                logout();
              }}
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
