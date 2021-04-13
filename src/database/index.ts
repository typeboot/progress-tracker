import {Pool} from "pg";
import config from "../config";

const pool = new Pool({
    user: config.databaseUser(),
    database: config.databaseName(),
    password: config.databasePassword(),
    host: config.databaseHost(),
    port: config.databasePort(),
    max: config.databaseConnectionSize(),
});

const query = async (raw: string, params: any[]) => {
    return pool.query(raw, params)
};

const end = async () => {
    await pool.end();
}

const dbInterface = {query, end};

export default dbInterface;