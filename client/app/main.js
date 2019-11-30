// React components for handling the game client and window

// A clickable div that may or may not contain treasure. Will later
// contain the player and can be navigated to/from using buttons
// Uses state to keep track of component state and change it dynamically
class GridTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasTreasure: props.treasure, // stores the NAME of the treasure on the tile. Empty == ""
            // hasPlayer: props.hasPlayer
            _csrf: props.csrf,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();

        if(this.state.hasTreasure == ''){
            alert("No treasure here!");
            return false;
        }

        // if there is treasure, tell server to create an instance of it for the player's inventory
        sendAjax(
            'POST',
            '/makeTreasure',
            {
                _csrf: this.state._csrf,
                name: this.state.hasTreasure.name,
                value: this.state.hasTreasure.value,
            },
            ()=> {
                loadInventoryFromServer();
            }
        );
        alert(`${this.state.hasTreasure.name} found and added to inventory!`)
        // remove treasure from the grid tile
        this.setState({hasTreasure: ''});
        return false;
    };

    render() {
        return (
            <div className="gridTile row content-justify-center" onClick={this.handleClick}>
                <div className="icon col-lg-2 col-md-2 col-sm-2 col-2">icon</div>
                <div className="label col-lg-8 col-md-8 col-sm-8 col-8">{this.state.hasTreasure.name}</div>
                <div className="value col-lg-2 col-md-2 col-sm-2 col-2">{this.state.hasTreasure.value}</div>
            </div>
        );
    }
};

// A traversable collection of grid tiles
// for each tile on the grid. Default value is passed into the props of each tile
const Grid = (props) => {
    return(
        <div className="gridContainer container">
            <GridTile treasure={props.treasArray[0]} csrf={props.csrf} />
            <GridTile treasure={props.treasArray[1]} csrf={props.csrf} />
            <GridTile treasure={props.treasArray[2]} csrf={props.csrf} />
        </div>
    );
};

const Inventory = (props) => {
    if(props.items.length === 0) {
        return (
            <div className="itemList">
                <h4>You have nothing in your inventory yet.</h4>
            </div>
        );
    }

    const itemTiles = props.items.map((item) => {
        return (
            <div className="container itemList">
                <div key={item.name} className="inventoryItem row justify-content-center">
                    <h4 className="itemName col-lg-4 col-md-5 col-sm-6 col-6 text-left">Name: {item.name}</h4>
                    <h4 className="itemValue col-lg-4 col-md-5 col-sm-6 col-6 text-right">Value: {item.value}</h4>            
                </div>
            </div>
        );
    });
    return (
        <div className="itemList">
            {itemTiles}
        </div>
    );
};

const loadInventoryFromServer = () => {
    sendAjax('GET', '/getTreasure', null, (data) => {
        ReactDOM.render(
            <Inventory items={data.treasure}/>, document.querySelector("#inventory")
        );
    });
};

// check to see if items are in inventory - remove them if so
const checkInventory = (treasArray, csrfToken) => {
    sendAjax('GET', '/getTreasure', null, (data) => {
        // get the name key values for both data sets to compare
        const getDataNames = (collection) => {
            const names = [];
            for (let i = 0; i < collection.length; i++){
                names.push(collection[i].name);
            }
            return names;
        };

        const serverNames = getDataNames(data.treasure);
        const clientNames = getDataNames(treasArray);

        for(let i = 0; i < treasArray.length; i++){
            if(serverNames.includes(clientNames[i])){
                treasArray[clientNames.indexOf(clientNames[i])] = '';
            }
        }

        render(csrfToken, treasArray);
    });
};

// render the react components
const render = (csrfToken, treasArray) => {
    ReactDOM.render(<Grid csrf={csrfToken} treasArray={treasArray} />, document.querySelector('#app'));
    ReactDOM.render(<Inventory items={[]}/>, document.querySelector("#inventory"));
    
    loadInventoryFromServer();
};

// The chance of treasure is procedurally generated in an array with corresponding indicies
const generateTreasure = (csrfToken) => {
    // Contains the names of treasure in a given grid tile
    let treasArray = ['', '', '', '', '', '', '', '', '',];

    // get random treasures and put them on the grid
    for(let i = 0; i < getNumTreasures(); i++){
        const index = getRandomInt(8);
        console.log(treasArray[index]);
        if(treasArray[index] == ''){
            treasArray[index] = getRandomTreasure();
        }
    }
    checkInventory(treasArray, csrfToken)
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        generateTreasure(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});