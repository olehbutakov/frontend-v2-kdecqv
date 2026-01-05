import { type ReactNode } from 'react';
import { NavLink, type To } from 'react-router-dom';
import './HeaderNavLink.css';

interface HeaderNavLinkProps {
  to: To;
  children: ReactNode;
  className?: string | undefined;
}

export const HeaderNavLink = ({
  to,
  children,
  className,
}: HeaderNavLinkProps) => {
  const handleClasses = (isActive: boolean) =>
    `nav-link ${className} ${isActive ? 'nav-link--active' : ''}`.trim();

  return (
    <NavLink to={to} className={({ isActive }) => handleClasses(isActive)}>
      {children}
    </NavLink>
  );
};
