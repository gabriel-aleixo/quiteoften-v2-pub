// Environment variables
import 'dotenv/config'

//DB Connections
import * as db from './dbFuncs'

//Outseta API Functions
import * as outseta from './outsetaFuncs'

// Express to run server and routes
import express from 'express';

import * as Sentry from "@sentry/node";

/* Dependencies */
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";
const jwt = require('jsonwebtoken');

// Start up an instance of app
const app = express();

Sentry.init({ dsn: "https://160bf0b2a24a4221ae61cba3a3ea2884@o1140146.ingest.sentry.io/6197077",   
              environment: process.env.NODE_ENV, 
              integrations: [
                new CaptureConsoleIntegration({
                levels: ['error']
                })
              ],
            }
);


/* Middleware*/

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());
// Compress all routes
app.use(compression());
// Helmet to set HTTP headers and protect app from web vulnerabilities
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["https://js.stripe.com/", "https://quiteoften.outseta.com/", "http://quiteoften.outseta.com/", "https://meet.jit.si/"],
      connectSrc: ["'self'", "ws://localhost:*", "https://meet.jit.si/", "https://hooks.slack.com/", "https://fonts.googleapis.com/", "https://quiteoften.outseta.com/", "https://cdn.outseta.com/", "https://www.google-analytics.com/", "https://www.googleapis.com/", "sentry.io", "*.sentry.io"],
      scriptSrc: ["'self'", "'unsafe-eval'", "https://meet.jit.si/", "https://cdn.outseta.com/", "https://quiteoften.outseta.com/", "https://www.google-analytics.com/", "http://www.googletagmanager.com/", "https://www.googletagmanager.com/", "https://ajax.googleapis.com/", "'unsafe-inline'",   "https://browser.sentry-cdn.com", "https://js.sentry-cdn.com", "https://*.sentry.io"],
      scriptSrcElem: ["'self'", "https://meet.jit.si/", "https://hooks.slack.com/", "https://js.stripe.com/", "https://cdn.outseta.com/", "https://quiteoften.outseta.com/", "https://www.google-analytics.com/", "http://www.googletagmanager.com/", "https://www.googletagmanager.com/", "https://ajax.googleapis.com/", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://hooks.slack.com/", "https://www.googletagmanager.com/", "http://quiteoften.outseta.com/", "https://fonts.googleapis.com/", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com/"],
      imgSrc: ["'self'", "data:", "https://s3.amazonaws.com/outseta-production/", "https://ui-avatars.com/api/"],
      mediaSrc: [],
    }
  }
}));

// Initialize the main project folder
app.use(express.static(path.resolve(__dirname, '../dist'), {
  maxage: '0'
})); 

function getJWT(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } 
  return null;
}

const accessChecker = function (req, res, next) {
  const accessToken = getJWT(req);
  if (!accessToken) {
    console.error("Authorization token is required");
    return res.status(401).send("Authorization token is required");
  } 
  try {
    const decode = jwt.verify(accessToken, process.env.OUTSETA_JWT_KEY);
    next();
  } 
  catch (error) {
    console.error(error);
    return res.status(403).send(error.message);
  }

}

// Middleware function to set Cache control headers
let setCache = function (req, res, next) {

  // Cache only for GET requests
  if (req.method == 'GET') {
    res.set('Cache-control', 'no-cache')
  } else {
    // don't cache for requests other than GET 
    res.set('Cache-control', `no-store`)
  }

  next()
}
app.use(setCache)

/* Write Express routes (endpoints) for the app */

