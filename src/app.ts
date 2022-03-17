import { Game } from '@gathertown/gather-game-client';
global.WebSocket = require("isomorphic-ws");

console.log('Hello World');

function getApiKey() {
  if(!process.env.GATHER_API_KEY) {
    throw new Error('GATHER_API_KEY is not set');
  }
  return process.env.GATHER_API_KEY
}

function getSpaceId() {
  if (!process.env.GATHER_SPACE_ID) {
    throw new Error('GATHER_SPACE_ID is not set');
  }
  return process.env.GATHER_SPACE_ID
}

const game =  new Game(undefined, () => Promise.resolve({ apiKey: getApiKey() }));
game.init(getSpaceId());
game.connect();

// subscribeToConnection(callback: (connected: boolean) => void): () => void;
game.subscribeToConnection(
  (connected) => {
    console.log('is connected: ', connected)
    game.subscribeToEvent('info', console.info)
    game.subscribeToEvent('warn', console.warn)
    game.subscribeToEvent('error', console.error)

    // game.subscribeToEvent('ready', (data, context) => {
    //     console.log('ready!!!')
    // })

    setInterval(()=> {
        console.log('after setTimeout')
        console.log('partialMaps keys')
        console.log(Object.keys(game.partialMaps))

        console.log('players')
        console.log(game.players)

        if (Object.keys(game.players).length) {
            console.log('teleport!!!!')
            game.teleport('rw-6', 10, 20, Object.keys(game.players)[0])
        }
    }, 1000)

    // テレポートしたい！
    // mapid [ 'rw-6', 'rw-poker', 'rw-roof-6', 'rw-speed-gathering' ]
  }
)


