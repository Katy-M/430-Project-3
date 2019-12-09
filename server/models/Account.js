const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastLoginDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  nextTreasureSpawn: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

// retrieve the spawn times from the server
AccountSchema.statics.getLoginDates = (
  username,
  callback
) => AccountModel.findByUsername(username, (err, account) => {
  if (err || !account) return callback(err);
  return callback(
    0,
    [account.lastLoginDate, account.nextTreasureSpawn]
  );
});

// update the spawn times in the given user's account
AccountSchema.statics.updateLoginDates = (
  username,
  callback
) => AccountModel.findByUsername(username, (err, docs) => {
  if (err || !docs) return callback(err);

  const account = docs;
  account.lastLoginDate = Date.now();
  // Project x number of minutes into the future from when the user logged in or created an account
  // https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
  account.nextTreasureSpawn = new Date(Date.now() + 2 * 60000);
  return account.save().then(() => callback(0,
    { data: [account.lastLoginDate, account.nextTreasureSpawn] }
  ));
});

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

AccountSchema.statics.authenticate = (username, password, callback) =>
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
