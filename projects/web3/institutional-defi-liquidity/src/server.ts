import { createIndexerApp } from "./indexer";
const port=Number(process.env.PORT??3440);
createIndexerApp().listen(port,()=>console.log(`Northstar DeFi event indexer listening on ${port}`));
