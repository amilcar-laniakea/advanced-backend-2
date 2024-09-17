import { app, PORT } from "./src/app.js";
import { Log } from "./src/utils/log.js";

app.listen(PORT, () => Log.info(`Server running on port:  ${PORT}!`));
