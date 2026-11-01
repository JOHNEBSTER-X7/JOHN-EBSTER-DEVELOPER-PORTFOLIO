import {app} from "./app";
const port=Number(process.env.PORT??3500);
app.listen(port,()=>console.log(`Northstar Fraud Intelligence API listening on ${port}`));
