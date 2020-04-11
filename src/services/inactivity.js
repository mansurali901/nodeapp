import constants from '../constants'

export default (() => {
  const events = ['click', 'contextmenu', 'keypress', 'scroll', 'touchstart', 'wheel'];
  let timerReference;
  let logoutActionSubject;
  let logoutCallback;

  const logout = () => {
    logoutCallback();
  };

  const clearTimer = () => {
    clearTimeout(timerReference);
  };

  const resetTimer = () => {
    clearTimer();
    timerReference = setTimeout(logout, constants.inactivityTimeoutDuration);
  };

  const addInactivityListeners = () => {
    window.addEventListener('load', resetTimer, true);
    events.forEach((eventName) => {
      document.addEventListener(eventName, resetTimer, true); 
    });
  };

  const removeInactivityListeners = () => {
    window.removeEventListener('load', resetTimer, true);
    events.forEach((eventName) => {
      document.removeEventListener(eventName, resetTimer, true); 
    });
  };

  const start = (callback) => {
    stop();
    resetTimer();
    addInactivityListeners();
    logoutCallback = callback;
  }

  const stop = () => {
    removeInactivityListeners();
    clearTimer();
    if (logoutActionSubject) {
      logoutActionSubject.complete();
    }
  }

  return {
    start: start,
    stop: stop
  }
})();