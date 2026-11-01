import {createApp} from "./app";
const port=Number(process.env.PORT??3480);
createApp().listen(port,()=>console.log(`Northstar Open Banking API listening on ${port}`));
