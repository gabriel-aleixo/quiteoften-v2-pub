import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../hooks/AuthProvider";
import art302 from '../images/art/abstrakt-design-302-green.png'


const Signup = () => {

  const {
    user,
    openSignup
  } = useAuth();

  if (user) window.location.assign('/')

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {


    // Get the planUid to display to user
    const planUid = searchParams.get("plan_uid") || "y9qO1KmA";
    const planPaymentTerm = searchParams.get("plan_payment_term") || "annual";
    // and clean up
    setSearchParams({});

    const signupOptions = {
      planUid: planUid,
      planPaymentTerm: planPaymentTerm,
      skipPlanOptions: false
    }

    openSignup(signupOptions)

  }, [])

  return (
    <>
      <NavBar />
      <div className="section">
        <div id="signup" className="container has-text-centered">
          <p className="title">Welcome to Quiteoften!</p>
          <p id="button" className="button is-text"
            onClick={() => openSignup({
              planUid: searchParams.get("plan_uid") || "y9qO1KmA",
              planPaymentTerm: searchParams.get("plan_payment_term") || "annual",
              skipPlanOptions: false
            })}>
            Signup Here
          </p>
        </div>
        <figure className="image container is-flex is-justify-content-center	">
          <img src={art302} alt="team work" style={{ maxWidth: 500, maxHeight: 500 }} />
        </figure>

      </div>


    </>
  )
}

export default Signup;