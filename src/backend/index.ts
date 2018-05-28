import "reflect-metadata";
import {getApp} from "./app";

(async()=>{
    const port = 3000;
    const app = await getApp();
    app.listen(port, () =>{
        console.log(`Server running on http://localhost:${port}`)
    });
})();
