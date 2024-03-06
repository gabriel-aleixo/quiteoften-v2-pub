import React from 'react';
import { useState } from 'react';
import { SWRConfig } from "swr";
import { useAuth } from '../hooks/AuthProvider';
import Login from './Login';
import { NavBar } from '../components/NavBar';
import { Nav } from '../components/Nav'
import Main from '../components/Main';
import { setHeaders } from '../helpers.js'; 

const LoggedHome = () => {

  const { user, dbUser, isLoading, hasError } = useAuth()

  const [selectedPair, setSelectedPair] = useState(null);
  const [join, setJoin] = useState(false);
  if (isLoading) return <p>Authenticating...</p>;
  if (!user || hasError) { return <Login /> }
  
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await fetch(url, {
            method: 'GET', //POST, GET, PUT, DEL...
            credentials: 'same-origin',
            headers: setHeaders({}),
          });
          return res.json();
        },
      }}
    >
      <div className="Home" id='Home'>
        <NavBar />
        <div className="columns">
          <div className={join ? "column is-narrow" : "column is-2"} id='Nav'>
            <Nav
              join={join}
              setSelectedPair={setSelectedPair}/>
          </div>
          <div className="column" id='Body'>

            <Main
              user={user}
              dbUser={dbUser}
              join={join}
              setJoin={setJoin}
              selectedPair={selectedPair}
            />

          </div>
        </div>
      </div>
    </SWRConfig>

  );
}

export default LoggedHome;
