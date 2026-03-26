import {
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  SearchCheck,
  Truck,
  UserCog,
  Warehouse,
  Wrench,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { MODULES } from '../../config/modules.js';

const ICONS = {
  dashboard: LayoutDashboard,
  usuarios: UserCog,
  clientes: Building2,
  cedis: Warehouse,
  vehiculos: Truck,
  verificentros: Wrench,
  notas: ClipboardList,
  verificaciones: SearchCheck,
  costos: CreditCard,
  transacciones: CreditCard,
  pedidos: FileText,
  reportes: FileText,
};

function groupItems(role) {
  const filteredModules = MODULES.filter((module) => module.roles.includes(role));

  return [
    { title: 'General', items: [{ key: 'dashboard', label: 'Dashboard', path: '/dashboard' }] },
    {
      title: 'Catalogos',
      items: filteredModules.filter((module) => module.section === 'Catalogos').map((module) => ({
        key: module.key,
        label: module.title,
        path: `/dashboard/${module.path}`,
      })),
    },
    {
      title: 'Operaciones',
      items: filteredModules.filter((module) => module.section === 'Operaciones').map((module) => ({
        key: module.key,
        label: module.title,
        path: `/dashboard/${module.path}`,
      })),
    },
    {
      title: 'Finanzas',
      items: filteredModules.filter((module) => module.section === 'Finanzas').map((module) => ({
        key: module.key,
        label: module.title,
        path: `/dashboard/${module.path}`,
      })),
    },
    { title: 'Analisis', items: [{ key: 'reportes', label: 'Reportes', path: '/dashboard/reportes' }] },
  ];
}

export function Sidebar({ role, collapsed, mobileOpen, onToggleCollapsed, onCloseMobile }) {
  const groups = groupItems(role);

  return (
    <>
      {mobileOpen ? <button type="button" className="sidebar-overlay" onClick={onCloseMobile} /> : null}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <strong>SP SCAN</strong>
            <strong>PESADO</strong>
          </div>
          <div className="sidebar-actions">
            <button type="button" className="sidebar-icon" onClick={onToggleCollapsed}>
              <Menu size={18} />
            </button>
            <button type="button" className="sidebar-icon mobile-only" onClick={onCloseMobile}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="sidebar-scroll">
          {groups.map((group) => (
            <section key={group.title} className="sidebar-group">
              <p className="sidebar-group-title">{group.title}</p>
              {group.items.map((item) => {
                const Icon = ICONS[item.key];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
