import {Router, Request, Response} from "express";
import {authMiddleware} from "../middleware/auth_middleware";
import {Repository} from "typeorm";
import {User} from "../entities/user";

export function getUserHandlers(
    userRepository : Repository<User>
){
    //create a new user
    const createUserHandler = (req: Request, res : Response) =>{
        (async()=>{
            try{
                const email =  req.body.email;
                const password = req.body.password;

                //check input
                if(!email && !password){
                    res.status(400).send();
                }

                const existingUser = await userRepository.findOne({ email: email });
                //if email already registered 
                if(existingUser){
                    res.status(400).send("User already exists");
                }

                //Save user
                const user = await userRepository.save({
                    email,
                    password
                });

                res.json(user).send();
                
            }catch(e){
                console.log(e);
                res.status(500).send();
            }
        })();
    };

    return {createUserHandler : createUserHandler};
}

export function getUserController(
    userRepository: Repository<User>
){
    const handlers = getUserHandlers(userRepository);
    const usersController = Router();
    
    //public
    usersController.post("/", handlers.createUserHandler);
    return usersController;
}