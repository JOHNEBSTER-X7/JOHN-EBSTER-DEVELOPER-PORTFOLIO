import {createApp} from "./app";
const port=Number(process.env.PORT??3490);
createApp().listen(port,()=>console.log(`Northstar Financial Crime API listening on ${port}`));
