import {createServer} from "node:http";
import {createApp} from "./app";
import {GrcService} from "./service";
const port=Number(process.env.PORT??3000);
createServer(createApp(new GrcService())).listen(port,()=>console.log("Northstar banking GRC service listening on "+port));