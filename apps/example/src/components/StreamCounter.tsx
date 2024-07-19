export const StreamCounter = () => {
    return (
        <div hx-ext="sse" sse-connect="/stream" class="flex gap-2 items-center">
            <button
                hx-post="/add"
                hx-swap="none"
                class="py-2 px-4 border border-slate-100 rounded-md hover:bg-slate-100"
            >
                +
            </button>
            <div class="py-2 px-4 bg-slate-100 rounded-md">
                <span class="text-orange-500" sse-swap="counter">
                    0
                </span>
            </div>
            <button
                hx-post="/subtract"
                hx-swap="none"
                class="py-2 px-4 border border-slate-100 rounded-md hover:bg-slate-100"
            >
                -
            </button>
        </div>
    );
};
