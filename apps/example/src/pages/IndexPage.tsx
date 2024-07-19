import { Root } from "@/components/Root";
import { StreamCounter } from "@/components/StreamCounter";

export const IndexPage = () => {
    return (
        <Root>
            <div class="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <h1 class="text-5xl font-bold underline">Hello, Avocado!</h1>
                <StreamCounter />
            </div>
        </Root>
    );
};
