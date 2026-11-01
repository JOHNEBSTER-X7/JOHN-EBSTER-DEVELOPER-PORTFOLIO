import { createApp } from "./app";
const port = Number(process.env.PORT ?? 3410);
createApp().listen(port, () => console.log(`Northstar Ledger API listening on port ${port}`));
