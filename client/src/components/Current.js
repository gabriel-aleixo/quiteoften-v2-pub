import React, { useState } from 'react';
import { withDiscussionItems } from './withDiscussionItems';
import { withActionItems } from './withActionItems';
import GenericBox from './GenericBox';
import VideoConference from './Jitsi_alt'
import { FaRegCopy } from 'react-icons/fa';



const RightBar = ({ jitsi, join, setJoin, selectedPair }) => {

    const DiscussionBox = withDiscussionItems(selectedPair, GenericBox);
    const ActionBox = withActionItems(selectedPair, GenericBox);

    const copyLink = () => {
        navigator.clipboard.writeText(jitsi._url);

    }


    return (
        <>
            <div className="tile is-ancestor">
                <div className="tile is-vertical">
                    <div className="tile is-parent">
                        <div className="tile box">
                            {join
                                ? <>
                                    <div className="tile is-child">
                                        <button className='button is-white has-text-grey'
                                        onClick={copyLink}>
                                            <span className="icon is-large has-text-grey">
                                                <FaRegCopy />
                                            </span>
                                            <span>Copy link to call</span>
                                        </button>
                                    </div>
                                </>
                                : <>
                                    <div className="tile is-4 is-child has-text-centered">
                                        <p className="heading">Next Meeting</p>
                                        <p><strong>Calendar not connected</strong></p>
                                    </div>

                                    <div className="tile is-4 is-child has-text-centered">
                                        <p className="heading">Previous Meeting</p>
                                        <p><strong>---</strong></p>
                                    </div>
                                </>

                            }
                            <div className="tile is-child">
                                {join
                                    ? <button className="button is-danger is-pulled-right" onClick={() => setJoin(false)}>Leave Meeting</button>
                                    : <button className="button is-primary is-pulled-right" onClick={() => setJoin(true)}>Join Meeting</button>
                                }
                            </div>
                        </div>

                    </div>
                    <div className={join ? "tile is-vertical" : "tile"}>
                        <div className="tile is-parent">
                            <div className="tile is-child box">
                                <DiscussionBox showAddItemOption={true}
                                    showDeleteItemOption={true}
                                    showToggleCompletionOfItem={true}
                                    filterByStatus="INCOMPLETE_ONLY" />
                            </div>
                        </div>
                        <div className="tile is-parent">
                            <div className="tile is-child box">
                                <ActionBox showAddItemOption={true}
                                    showDeleteItemOption={true}
                                    showToggleCompletionOfItem={true}
                                    filterByStatus="INCOMPLETE_ONLY" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

const Current = ({ join, setJoin, selectedPair, user, dbUser }) => {

    const [jitsi, setJitsi] = useState({});

    return (
        <>
            <div className="columns">
                {
                    join
                        ? <div className="column is-8">
                            <div className="tile is-ancestor sticky-top" style={{ height: '80vh' }} >
                                <div className="tile is-parent is is-vertical">
                                    <VideoConference
                                        jitsi={jitsi}
                                        setJitsi={setJitsi}
                                        join={join}
                                        setJoin={setJoin}
                                        selectedPair={selectedPair}
                                        user={user}
                                        dbUser={dbUser}
                                    />
                                </div>
                            </div>
                        </div>
                        : <div className="column is-hidden" />
                }
                <div className="column" id="main-right">
                    <RightBar
                        jitsi={jitsi}
                        join={join}
                        setJoin={setJoin}
                        selectedPair={selectedPair}
                    />
                </div>
            </div>
        </>

    )
}

export default Current;
