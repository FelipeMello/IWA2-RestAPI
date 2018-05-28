import { Router, Request, Response } from "express";
import { Link } from "../entities/link";
import { Vote } from "../entities/vote";
import { User } from "../entities/user";
import { getLinkRepository } from "../repositories/link_repository";
import { Repository } from "typeorm";
import { getUserRepository } from "../repositories/user_repository";
import { getVoteRepository } from "../repositories/vote_repository";
import { link } from "fs";
import { authMiddleware } from "../middleware/auth_middleware";

export function getLinksHandlers(
    linkRepository: Repository<Link>,
    voteRepository: Repository<Vote>
) {

    //Retrieve all the links from the db
    const getLinksHandler = (req: Request, res: Response) => {
        (async () => {
            try {
                const links = await linkRepository.find({
                    relations: ["uer"]
                });
                res.status(200).json(links).send();
            } catch (e) {
                printErrorMessage500(e, res);
            }
        })();

    };
    //Creating a link
    const createLinkHandler = (req: Request, res: Response) => {
        (async () => {
            try {
                const userId = (req as any).userId;

                const link = {
                    title: req.body.title,
                    url: req.body.url,
                    user: {
                        id: userId
                    }
                };

                //check if the link already exists

                const existingLink = await linkRepository.findOne({
                    where: {
                        url: link.url
                    }
                });

                if (existingLink) {
                    res.status(400).send("Link already exists!");
                } else {
                    const newLink = await linkRepository.save(link);
                    res.status(200).json(newLink);
                }

            } catch (e) {
                printErrorMessage500(e,res);
            }

        })();


    };
    //Delete a link
    const deletedLinkHandler = (req: Request, res: Response) => {
        (async () => {
            try {
                const userId = (req as any).userId;
                const linkId = req.params.id;
                const linkrepository = await getLinkRepository();
                
                //Try to find a link
                const link = await linkRepository.findOne({
                    where : {
                        id: linkId
                    },
                    relations: ["user"]
                });

                //not found
                if(!link){
                    res.status(400).json({ error: "Link not found" });
                }else{
                    //Check if user is not the owner
                    if(link.user.id != userId){
                        res.status(400).json({ error: "You are not the owner of this link!" });
                    }else{
                        //Find votes fot this link
                        const votes = await voteRepository.find({
                            where:{
                                link:{
                                    id:linkId
                                }
                            }
                        });
                        //Delete vote for link
                        for(const vote of votes){
                            await voteRepository.deleteById(vote.id);
                        }
                        //Delete link
                        await linkrepository.deleteById(linkId);
                        res.json({ status:"success"}).send();
                    }
                }
            }catch(e){
                printErrorMessage500(e,res);
            }
            
        })();


    }

    const upVoteHandler = (req: Request, res: Response) => {
        (async () => {
            try{
                const userId = (req as any).userId;
                const linkId = req.params.id;

                //Check if user has already voted this link
                const existingVote = await checkVote(voteRepository, userId, linkId);
                
                if(existingVote){
                    //User is allow to vote only once
                    res.status(403).send("Only one vote per user!");
                }else{
                    //Save vote, if the user haven't vote
                    const upvoted = await voteRepository.save({
                        user:{id:userId},
                        link:{id:linkId},
                        isUpvote : true
                    });
                    res.json(upvoted);
                }
            }catch(e){
                printErrorMessage500(e,res);
            }
        })();


    }

    const downVoteHandler = (req: Request, res: Response) => {
        (async () => {
            try{
                const userId = (req as any).userId;
                const linkId = req.params.id;

                //Check if user has already voted this link
                const existingVote = await checkVote(voteRepository, userId, linkId);

                if(existingVote){
                    //User is allow to vote only once
                    res.status(403).send("Only one vote per user!");
                }else{
                    //Save vote, if the user haven't vote
                    const upvoted = await voteRepository.save({
                        user:{id:userId},
                        link:{id:linkId},
                        isUpvote : false
                    });
                    res.json(upvoted);
                }
            }catch(e){
                printErrorMessage500(e,res);
            }
        })();
    }

    //Return all votes for links
    //Debugging
    const getLinkVotesHandler = (req:Request, res:Response) =>{
        (async()=>{
            try{
                const links = await voteRepository.find({
                    where:{
                        link:{id: req.params.id}
                    }
                });
                res.json(links);
            }catch(e){
                printErrorMessage500(e, res);
            }
        })
    };
    return {
      getLinksHandler: getLinksHandler,
      createLinkHandler : createLinkHandler,
      deletedLinkHandler : deletedLinkHandler,
      upVoteHandler : upVoteHandler,
      downVoteHandler : downVoteHandler,
      getLinkVotesHandler : getLinkVotesHandler
    };


}

function printErrorMessage500(e: any, res: Response) {
    console.log(e);
    res.status(500).send().json({ error: e.message });
}

async function checkVote(voteRepository: Repository<Vote>, userId: any, linkId: any) {
    return await voteRepository.findOne({
        user: { id: userId },
        link: { id: linkId }
    });
}

export function getLinksController(
    linkRepository: Repository<Link>,
    voteRepository : Repository<Vote>) {
    

    const handlers = getLinksHandlers(linkRepository, voteRepository);
    const linksController = Router();

    //public 
    linksController.get("/", handlers.getLinksHandler);
    linksController.get("/:id/votes", handlers.getLinkVotesHandler);

    //private
    linksController.post("/", authMiddleware, handlers.createLinkHandler);
    linksController.delete("/:id", authMiddleware, handlers.deletedLinkHandler);
    linksController.post("/:id/upvote", authMiddleware,handlers.upVoteHandler);
    linksController.post("/:id/downvote", authMiddleware, handlers.downVoteHandler);

    return linksController;

}

