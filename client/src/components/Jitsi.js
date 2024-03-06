import React, { useState, useEffect } from 'react';
import * as portals from 'react-reverse-portal';

export const JitsiApi = window

export const JitsiMeetComponent = ({ join, setJoin, selectedPair, user, dbUser }) => {

    const [loading, setLoading] = useState(true);

    let roomName;

    if (dbUser.id === selectedPair.lead) {
        roomName = `${user.Account.Uid}-${user.Uid}-${selectedPair.otherUserOfPair.Uid}`
    } else {
        roomName = `${user.Account.Uid}-${selectedPair.otherUserOfPair.Uid}-${user.Uid}`
    }

    console.log('room name is', roomName)
    useEffect(() => {
        function startConference() {
            try {
                const domain = 'meet.jit.si';
                const options = {
                    roomName: roomName,
                    height: '100%',
                    parentNode: document.getElementById('jitsi-container'),
                    interfaceConfigOverwrite: {
                        // SHOW_JITSI_WATERMARK: false,
                        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                        DISABLE_TRANSCRIPTION_SUBTITLES: false
                    },
                    configOverwrite: {
                        disableSimulcast: true,
                        defaultLocalDisplayName: 'Me',
                        disable1On1Mode: null,
                        disableInviteFunctions: false,
                        disableProfile: true,
                        disableReactions: true,
                        disableRemoteMute: true,
                        disableResponsiveTiles: true,
                        disableSelfViewSettings: true,
                        disableSpeakerStatsSearch: true,
                        disableTileView: true,
                        enableCalendarIntegration: false,
                        enableClosePage: false,
                        enableNoAudioDetection: true,
                        enableNoisyMicDetection: true,
                        enableWelcomePage: false,
                        hideAddRoomButton: true,
                        hideConferenceSubject: true,
                        hideLobbyButton: true,
                        // hideDisplayName: false,
                        liveStreamingEnabled: false,
                        // noticeMessage: '',
                        prejoinPageEnabled: false,
                        p2p: {
                            enabled: true
                        },
                        remoteVideoMenu: {
                            disableKick: true,
                            disableGrantModerator: true
                        },
                        requireDisplayName: false,
                        subject: 'Quiteoften Call',
                        toolbarButtons: [
                            'camera',
                            // 'closedcaptions',
                            'desktop',
                            'fullscreen',
                            'hangup',
                            'microphone',
                            'select-background',
                            'settings',
                            'toggle-camera',
                            // 'videoquality'
                            // '__end'
                        ],
                        toolbarConfig: {
                            alwaysVisible: true
                        },
                        transcribingEnabled: true,
                        useHostPageLocalStorage: true,
                        userInfo: {
                            email: user.email,
                            displayName: user.fullName
                        }
                    }
                };

                const api = new window.JitsiMeetExternalAPI(domain, options);
                api.addEventListener('videoConferenceJoined', () => {
                    console.log('Local User Joined');
                    setLoading(false);
                    api.executeCommand('displayName', user.fullName);
                });
                api.addEventListener('videoConferenceLeft', () => {
                    console.log("handleVideoConferenceLeft");
                    setJoin(false);
                })
                return api
            } catch (error) {
                console.error('Failed to load Jitsi API', error);
            }
        }

        // verify the JitsiMeetExternalAPI constructor is added to the global..
        if (window.JitsiMeetExternalAPI) startConference();
        else alert('Jitsi Meet API script not loaded');
    }, [roomName, setJoin, user.fullName, user.email]);

    return (
        <>
            <div id="jitsi-container" className='tile is-child box' />
        </>

    );
}

export const JitsiMeetPortal = (componentToShow, join, setJoin) => {

    const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), []);

    return <>
        {/*
            Render the content that you want to move around later.
            InPortals render as normal, but send the output to detached DOM.
            MyExpensiveComponent will be rendered immediately, but until
            portalNode is used in an OutPortal, MyExpensiveComponent, it
            will not appear anywhere on the page.
        */}
        <portals.InPortal node={portalNode}>
            <JitsiMeetComponent
                // Optionally set props to use now, before this enters the DOM
                join={join}
                setJoin={setJoin}
            />
        </portals.InPortal>

        {/* ... The rest of your UI ... */}

        {/* Later, pass the portal node around to whoever might want to use it:
        {componentToShow === 'component-a'
            ? <ComponentA portalNode={portalNode} />
            : <ComponentB portalNode={portalNode} />} */}
    </>;

}

// Later still, pull content from the portal node and show it somewhere:

export const ComponentA = ({ portalNode }) => {
    return <div id='component-a'>
        {/* ... Some more UI ... */}

        {/* Show the content of the portal node here: */}
        <portals.OutPortal node={portalNode} />
    </div>;
}

export const ComponentB = ({ portalNode }) => {
    return <div id='component-b'>
        {/* ... Some more UI ... */}

        <portals.OutPortal
            node={portalNode}
            myProp={"newValue"}     // Optionally, override default values
            myOtherProp={123}       // Or add new props

        // These props go back to the content of the InPortal, and trigger a
        // component render (but on the same component instance) as if they
        // had been passed to MyExpensiveComponent directly.
        />
    </div>;
}

// const portalNode = createHtmlPortalNode();

// return React.createElement(() => {
//     const [useOuterDiv, setDivToUse] = React.useState(false);

//     return <div>
//         <InPortal node={portalNode}>
//             <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
//         </InPortal>

//         <button onClick={() => setDivToUse(!useOuterDiv)}>
//             Click to move the OutPortal
//         </button>

//         <hr />

//         <div>
//             <p>Outer OutPortal:</p>
//             {useOuterDiv === true && <OutPortal node={portalNode} />}
//             <Container>
//                 <Container>
//                     <Container>
//                         <p>Inner OutPortal:</p>
//                         {useOuterDiv === false && <OutPortal node={portalNode} />}
//                     </Container>
//                 </Container>
//             </Container>
//         </div>
//     </div>;
// })
// })