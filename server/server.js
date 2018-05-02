import express from 'express';
import passport from 'passport';
import FbPass from 'passport-facebook';
import GooglePass from 'passport-google-oauth20';
import * as firebase from "firebase";
import * as bodyParser from "body-parser";
import fetch from 'node-fetch';
import uuidv3 from 'uuid/v3';
import uuidv1 from 'uuid/v1';
import async from 'async';
import {expirations} from './cleaned_expiration_data.js';
import levenshtein from 'fast-levenshtein';
import update from 'immutability-helper';

import { facebook, google, firebaseConfig, uuidNamespace, scannerkey } from './config';



const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


/****************** Expiration ******************************************************
 ***********************************************************************************/
async function attachItemWithOpened(item) {
  let opened_expiry = {};
  await Promise.all(expirations.opened.map(expiry => {
    if (expiry.item == item.expiration.item) {
      opened_expiry = expiry;
    }
  }))
  return {...item, 'opened_expiration': opened_expiry}
}

async function attachItemWithCooked(item) {
  let cooked_expiry = {};
  await Promise.all(expirations.cooked.map(expiry => {
    if (expiry.item == item.expiration.item) {
      cooked_expiry = expiry;
    }
  }))
  return attachItemWithOpened({...item, 'cooked_expiration': cooked_expiry});
}

function createItemWithExpiry(expiry_item, item) {
  return attachItemWithCooked({...item, 'expiration': expiry_item})
}

async function searchExpiries(item) {
  let closest = 3;
  let expiry_item = {};
  await Promise.all(expirations.default.map(expiry => {
    if (levenshtein.get(item.label.toLowerCase(), expiry.item) < closest) {
      closest = levenshtein.get(item.label.toLowerCase(), expiry.item)
      expiry_item = expiry;
    }
    if (expiry.item.includes(item.label.toLowerCase())) {
      if (closest > 2) {
        closest = 2;
        expiry_item = expiry;
      }
    }
  }))
  return createItemWithExpiry(expiry_item, item);
}

app.post('/expiration/getexpirations', async function(req, res) {
  const expiries = await Promise.all(req.body.data.map(item => {
    return searchExpiries(item)
  }))
  res.send(expiries);
})

function constructExpirationLabel(numDays) {
  if (numDays < 365) {
    return "" + numDays + " days"
  } else {
    return "" + (numDays/365).toPrecision(2) + " years"
  }
}
function updateFreezer(date, expiration) {
  if (expiration.freezer != "") {
    const dateString = date.split('-');
    return [expiration.freezer[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2),0,0,0,0).getTime()) / (1000 * 3600 * 24)), constructExpirationLabel(expiration.freezer[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2),0,0,0,0).getTime()) / (1000 * 3600 * 24)))]; 
  } else {
    return ""
  }
}
function updateRefrigerator(date, expiration) {
  if (expiration.refrigerator != "") {
    const dateString = date.split('-');
    return [expiration.refrigerator[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2),0,0,0,0).getTime()) / (1000 * 3600 * 24)), constructExpirationLabel(expiration.refrigerator[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2),0,0,0,0).getTime()) / (1000 * 3600 * 24)))]; 
  } else {
    return ""
  }
}
function updatePantry(date, expiration) {
  if (expiration.pantry != "") {
    const dateString = date.split('-');
    return [expiration.pantry[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2), 0,0,0,0).getTime()) / (1000 * 3600 * 24)), constructExpirationLabel(expiration.pantry[0] - Math.round(Math.abs(new Date(new Date().setHours(0,0,0,0)).getTime() - new Date(dateString[0], parseInt(dateString[1] - 1), dateString[2].substring(0,2),0,0,0,0).getTime()) / (1000 * 3600 * 24)))]; 
  } else {
    return ""
  }
}
function updateExpiration(date, expiration) {
  return {...expiration, 'freezer': updateFreezer(date, expiration), 'refrigerator': updateRefrigerator(date, expiration), 'pantry': updatePantry(date, expiration)}
}
function updateItem(item) {
  if (item.isCooked) {
    return {...item, 'cooked_expiration': updateExpiration(item.dateCooked, item.cooked_expiration)}
  } else if (item.isOpened) {
    return {...item, 'opened_expiration': updateExpiration(item.dateOpened, item.opened_expiration)}
  } else {
    return {...item, 'expiration': updateExpiration(item.datePurchased, item.expiration)}
  }
}
app.post('/expiration/update', async function(req, res) {
  const updatedInventory= await Promise.all(req.body.inv.inventoryItems.map(item => {
    if(item.expiration) {return updateItem(item)}
    else {return item}
  }))
  firebase.database().ref('users/' + req.body.uid + '/inventory').set({...req.body.inv, 'inventoryItems': updatedInventory});
  res.send({...req.body.inv, 'inventoryItems': updatedInventory});
})


/****************** Nutrition ******************************************************
 ***********************************************************************************/

