(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _makingGamesGame = require("./making-games/game");

var _makingGamesGame2 = _interopRequireDefault(_makingGamesGame);

var _makingGamesPlayer = require("./making-games/player");

var _makingGamesPlayer2 = _interopRequireDefault(_makingGamesPlayer);

var _makingGamesBox = require("./making-games/box");

var _makingGamesBox2 = _interopRequireDefault(_makingGamesBox);

var _makingGamesLadder = require("./making-games/ladder");

var _makingGamesLadder2 = _interopRequireDefault(_makingGamesLadder);

var _region = require("region");

var _region2 = _interopRequireDefault(_region);

var _map = require("./map");

var _map2 = _interopRequireDefault(_map);

var game = new _makingGamesGame2["default"]();

_map2["default"].forEach(function (object) {
    var sprite = null;

    if (object.url) {
        sprite = new PIXI.Sprite.fromImage(object.url);
    }

    var rectangle = new PIXI.Rectangle(object.left, object.top, object.width, object.height);

    if (object.type === "player") {
        var actor = new _makingGamesPlayer2["default"](sprite, rectangle);
    }

    if (object.type === "ladder") {
        var actor = new _makingGamesLadder2["default"](sprite, rectangle);
    }

    if (object.type === "box") {
        var actor = new _makingGamesBox2["default"](sprite, rectangle);
    }

    game.addObject(actor);
});

game.addEventListenerToElement(window);
game.addRendererToElement(document.body);
game.animate();

},{"./making-games/box":2,"./making-games/game":3,"./making-games/ladder":4,"./making-games/player":5,"./map":6,"region":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = (function () {
    _createClass(Box, [{
        key: "collides",
        value: function collides(state) {
            var _this = this;

            var collides = false;

            state.objects.forEach(function (object) {
                if (object.constructor.name !== "Player") {
                    return;
                }

                var edges = _this.getEdges(_this, object);

                if (!(edges.boxTop > edges.playerBottom || edges.boxRight < edges.playerLeft || edges.boxBottom < edges.playerTop || edges.boxLeft > edges.playerRight)) {
                    collides = true;
                    return;
                }
            });

            return collides;
        }
    }, {
        key: "getEdges",
        value: function getEdges(box, player) {
            return {
                "boxLeft": box.rectangle.x,
                "boxRight": box.rectangle.x + box.rectangle.width,
                "boxTop": box.rectangle.y,
                "boxBottom": box.rectangle.y + box.rectangle.height,
                "playerLeft": player.rectangle.x,
                "playerRight": player.rectangle.x + player.rectangle.width,
                "playerTop": player.rectangle.y,
                "playerBottom": player.rectangle.y + player.rectangle.height
            };
        }
    }, {
        key: "collidesInDirection",
        value: function collidesInDirection(box, player) {
            var edges = this.getEdges(box, player);

            var offsetLeft = edges.playerRight - edges.boxLeft;
            var offsetRight = edges.boxRight - edges.playerLeft;
            var offsetTop = edges.playerBottom - edges.boxTop;
            var offsetBottom = edges.boxBottom - edges.playerTop;

            if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetTop) {
                return "↓";
            }

            if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetBottom) {
                return "↑";
            }

            if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetLeft) {
                return "→";
            }

            if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetRight) {
                return "←";
            }

            return "unknown";
        }
    }]);

    function Box(sprite, rectangle) {
        _classCallCheck(this, Box);

        this.sprite = sprite;
        this.rectangle = rectangle;
    }

    _createClass(Box, [{
        key: "animate",
        value: function animate(state) {
            if (this.sprite) {
                this.sprite.x = this.rectangle.x;
                this.sprite.y = this.rectangle.y;
            }
        }
    }]);

    return Box;
})();

exports["default"] = Box;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = (function () {
    function Game() {
        _classCallCheck(this, Game);

        this.state = {
            "keys": {},
            "clicks": {},
            "mouse": {},
            "objects": []
        };
    }

    _createClass(Game, [{
        key: "newStage",
        value: function newStage() {
            return new PIXI.Container();
        }
    }, {
        key: "newRenderer",
        value: function newRenderer() {
            return new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, this.newRendererOptions());
        }
    }, {
        key: "newRendererOptions",
        value: function newRendererOptions() {
            return {
                "antialias": true,
                "autoResize": true,
                "transparent": true,
                "resolution": 2
            };
        }
    }, {
        key: "animate",
        value: function animate() {
            var _this = this;

            var caller = function caller() {
                requestAnimationFrame(caller);

                _this.state.renderer = _this.renderer;
                _this.state.stage = _this.stage;

                _this.state.objects.forEach(function (object) {
                    object.animate(_this.state);
                });

                _this.renderer.render(_this.stage);
            };

            caller();

            return this;
        }
    }, {
        key: "addEventListenerToElement",
        value: function addEventListenerToElement(element) {
            var _this2 = this;

            element.addEventListener("keydown", function (event) {
                _this2.state.keys[event.keyCode] = true;
            });

            element.addEventListener("keyup", function (event) {
                _this2.state.keys[event.keyCode] = false;
            });

            element.addEventListener("mousedown", function (event) {
                _this2.state.clicks[event.which] = {
                    "clientX": event.clientX,
                    "clientY": event.clientY
                };
            });

            element.addEventListener("mouseup", function (event) {
                _this2.state.clicks[event.which] = false;
            });

            element.addEventListener("mousemove", function (event) {
                _this2.state.mouse.clientX = event.clientX;
                _this2.state.mouse.clientY = event.clientY;
            });

            return this;
        }
    }, {
        key: "addRendererToElement",
        value: function addRendererToElement(element) {
            element.appendChild(this.renderer.view);

            return this;
        }
    }, {
        key: "addObject",
        value: function addObject(object) {
            this.state.objects.push(object);

            if (object.sprite) {
                this.stage.addChild(object.sprite);
            }

            return this;
        }
    }, {
        key: "stage",
        get: function get() {
            if (!this._stage) {
                this._stage = this.newStage();
            }

            return this._stage;
        },
        set: function set(stage) {
            this._stage = stage;
        }
    }, {
        key: "renderer",
        get: function get() {
            if (!this._renderer) {
                this._renderer = this.newRenderer();
            }

            return this._renderer;
        },
        set: function set(renderer) {
            this._renderer = renderer;
        }
    }]);

    return Game;
})();

