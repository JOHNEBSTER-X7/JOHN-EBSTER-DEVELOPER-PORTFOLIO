import {app} from "./app";
const port=Number(process.env.PORT||3200);
app.listen(port,()=>console.log("Northstar Research Intelligence listening on http://localhost:"+port));
