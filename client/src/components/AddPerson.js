import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { postData } from '../helpers.js';

const EmailForm = ({ user, dbUser, formState, setFormState,
                     pairedUsers, setPairedUsers, setSelectedPair, 
                     setSelectedIndexInNav }) => {

    const onSubmit = async (e) => {

        console.log(e);
        e.preventDefault();
        const email = e.target[1].value;

        if (!email) {
            setFormState({ status: 'alert', errorMsg: 'This email is invalid'});
            return;
        }
        setFormState({ status: 'loading' });
        try {
            const params = {};
            params.leadId = dbUser.id;
            params.email = email;
            params.acctUid = user.Account.Uid;
            const newPair = await postData('/api/pairs', params);    
            const newPairedUsers = pairedUsers ? [...pairedUsers, newPair[0]] : [newPair[0]];
            setPairedUsers(newPairedUsers);
            setSelectedPair(newPair[0]);
            setSelectedIndexInNav(newPairedUsers.length - 1); //we are at end of the list
            setFormState({ status: 'success' });
            e.target[1].value = '';
        }
        catch (error) {
            console.error(error);
            setFormState({ status: 'alert', errorMsg: 'Sorry there was a problem' });
        }
    }

    return (
        <div className="tile is-child">
            <form onSubmit={onSubmit} >

                <fieldset disabled={formState.status === 'loading'} >
                    <div className="field">
                        <div className="control is-expanded">
                            <input
                                className={formState.status === 'alert'
                                    ? "input is-danger"
                                    : formState.status === 'success'
                                        ? "input is-success"
                                        : "input"}
                                type="email"
                                placeholder="Enter email"
                                onChange={() => setFormState({ status: 'open' })}
                            />
                        </div>
                        {formState.status === 'alert' && <p className="help is-danger">{formState.errorMsg}</p>}
                        {formState.status === 'success' && <p className="help is-success">Email sent</p>}
                    </div>
                    <div className="field is-grouped is-grouped-centered">
                        <div className="control">
                            <button
                                type="submit"
                                className={formState.status === 'loading'
                                    ? "button is-small is-primary is-loading"
                                    : "button is-small is-primary"}>Send Invite</button>
                        </div>
                        <div className="control">
                            <div type="button" className="button is-small is-light"
                                onClick={() => setFormState({ status: 'init', errorMsg: null })}>Cancel</div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}

export const AddPerson = ({ user, dbUser, pairedUsers, setPairedUsers, setSelectedPair, setSelectedIndexInNav }) => {

    const [formState, setFormState] = useState(  {status: 'init', errorMsg: null } );



    return (
        <>
            <div className='tile is-child'>
                <button className="button is-primary is-inverted is-fullwidth"
                    onClick={() => setFormState({ status: 'open' })}>
                    <span className="icon is-small">
                        <FaUserPlus />
                    </span>
                    <span>Add Person</span>
                </button>

            </div>
            {formState.status !== 'init' &&
                <EmailForm
                    user={user}
                    dbUser={dbUser}
                    formState={formState}
                    setFormState={setFormState}
                    pairedUsers={pairedUsers}
                    setPairedUsers={setPairedUsers}
                    setSelectedPair={setSelectedPair}
                    setSelectedIndexInNav={setSelectedIndexInNav}
                />}
        </>


    )
};