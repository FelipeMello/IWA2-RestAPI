import {Router, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {Repository} from "typeorm";
import {User} from "../entities/user";

export function getAuthHandlers(userRepository : Repository<User>){
    const loginHandler = (req : Request, res: Response) =>{

        (async() =>{
            //Read toke from request headers
            const secret = process.env.AUTH_SECRET;

            //Validate inputs
            const email = req.body.email;
            const password = req.body.password;

            if(typeof email !=="string" || typeof password !=="string"){
                res.status(400).send();
            }else{
                //check if login and password matches the db
                const user = await userRepository.findOne({
                    where:{
                        email: email,
                        password: password
                    }
                });
                if(!user){
                    res.status(401).send();
                }else{
                    //Return JWT token
                    const token = jwt.sign({
                        id: user.id
                    },secret);
                    res.json({
                        token: token
                    });
                }
            }

        })();
    };

    return {
        loginHandler: loginHandler
    };
}

export function getAuthController(userRepository: Repository<User>){
    const authHandlers = getAuthHandlers(userRepository);
    const authController = Router();

    //public
    authController.post("/login", authHandlers.loginHandler);
    return authController;
}