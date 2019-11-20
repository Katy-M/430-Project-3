const models = require('../models');

const Account = models.account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('login');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to strings
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: 'app' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: 'app' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username is already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // https://stackoverflow.com/questions/17828663/passport-local-mongoose-change-password
  return Account.AccountModel.authenticate(req.body.username, req.body.pass, (err, account) => {
    if (!account) {
      return res.status(500).json({ error: 'Account does not exist.' });
    }
    if (req.body.pass2 === req.body.pass) {
      return res.status(400).json({ error: 'Password cannot match old password.' });
    }

    return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
      Account.AccountModel.updateOne(
        { username: account.username },
        { salt, password: hash }, (error) => {
          if (err) return res.status(400).json({ error });
          return res.json({ redirect: 'login' });
        });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
