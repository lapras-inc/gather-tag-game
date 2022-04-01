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

type GameState = {
  oniId: string | null
}

const gameState: GameState = {
  oniId: null
}

// 鬼の見た目
const oniOutfitString = '{"skin":{"id":"KPK1RNe5O32vJ8IhOicy","parts":[{"spritesheetId":"dQCYs4n7O99ksXuBIe33","layerId":"skin front"}],"name":"typical","color":"3","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/BbNpZNRQylqIUmzc2QveW","type":"skin"},"hair":{"id":"3c64NGNFBD5bMLMpx8II","type":"hair","name":"pigtail dreads","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/g0jK_YLLwqI5nTOs77Vtm","parts":[{"spritesheetId":"AK0gSqf19MS6QxafQUFi","layerId":"hair back"},{"layerId":"hair front","spritesheetId":"N8eeTcplR9BBS3sAHZeD"}],"isDefault":true,"color":"red"},"facial_hair":{"id":"PxzDsPQO0muvYoRYnNT9","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/8XuZpyvW277EarW3jV5PR","color":"red","name":"short beard","parts":[{"spritesheetId":"ktQ1FuZP5fDteqypkZE1","layerId":"facial_hair front"}],"isDefault":true,"type":"facial_hair"},"top":null,"bottom":{"id":"CDZIn9vCeELUKeD8Qyi2","type":"bottom","color":"yellow","isDefault":true,"name":"shorts","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/KetP5l2L4YYj3KxviKWca","parts":[{"spritesheetId":"bs7WkOPMJWbxrLS6c7P4","layerId":"bottom front"}]},"shoes":null,"hat":{"id":"XJRE1niOEtcswUzzwIlx","name":"yarmulke","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/jd6idDnKOhFC-SvJUmREY","color":"white","parts":[{"layerId":"hat front","spritesheetId":"IzSBm8b0ZqyfiOhnJ4pf"}],"type":"hat"},"glasses":{"id":"4VTBpoUMc9ArGH13ZvsF","name":"eyepatch","color":"black","type":"glasses","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/yQWv5249ilyoVwwKuDjiI","isDefault":true,"parts":[{"layerId":"glasses front","spritesheetId":"I0NzldPc6I5i5ZUlcSP0"}]},"other":{"id":"MIkf9YIL8LRNrJ2VXFjQ","parts":[{"layerId":"other back","spritesheetId":"nNK840TmmRhIJcu8yEC0"},{"spritesheetId":"u0oJqP6Ky5gX5Ddz4Nze","layerId":"other front"}],"type":"other","name":"bat wings","color":"black","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/cIXQBDBROc2PWbGKwSx2-"},"costume":null}'
// 人間の見た目
const humanOutFitString = '{"skin":{"id":"KPK1RNe5O32vJ8IhOicy","isDefault":true,"type":"skin","parts":[{"spritesheetId":"dQCYs4n7O99ksXuBIe33","layerId":"skin front"}],"color":"3","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/BbNpZNRQylqIUmzc2QveW","name":"typical"},"hair":{"id":"CURjYhrlJhslNV5pJN9b","name":"bun","parts":[{"spritesheetId":"6B35DeKTr4eKXIBTRBGi","layerId":"hair front"}],"type":"hair","color":"yellow","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/om596IBXacH4s1Qk5exd5","isDefault":true},"facial_hair":{},"top":{"id":"9mBgEA70FAc2R3L0XQOy","name":"t shirt","type":"top","isDefault":true,"parts":[{"layerId":"top front","spritesheetId":"mM67X1J6SaKG46wWXLKz"}],"color":"yellow","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/JFfkmoq8gZSXAzTqLV2DP"},"bottom":{"id":"ua6kq1m7YDtCPmdkEMGa","parts":[{"layerId":"bottom front","spritesheetId":"52UR2uCjJmKsRXTA3AfY"}],"type":"bottom","name":"pants","color":"black","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/0-LLm4lN-a1F17lnEoe3P"},"shoes":{"id":"jWRxPyatM2P0bdzSnf50","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/kgDMGDXcC-ChLVRhOr7TZ","name":"generic","parts":[{"spritesheetId":"yFpcQh7UcvdChVN8WvIW","layerId":"shoes front"}],"isDefault":true,"type":"shoes","color":"black"},"hat":{},"glasses":{},"other":{},"costume":{}}'

