import {app} from "./app";
const port=Number(process.env.PORT??3800);
app.listen(port,()=>console.log(`Northstar Banking Event Streaming Platform listening on ${port}`));
