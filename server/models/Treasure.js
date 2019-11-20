const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TreasureModel = {};

// mongoose.Types.ObjectID - converts string ID to mongo ID
const convertId = mongoose.Types.ObjectId;
const setString = (str) => _.escape(str).trim();

const TreasureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
    // For the inventory
  player: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TreasureSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  value: doc.value,
});

TreasureSchema.statics.findByPlayer = (playerId, callback) => {
  const search = {
    player: convertId(playerId),
  };
  return TreasureModel.find(search).select('name value').exec(callback);
};

TreasureModel = mongoose.model('Treasure', TreasureSchema);

module.exports.TreasureModel = TreasureModel;
module.exports.TreasureSchema = TreasureSchema;
