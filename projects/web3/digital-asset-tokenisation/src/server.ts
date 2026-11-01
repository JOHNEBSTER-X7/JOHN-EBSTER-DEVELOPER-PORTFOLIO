import { createIndexerApp } from "./indexer";
const port=Number(process.env.PORT??3430);
createIndexerApp().listen(port,()=>console.log(`Northstar event indexer listening on ${port}`));
