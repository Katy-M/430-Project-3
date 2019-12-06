"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// React components for handling the game client and window

// A clickable div that contains treasure
var GridTile = function (_React$Component) {
    _inherits(GridTile, _React$Component);

    function GridTile(props) {
        _classCallCheck(this, GridTile);

        var _this = _possibleConstructorReturn(this, (GridTile.__proto__ || Object.getPrototypeOf(GridTile)).call(this, props));

        _this.state = {
            hasTreasure: props.treasure, // stores the NAME of the treasure
            _csrf: props.csrf
        };

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(GridTile, [{
        key: 'handleClick',
        value: function handleClick(e) {
            e.preventDefault();

            if (this.state.hasTreasure == '') {
                alert("No treasure here!");
                return false;
            }

            // Tell server to create an instance of it for the player's inventory
            sendAjax('POST', '/makeTreasure', {
                _csrf: this.state._csrf,
                name: this.state.hasTreasure.name,
                value: this.state.hasTreasure.value
            }, function () {
                loadInventoryFromServer();
            });
            alert(this.state.hasTreasure.name + ' found and added to inventory!');
            // remove treasure from the grid tile
            this.setState({ hasTreasure: '' });

            // Reset the collection timer in the player's account after the item is collected
            sendAjax('POST', '/updateTimer', {}, function () {
                console.log("in post");
            });
            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.hasTreasure == '') {
                return null;
            }
            return React.createElement(
                'div',
                { className: 'gridTile row content-justify-center', onClick: this.handleClick },
                React.createElement(
                    'div',
                    { className: 'icon col-lg-2 col-md-2 col-sm-2 col-2' },
                    'icon'
                ),
                React.createElement(
                    'div',
                    { className: 'label col-lg-8 col-md-8 col-sm-8 col-8' },
                    this.state.hasTreasure.name
                ),
                React.createElement(
                    'div',
                    { className: 'value col-lg-2 col-md-2 col-sm-2 col-2' },
                    this.state.hasTreasure.value
                )
            );
        }
    }]);

    return GridTile;
}(React.Component);

;

// A list of treasures
// for each item  on the grid. Default value is passed into the props of each tile
var Grid = function Grid(props) {
    return React.createElement(
        'div',
        { className: 'gridContainer container' },
        props.treasArray.map(function (treasure, key) {
            return React.createElement(GridTile, { key: key, treasure: treasure, csrf: props.csrf });
        })
    );
};

var Inventory = function Inventory(props) {
    if (props.items.length === 0) {
        return React.createElement(
            'div',
            { className: 'itemList' },
            React.createElement(
                'h4',
                null,
                'You have nothing in your inventory yet.'
            )
        );
    }

    var itemTiles = props.items.map(function (item) {
        return React.createElement(
            'div',
            { className: 'container itemList' },
            React.createElement(
                'div',
                { key: item.name, className: 'inventoryItem row justify-content-center' },
                React.createElement(
                    'h4',
                    { className: 'itemName col-lg-4 col-md-5 col-sm-6 col-6 text-left' },
                    'Name: ',
                    item.name
                ),
                React.createElement(
                    'h4',
                    { className: 'itemValue col-lg-4 col-md-5 col-sm-6 col-6 text-right' },
                    'Value: ',
                    item.value
                )
            )
        );
    });
    return React.createElement(
        'div',
        { className: 'itemList' },
        itemTiles
    );
};

var Timer = function (_React$Component2) {
    _inherits(Timer, _React$Component2);

    function Timer(props) {
        _classCallCheck(this, Timer);

        var _this2 = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this, props));

        _this2.state = {
            time: ''
        };

        _this2.getTimer = _this2.getTimer.bind(_this2);
        return _this2;
    }

    // Get the time from the server stored in the user's account


    _createClass(Timer, [{
        key: 'getTimer',
        value: function getTimer() {
            var _this3 = this;

            sendAjax('GET', '/collectionTimer', {}, function (data) {
                _this3.setState({ time: data[0] - data[1] });
                console.log("time received");
            });
        }
    }, {
        key: 'render',
        value: function render() {
            this.getTimer();
            return React.createElement(
                'div',
                { className: 'timerContainer container' },
                React.createElement(
                    'h4',
                    { className: 'text-center' },
                    'Come back at ',
                    React.createElement(
                        'b',
                        null,
                        this.state.time
                    ),
                    ' for more treasures!'
                )
            );
        }
    }]);

    return Timer;
}(React.Component);

;

var loadInventoryFromServer = function loadInventoryFromServer() {
    sendAjax('GET', '/getTreasure', null, function (data) {
        ReactDOM.render(React.createElement(Inventory, { items: data.treasure }), document.querySelector("#inventory"));
    });
};

// render the react components
var render = function render(csrfToken, treasArray) {
    ReactDOM.render(React.createElement(Grid, { csrf: csrfToken, treasArray: treasArray }), document.querySelector('#app'));
    ReactDOM.render(React.createElement(Timer, null), document.querySelector('#timer'));
    ReactDOM.render(React.createElement(Inventory, { items: [] }), document.querySelector("#inventory"));

    loadInventoryFromServer();
};

var generateTreasure = function generateTreasure(csrfToken) {
    // check if enough time has passed for the user to generate treasure
    sendAjax('GET', '/collectionTimer', {}, function (data) {
        if (data[0] >= data[1]) {
            // Contains the names of treasure
            var treasArray = [];

            // get random treasures and put them on the grid
            for (var i = 0; i < getNumTreasures(); i++) {
                treasArray.push(getRandomTreasure());
            }
            render(csrfToken, treasArray);
        }
    });
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        generateTreasure(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr) {
            var messageObj = JSON.parse(xhr.responseText);
            alert(messageObj.error);
        }
    });
};

var getRandomInt = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

var getNumTreasures = function getNumTreasures() {
    var num = getRandomInt(3);
    if (num === 0) num = 1;
    return num;
};

var getRandomTreasure = function getRandomTreasure() {
    // 4 types of treasure
    var id = getRandomInt(5);
    var treasure = '';
    switch (id) {
        case 0:
            treasure = { name: 'Silver Platter', value: '500' };
            break;
        case 1:
            treasure = { name: 'Gold Coins', value: '50' };
            break;
        case 2:
            treasure = { name: 'Eye of Newt', value: '200' };
            break;
        case 3:
            treasure = { name: 'Serpent Tail', value: '830' };
            break;
        case 4:
            treasure = { name: 'Iron Sword', value: '25' };
            break;
        default:
            treasure = { name: 'undefined', value: '0' };
    }
    return treasure;
};
