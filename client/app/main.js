// React components for handling the game client and window

// A clickable div that contains treasure
class GridTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasTreasure: props.treasure, // stores the NAME of the treasure
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

        // Tell server to create an instance of it for the player's inventory
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
        if (this.state.hasTreasure == '') {
            return null;
        }
        return (
            <div className="gridTile row content-justify-center" onClick={this.handleClick}>
                <div className="icon col-lg-2 col-md-2 col-sm-2 col-2">icon</div>
                <div className="label col-lg-8 col-md-8 col-sm-8 col-8">{this.state.hasTreasure.name}</div>
                <div className="value col-lg-2 col-md-2 col-sm-2 col-2">{this.state.hasTreasure.value}</div>
            </div>
        );
    }
};

// A list of treasures
// for each item  on the grid. Default value is passed into the props of each tile
const Grid = (props) => {
    return(
        <div className="gridContainer container">
            {props.treasArray.map((treasure, key) => {
                return <GridTile key={key} treasure={treasure} csrf={props.csrf} />
            })}
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

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '',
        };

        this.getTimer = this.getTimer.bind(this);
    }

    // Get the time from the server stored in the user's account
    getTimer() {
        console.log("client getting timer");
        sendAjax(
            'GET', '/collectionTimer', {}, (data)=> {
                this.setState({time: data[0] - data[1]});
                console.log("time received");
            }
        );
    };
    render() {
        this.getTimer();
        return(
            <div className="timerContainer container">
                <h4 className="text-center">
                    Come back at <b>{this.state.time}</b> for more treasures!
                </h4>
            </div>
        );
    };
};

const loadInventoryFromServer = () => {
    sendAjax('GET', '/getTreasure', null, (data) => {
        ReactDOM.render(
            <Inventory items={data.treasure}/>, document.querySelector("#inventory")
        );
    });
};

// check to see if items are in inventory
const checkInventory = (treasArray, csrfToken) => {
    /* sendAjax('GET', '/getTreasure', null, (data) => {
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
    }); */
    render(csrfToken, treasArray);
};

// render the react components
const render = (csrfToken, treasArray) => {
    ReactDOM.render(<Grid csrf={csrfToken} treasArray={treasArray} />, document.querySelector('#app'));
    ReactDOM.render(<Timer />, document.querySelector('#timer'))
    ReactDOM.render(<Inventory items={[]}/>, document.querySelector("#inventory"));
    
    loadInventoryFromServer();
};

const generateTreasure = (csrfToken) => {
    // Contains the names of treasure
    let treasArray = [];

    // get random treasures and put them on the grid
    for(let i = 0; i < getNumTreasures(); i++){
        treasArray.push(getRandomTreasure());
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