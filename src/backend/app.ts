import express from "express";
import { getLinkRouter } from "./backend/controllers/link_controller";
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
    const app = express();
    app.get("/api/v1/links", getLinkRouter()); //GET
    app.post("api/v1/links", getLinkRouter());   //POST
    app.delete("api/v1/links/:id", getLinkRouter());   //DELETE

    app.use("api/v1/link/:id/upvote", getLinkRouter()); //UPVOTE LINK
    app.use("api/v1/link/:id/downvote", getLinkRouter()); //DOWNVOTE LINK
    return app;
}
