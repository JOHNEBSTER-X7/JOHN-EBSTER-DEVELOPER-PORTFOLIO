import {app} from "./app";
const port=Number(process.env.PORT??3700);
app.listen(port,()=>console.log(`Northstar Banking Integration Gateway listening on ${port}`));
