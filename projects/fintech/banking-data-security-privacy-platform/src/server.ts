import {createServer} from "node:http";import {createApp} from "./app";import {PrivacyService} from "./service";
const port=Number(process.env.PORT??3000);createServer(createApp(new PrivacyService())).listen(port,()=>console.log("Northstar privacy service listening on "+port));
