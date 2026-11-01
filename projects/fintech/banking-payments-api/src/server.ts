import { createApp } from "./app";
const port = Number(process.env.PORT ?? 3420);
createApp().listen(port, () => console.log(`Northstar Banking & Payments API listening on port ${port}`));
