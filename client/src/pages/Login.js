import { useEffect } from "react";

import { NavBar } from "../components/NavBar";
import { useAuth } from "../hooks/AuthProvider";
import { hasQueryParam } from '../helpers';
import art302 from '../images/art/abstrakt-design-302-green.png'

const Login = () => {

  const {
    user,
    openLogin
  } = useAuth();


  useEffect(() => {
    if (user) window.location.assign('/')
    if(!hasQueryParam(window.location.search, "resetToken"))
      openLogin()

  }, [openLogin, user])



  return (
    <>
      <NavBar />
      <div className="section">
        <div id="login" className="container has-text-centered">
          <p className="title">Welcome to Quiteoften!</p>
          <p id="button" className="button is-text" onClick={openLogin}>
            Login
          </p>
        </div>
        <figure className="image container is-flex is-justify-content-center	">
          <img src={art302} alt="team work" style={{ maxWidth: 500, maxHeight: 500 }} />
        </figure>

      </div>


    </>
  )

}

export default Login;