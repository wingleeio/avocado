import { app } from "@/avocado";

export const counter = [
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
