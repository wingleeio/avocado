import { Avocado } from "@avocado/http";
import { Counter } from "@/components/Counter";
import { MainContext } from "@/context/MainContext";
import { Root } from "@/components/Root";
import { StreamCounter } from "@/components/StreamCounter";

const app = new Avocado().use(MainContext);

const routes = [
    app.get("/", async (c) => {
        c.res.writeHead(200, { "Content-Type": "text/html" });
        c.res.end(
            <Root>
                <div class="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <h1 class="text-5xl font-bold underline">Hello, Avocado!</h1>
                    <StreamCounter />
                    <Counter />
                </div>
            </Root>,
        );
    }),
    app.get("/stream", (c) => {
        c.res.writeHead(200, { "Content-Type": "text/event-stream" });

        let count = 1;

        setInterval(() => {
            c.res.write(`event: counter\n`);
            c.res.write(`data: ${count++}\n\n`);
        }, 1000);
    }),
] as const;

app.listen(3500, routes);
