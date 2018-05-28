import express from "express";
import jwt from "jsonwebtoken";
import {getUserRepository} from "../repositories/user_repository";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
){
    try{
        //Read token from request headers
        const token = req.headers["authorization"];

        //if no toke not a string, it is an invalid request
        if(token === undefined || Array.isArray(token)){
            res.status(400).send();
        }else{
            //Read secret from environment variables
            const secret = process.env.AUTH_SECRET;

            //if secret is undefined, there is an internal error
            if(!secret){
                res.status(500).send();
            }else{
                let decoded : any;
                try{
                    //Decode toke and get user id
                    decoded =  jwt.verify(token, secret) as any;
                }catch(e){
                    //If cannot decode toke, the user is unauthorized
                    res.status(401).send();
                }
                //Attach current user to request ojs
                (req as any).userId = decoded.id;
                //Invoke next handler
                next();
            }
        }
    }catch(e){
        res.status(500).send();
    }
}