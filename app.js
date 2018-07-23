//=========================================
//                IMPORTS
//=========================================
const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//=========================================
//                MIDDLEWARE
//=========================================
// Handlebars: A logicless templating language that keeps the view and the code separated
// * https://github.com/wycats/handlebars.js/
// * https://github.com/ericf/express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Tells the system that you want json to be used
app.use(bodyParser.json());
/*  Tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true). */
app.use(bodyParser.urlencoded({ extended: false }));

// * https://expressjs.com/en/starter/static-files.html
app.use(express.static(`${__dirname}/public`));

//=========================================
//             SET UP SERVER
//=========================================
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//=========================================
//                ROUTES
//=========================================
// * ROOT
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// * CHARGE
app.post('/charge', (req, res) => {
  const amount = 0100;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Breathe by Christopher Beards',
        currency: 'usd',
        customer: customer.id,
      }),
    )
    .then(charge => res.render('success'));
});

// * (DEVELOPMENT) SUCCESS
app.get('/success', (req, res) => {
  res.render('success');
});