// All controllers should live here
// create api router...so all urls here are invoked from client as /api/...
const createApiRouter = () => {
  const router = new express.Router()
  
  router.use(accessChecker);
  
  //Write all the /api routes here... eg. /users, /pairs, etc, but without /api in the beginning

  router.get('/users', async (req, res) => {
    const dbUser = await db.getUserByOutsetaUserId(req.query.outsetaUserId);
    res.status(200).json(dbUser.rows);
  });

  router.post('/users', async (req, res) => {

    let source;
    req.body.PrimaryContact ? source = "Outseta" : source = "App";

    if (source === "Outseta") {
      const newUser = await db.addUser(req.body.PrimaryContact.Uid);
      res.status(200).json(newUser.rows);
    } else if (source === "App") {
      const newUser = await db.addUser(req.query.outsetaUserId);
      res.status(200).json(newUser.rows);
    }

  })

  router.get('/pairs', async (req, res) => {

    const userId = Number(req.query.userId);
    const pairResults = await db.getPairs(userId);
    let newArrayWithMoreInfo;
    if (pairResults != null) { 
        const pairResultsRows = pairResults.rows;

        newArrayWithMoreInfo = await Promise.all(pairResultsRows.map(async (pairResultRow) => {
            let otherUserOfPairFromDB;
            //If I do a === check then it fails as lead and follow are not Numbers..
            if (pairResultRow.lead == userId) { 
              otherUserOfPairFromDB = await db.getUser(pairResultRow.follow);
            } else if (pairResultRow.follow == userId) {
              otherUserOfPairFromDB = await db.getUser(pairResultRow.lead);
            }
            const outsetaUIdOfOtherUser = otherUserOfPairFromDB.rows[0].outseta_user_id;
            if (outsetaUIdOfOtherUser != null) {
              const personObjectFromOutseta = await outseta.getPerson (outsetaUIdOfOtherUser);
              return {...pairResultRow, otherUserOfPair: personObjectFromOutseta};
            }
            else return null;
          }
        )
        )
    }
    res.status(200).json(newArrayWithMoreInfo);

  });

  router.post('/pairs', async (req, res) => {


    const leadId = Number(req.query.leadId);
    const email = req.query.email;
    const acctUid = req.query.acctUid;
    let outsetaUserIdOfPerson;
    let outsetaPerson;
    const existingOutsetaUser = await outseta.getPeopleWithEmailInAccount(email);
    if (existingOutsetaUser != null && existingOutsetaUser.items.length>0) {
      if (existingOutsetaUser.items.length === 1 ) {
        const tmpOutsetaPerson = existingOutsetaUser.items[0];
        const tmpOutsetaUserIdOfPerson = tmpOutsetaPerson.Uid;
        const checkIfAccountUidExistsInPersonAccount = tmpOutsetaPerson.PersonAccount.some(obj => obj.Account.Uid == acctUid); // === did not work here
        if (checkIfAccountUidExistsInPersonAccount) { 
          //This means person is already there in this Outseta account, no need to add
          outsetaPerson = tmpOutsetaPerson;
          outsetaUserIdOfPerson = tmpOutsetaUserIdOfPerson; 
        }
        else {
          //This means person is there in Outseta, but not in this account, need to add existing Outseta user to this account which creates a new PersonAccount object
          const newOutsetaPersonAccount = await outseta.addExistingPersonToExistingAccount(acctUid, tmpOutsetaUserIdOfPerson);
          outsetaPerson = newOutsetaPersonAccount.Person; 
          outsetaUserIdOfPerson = outsetaPerson.Uid;          
        }
      }
      else if (existingOutsetaUser.items.length > 1){
        throw new Error(`Unexpected result from getPeopleWithEmailInAccount on multiple Outseta people with same email` + existingOutsetaUser);
      }
    } else {
      const newOutsetaUser = await outseta.addNewPersonToExistingAccount(acctUid, email);
      outsetaPerson = newOutsetaUser.Person;
      outsetaUserIdOfPerson = outsetaPerson.Uid;
    }
    const existingDbUser = await db.getUserByOutsetaUserId(outsetaUserIdOfPerson);

    let dbUserIdOfPerson;
    if (existingDbUser != null && existingDbUser.rows.length > 0) {
      if (existingDbUser.rows.length === 1) {
        dbUserIdOfPerson = existingDbUser.rows[0].id;
      }
      else if (existingDbUser.rows.length > 1) {
        throw new Error(`Unexpected result from getUserByOutsetaUserId on multiple users with same outsetaid` + existingDbUser);
      }      
    }
    else {
      const newDbUser = await db.addUser(outsetaUserIdOfPerson);
      dbUserIdOfPerson = newDbUser.rows[0].id;
    }
    const followId = dbUserIdOfPerson;
    const newPair = await db.addPairs(leadId, followId);
    if (newPair.rows.length === 1) {
      newPair.rows[0].otherUserOfPair = outsetaPerson;
    }
    res.status(200).json(newPair.rows);
    

  });

  router.get('/discussion-items/:pairId', async (req, res) => {
    const pairId = Number(req.params.pairId);
    const discussionItemResults = await db.getDiscussionItems(pairId);
    res.status(200).json(discussionItemResults.rows);
  });

  router.post('/discussion-items/swapPositionsInPair', async (req, res) => {
    const srcItemId = Number(req.query.srcItemId);
    const dstItemId = Number(req.query.dstItemId);
    const updatedDiscussionItems = await db.swapDiscussionItemsPositionInPair(srcItemId, dstItemId);
    res.status(200).json(updatedDiscussionItems.rows);
  });

  router.post('/discussion-items/:pairId', async (req, res) => {
    const pairId = Number(req.params.pairId);
    const insertedDiscussionItem = await db.addDiscussionItem(pairId, req.body);
    res.status(200).json(insertedDiscussionItem.rows[0]);
  });

  router.delete('/discussion-items/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await db.removeDiscussionItem(id);
    res.status(200).end();
  });

  router.put('/discussion-items/:id', async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const updatedDiscussionItemResults = await db.updateDiscussionItem(body, id);
    res.status(200).json(updatedDiscussionItemResults.rows[0]);
  });

  router.get('/action-items/:pairId', async (req, res) => {
    const pairId = Number(req.params.pairId);
    const actionItemResults = await db.getActionItems(pairId);
    res.status(200).json(actionItemResults.rows);
  });

  router.post('/action-items/swapPositionsInPair', async (req, res) => {
    const srcItemId = Number(req.query.srcItemId);
    const dstItemId = Number(req.query.dstItemId);
    const updatedActionItems = await db.swapActionItemsPositionInPair(srcItemId, dstItemId);
    res.status(200).json(updatedActionItems.rows);
  });

  router.post('/action-items/:pairId', async (req, res) => {
    const pairId = Number(req.params.pairId);
    const insertedActionItem = await db.addActionItem(pairId, req.body)
    res.status(200).json(insertedActionItem.rows[0]);
  });

  router.delete('/action-items/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await db.removeActionItem(id);
    res.status(200).end();
  });


  router.put('/action-items/:id', async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const updatedActionItemResults = await db.updateActionItem(body, id);
    res.status(200).json(updatedActionItemResults.rows[0]);
  });
  
  return router;
}
  
  
// mount api router under the path /api
app.use('/api', createApiRouter());


/* Catch all requests to routes not previously defined*/
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  console.error(err);
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

/* Innitialize the server */
const port = process.env.NODE_ENV === undefined ? 3001 : process.env.PORT || 8080;

app.listen(port, () => { console.log(`server running on port ${port}, Node Environment ${process.env.NODE_ENV}, DB Host ${process.env.DB_HOST}`) });