app.post('/nutrition/searchupc', (req, res) => {
  fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${req.body.upc}`, {
    method: "GET",
    headers: {
      'x-remote-user-id': '0',
      'x-app-id': '40fe7070',
      'x-app-key': 'c4963c085ebf538cad731d2b1028d045'
    }
  }).then(response => response.json())
  .then(data => {
    res.json(data);
  })
})

app.post('/nutrition/getitem', (req, res) => {
  fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      'x-remote-user-id': '0',
      'x-app-id': '40fe7070',
      'x-app-key': 'c4963c085ebf538cad731d2b1028d045',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({
      query: req.body.item
    })
  }).then(response => response.json())
  .then(async function(data) {
    const vitamins_minerals = {};
    await Promise.all(data.foods[0].full_nutrients.map(item => {
      if (item.attr_id == 301 || item.attr_id == 303 || item.attr_id == 320 || item.attr_id == 401 || item.attr_id == 328 || item.attr_id == 605) {
        vitamins_minerals[item.attr_id] = item.value
      }
    }))
    return res.send({
      name: data.foods[0].food_name[0].toUpperCase() + data.foods[0].food_name.slice(1),
      serving: data.foods[0].serving_qty + ' ' + data.foods[0].serving_unit,
      calories: data.foods[0].nf_calories,
      total_fat: data.foods[0].nf_total_fat,
      total_carbs: data.foods[0].nf_total_carbohydrate,
      protein: data.foods[0].nf_protein,
      sugar: data.foods[0].nf_sugars,
      sodium: data.foods[0].nf_sodium,
      sat_fat: data.foods[0].nf_saturated_fat,
      cholersterol: data.foods[0].nf_cholesterol,
      fiber: data.foods[0].nf_dietary_fiber,
      potassium: data.foods[0].nf_potassium,
      vitamins_minerals: vitamins_minerals,
      image: data.foods[0].photo.thumb
    })
  })
})

app.post('/nutrition/searchinput', (req, res) => {
  const query = req.body.query;
  fetch(`http://trackapi.nutritionix.com/v2/search/instant?query=${query}&branded=false`, {
    method: "GET",
    headers: {
      'x-remote-user-id': '0',
      'x-app-id': '40fe7070',
      'x-app-key': 'c4963c085ebf538cad731d2b1028d045'
    }
  }).then(response => response.json())
  .then(data => {
    return res.send(data.common);
  })
})


/****************** Lists **********************************************************
 ***********************************************************************************/

app.post('/shoppinglist/getlists', (req, res) => {
  return firebase.database().ref('/users/' + req.body.uid + '/shoppinglists').once('value').then(function(snapshot) {
    res.send(snapshot.val());
  });
});

app.post('/shoppinglist/createnew', (req, res) => {
  const id = uuidv1();
  const listData = req.body.listData;
  firebase.database().ref('users/' + req.body.uid + '/shoppinglists/' + id).set({
    title: listData.title,
    items: listData.items,
    status: 'active',
    id: id
  }, err => {
    if (!err) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(500);
    }
  });
});

app.post('/shoppinglist/delete', (req, res) => {
  firebase.database().ref('users/' + req.body.uid + '/shoppinglists/' + req.body.listId).remove(err => {
    if (!err) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(500);
    }
  });
})

app.post('/shoppinglist/update', (req, res) => {
  firebase.database().ref('users/' + req.body.uid + '/shoppinglists/' + req.body.listId).set(req.body.data);
  res.status(200).end();
})

/****************** Inventory ****************************************************************
 ****************************************************************************************/

app.post('/inventory/update', (req, res) => {
  firebase.database().ref('users/' + req.body.uid + '/inventory').set(req.body.data);
  res.status(200).end();
});

app.post('/inventory/get', (req, res) => {
  firebase.database().ref('/users/' + req.body.uid + '/inventory').once('value').then(function(snapshot) {
    res.send(snapshot.val());
  });
})

async function updateList(item, inv) {
  const updatedList = await Promise.all(update(inv.inventoryItems, {$push: [searchExpiries({label: item.food_name, datePurchased: new Date(new Date().setHours(0,0,0,0))})]}))
  return updatedList;
}

app.post('/inventory/addscanneditem', async function (req, res) {
  if (req.body.inventory.inventoryItems) {
    const updatedList = await Promise.all(update(req.body.inventory.inventoryItems, {$push: [searchExpiries({label: req.body.item.food_name, datePurchased: new Date(new Date().setHours(0,0,0,0))})]}))
    firebase.database().ref('users/' + req.body.uid + '/inventory').set({inventoryItems: updatedList})
    res.status(200).end();
  } else {
    const updatedList = await Promise.all(update([], {$push: [searchExpiries({label: req.body.item.food_name, datePurchased: new Date(new Date().setHours(0,0,0,0))})]}))
    firebase.database().ref('users/' + req.body.uid + '/inventory').set({inventoryItems: updatedList})
    res.status(200).end();
  }
})
/****************** AUTH ****************************************************************
 ****************************************************************************************/

// Transform Facebook profile into user object
const transformFacebookProfile = (profile) => ({
  id: uuidv3(profile.id, uuidNamespace),
  name: profile.name,
  avatar: profile.picture.data.url,
});

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  id: uuidv3(profile.id, uuidNamespace),
  name: profile.displayName,
  avatar: profile.image.url,
});

// Register Facebook Passport strategy
passport.use(new FbPass(facebook,
  async (accessToken, refreshToken, profile, done)
    => done(null, transformFacebookProfile(profile._json))
));

// Register Google Passport strategy
passport.use(new GooglePass(google,
  async (accessToken, refreshToken, profile, done)
    => done(null, transformGoogleProfile(profile._json))
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Set up Facebook auth routes
app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login/facebook' }),
  (req, res) => {
    res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user))
  }
);

// Set up Google auth routes
app.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/google' }),
  (req, res) => {
    res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user))
  }
);
/***************************************************************************************
 ***************************************************************************************
 ****************************************************************************************/

app.get('/getscannerkey', (req, res) => {
  res.send(scannerkey)
})

app.listen(process.env.PORT || 5000, function () {
  console.log('Pantrymate is running');
});
