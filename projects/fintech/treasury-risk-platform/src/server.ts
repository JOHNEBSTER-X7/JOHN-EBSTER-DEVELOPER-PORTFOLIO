import {createApp} from "./app";
const port=Number(process.env.PORT??3460);
createApp().listen(port,()=>console.log(`Northstar Treasury API listening on ${port}`));
