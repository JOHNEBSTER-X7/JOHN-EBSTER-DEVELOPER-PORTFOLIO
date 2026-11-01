import { app } from "./app";

const port = Number(process.env.PORT || 3100);
app.listen(port, () => console.log(`Northstar multi-agent orchestrator listening on http://localhost:${port}`));