exports["default"] = Game;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _box = require("./box");

var _box2 = _interopRequireDefault(_box);

var Ladder = (function (_Box) {
  _inherits(Ladder, _Box);

  function Ladder() {
    _classCallCheck(this, Ladder);

    _get(Object.getPrototypeOf(Ladder.prototype), "constructor", this).apply(this, arguments);
  }

  return Ladder;
})(_box2["default"]);

exports["default"] = Ladder;
module.exports = exports["default"];

},{"./box":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = (function () {
    function Player(sprite, rectangle) {
        _classCallCheck(this, Player);

        this.sprite = sprite;
        this.rectangle = rectangle;

        this.velocityX = 0;
        this.maximumVelocityX = 12;
        this.accelerationX = 2;
        this.frictionX = 0.9;

        this.velocityY = 0;
        this.maximumVelocityY = 20;
        this.accelerationY = 5;
        this.jumpVelocity = -40;

        this.climbingSpeed = 10;
    }

    _createClass(Player, [{
        key: "animate",
        value: function animate(state) {
            var _this = this;

            if (state.keys[37]) {
                this.velocityX = Math.max(this.velocityX - this.accelerationX, this.maximumVelocityX * -1);
            }

            if (state.keys[39]) {
                this.velocityX = Math.min(this.velocityX + this.accelerationX, this.maximumVelocityX);
            }

            this.velocityX *= this.frictionX;

            this.velocityY = Math.min(this.velocityY + this.accelerationY, this.maximumVelocityY);

            var onLadder = false;

            state.objects.forEach(function (object) {
                if (object === _this) {
                    return;
                }

                if (object.collides(state)) {
                    var type = object.constructor.name;
                    var direction = object.collidesInDirection(object, _this);

                    if (type === "Ladder") {
                        onLadder = true;

                        var player = _this.rectangle;
                        var ladder = object.rectangle;

                        if (state.keys[38] || state.keys[40]) {
                            _this.grounded = false;
                            _this.jumping = false;
                            _this.climbing = true;
                            _this.velocityY = 0;
                            _this.velocityX = 0;
                        }

                        if (state.keys[38]) {
                            var limit = ladder.y - _this.rectangle.height + 1;

                            _this.rectangle.y = Math.max(_this.rectangle.y -= _this.climbingSpeed, limit);

                            if (player.y === limit) {
                                _this.grounded = true;
                                _this.jumping = false;
                            }
                        }

                        if (state.keys[40] && player.y + player.height < ladder.y + ladder.height) {
                            _this.rectangle.y += _this.climbingSpeed;
                        }

                        return;
                    }

                    if (type === "Box") {
                        if (direction === "↓") {
                            _this.velocityY = 0;
                            _this.grounded = true;
                            _this.jumping = false;
                        }

                        if (direction === "↑") {
                            _this.velocityY = _this.accelerationY;
                        }

                        if (direction === "←" && _this.velocityX < 0) {
                            _this.velocityX = 0;
                        }

                        if (direction === "→" && _this.velocityX > 0) {
                            _this.velocityX = 0;
                        }
                    }
                }
            });

            if (!onLadder) {
                this.climbing = false;
            }

            if (state.keys[38] && this.grounded && !this.climbing) {
                this.velocityY = this.jumpVelocity;
                this.jumping = true;
                this.grounded = false;
            }

            this.rectangle.x += this.velocityX;

            if (!this.climbing) {
                this.rectangle.y += this.velocityY;
            }

            this.sprite.x = this.rectangle.x;
            this.sprite.y = this.rectangle.y;
        }
    }]);

    return Player;
})();

exports["default"] = Player;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = [{
    "type": "box",
    "left": 96,
    "top": 0,
    "url": "assets/room1.png",
    "width": 96,
    "height": 192
}, {
    "type": "box",
    "left": 32,
    "top": 96,
    "url": "assets/room2.png",
    "width": 64,
    "height": 128
}, {
    "type": "box",
    "left": 0,
    "top": 128,
    "url": "assets/room3.png",
    "width": 32,
    "height": 224
}, {
    "type": "box",
    "left": 32,
    "top": 256,
    "url": "assets/room4.png",
    "width": 64,
    "height": 96
}, {
    "type": "box",
    "left": 96,
    "top": 224,
    "url": "assets/room5.png",
    "width": 64,
    "height": 128
}, {
    "type": "box",
    "left": 160,
    "top": 160,
    "url": "assets/room6.png",
    "width": 160,
    "height": 128
}, {
    "type": "box",
    "left": 224,
    "top": 192,
    "url": "assets/room7.png",
    "width": 96,
    "height": 96
}, {
    "type": "box",
    "left": 224,
    "top": 256,
    "url": "assets/room8.png",
    "width": 96,
    "height": 160
}, {
    "type": "box",
    "left": 160,
    "top": 320,
    "url": "assets/room9.png",
    "width": 64,
    "height": 128
}, {
    "type": "box",
    "left": 96,
    "top": 352,
    "url": "assets/room10.png",
    "width": 96,
    "height": 128
}];
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
module.exports = require('./src')
},{"./src":12}],8:[function(require,module,exports){
'use strict'

var hasOwn = Object.prototype.hasOwnProperty

function curry(fn, n){

    if (typeof n !== 'number'){
        n = fn.length
    }

    function getCurryClosure(prevArgs){

        function curryClosure() {

            var len  = arguments.length
            var args = [].concat(prevArgs)

            if (len){
                args.push.apply(args, arguments)
            }

            if (args.length < n){
                return getCurryClosure(args)
            }

            return fn.apply(this, args)
        }

        return curryClosure
    }

    return getCurryClosure([])
}


module.exports = curry(function(object, property){
    return hasOwn.call(object, property)
})
},{}],9:[function(require,module,exports){
module.exports = function(){

    'use strict';

    var fns = {}

    return function(len){

        if ( ! fns [len ] ) {

            var args = []
            var i    = 0

            for (; i < len; i++ ) {
                args.push( 'a[' + i + ']')
            }

            fns[len] = new Function(
                            'c',
                            'a',
                            'return new c(' + args.join(',') + ')'
                        )
        }

        return fns[len]
    }

}()
},{}],10:[function(require,module,exports){
var getInstantiatorFunction = require('./getInstantiatorFunction')

module.exports = function(fn, args){
	return getInstantiatorFunction(args.length)(fn, args)
}
},{"./getInstantiatorFunction":9}],11:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],12:[function(require,module,exports){
'use strict';

var hasOwn    = require('hasown')
var newify    = require('newify')

var assign      = require('object-assign');
var EventEmitter = require('events').EventEmitter

var inherits = require('./inherits')
var VALIDATE = require('./validate')

var objectToString = Object.prototype.toString

var isObject = function(value){
    return objectToString.apply(value) === '[object Object]'
}

function copyList(source, target, list){
    if (source){
        list.forEach(function(key){
            if (hasOwn(source, key)){
                target[key] = source[key]
            }
        })
    }

    return target
}

/**
 * @class Region
 *
 * The Region is an abstraction that allows the developer to refer to rectangles on the screen,
 * and move them around, make diffs and unions, detect intersections, compute areas, etc.
 *
 * ## Creating a region
 *      var region = require('region')({
 *          top  : 10,
 *          left : 10,
 *          bottom: 100,
 *          right : 100
 *      })
 *      //this region is a square, 90x90, starting from (10,10) to (100,100)
 *
 *      var second = require('region')({ top: 10, left: 100, right: 200, bottom: 60})
 *      var union  = region.getUnion(second)
 *
 *      //the "union" region is a union between "region" and "second"
 */

var POINT_POSITIONS = {
        cy: 'YCenter',
        cx: 'XCenter',
        t : 'Top',
        tc: 'TopCenter',
        tl: 'TopLeft',
        tr: 'TopRight',
        b : 'Bottom',
        bc: 'BottomCenter',
        bl: 'BottomLeft',
        br: 'BottomRight',
        l : 'Left',
        lc: 'LeftCenter',
        r : 'Right',
        rc: 'RightCenter',
        c : 'Center'
    }

/**
 * @constructor
 *
 * Construct a new Region.
 *
 * Example:
 *
 *      var r = new Region({ top: 10, left: 20, bottom: 100, right: 200 })
 *
 *      //or, the same, but with numbers (can be used with new or without)
 *
 *      r = Region(10, 200, 100, 20)
 *
 *      //or, with width and height
 *
 *      r = Region({ top: 10, left: 20, width: 180, height: 90})
 *
 * @param {Number|Object} top The top pixel position, or an object with top, left, bottom, right properties. If an object is passed,
 * instead of having bottom and right, it can have width and height.
 *
 * @param {Number} right The right pixel position
 * @param {Number} bottom The bottom pixel position
 * @param {Number} left The left pixel position
 *
 * @return {Region} this
 */
var REGION = function(top, right, bottom, left){

    if (!(this instanceof REGION)){
        return newify(REGION, arguments)
    }

    EventEmitter.call(this)

    if (isObject(top)){
        copyList(top, this, ['top','right','bottom','left'])

        if (top.bottom == null && top.height != null){
            this.bottom = this.top + top.height
        }
        if (top.right == null && top.width != null){
            this.right = this.left + top.width
        }

        if (top.emitChangeEvents){
            this.emitChangeEvents = top.emitChangeEvents
        }
    } else {
        this.top    = top
        this.right  = right
        this.bottom = bottom
        this.left   = left
    }

    this[0] = this.left
    this[1] = this.top

    VALIDATE(this)
}

inherits(REGION, EventEmitter)

assign(REGION.prototype, {

    /**
     * @cfg {Boolean} emitChangeEvents If this is set to true, the region
     * will emit 'changesize' and 'changeposition' whenever the size or the position changs
     */
    emitChangeEvents: false,

    /**
     * Returns this region, or a clone of this region
     * @param  {Boolean} [clone] If true, this method will return a clone of this region
     * @return {Region}       This region, or a clone of this
     */
    getRegion: function(clone){
        return clone?
                    this.clone():
                    this
    },

    /**
     * Sets the properties of this region to those of the given region
     * @param {Region/Object} reg The region or object to use for setting properties of this region
     * @return {Region} this
     */
    setRegion: function(reg){

        if (reg instanceof REGION){
            this.set(reg.get())
        } else {
            this.set(reg)
        }

        return this
    },

    /**
     * Returns true if this region is valid, false otherwise
     *
     * @param  {Region} region The region to check
     * @return {Boolean}        True, if the region is valid, false otherwise.
     * A region is valid if
     *  * left <= right  &&
     *  * top  <= bottom
     */
    validate: function(){
        return REGION.validate(this)
    },

    _before: function(){
        if (this.emitChangeEvents){
            return copyList(this, {}, ['left','top','bottom','right'])
        }
    },

    _after: function(before){
        if (this.emitChangeEvents){

            if(this.top != before.top || this.left != before.left) {
                this.emitPositionChange()
            }

            if(this.right != before.right || this.bottom != before.bottom) {
                this.emitSizeChange()
            }
        }
    },

    notifyPositionChange: function(){
        this.emit('changeposition', this)
    },

    emitPositionChange: function(){
        this.notifyPositionChange()
    },

    notifySizeChange: function(){
        this.emit('changesize', this)
    },

    emitSizeChange: function(){
        this.notifySizeChange()
    },

    /**
     * Add the given amounts to each specified side. Example
     *
     *      region.add({
     *          top: 50,    //add 50 px to the top side
     *          bottom: -100    //substract 100 px from the bottom side
     *      })
     *
     * @param {Object} directions
     * @param {Number} [directions.top]
     * @param {Number} [directions.left]
     * @param {Number} [directions.bottom]
     * @param {Number} [directions.right]
     *
     * @return {Region} this
     */
    add: function(directions){

        var before = this._before()
        var direction

        for (direction in directions) if ( hasOwn(directions, direction) ) {
            this[direction] += directions[direction]
        }

        this[0] = this.left
        this[1] = this.top

        this._after(before)

        return this
    },

    /**
     * The same as {@link #add}, but substracts the given values
     * @param {Object} directions
     * @param {Number} [directions.top]
     * @param {Number} [directions.left]
     * @param {Number} [directions.bottom]
     * @param {Number} [directions.right]
     *
     * @return {Region} this
     */
    substract: function(directions){

        var before = this._before()
        var direction

        for (direction in directions) if (hasOwn(directions, direction) ) {
            this[direction] -= directions[direction]
        }

        this[0] = this.left
        this[1] = this.top

        this._after(before)

        return this
    },

    /**
     * Retrieves the size of the region.
     * @return {Object} An object with {width, height}, corresponding to the width and height of the region
     */
    getSize: function(){
        return {
            width  : this.width,
            height : this.height
        }
    },

    /**
     * Move the region to the given position and keeps the region width and height.
     *
     * @param {Object} position An object with {top, left} properties. The values in {top,left} are used to move the region by the given amounts.
     * @param {Number} [position.left]
     * @param {Number} [position.top]
     *
     * @return {Region} this
     */
    setPosition: function(position){
        var width  = this.width
        var height = this.height

        if (position.left != undefined){
            position.right  = position.left + width
        }

        if (position.top != undefined){
            position.bottom = position.top  + height
        }

        return this.set(position)
    },

    /**
     * Sets both the height and the width of this region to the given size.
     *
     * @param {Number} size The new size for the region
     * @return {Region} this
     */
    setSize: function(size){
        if (size.height != undefined && size.width != undefined){
            return this.set({
                right  : this.left + size.width,
                bottom : this.top  + size.height
            })
        }

        if (size.width != undefined){
            this.setWidth(size.width)
        }

        if (size.height != undefined){
            this.setHeight(size.height)
        }

        return this
    },



    /**
     * @chainable
     *
     * Sets the width of this region
     * @param {Number} width The new width for this region
     * @return {Region} this
     */
    setWidth: function(width){
        return this.set({
            right: this.left + width
        })
    },

    /**
     * @chainable
     *
     * Sets the height of this region
     * @param {Number} height The new height for this region
     * @return {Region} this
     */
    setHeight: function(height){
        return this.set({
            bottom: this.top + height
        })
    },

    /**
     * Sets the given properties on this region
     *
     * @param {Object} directions an object containing top, left, and EITHER bottom, right OR width, height
     * @param {Number} [directions.top]
     * @param {Number} [directions.left]
     *
     * @param {Number} [directions.bottom]
     * @param {Number} [directions.right]
     *
     * @param {Number} [directions.width]
     * @param {Number} [directions.height]
     *
     *
     * @return {Region} this
     */
    set: function(directions){
        var before = this._before()

        copyList(directions, this, ['left','top','bottom','right'])

        if (directions.bottom == null && directions.height != null){
            this.bottom = this.top + directions.height
        }
        if (directions.right == null && directions.width != null){
            this.right = this.left + directions.width
        }

        this[0] = this.left
        this[1] = this.top

        this._after(before)

        return this
    },

    /**
     * Retrieves the given property from this region. If no property is given, return an object
     * with {left, top, right, bottom}
     *
     * @param {String} [dir] the property to retrieve from this region
     * @return {Number/Object}
     */
    get: function(dir){
        return dir? this[dir]:
                    copyList(this, {}, ['left','right','top','bottom'])
    },

    /**
     * Shifts this region to either top, or left or both.
     * Shift is similar to {@link #add} by the fact that it adds the given dimensions to top/left sides, but also adds the given dimensions
     * to bottom and right
     *
     * @param {Object} directions
     * @param {Number} [directions.top]
     * @param {Number} [directions.left]
     *
     * @return {Region} this
     */
    shift: function(directions){

        var before = this._before()

        if (directions.top){
            this.top    += directions.top
            this.bottom += directions.top
        }

        if (directions.left){
            this.left  += directions.left
            this.right += directions.left
        }

        this[0] = this.left
        this[1] = this.top

        this._after(before)

        return this
    },

    /**
     * Same as {@link #shift}, but substracts the given values
     * @chainable
     *
     * @param {Object} directions
     * @param {Number} [directions.top]
     * @param {Number} [directions.left]
     *
     * @return {Region} this
     */
    unshift: function(directions){

        if (directions.top){
            directions.top *= -1
        }

        if (directions.left){
            directions.left *= -1
        }

        return this.shift(directions)
    },

    /**
     * Compare this region and the given region. Return true if they have all the same size and position
     * @param  {Region} region The region to compare with
     * @return {Boolean}       True if this and region have same size and position
     */
    equals: function(region){
        return this.equalsPosition(region) && this.equalsSize(region)
    },

    /**
     * Returns true if this region has the same bottom,right properties as the given region
     * @param  {Region/Object} size The region to compare against
     * @return {Boolean}       true if this region is the same size as the given size
     */
    equalsSize: function(size){
        var isInstance = size instanceof REGION

        var s = {
            width: size.width == null && isInstance?
                    size.getWidth():
                    size.width,

            height: size.height == null && isInstance?
                    size.getHeight():
                    size.height
        }
        return this.getWidth() == s.width && this.getHeight() == s.height
    },

    /**
     * Returns true if this region has the same top,left properties as the given region
     * @param  {Region} region The region to compare against
     * @return {Boolean}       true if this.top == region.top and this.left == region.left
     */
    equalsPosition: function(region){
        return this.top == region.top && this.left == region.left
    },

    /**
     * Adds the given ammount to the left side of this region
     * @param {Number} left The ammount to add
     * @return {Region} this
     */
    addLeft: function(left){
        var before = this._before()

        this.left = this[0] = this.left + left

        this._after(before)

        return this
    },

    /**
     * Adds the given ammount to the top side of this region
     * @param {Number} top The ammount to add
     * @return {Region} this
     */
    addTop: function(top){
        var before = this._before()

        this.top = this[1] = this.top + top

        this._after(before)

        return this
    },

    /**
     * Adds the given ammount to the bottom side of this region
     * @param {Number} bottom The ammount to add
     * @return {Region} this
     */
    addBottom: function(bottom){
        var before = this._before()

        this.bottom += bottom

        this._after(before)

        return this
    },

    /**
     * Adds the given ammount to the right side of this region
     * @param {Number} right The ammount to add
     * @return {Region} this
     */
    addRight: function(right){
        var before = this._before()

        this.right += right

        this._after(before)

        return this
    },

    /**
     * Minimize the top side.
     * @return {Region} this
     */
    minTop: function(){
        return this.expand({top: 1})
    },
    /**
     * Minimize the bottom side.
     * @return {Region} this
     */
    maxBottom: function(){
        return this.expand({bottom: 1})
    },
    /**
     * Minimize the left side.
     * @return {Region} this
     */
    minLeft: function(){
        return this.expand({left: 1})
    },
    /**
     * Maximize the right side.
     * @return {Region} this
     */
    maxRight: function(){
        return this.expand({right: 1})
    },

    /**
     * Expands this region to the dimensions of the given region, or the document region, if no region is expanded.
     * But only expand the given sides (any of the four can be expanded).
     *
     * @param {Object} directions
     * @param {Boolean} [directions.top]
     * @param {Boolean} [directions.bottom]
     * @param {Boolean} [directions.left]
     * @param {Boolean} [directions.right]
     *
     * @param {Region} [region] the region to expand to, defaults to the document region
     * @return {Region} this region
     */
    expand: function(directions, region){
        var docRegion = region || REGION.getDocRegion()
        var list      = []
        var direction
        var before = this._before()

        for (direction in directions) if ( hasOwn(directions, direction) ) {
            list.push(direction)
        }

        copyList(docRegion, this, list)

        this[0] = this.left
        this[1] = this.top

        this._after(before)

        return this
    },

    /**
     * Returns a clone of this region
     * @return {Region} A new region, with the same position and dimension as this region
     */
    clone: function(){
        return new REGION({
                    top    : this.top,
                    left   : this.left,
                    right  : this.right,
                    bottom : this.bottom
                })
    },

    /**
     * Returns true if this region contains the given point
     * @param {Number/Object} x the x coordinate of the point
     * @param {Number} [y] the y coordinate of the point
     *
     * @return {Boolean} true if this region constains the given point, false otherwise
     */
    containsPoint: function(x, y){
        if (arguments.length == 1){
            y = x.y
            x = x.x
        }

        return this.left <= x  &&
               x <= this.right &&
               this.top <= y   &&
               y <= this.bottom
    },

    /**
     *
     * @param region
     *
     * @return {Boolean} true if this region contains the given region, false otherwise
     */
    containsRegion: function(region){
        return this.containsPoint(region.left, region.top)    &&
               this.containsPoint(region.right, region.bottom)
    },

    /**
     * Returns an object with the difference for {top, bottom} positions betwen this and the given region,
     *
     * See {@link #diff}
     * @param  {Region} region The region to use for diff
     * @return {Object}        {top,bottom}
     */
    diffHeight: function(region){
        return this.diff(region, {top: true, bottom: true})
    },

    /**
     * Returns an object with the difference for {left, right} positions betwen this and the given region,
     *
     * See {@link #diff}
     * @param  {Region} region The region to use for diff
     * @return {Object}        {left,right}
     */
    diffWidth: function(region){
        return this.diff(region, {left: true, right: true})
    },

    /**
     * Returns an object with the difference in sizes for the given directions, between this and region
     *
     * @param  {Region} region     The region to use for diff
     * @param  {Object} directions An object with the directions to diff. Can have any of the following keys:
     *  * left
     *  * right
     *  * top
     *  * bottom
     *
     * @return {Object} and object with the same keys as the directions object, but the values being the
     * differences between this region and the given region
     */
    diff: function(region, directions){
        var result = {}
        var dirName

        for (dirName in directions) if ( hasOwn(directions, dirName) ) {
            result[dirName] = this[dirName] - region[dirName]
        }

        return result
    },

    /**
     * Returns the position, in {left,top} properties, of this region
     *
     * @return {Object} {left,top}
     */
    getPosition: function(){
        return {
            left: this.left,
            top : this.top
        }
    },

    /**
     * Returns the point at the given position from this region.
     *
     * @param {String} position Any of:
     *
     *  * 'cx' - See {@link #getPointXCenter}
     *  * 'cy' - See {@link #getPointYCenter}
     *  * 'b'  - See {@link #getPointBottom}
     *  * 'bc' - See {@link #getPointBottomCenter}
     *  * 'l'  - See {@link #getPointLeft}F
     *  * 'lc' - See {@link #getPointLeftCenter}
     *  * 't'  - See {@link #getPointTop}
     *  * 'tc' - See {@link #getPointTopCenter}
     *  * 'r'  - See {@link #getPointRight}
     *  * 'rc' - See {@link #getPointRightCenter}
     *  * 'c'  - See {@link #getPointCenter}
     *  * 'tl' - See {@link #getPointTopLeft}
     *  * 'bl' - See {@link #getPointBottomLeft}
     *  * 'br' - See {@link #getPointBottomRight}
     *  * 'tr' - See {@link #getPointTopRight}
     *
     * @param {Boolean} asLeftTop
     *
     * @return {Object} either an object with {x,y} or {left,top} if asLeftTop is true
     */
    getPoint: function(position, asLeftTop){

        //<debug>
        if (!POINT_POSITIONS[position]) {
            console.warn('The position ', position, ' could not be found! Available options are tl, bl, tr, br, l, r, t, b.');
        }
        //</debug>

        var method = 'getPoint' + POINT_POSITIONS[position],
            result = this[method]()

        if (asLeftTop){
            return {
                left : result.x,
                top  : result.y
            }
        }

        return result
    },

    /**
     * Returns a point with x = null and y being the middle of the left region segment
     * @return {Object} {x,y}
     */
    getPointYCenter: function(){
        return { x: null, y: this.top + this.getHeight() / 2 }
    },

    /**
     * Returns a point with y = null and x being the middle of the top region segment
     * @return {Object} {x,y}
     */
    getPointXCenter: function(){
        return { x: this.left + this.getWidth() / 2, y: null }
    },

    /**
     * Returns a point with x = null and y the region top position on the y axis
     * @return {Object} {x,y}
     */
    getPointTop: function(){
        return { x: null, y: this.top }
    },

    /**
     * Returns a point that is the middle point of the region top segment
     * @return {Object} {x,y}
     */
    getPointTopCenter: function(){
        return { x: this.left + this.getWidth() / 2, y: this.top }
    },

    /**
     * Returns a point that is the top-left point of the region
     * @return {Object} {x,y}
     */
    getPointTopLeft: function(){
        return { x: this.left, y: this.top}
    },

    /**
     * Returns a point that is the top-right point of the region
     * @return {Object} {x,y}
     */
    getPointTopRight: function(){
        return { x: this.right, y: this.top}
    },

    /**
     * Returns a point with x = null and y the region bottom position on the y axis
     * @return {Object} {x,y}
     */
    getPointBottom: function(){
        return { x: null, y: this.bottom }
    },

    /**
     * Returns a point that is the middle point of the region bottom segment
     * @return {Object} {x,y}
     */
    getPointBottomCenter: function(){
        return { x: this.left + this.getWidth() / 2, y: this.bottom }
    },

    /**
     * Returns a point that is the bottom-left point of the region
     * @return {Object} {x,y}
     */
    getPointBottomLeft: function(){
        return { x: this.left, y: this.bottom}
    },

    /**
     * Returns a point that is the bottom-right point of the region
     * @return {Object} {x,y}
     */
    getPointBottomRight: function(){
        return { x: this.right, y: this.bottom}
    },

    /**
     * Returns a point with y = null and x the region left position on the x axis
     * @return {Object} {x,y}
     */
    getPointLeft: function(){
        return { x: this.left, y: null }
    },

    /**
     * Returns a point that is the middle point of the region left segment
     * @return {Object} {x,y}
     */
    getPointLeftCenter: function(){
        return { x: this.left, y: this.top + this.getHeight() / 2 }
    },

    /**
     * Returns a point with y = null and x the region right position on the x axis
     * @return {Object} {x,y}
     */
    getPointRight: function(){
        return { x: this.right, y: null }
    },

    /**
     * Returns a point that is the middle point of the region right segment
     * @return {Object} {x,y}
     */
    getPointRightCenter: function(){
        return { x: this.right, y: this.top + this.getHeight() / 2 }
    },

    /**
     * Returns a point that is the center of the region
     * @return {Object} {x,y}
     */
    getPointCenter: function(){
        return { x: this.left + this.getWidth() / 2, y: this.top + this.getHeight() / 2 }
    },

    /**
     * @return {Number} returns the height of the region
     */
    getHeight: function(){
        return this.bottom - this.top
    },

    /**
     * @return {Number} returns the width of the region
     */
    getWidth: function(){
        return this.right - this.left
    },

    /**
     * @return {Number} returns the top property of the region
     */
    getTop: function(){
        return this.top
    },

    /**
     * @return {Number} returns the left property of the region
     */
    getLeft: function(){
        return this.left
    },

    /**
     * @return {Number} returns the bottom property of the region
     */
    getBottom: function(){
        return this.bottom
    },

    /**
     * @return {Number} returns the right property of the region
     */
    getRight: function(){
        return this.right
    },

    /**
     * Returns the area of the region
     * @return {Number} the computed area
     */
    getArea: function(){
        return this.getWidth() * this.getHeight()
    },

    constrainTo: function(contrain){
        var intersect = this.getIntersection(contrain)
        var shift

        if (!intersect || !intersect.equals(this)){

            var contrainWidth  = contrain.getWidth(),
                contrainHeight = contrain.getHeight()

            if (this.getWidth() > contrainWidth){
                this.left = contrain.left
                this.setWidth(contrainWidth)
            }

            if (this.getHeight() > contrainHeight){
                this.top = contrain.top
                this.setHeight(contrainHeight)
            }

            shift = {}

            if (this.right > contrain.right){
                shift.left = contrain.right - this.right
            }

            if (this.bottom > contrain.bottom){
                shift.top = contrain.bottom - this.bottom
            }

            if (this.left < contrain.left){
                shift.left = contrain.left - this.left
            }

            if (this.top < contrain.top){
                shift.top = contrain.top - this.top
            }

            this.shift(shift)

            return true
        }

        return false
    },

    __IS_REGION: true

    /**
     * @property {Number} top
     */

    /**
     * @property {Number} right
     */

    /**
     * @property {Number} bottom
     */

    /**
     * @property {Number} left
     */

    /**
     * @property {Number} [0] the top property
     */

    /**
     * @property {Number} [1] the left property
     */

    /**
     * @method getIntersection
     * Returns a region that is the intersection of this region and the given region
     * @param  {Region} region The region to intersect with
     * @return {Region}        The intersection region
     */

    /**
     * @method getUnion
     * Returns a region that is the union of this region with the given region
     * @param  {Region} region  The region to make union with
     * @return {Region}        The union region. The smallest region that contains both this and the given region.
     */

})

Object.defineProperties(REGION.prototype, {
    width: {
        get: function(){
            return this.getWidth()
        },
        set: function(width){
            return this.setWidth(width)
        }
    },
    height: {
        get: function(){
            return this.getHeight()
        },
        set: function(height){
            return this.setHeight(height)
        }
    }
})

require('./statics')(REGION)

module.exports = REGION
},{"./inherits":13,"./statics":14,"./validate":15,"events":16,"hasown":8,"newify":10,"object-assign":11}],13:[function(require,module,exports){
'use strict';

module.exports = function(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value       : ctor,
            enumerable  : false,
            writable    : true,
            configurable: true
        }
    })
}
},{}],14:[function(require,module,exports){
'use strict';

var hasOwn   = require('hasown')
var VALIDATE = require('./validate')

module.exports = function(REGION){

    var MAX = Math.max
    var MIN = Math.min

    var statics = {
        init: function(){
            var exportAsNonStatic = {
                getIntersection      : true,
                getIntersectionArea  : true,
                getIntersectionHeight: true,
                getIntersectionWidth : true,
                getUnion             : true
            }
            var thisProto = REGION.prototype
            var newName

            var exportHasOwn = hasOwn(exportAsNonStatic)
            var methodName

            for (methodName in exportAsNonStatic) if (exportHasOwn(methodName)) {
                newName = exportAsNonStatic[methodName]
                if (typeof newName != 'string'){
                    newName = methodName
                }

                ;(function(proto, methodName, protoMethodName){

                    proto[methodName] = function(region){
                        //<debug>
                        if (!REGION[protoMethodName]){
                            console.warn('cannot find method ', protoMethodName,' on ', REGION)
                        }
                        //</debug>
                        return REGION[protoMethodName](this, region)
                    }

                })(thisProto, newName, methodName);
            }
        },

        validate: VALIDATE,

        /**
         * Returns the region corresponding to the documentElement
         * @return {Region} The region corresponding to the documentElement. This region is the maximum region visible on the screen.
         */
        getDocRegion: function(){
            return REGION.fromDOM(document.documentElement)
        },

        from: function(reg){
            if (reg.__IS_REGION){
                return reg
            }

            if (typeof document != 'undefined'){
                if (typeof HTMLElement != 'undefined' && reg instanceof HTMLElement){
                    return REGION.fromDOM(reg)
                }

                if (reg.type && typeof reg.pageX !== 'undefined' && typeof reg.pageY !== 'undefined'){
                    return REGION.fromEvent(reg)
                }
            }

            return REGION(reg)
        },

        fromEvent: function(event){
            return REGION.fromPoint({
                x: event.pageX,
                y: event.pageY
            })
        },

        fromDOM: function(dom){
            var rect = dom.getBoundingClientRect()
            // var docElem = document.documentElement
            // var win     = window

            // var top  = rect.top + win.pageYOffset - docElem.clientTop
            // var left = rect.left + win.pageXOffset - docElem.clientLeft

            return new REGION({
                top   : rect.top,
                left  : rect.left,
                bottom: rect.bottom,
                right : rect.right
            })
        },

        /**
         * @static
         * Returns a region that is the intersection of the given two regions
         * @param  {Region} first  The first region
         * @param  {Region} second The second region
         * @return {Region/Boolean}        The intersection region or false if no intersection found
         */
        getIntersection: function(first, second){

            var area = this.getIntersectionArea(first, second)

            if (area){
                return new REGION(area)
            }

            return false
        },

        getIntersectionWidth: function(first, second){
            var minRight  = MIN(first.right, second.right)
            var maxLeft   = MAX(first.left,  second.left)

            if (maxLeft < minRight){
                return minRight  - maxLeft
            }

            return 0
        },

        getIntersectionHeight: function(first, second){
            var maxTop    = MAX(first.top,   second.top)
            var minBottom = MIN(first.bottom,second.bottom)

            if (maxTop  < minBottom){
                return minBottom - maxTop
            }

            return 0
        },

        getIntersectionArea: function(first, second){
            var maxTop    = MAX(first.top,   second.top)
            var minRight  = MIN(first.right, second.right)
            var minBottom = MIN(first.bottom,second.bottom)
            var maxLeft   = MAX(first.left,  second.left)

            if (
                    maxTop  < minBottom &&
                    maxLeft < minRight
                ){
                return {
                    top    : maxTop,
                    right  : minRight,
                    bottom : minBottom,
                    left   : maxLeft,

                    width  : minRight  - maxLeft,
                    height : minBottom - maxTop
                }
            }

            return false
        },

        /**
         * @static
         * Returns a region that is the union of the given two regions
         * @param  {Region} first  The first region
         * @param  {Region} second The second region
         * @return {Region}        The union region. The smallest region that contains both given regions.
         */
        getUnion: function(first, second){
            var top    = MIN(first.top,   second.top)
            var right  = MAX(first.right, second.right)
            var bottom = MAX(first.bottom,second.bottom)
            var left   = MIN(first.left,  second.left)

            return new REGION(top, right, bottom, left)
        },

        /**
         * @static
         * Returns a region. If the reg argument is a region, returns it, otherwise return a new region built from the reg object.
         *
         * @param  {Region} reg A region or an object with either top, left, bottom, right or
         * with top, left, width, height
         * @return {Region} A region
         */
        getRegion: function(reg){
            return REGION.from(reg)
        },

        /**
         * Creates a region that corresponds to a point.
         *
         * @param  {Object} xy The point
         * @param  {Number} xy.x
         * @param  {Number} xy.y
         *
         * @return {Region}    The new region, with top==xy.y, bottom = xy.y and left==xy.x, right==xy.x
         */
        fromPoint: function(xy){
            return new REGION({
                        top    : xy.y,
                        bottom : xy.y,
                        left   : xy.x,
                        right  : xy.x
                    })
        }
    }

    Object.keys(statics).forEach(function(key){
        REGION[key] = statics[key]
    })

    REGION.init()
}
},{"./validate":15,"hasown":8}],15:[function(require,module,exports){
'use strict';

/**
 * @static
 * Returns true if the given region is valid, false otherwise.
 * @param  {Region} region The region to check
 * @return {Boolean}        True, if the region is valid, false otherwise.
 * A region is valid if
 *  * left <= right  &&
 *  * top  <= bottom
 */
module.exports = function validate(region){

    var isValid = true

    if (region.right < region.left){
        isValid = false
        region.right = region.left
    }

    if (region.bottom < region.top){
        isValid = false
        region.bottom = region.top
    }

    return isValid
}
},{}],16:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1]);
