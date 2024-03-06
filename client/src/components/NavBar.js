import React, { useState } from 'react';
import logo from '../images/logos/logo_black_transp-600x0.png'
import { useAuth } from '../hooks/AuthProvider';
//import { FaBars, FaUser, FaUserCircle } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';

export const NavBar = () => {

  const { user, logout, openProfile } = useAuth()
  const [burgerActive, setBurgerActive] = useState(false)

  return (
    <IconContext.Provider value={{ size: "2em" }}>
      <nav className="navbar is-spaced is-fixed-top-touch is-fixed-top-desktop" role="navigation"
        aria-label="main navigation" id="navbar">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img src={logo} width="150" height="30" alt="logo" />
          </a>
          <div role="button" className={burgerActive ? "navbar-burger is-active" : "navbar-burger"}
            aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
            onClick={() => { setBurgerActive(!burgerActive) }}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>

        <div className={burgerActive ? "navbar-menu is-active" : "navbar-menu"}>
          {user
            ?
            <div className="navbar-end">
              <div className="navbar-item has-dropdown is-hoverable"
                id="profile-icon-desktop">
                <div className="navbar-link is-arrowless is-hidden-mobile">
                  <span className="icon is-large">
                    <FaUserCircle />
                  </span>
                </div>
                <div className="navbar-dropdown is-right">
                  <div
                    onClick={openProfile}
                    style={{ cursor: 'pointer' }}
                    className="navbar-item">
                    Profile
                  </div>
                  <div onClick={logout}
                    style={{ cursor: 'pointer' }}
                    className="navbar-item">
                    Log out
                  </div>
                </div>
              </div>
            </div>
            : ''}
        </div>
      </nav>
    </IconContext.Provider>
  )
};
