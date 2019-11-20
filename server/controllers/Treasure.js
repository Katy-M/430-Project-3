const models = require('../models');

const Treasure = models.treasure;

// Find and render the player's inventory
const inventoryPage = (req, res) => {
  Treasure.TreasureModel.findByPlayer(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('inventory', { csrfToken: req.csrfToken(), treasure: docs });
  });
};

const appPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

// Make a new Treasure object for the current player
const makeTreasure = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const treasureData = {
    name: req.body.name,
    value: req.body.value,
    player: req.session.account._id,
  };

  const newTreasure = new Treasure.TreasureModel(treasureData);
  const treasurePromise = newTreasure.save();

  treasurePromise.then(() => res.json({ redirect: 'makeTreasure' }));
  treasurePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Treasure already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred.' });
  });
  return treasurePromise;
};

  // get the treasure associated with a player's account
const getTreasure = (request, response) => {
  const req = request;
  const res = response;

  return Treasure.TreasureModel.findByPlayer(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.json({ treasure: docs });
  });
};

module.exports.inventoryPage = inventoryPage;
module.exports.makeTreasure = makeTreasure;
module.exports.getTreasure = getTreasure;
module.exports.appPage = appPage;
