const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/app', mid.requiresLogin, controllers.Treasure.appPage);
  app.get('/inventory', mid.requiresLogin, controllers.Treasure.inventoryPage);
  app.post('/makeTreasure', mid.requiresLogin, controllers.Treasure.makeTreasure);
  app.get('/getTreasure', mid.requiresLogin, controllers.Treasure.getTreasure);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post(
    '/changePassword',
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.changePassword
    );
};

module.exports = router;
