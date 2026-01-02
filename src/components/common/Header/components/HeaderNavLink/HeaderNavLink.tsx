import React from 'react';
import { NavLink, type To } from 'react-router-dom';
import './HeaderNavLink.css';

type HeaderNavLinkProps = {
  to: To;
  children: React.ReactNode;
};

export const HeaderNavLink = ({ to, children }: HeaderNavLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link--active' : 'nav-link'
      }
    >
      {children}
    </NavLink>
  );
};
