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
    let num = getRandomInt(3);
    if(num === 0) num = 1;
    return num;
};

// Image citations:
// Sword: https://www.needpix.com/photo/178370/sword-medieval-weapon-metal
// Coins: https://pixabay.com/vectors/coins-money-profit-wealth-161724/
// Eyeball: https://pixabay.com/vectors/alligator-crocodile-eye-green-160769/

const getRandomTreasure = () => {
    // 4 types of treasure
    const id = getRandomInt(5);
    let treasure = '';
    switch (id) {
        case 0:
            treasure = { name: 'Silver Platter', value: '500' };
            break;
        case 1:
            treasure = { iconSrc: '/assets/img/coins.png', name: 'Gold Coins', value: '50' };
            break;
        case 2:
            treasure = { iconSrc: '/assets/img/eye.png', name: 'Eye of Newt', value: '200' };
            break;
        case 3:
            treasure = { iconSrc: '', name: 'Serpent Tail', value: '830' };
            break;
        case 4:
            treasure = { iconSrc: '/assets/img/sword.png', name: 'Iron Sword', value: '25' };
            break;
        default:
            treasure = { iconSrc: '', name: 'undefined', value: '0' };
    }
    return treasure;
};
