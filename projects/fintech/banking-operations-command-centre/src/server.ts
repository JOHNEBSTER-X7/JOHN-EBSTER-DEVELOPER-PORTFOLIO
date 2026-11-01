import {app} from "./app";
const port=Number(process.env.PORT??3600);
app.listen(port,()=>console.log(`Northstar Banking Operations Command Centre listening on ${port}`));
