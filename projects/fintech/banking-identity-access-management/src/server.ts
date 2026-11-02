import {createServer} from "node:http";
import {createApp} from "./app";
import {IdentityService} from "./service";
const port=Number(process.env.PORT??3000);
createServer(createApp(new IdentityService())).listen(port,()=>console.log("Northstar identity service listening on "+port));