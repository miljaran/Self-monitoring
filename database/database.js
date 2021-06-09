import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const connectionPool = new Pool(config.database, 4);

const executeQuery = async(query, ...args) => {
  const client = await connectionPool.connect();
  try {
    return await client.queryObject(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
}

export { executeQuery }
