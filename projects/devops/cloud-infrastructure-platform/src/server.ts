import {app} from "./app";
const port=Number(process.env.PORT||3400);
app.listen(port,()=>console.log("Northstar Cloud Platform listening on http://localhost:"+port));
