import { useEffect , useState } from "react";

const useQuizSecurity = (onViolation) => {
    const [violationRemaining, setViolationRemaining] = useState(3);
    useEffect(() => {

        const disqualifyUser = () => {
            onViolation({message : "You have been disqualified due to multiple security violations." , disqualify : true});
            setViolationRemaining(0);
            document.exitFullscreen();
            window.onblur = null;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', disableCheats);
            document.removeEventListener('contextmenu', (e) => {
                e.preventDefault();
                onViolation({message : 'Right-click disabled' , disqualify : false} );
            });

        }
        const enterFullScreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        }

        const handleBlur = () => {
            if(violationRemaining <= 0) {
                disqualifyUser();
                
                return;
            }
            setViolationRemaining(prev => prev - 1);
            onViolation({message : "Window lost focus. Please return to the quiz." , disqualify : false});
        }

        const handleVisibilityChange = () => {
            if(violationRemaining <= 0) {
                disqualifyUser();
                return;
            }
            setViolationRemaining(prev => prev - 1);
            if (document.hidden) {
                onViolation({message : "Window hidden. Please return to the quiz." , disqualify : false});
            } else {
                enterFullScreen();
            }
        }

        const disableCheats = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.ctrlKey && e.key === 'U')
              ) {
                e.preventDefault();
                onViolation({message : 'Blocked key combination detected' , disqualify : false});
              }
        }

        enterFullScreen();
        window.onblur = handleBlur;
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', disableCheats);
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            onViolation('Right-click disabled');
        });

        return () => {
            window.onblur = null;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', disableCheats);
            document.removeEventListener('contextmenu', (e) => {
                e.preventDefault();
                onViolation({message : 'Right-click disabled' , disqualify : false} );
            });
        }

    }  , [onViolation])
};

export default useQuizSecurity;