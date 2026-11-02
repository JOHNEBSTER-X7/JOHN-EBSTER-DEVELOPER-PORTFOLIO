import {createServer} from "node:http";
import {createApp} from "./app";
import {SecurityOperationsService} from "./service";
const port=Number(process.env.PORT??3000);
createServer(createApp(new SecurityOperationsService())).listen(port,()=>console.log("Northstar security operations listening on "+port));