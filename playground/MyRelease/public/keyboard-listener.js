export default function createKeyboardListener(document) {
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observeFunction) {
        state.observers.push(observeFunction)
    }

    function notifyAll(command) {
        //console.log(`createKeyboardListener.notifyAll => Notifing ${state.observers.length} observers`)
        for (const observeFunction of state.observers) 
            observeFunction(command)
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed: keyPressed
        }

        notifyAll(command)
    }
    return {
        subscribe,
        registerPlayerId
    }
}
