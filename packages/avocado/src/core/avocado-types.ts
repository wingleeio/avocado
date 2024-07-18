export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export type Route = {
    type: "ROUTE";
    path: string;
    method: HttpMethod;
    handler: () => any;
};

export type Branch = {
    type: "BRANCH";
    path: string;
    items: ReadonlyArray<Route | Branch>;
};

export type Item = Route | Branch;

export type MergeObjects<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void
    ? { [K in keyof I]: I[K] }
    : never;

export type Next = <NewContext>(context?: NewContext) => Promise<NewContext>;

export type Middleware<CurrentContext extends any, NewContext> = <UpdatedContext extends NewContext>(
    context: ContextWithNext<CurrentContext>,
) => Promise<UpdatedContext>;

export type ContextWithNext<Context> = Context & { next: Next };
