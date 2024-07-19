export const StreamCounter = () => {
    return (
        <div hx-ext="sse" sse-connect="/stream">
            Stream counter is now at{" "}
            <span class="text-orange-500" sse-swap="counter">
                0
            </span>
        </div>
    );
};
