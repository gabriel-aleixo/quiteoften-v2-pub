import React from "react";
import { useState } from "react";

const VideoConference = ({ jitsi, setJitsi, join, setJoin, selectedPair, user, dbUser }) => {
    const jitsiContainerId = "jitsi-container-id";
    const [loading, setLoading] = useState(true);


    const loadJitsiScript = () => {
        let resolveLoadJitsiScriptPromise = null;

        const loadJitsiScriptPromise = new Promise(resolve => {
            resolveLoadJitsiScriptPromise = resolve;
        });

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolveLoadJitsiScriptPromise(true);
        document.body.appendChild(script);

        return loadJitsiScriptPromise;
    };

    const initialiseJitsi = async () => {
        if (!window.JitsiMeetExternalAPI) {
            await loadJitsiScript();
        }

        let roomName;

        if (dbUser.id === selectedPair.lead) {
            roomName = `${user.Account.Uid}-${user.Uid}-${selectedPair.otherUserOfPair.Uid}`
        } else {
            roomName = `${user.Account.Uid}-${selectedPair.otherUserOfPair.Uid}-${user.Uid}`
        }

        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            height: '100%',
            parentNode: document.getElementById(jitsiContainerId),
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

        const _jitsi = new window.JitsiMeetExternalAPI(domain, options);

        _jitsi.addEventListener('videoConferenceJoined', () => {
            console.log('Local User Joined');
            setLoading(false);
            _jitsi.executeCommand('displayName', user.fullName);
        });
        _jitsi.addEventListener('videoConferenceLeft', () => {
            console.log("handleVideoConferenceLeft");
            window.localStorage.removeItem('jitsiLocalStorage')
            setJoin(false);
        })


        setJitsi(_jitsi);
        const iFrame = _jitsi.getIFrame()
        return iFrame;
    };

    React.useEffect(() => {
        const open = async () => {
            const iFrame = await initialiseJitsi();
            iFrame.classList.add('card');
        };
        open();
        return () => {
            jitsi?.dispose?.();
        };
    }, []);


    return (
        <>
            <div id={jitsiContainerId} className='tile is-child box' style={{ padding: 0 }}/>
        </>
    )

};

export default VideoConference;
