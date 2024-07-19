import { IndexPage } from "@/pages/IndexPage";
import { app } from "@/avocado";
import { counter } from "@/controllers/counter";

const routes = [
    app.get("/", async (c) => {
        c.res.writeHead(200, { "Content-Type": "text/html" });
        c.res.end(<IndexPage />);
    }),
    app.branch("/counter", counter),
] as const;

app.listen(3500, routes);
