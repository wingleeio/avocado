import { Avocado } from "@avocado/http";
import fs from "fs";
import path from "path";

export const files = (root: string) => {
    return new Avocado().use(async (c) => {
        const file = path.join(process.cwd(), root, c.req.url);
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
};
