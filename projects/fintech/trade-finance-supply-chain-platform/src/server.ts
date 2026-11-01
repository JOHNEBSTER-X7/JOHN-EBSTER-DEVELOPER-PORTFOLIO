import {createApp} from "./app";
const port=Number(process.env.PORT??3470);
createApp().listen(port,()=>console.log(`Northstar Trade Finance API listening on ${port}`));
