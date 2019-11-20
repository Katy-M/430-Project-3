"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// React components for handling the game client and window

// A clickable div that may or may not contain treasure. Will later
// contain the player and can be navigated to/from using buttons
// Uses state to keep track of component state and change it dynamically
var GridTile = function (_React$Component) {
    _inherits(GridTile, _React$Component);

    function GridTile(props) {
        _classCallCheck(this, GridTile);

        var _this = _possibleConstructorReturn(this, (GridTile.__proto__ || Object.getPrototypeOf(GridTile)).call(this, props));

        _this.state = {
            hasTreasure: props.treasure, // stores the NAME of the treasure on the tile. Empty == ""
            // hasPlayer: props.hasPlayer
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

            // if there is treasure, tell server to create an instance of it for the player's inventory
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
            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'gridTile col-lg-4 col-md-4 col-sm-4 col-4', onClick: this.handleClick },
                React.createElement(
                    'p',
                    { className: 'label' },
                    this.state.hasTreasure.name
                )
            );
        }
    }]);

    return GridTile;
}(React.Component);

;

// A traversable collection of grid tiles
// for each tile on the grid. Default value is passed into the props of each tile
var Grid = function Grid(props) {
    return React.createElement(
        'div',
        { className: 'gridContainer container' },
        React.createElement(
            'div',
            { className: 'row content-justify-center' },
            React.createElement(GridTile, { treasure: props.treasArray[0], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[1], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[2], csrf: props.csrf })
        ),
        React.createElement(
            'div',
            { className: 'row content-justify-center' },
            React.createElement(GridTile, { treasure: props.treasArray[3], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[4], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[5], csrf: props.csrf })
        ),
        React.createElement(
            'div',
            { className: 'row content-justify-center' },
            React.createElement(GridTile, { treasure: props.treasArray[6], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[7], csrf: props.csrf }),
            React.createElement(GridTile, { treasure: props.treasArray[8], csrf: props.csrf })
        )
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

var loadInventoryFromServer = function loadInventoryFromServer() {
    sendAjax('GET', '/getTreasure', null, function (data) {
        ReactDOM.render(React.createElement(Inventory, { items: data.treasure }), document.querySelector("#inventory"));
    });
};

// check to see if items are in inventory - remove them if so
var checkInventory = function checkInventory(treasArray, csrfToken) {
    sendAjax('GET', '/getTreasure', null, function (data) {
        // get the name key values for both data sets to compare
        var getDataNames = function getDataNames(collection) {
            var names = [];
            for (var i = 0; i < collection.length; i++) {
                names.push(collection[i].name);
            }
            return names;
        };

        var serverNames = getDataNames(data.treasure);
        var clientNames = getDataNames(treasArray);

        for (var i = 0; i < treasArray.length; i++) {
            if (serverNames.includes(clientNames[i])) {
                treasArray[clientNames.indexOf(clientNames[i])] = '';
            }
        }

        render(csrfToken, treasArray);
    });
};

// render the react components
var render = function render(csrfToken, treasArray) {
    ReactDOM.render(React.createElement(Grid, { csrf: csrfToken, treasArray: treasArray }), document.querySelector('#app'));
    ReactDOM.render(React.createElement(Inventory, { items: [] }), document.querySelector("#inventory"));

    loadInventoryFromServer();
};

// The chance of treasure is procedurally generated in an array with corresponding indicies
var generateTreasure = function generateTreasure(csrfToken) {
    // Contains the names of treasure in a given grid tile
    var treasArray = ['', '', '', '', '', '', '', '', ''];

    // get random treasures and put them on the grid
    for (var i = 0; i < getNumTreasures(); i++) {
        var index = getRandomInt(8);
        console.log(treasArray[index]);
        if (treasArray[index] == '') {
            treasArray[index] = getRandomTreasure();
        }
    }
    checkInventory(treasArray, csrfToken);
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
    var num = getRandomInt(7);
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
