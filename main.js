import Game from "./making-games/game";
import Player from "./making-games/player";
import Box from "./making-games/box";
import Ladder from "./making-games/ladder";
import Region from "region";
import Map from "./map";

var game = new Game();

Map.forEach((object) => {
    if (object.type === "box") {
        var sprite = null;

        if (object.url) {
            sprite = new PIXI.Sprite.fromImage(
                object.url
            );
        }

        var box = new Box(
            sprite,
            new PIXI.Rectangle(
                object.left,
                object.top,
                object.width,
                object.height
            )
        )

        game.addObject(box);
    }
})

game.addEventListenerToElement(window);
game.addRendererToElement(document.body);
game.animate();
