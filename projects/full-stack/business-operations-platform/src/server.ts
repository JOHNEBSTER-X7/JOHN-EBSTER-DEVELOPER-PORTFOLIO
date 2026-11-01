import {app} from "./app";
const port=Number(process.env.PORT||3300);
app.listen(port,()=>console.log("Northstar Business Operations listening on http://localhost:"+port));