const setInitialOni = (initialOniId: string, initialHumanIds: string[]) => {
  // 鬼を決めたり、開始時点の着替えを覚えたり、など
  game.setOutfitString(oniOutfitString, initialOniId)

  initialHumanIds.forEach(humanId => {
    game.setOutfitString(humanOutFitString, humanId)
  })

  gameState.oniId = initialOniId
  return
}

// subscribeToConnection(callback: (connected: boolean) => void): () => void;
game.subscribeToConnection(
  (connected) => {
    console.log('is connected: ', connected)
    game.subscribeToEvent('info', console.info)
    game.subscribeToEvent('warn', console.warn)
    game.subscribeToEvent('error', console.error)

    // playerMoves
    game.subscribeToEvent('playerMoves', () => {
      if (!Object.keys(game.players).length) return

      // 今いる player の座標を全部出す
      const players = Object.values(game.players)
      const playerIds = Object.keys(game.players)

      // TODO: ある地点に入ったらゲームを初期化する
      // P のところ
      const resetX = 16
      const resetY = 20
      for(const playerId of playerIds) {
        const player = game.players[playerId]
        const xDiff = player.x - resetX
        const yDiff = player.y - resetY
        if (xDiff === 0 && yDiff === 0) {
          // TODO: reset
          console.log('reset !!!! by player: ', player.name)
          const initialHumans = playerIds.filter(_playerId => _playerId !== playerId)
          setInitialOni(playerId, initialHumans)
          return
        }
      }


      const oni = game.players[gameState.oniId!]
      playerIds.forEach(playerId => {
        if(playerId === gameState.oniId) return
        const human = game.players[playerId]
        // 鬼からの相対的な座標を取ってる
        const xDiff = oni.x - human.x
        const yDiff = oni.y - human.y

        // 鬼との距離を出す
        const r = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        console.log(`${human.name} to oni: ${xDiff} ${yDiff}, r: ${r}`)

        // rが1以下だったらタッチ有効範囲内
        if (r <= 1) {
          console.log(`${human.name}, out !!!!!`)
          // human を鬼にする (鬼交代)
          game.setOutfitString(oniOutfitString, playerId)
          game.setOutfitString(humanOutFitString, gameState.oniId!)
          gameState.oniId = playerId
        }
      })
    })

    // game.subscribeToEvent('ready', (data, context) => {
    //     console.log('ready!!!')
    // })

    // setInterval(()=> {
    //     console.log('after setTimeout')
    //     console.log('partialMaps keys')
    //     console.log(Object.keys(game.partialMaps))

    //     console.log('players')
    //     console.log(game.players)

    //     if (Object.keys(game.players).length) {
    //         console.log('teleport!!!!')
    //         const playerId = Object.keys(game.players)[0]
    //         game.teleport('rw-6', 10, 20, playerId)
    //         // TODO: 鬼に着せ替える！
    //         // setOutfitString(outfitString: string, targetId?: string): void;

    //         // debugger;

    //         // const outFitString = '{"skin":{"id":"KPK1RNe5O32vJ8IhOicy","parts":[{"spritesheetId":"dQCYs4n7O99ksXuBIe33","layerId":"skin front"}],"name":"typical","color":"3","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/BbNpZNRQylqIUmzc2QveW","type":"skin"},"hair":{"id":"d6ffEhIDh5hv5teehjIT","type":"hair","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/gH-ZRIwwEn60v5wb7w1hG","name":"short side combed","color":"blue","parts":[{"spritesheetId":"V8rZ6pvCew1xbHWC6gRb","layerId":"hair front"}]},"facial_hair":null,"top":{"id":"3kboRSzmrmAPLZg8TW13","isDefault":true,"parts":[{"layerId":"top front","spritesheetId":"YBi8Oj86G2TBpwjAwDYd"}],"name":"t shirt","color":"black","type":"top","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/Xj7gdf4fUeqsOsx1UUuku"},"bottom":{"id":"oLNpVNy0WKrLGyT5pzUJ","type":"bottom","parts":[{"spritesheetId":"UzbB5TTbkmeLg7hfrUii","layerId":"bottom front"}],"isDefault":true,"name":"pants","color":"yellow","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/zIvXmpOR6pZsZSiJYb8pV"},"shoes":{"id":"jWRxPyatM2P0bdzSnf50","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/kgDMGDXcC-ChLVRhOr7TZ","isDefault":true,"type":"shoes","color":"black","parts":[{"layerId":"shoes front","spritesheetId":"yFpcQh7UcvdChVN8WvIW"}],"name":"generic"},"hat":null,"glasses":null,"other":null,"costume":null}'
    //         const oniOutfitString = '{"skin":{"id":"KPK1RNe5O32vJ8IhOicy","parts":[{"spritesheetId":"dQCYs4n7O99ksXuBIe33","layerId":"skin front"}],"name":"typical","color":"3","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/BbNpZNRQylqIUmzc2QveW","type":"skin"},"hair":{"id":"3c64NGNFBD5bMLMpx8II","type":"hair","name":"pigtail dreads","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/g0jK_YLLwqI5nTOs77Vtm","parts":[{"spritesheetId":"AK0gSqf19MS6QxafQUFi","layerId":"hair back"},{"layerId":"hair front","spritesheetId":"N8eeTcplR9BBS3sAHZeD"}],"isDefault":true,"color":"red"},"facial_hair":{"id":"PxzDsPQO0muvYoRYnNT9","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/8XuZpyvW277EarW3jV5PR","color":"red","name":"short beard","parts":[{"spritesheetId":"ktQ1FuZP5fDteqypkZE1","layerId":"facial_hair front"}],"isDefault":true,"type":"facial_hair"},"top":null,"bottom":{"id":"CDZIn9vCeELUKeD8Qyi2","type":"bottom","color":"yellow","isDefault":true,"name":"shorts","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/KetP5l2L4YYj3KxviKWca","parts":[{"spritesheetId":"bs7WkOPMJWbxrLS6c7P4","layerId":"bottom front"}]},"shoes":null,"hat":{"id":"XJRE1niOEtcswUzzwIlx","name":"yarmulke","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/jd6idDnKOhFC-SvJUmREY","color":"white","parts":[{"layerId":"hat front","spritesheetId":"IzSBm8b0ZqyfiOhnJ4pf"}],"type":"hat"},"glasses":{"id":"4VTBpoUMc9ArGH13ZvsF","name":"eyepatch","color":"black","type":"glasses","previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/yQWv5249ilyoVwwKuDjiI","isDefault":true,"parts":[{"layerId":"glasses front","spritesheetId":"I0NzldPc6I5i5ZUlcSP0"}]},"other":{"id":"MIkf9YIL8LRNrJ2VXFjQ","parts":[{"layerId":"other back","spritesheetId":"nNK840TmmRhIJcu8yEC0"},{"spritesheetId":"u0oJqP6Ky5gX5Ddz4Nze","layerId":"other front"}],"type":"other","name":"bat wings","color":"black","isDefault":true,"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/cIXQBDBROc2PWbGKwSx2-"},"costume":null}'
    //         game.setOutfitString(oniOutfitString, playerId)
    //     }
    // }, 5000)

    // TODO: タッチ判定
    // プレーヤーが動くと取れるイベントがある


    // テレポートしたい！
    // mapid [ 'rw-6', 'rw-poker', 'rw-roof-6', 'rw-speed-gathering' ]
  }
)


