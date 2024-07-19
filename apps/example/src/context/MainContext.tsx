import { Avocado } from "@avocado/http";
import EventEmitter from "events";
import { files } from "@/middleware/files";
import { logger } from "@/middleware/logger";

const events = new EventEmitter();

const context = {
    events,
};

export const MainContext = new Avocado()
    .use((c) => c.next(context))
    .use(logger())
    .use(files("public"));
