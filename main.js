import Game from "./making-games/game";
import Player from "./making-games/player";
import Box from "./making-games/box";
import Ladder from "./making-games/ladder";
import Region from "region";
import Map from "./map";

var game = new Game();

Map.forEach((object) => {
    var sprite = null;

    if (object.url) {
        sprite = new PIXI.Sprite.fromImage(
            object.url
        );
    }

    var rectangle = new PIXI.Rectangle(
        object.left,
        object.top,
        object.width,
        object.height
    );

    if (object.type === "player") {
        var actor = new Player(
            sprite,
            rectangle
        );
    }

    if (object.type === "ladder") {
        var actor = new Ladder(
            sprite,
            rectangle
        );
    }

    if (object.type === "box") {
        var actor = new Box(
            sprite,
            rectangle
        );
    }

    game.addObject(actor);
});

game.addEventListenerToElement(window);
game.addRendererToElement(document.body);
game.animate();
