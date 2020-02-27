export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function start() {
        const frequency = 5000
        setInterval(addFruit, frequency)
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function subscribe(observeFunction) {
        observers.push(observeFunction)
    }

    function notifyAll(command) {
        for (const observeFunction of observers) 
            observeFunction(command)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
                
        state.players[playerId] = {
            x: playerX,
            y: playerY
        }
        
        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        delete state.players[command.playerId]
        notifyAll({
            type: 'remove-player',
            playerId: command.playerId
        })
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        delete state.fruits[command.fruitId]
        notifyAll({
            type: 'remove-fruit',
            fruitId: command.fruitId
        })
    }

    function movePlayer(command) {
        console.log(`createGame.movePlayer => Moving ${command.playerId} with ${command.keyPressed}`)
        notifyAll(command)
        const acceptMoves = {
            ArrowUp(player) {
                if ( player.y > 0 ) {
                    player.y = player.y - 1
                }
                //console.log(`createGame.movePlayer.ArrowUp => (${player.x},${player.y})`)
            },
            ArrowDown(player) {
                if ( player.y + 1 < state.screen.height ){
                    player.y = player.y + 1
                }
                //console.log(`createGame.movePlayer.ArrowDown => (${player.x},${player.y})`)
            },
            ArrowLeft(player) {
                if ( player.x > 0 ){
                    player.x = player.x - 1
                }
                //console.log(`createGame.movePlayer.ArrowLeft => (${player.x},${player.y})`)
            },
            ArrowRight(player) {
                if ( player.x + 1 < state.screen.width ){
                    player.x = player.x + 1
                }
                //console.log(`createGame.movePlayer.ArrowRight => (${player.x},${player.y})`)
            }
        }
        const keyPressed = command.keyPressed
        const player = state.players[command.playerId]
        const moveFunction = acceptMoves[keyPressed]
        if (player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(command.playerId)
        }
    }
    
    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checking [${playerId}] (${player.x},${player.y}) and [${fruitId}] (${fruit.x},${fruit.y})`)
            if (fruit.x == player.x && fruit.y == player.y) {
                console.log('COLLISION')
                removeFruit({fruitId})
            }
        }
    }
    
    return {
        start,
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        subscribe
    }
}
