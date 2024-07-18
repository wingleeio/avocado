class TrieNode<Handler, MapKey> {
    children: Map<string, TrieNode<Handler, MapKey>> = new Map();
    handlers: Map<MapKey, Handler> = new Map();
    regex: RegExp | null = null; //
}

export class TrieRouter<Handler, MapKey> {
    private root = new TrieNode<Handler, MapKey>();

    public add(path: string, method: MapKey, handler: Handler) {
        let current = this.root;
        const parts = path.split("/");

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isDynamic = part.startsWith(":");

            if (isDynamic) {
                const dynamicSegment = `[^/]+`;
                const regex = new RegExp(`^${dynamicSegment}$`);

                if (!current.children.has(":dynamic")) {
                    current.children.set(":dynamic", new TrieNode());
                }

                current = current.children.get(":dynamic")!;
                current.regex = regex;
            } else {
                if (!current.children.has(part)) {
                    current.children.set(part, new TrieNode());
                }

                current = current.children.get(part)!;
            }
        }

        current.handlers.set(method, handler);
    }

    public lookup(path: string, method: MapKey) {
        const parts = path.split("/");
        let current = this.root;
        const parameters: string[] = [];

        for (const part of parts) {
            let matched = false;

            // Check for exact match
            if (current.children.has(part)) {
                current = current.children.get(part)!;
                matched = true;
            }
            // Check for dynamic segments
            else if (current.children.has(":dynamic")) {
                const dynamicNode = current.children.get(":dynamic")!;
                if (dynamicNode.regex && dynamicNode.regex.test(part)) {
                    current = dynamicNode;
                    matched = true;
                    parameters.push(part);
                }
            }

            if (!matched) {
                return { parameters: [], value: undefined };
            }
        }

        return {
            parameters,
            value: current.handlers.get(method),
        };
    }
}
