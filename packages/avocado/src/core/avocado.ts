import { ContextWithNext, HttpMethod, Item, MergeObjects, Middleware, Route } from "./avocado-types";
import { IncomingMessage, ServerResponse, createServer } from "http";

import { TrieRouter } from "./trie-router";

export type AvocadoContext = {
    req: IncomingMessage;
    res: ServerResponse;
};

export class Avocado<Context extends AvocadoContext> {
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

    private static flatten(items: ReadonlyArray<Item>, basePath: string = ""): Route[] {
        const routes: Route[] = [];

        for (const item of items) {
            if (item.type === "ROUTE") {
                routes.push({
                    ...item,
                    path: basePath + item.path,
                });
            } else if (item.type === "BRANCH") {
                const mergedBasePath = basePath + item.path;
                routes.push(...this.flatten(item.items, mergedBasePath));
            }
        }

        return routes;
    }

    public listen = async (port: number, routes: ReadonlyArray<Item>) => {
        const router = new TrieRouter<(context: any) => any, HttpMethod>();

        const build = (routes: ReadonlyArray<Route>) => {
            routes.forEach((route) => {
                router.add(route.path, route.method, route.handler);
            });
        };

        build(Avocado.flatten(routes));

        const server = createServer((req, res) => {
            const path = req.url?.split("?")[0] || "";
            const method = req.method as HttpMethod;

            const match = router.lookup(path, method);

            const handler = match.value;

            if (handler) {
                handler({ req, res, parameters: match.parameters });
            } else {
                this.execute(Object.assign({ req, res }, this.context), () => {});
            }
        });

        server.listen(port);
    };
}
