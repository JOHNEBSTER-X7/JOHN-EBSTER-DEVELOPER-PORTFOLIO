import {createServer} from "node:http";
import {createApp} from "./app";
import {ZeroTrustService} from "./service";
const port=Number(process.env.PORT??3000);
createServer(createApp(new ZeroTrustService())).listen(port,()=>console.log("Northstar zero-trust network service listening on "+port));