import { ContextWithNext, HttpMethod, Item, MergeObjects, Middleware } from "./avocado-types";
import { IncomingMessage, ServerResponse, createServer } from "http";

import { TrieRouter } from "./trie-router";

type DefaultContext = {
    req: IncomingMessage;
    res: ServerResponse;
};

export class Avocado<Context extends DefaultContext> {
    constructor(
        private context: Context = {} as Context,
        public middleware: Array<Middleware<Context, any>> = [],
    ) {}

    public use<NewContext>(
        //@ts-ignore
        middleware: ((context: ContextWithNext<Context>) => Promise<NewContext>) | Avocado<NewContext>,
    ) {
        if (middleware instanceof Avocado) {
            //@ts-ignore
            return new Avocado<MergeObjects<Context & NewContext>>(
                this.context as any,
                [...this.middleware, ...middleware.middleware] as any,
            );
        } else {
            //@ts-ignore
            return new Avocado<MergeObjects<Context & NewContext>>(
                this.context as any,
                [
                    ...this.middleware,
                    (context: ContextWithNext<Context>) => {
                        return middleware(context);
                    },
                ] as any,
            );
        }
    }

    private execute = async <R>(context: Context, handler: (context: Context) => R): Promise<R> => {
        const stack = [...this.middleware, (context: Context) => handler(context)];
        let current: any = context;

        const next = async (context: any) => {
            if (stack.length === 0) {
                return context;
            }

            current = { ...current, ...context };

            const middleware = stack.shift()!;

            return middleware(stack.length === 0 ? { ...current, ...context } : { ...current, ...context, next });
        };

        return next(current);
    };

    public get<P extends string, R>(path: P, handler: (context: Context) => R) {
        return {
            type: "ROUTE",
            method: HttpMethod.GET,
            path,
            handler: (context: any = {}) => {
                return this.execute<R>(Object.assign(context, this.context), handler);
            },
        } as const;
    }

    public post<P extends string, R>(path: P, handler: (context: Context) => R) {
        return {
            type: "ROUTE",
            method: HttpMethod.POST,
            path,
            handler: (context: any = {}) => {
                return this.execute<R>(Object.assign(context, this.context), handler);
            },
        } as const;
    }

    public branch<P extends string, I extends ReadonlyArray<Item>>(path: P, items: I) {
        return {
            type: "BRANCH",
            path,
            items,
        } as const;
    }

    public static listen = async (port: number, routes: ReadonlyArray<Item>) => {
        const router = new TrieRouter<(context: any) => any, HttpMethod>();

        const build = (routes: ReadonlyArray<Item>) => {
            routes.forEach((route) => {
                if (route.type === "ROUTE") {
                    router.add(route.path, route.method, route.handler);
                } else {
                    build(route.items);
                }
            });
        };

        build(routes);

        const server = createServer((req, res) => {
            const path = req.url?.split("?")[0] || "";
            const method = req.method as HttpMethod;

            const match = router.lookup(path, method);

            if (match) {
                const handler = match.value;
                handler({ req, res, parameters: match.parameters });
            } else {
                res.statusCode = 404;
                res.end("Not found");
            }
        });

        server.listen(port);
    };
}
