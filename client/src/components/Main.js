import React from 'react';
import { useState } from 'react';
import Current from './Current';
import Past from './Past';
import { useAuth } from '../hooks/AuthProvider';

const Main = ({ user, dbUser, join, setJoin, selectedPair }) => {

    const {
        openProfile
    } = useAuth();

    const [tab, setTab] = useState("current");

    if (!selectedPair) return (
        <>
            <div className='title is-4'>Welcome to Quiteoften{user.FirstName === '' ? '' : `, ${user.FirstName}`}!</div>
            {user.FirstName === '' &&
                <div className='tile is-align-items-center'>
                    <p>Take a moment to</p>
                    <p className="button is-text" onClick={openProfile}>complete your profile</p>
                </div>
            }
        </>

    )

    return (
        <>
            <div className="" id="main">
                <h1 className="title is-3">{selectedPair.otherUserOfPair.FullName.split(" ")[0]} / {user.FullName.split(" ")[0]} </h1>
                {join === false && <div className="tabs">
                    <ul>
                        <li className={tab === "current" ? "is-active" : ""}><a onClick={() => setTab("current")}>Current</a></li>
                        <li className={tab === "past" ? "is-active" : ""}><a onClick={() => setTab("past")}>Past</a></li>
                    </ul>
                </div>}
                {tab === "current"
                    ? <Current
                        join={join}
                        setJoin={setJoin}
                        selectedPair={selectedPair}
                        user={user}
                        dbUser={dbUser}
                    />
                    : <Past selectedPair={selectedPair} />
                }
            </div>
        </>

    )

}

export default Main;