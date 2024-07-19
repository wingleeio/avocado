import { Avocado } from "@avocado/http";
import { IndexPage } from "@/pages/IndexPage";
import { MainContext } from "@/context/MainContext";

const app = new Avocado().use(MainContext);

const routes = [
    app.get("/", async (c) => {
        c.res.writeHead(200, { "Content-Type": "text/html" });
        c.res.end(<IndexPage />);
    }),
    app.post("/add", (c) => {
        c.events.emit("add");
        c.res.end();
    }),
    app.post("/subtract", (c) => {
        c.events.emit("subtract");
        c.res.end();
    }),
    app.get("/stream", (c) => {
        c.res.writeHead(200, { "Content-Type": "text/event-stream" });

        let count = 0;

        c.res.write(`event: counter\n`);
        c.res.write(`data: ${count}\n\n`);

        c.events.on("add", () => {
            count++;
            c.res.write(`event: counter\n`);
            c.res.write(`data: ${count}\n\n`);
        });

        c.events.on("subtract", () => {
            count--;
            c.res.write(`event: counter\n`);
            c.res.write(`data: ${count}\n\n`);
        });
    }),
] as const;

app.listen(3500, routes);
