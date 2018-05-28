import express from "express";
import * as bodyParser from "body-parser";
import {getUserRepository} from "./repositories/user_repository";
import {getLinkRepository} from "./repositories/link_repository";
import {getVoteRepository} from "./repositories/vote_repository";
import {getLinksController} from "./controllers/link_controller";
import {getUserController} from "./controllers/user_controller";
import {getAuthController} from "./controllers/auth_controller";
import {connecToDatabase} from "./db";




/**
 * GET retrieves a representation of the resource at the specified URI. The body
of the response message contains the details of the requested resource.
● POST creates a new resource at the specified URI. The body of the request
message provides the details of the new resource. Note that POST can also
be used to trigger operations that don't actually create resources.
● PUT either creates or replaces the resource at the specified URI. The body of
the request message specifies the resource to be created or updated.
● PATCH performs a partial update of a resource. The request body specifies
the set of changes to apply to the resource.
● DELETE removes the resource at the specified URI.
 */

export async function getApp() {

    //connect ot db
    await connecToDatabase();

    //App
    const app = express();

    //Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //Repositories
    const userRepository = getUserRepository();
    const linkRepository = getLinkRepository();
    const voteRepository = getVoteRepository();

    //Controllers
    const authController = getAuthController(userRepository);
    const usersController = getUserController(userRepository);
    const linksController = getLinksController(linkRepository, voteRepository);

    //Routes
    app.get("/", (req, res) =>{
        res.send("Server is running ! Rest API");
    });

    app.use("/api/v1/links", usersController);
    app.use("api/v1/links", linksController); 
    app.use("api/v1/auth",authController);

    return app;
}
