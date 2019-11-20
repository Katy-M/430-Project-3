const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr) {
            var messageObj = JSON.parse(xhr.responseText);
            alert(messageObj.error);
        }
    });
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const getNumTreasures = () => {
    let num = getRandomInt(7);
    if(num === 0) num = 1;
    return num;
};

const getRandomTreasure = () => {
    // 4 types of treasure
    const id = getRandomInt(5);
    let treasure = '';
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
