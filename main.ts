namespace SpriteKind {
    //% isKind
    export const AffectedByPhysics = SpriteKind.create()
}
//% color="#287d81"
namespace MiniTilemaps {
    //% block="Generate mini tilemap on all $selected tiles with collision $collisionImg"
    //% selected.shadow=tileset_tile_picker
    //% collisionImg.shadow=screen_image_picker
    export function GenerateCollision(selected: Image, collisionImg: Image) {
        for (let value2 of tiles.getTilesByType(selected)) {
            for (let index32 = 0; index32 <= collisionImg.width; index32++) {
                for (let index23 = 0; index23 <= collisionImg.height; index23++) {
                    if (0 != collisionImg.getPixel(index32, index23)) {
                        TileCollisionArrayX.push(value2.column * 16 + index32)
                        TileCollisionArrayY.push(value2.row * 16 + index23)
                    }
                }
            }
        }
    }
    //% block="Clear all mini tilemaps"
    export function ClearAll() {
        TileCollisionArrayX = []
        TileCollisionArrayY = []
    }

    // Small useful functions from extensions used in my extension, credit to MakeCode devs.
    export function setDataNumber(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }
    export function changeDataNumberBy(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = (d[name] || 0) + value;
    }
    export function readDataNumber(sprite: Sprite, name: string): number {
        if (!sprite || !name) return 0;
        const d = sprite.data;
        return d[name] as number;
    }
    export function onMapLoaded(cb: (tilemap: tiles.TileMapData) => void) {
        tiles.addEventListener(tiles.TileMapEvent.Loaded, cb);
    }
    export function onMapUnloaded(cb: (tilemap: tiles.TileMapData) => void) {
        tiles.addEventListener(tiles.TileMapEvent.Unloaded, cb);
    }
}
let cany = 0
let canx = 0
let repeat = 0
let cury = 0
let curx = 0
let TileCollisionArrayY = [0]
let TileCollisionArrayX = [0]
TileCollisionArrayY = []
TileCollisionArrayX = []
MiniTilemaps.onMapUnloaded(function () {
    TileCollisionArrayY = []
    TileCollisionArrayX = []
})
MiniTilemaps.onMapLoaded(function () {
    TileCollisionArrayY = []
    TileCollisionArrayX = []
})
game.onUpdate(function () {
    if (TileCollisionArrayX.length != 0) {
        for (let mySprite of sprites.allOfKind(SpriteKind.AffectedByPhysics)) {
            curx = mySprite.x
            cury = mySprite.y
            mySprite.setPosition(MiniTilemaps.readDataNumber(mySprite, "prevx"), MiniTilemaps.readDataNumber(mySprite, "prevy"))
            repeat = (Math.abs(curx - MiniTilemaps.readDataNumber(mySprite, "prevx")) + Math.abs(cury - MiniTilemaps.readDataNumber(mySprite, "prevy"))) * 2
            canx = 1
            cany = 1
            if (repeat > 0) {
                for (let index = 0; index <= repeat; index++) {
                    if (canx == 1) {
                        mySprite.x += (curx - MiniTilemaps.readDataNumber(mySprite, "prevx")) / repeat
                        if (canx == 1) {
                            for (let index2 = 0; index2 <= mySprite.width; index2++) {
                                if (TileCollisionArrayX.get(index2 + mySprite.left) == index2 + mySprite.left) {
                                    for (let index3 = 0; index3 <= mySprite.height; index3++) {
                                        if (TileCollisionArrayY.get(index3 + mySprite.top) == index3 + mySprite.top) {
                                            mySprite.y += 0 - (cury - MiniTilemaps.readDataNumber(mySprite, "prevy")) / repeat
                                            cany = 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (cany == 1) {
                        mySprite.y += (cury - MiniTilemaps.readDataNumber(mySprite, "prevy")) / repeat
                        for (let index22 = 0; index22 <= TileCollisionArrayY.length; index22++) {
                            if (cany == 1) {
                                for (let index2 = 0; index2 <= mySprite.width; index2++) {
                                    if (TileCollisionArrayX.get(index2 + mySprite.left) == index2 + mySprite.left) {
                                        for (let index3 = 0; index3 <= mySprite.height; index3++) {
                                            if (TileCollisionArrayY.get(index3 + mySprite.top) == index3 + mySprite.top) {
                                                mySprite.y += 0 - (cury - MiniTilemaps.readDataNumber(mySprite, "prevy")) / repeat
                                                cany = 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            MiniTilemaps.setDataNumber(mySprite, "prevx", mySprite.x)
            MiniTilemaps.setDataNumber(mySprite, "prevy", mySprite.y)
        }
    }
})
