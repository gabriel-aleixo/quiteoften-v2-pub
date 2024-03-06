// // Environment variables
// require('dotenv').config();

const { Pool, Client } = require("pg");

let DB_NAME;

if (process.env.NODE_ENV == "production") {
  DB_NAME = process.env.DB_NAME_PROD;
} else {
  DB_NAME = process.env.DB_NAME_DEV;
}

const credentials = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// const pool = new Pool(credentials);

const connectionString = process.env.CONNECTION_STRING;

// This function allowed me to connect the same code to Supabase, withouth ussing coonections pool
// To use pool with Supabase, I need to connect using Prisma and refactor all the dbFuncs
// This is much slower than pools but it's enough for demo purposes
const runQuery = async (text, values) => {
  const client = new Client({ connectionString });
  client.connect();
  const result = await client.query(text, values);
  client.end();
  return result;
};

async function getUser(dbUserId) {
  const text = `SELECT * FROM users WHERE id = $1 ORDER BY created_at DESC LIMIT 1`;
  const values = [dbUserId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserByOutsetaUserId(outsetaPersonUid) {
  const text = `SELECT * FROM users WHERE outseta_user_id = $1 ORDER BY created_at DESC LIMIT 1`;
  const values = [outsetaPersonUid];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addUser(outsetaPersonUid) {
  const text = `INSERT INTO users (outseta_user_id) VALUES ($1) RETURNING *`;
  const values = [outsetaPersonUid];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPairs(userId) {
  const text = `SELECT * FROM pairs WHERE ((lead = $1) or (follow  = $1) and (lead != follow))`;
  const values = [userId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addPairs(leadId, followId) {
  const text = `INSERT INTO pairs (lead, follow) VALUES ($1, $2) RETURNING *`;
  const values = [leadId, followId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getDiscussionItems(pairId) {
  const text = `SELECT * FROM discussionitems WHERE pair_id = $1 
                  ORDER BY position_in_pair,created_at`;
  const values = [pairId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getActionItems(pairId) {
  const text = `SELECT * FROM actionitems WHERE pair_id = $1 
                  ORDER BY position_in_pair,created_at`;
  const values = [pairId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeDiscussionItem(id) {
  const text = `DELETE FROM discussionItems WHERE id = $1`;
  const values = [id];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeActionItem(id) {
  const text = `DELETE FROM actionitems WHERE id = $1`;
  const values = [id];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addDiscussionItem(pairId, discussionItem) {
  const text = `
    INSERT INTO discussionitems (pair_id, description, complete, position_in_pair)
    VALUES ($1, $2, $3, (select (coalesce(MAX(position_in_pair), 0)+1) 
                            FROM  discussionitems where pair_id=$1))
    RETURNING *
    `;
  const values = [pairId, discussionItem.description, discussionItem.complete];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addActionItem(pairId, actionItem) {
  const text = `
    INSERT INTO actionitems (pair_id, description, complete, position_in_pair)
    VALUES ($1, $2, $3, (select (coalesce(MAX(position_in_pair), 0)+1) 
    FROM  actionitems where pair_id=$1))
    RETURNING *
    `;
  const values = [pairId, actionItem.description, actionItem.complete];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateDiscussionItem(newDiscussionItem, id) {
  const text = `UPDATE discussionItems 
                  SET complete = $2, updated_at=NOW() 
                  WHERE id = $1
                  RETURNING *`;
  const values = [id, newDiscussionItem.complete];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateActionItem(newActionItem, id) {
  const text = `UPDATE actionItems 
                  SET complete = $2, updated_at=NOW()  
                  WHERE id = $1
                  RETURNING *`;
  const values = [id, newActionItem.complete];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function swapDiscussionItemsPositionInPair(srcItemId, dstItemId) {
  const text = `
        UPDATE discussionitems dst
        SET position_in_pair = src.position_in_pair, updated_at=NOW() 
        FROM discussionitems src
        WHERE dst.id IN($1,$2)
        AND src.id IN($1,$2)
        AND dst.id <> src.id
        RETURNING dst.*
    `;
  const values = [srcItemId, dstItemId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function swapActionItemsPositionInPair(srcItemId, dstItemId) {
  const text = `
        UPDATE actionitems dst
        SET position_in_pair = src.position_in_pair, updated_at=NOW() 
        FROM actionitems src
        WHERE dst.id IN($1,$2)
        AND src.id IN($1,$2)
        AND dst.id <> src.id
        RETURNING dst.*
    `;
  const values = [srcItemId, dstItemId];
  try {
    const result = await runQuery(text, values);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {
  getUser,
  getUserByOutsetaUserId,
  addUser,
  getDiscussionItems,
  getActionItems,
  removeActionItem,
  removeDiscussionItem,
  addActionItem,
  addDiscussionItem,
  updateActionItem,
  updateDiscussionItem,
  swapActionItemsPositionInPair,
  swapDiscussionItemsPositionInPair,
  getPairs,
  addPairs,
};
