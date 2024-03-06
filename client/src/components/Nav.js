import React, { useState, useEffect } from 'react';
import { getData } from '../helpers.js';
import { AddPerson } from './AddPerson.js';
import { FaRegHandPointDown } from 'react-icons/fa'
import { useAuth } from '../hooks/AuthProvider.js';

export const Nav = ({ join, setSelectedPair }) => {

    const { user, dbUser, isLoading } = useAuth();

    const [pairedUsers, setPairedUsers] = useState([]);
    const [selectedIndexInNav, setSelectedIndexInNav] = useState();
    const [loadingPairs, setLoadingPairs] = useState(true);
    const [hasError, setHasError] = useState(false);


    const handleNavItemClick = (index) => {
        setSelectedIndexInNav(index);
        setSelectedPair(pairedUsers[index]);
    };

    useEffect(() => {

        const fetchPairedUsers = async () => {
            try {
                const params = {};
                params.userId = dbUser.id;
                const result = await getData(`/api/pairs`, params);
                setPairedUsers(result);
                setLoadingPairs(false);
            } catch (error) {
                console.error(error);
                setHasError(true);
            }
        }
        fetchPairedUsers();

    }, [])

    if (hasError) return <p>Something went wrong...</p>;
    if (isLoading) return <p>Authenticating...</p>;
    if (loadingPairs) return <p>Fetching data...</p>;


    return (
        <>
            <aside className="tile is-ancestor sticky-top">
                <div className="tile is-parent is-vertical" style={{ maxWidth: '-webkit-fill-available' }}>
                    {(!pairedUsers || pairedUsers.length === 0)
                        ? < div className='tile is-child notification is-primary is-light' > Start by adding someone to your workspace
                            < span className="icon" >
                                <FaRegHandPointDown />
                            </span >
                        </div >

                        : <>
                            <div className="tile is-child">
                                <div className="list has-hoverable-list-items has-overflow-ellipsis">
                                    {
                                        pairedUsers.map((pairedUser, pairedUserlistIndex) => (

                                            <div className={(selectedIndexInNav === pairedUserlistIndex) ? "list-item box has-background-grey-lighter" : "list-item box"}
                                            key={pairedUserlistIndex} onClick={() => handleNavItemClick(pairedUserlistIndex)} style={{cursor:'pointer', boxShadow:'none'}}>
                                                <div className="list-item-image">
                                                    <figure className="image is-32x32">
                                                        <img src={`https://ui-avatars.com/api/?name=${pairedUser.otherUserOfPair.FullName}&background=3ab795&color=fff&font-size=0.6`} onLoad={(event) => event.target.style.display = 'inline-block'} alt="avatar" className="is-rounded" />
                                                    </figure>
                                                </div>
                                                <div className={join ? "list-item-content is-hidden" : "list-item-content"}>
                                                    <div className="list-item-title">
                                                        {pairedUser.otherUserOfPair.FullName}
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                    }
                    {!join && <AddPerson
                        user={user}
                        dbUser={dbUser}
                        pairedUsers={pairedUsers}
                        setPairedUsers={setPairedUsers}
                        setSelectedPair={setSelectedPair}
                        setSelectedIndexInNav={setSelectedIndexInNav} />}
                </div>
            </aside >

        </>





    )


};