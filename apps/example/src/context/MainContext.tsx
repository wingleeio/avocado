import { Avocado } from "@avocado/http";
import fs from "fs";
import path from "path";

export const MainContext = new Avocado()
    .use(async (c) => {
        const now = performance.now();
        const next = await c.next();
        const duration = performance.now() - now;
        console.log(
            "\x1b[34m" + c.req.method + "\x1b[0m",
            c.res.statusCode,
            c.req.url,
            "\x1b[38;5;208m" + duration.toFixed(3) + "\x1b[0m",
            "ms",
        );
        return next;
    })
    .use(async (c) => {
        const file = path.join(__dirname, "../../public" + c.req.url);
        const extname = path.extname(file);

        const CONTENT_TYPES = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
        };

        if (!CONTENT_TYPES[extname]) {
            return c.next();
        }

        fs.readFile(file, (err, content) => {
            if (err) {
                c.res.writeHead(404);
                c.res.end(`Error loading ${file}`);
                return;
            }

            c.res.writeHead(200, { "Content-Type": CONTENT_TYPES[extname] });
            c.res.end(content);
        });
    });
