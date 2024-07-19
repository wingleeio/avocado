export const Counter = () => {
    return (
        <div x-data="{ count: 0 }" class="flex gap-2 items-center">
            <button x-on:click="count++" class="py-2 px-4 border border-slate-100 rounded-md hover:bg-slate-100">
                +
            </button>
            <div class="py-2 px-4 bg-slate-100 rounded-md">
                <span x-text="count" />
            </div>
            <button x-on:click="count--" class="py-2 px-4 border border-slate-100 rounded-md hover:bg-slate-100">
                -
            </button>
        </div>
    );
};
