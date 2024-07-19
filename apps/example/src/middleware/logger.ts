import { Avocado } from "@avocado/http";

export const logger = () => {
    return new Avocado().use(async (c) => {
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
    });
};
