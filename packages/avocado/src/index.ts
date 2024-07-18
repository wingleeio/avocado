import { Avocado } from "./core/avocado";

const app = new Avocado().use((c) => {
    console.log(c.req.method, c.req.url);
    return c.next({ test: "Hello, World!" });
});

const routes = [
    app.get("/", (c) => {
        c.res.end("Hello, World!");
    }),
] as const;

Avocado.listen(3500, routes);
