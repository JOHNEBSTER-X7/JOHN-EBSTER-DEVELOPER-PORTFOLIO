import {createApp} from "./app";
const port=Number(process.env.PORT??3450);
createApp().listen(port,()=>console.log(`Northstar exchange API listening on ${port}`));
