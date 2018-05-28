/**
 * Felipe Silva de Mello 2015335
 * 
 */
import { createConnection } from "typeorm";
import { Link }  from "./entities/link"
import {User } from "./entities/user";
import {Vote } from "./entities/vote";

export async function connecToDatabase() {

    const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
    const DATABASE_USER = process.env.DATABASE_USER || "I am the root";
    const DATABASE_PORT = 3009;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "xxxxxxx";
    const DATABASE_DB = "test";

    const entities = [
        Vote,
        User,
        Vote
    ];

    const conn = await createConnection({
        type: "mysql",
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: entities,
        synchronize: true
    });

}
