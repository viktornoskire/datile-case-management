export default function Purchases() {
    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-10">

                {/* HEADER */}
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur sm:mb-5 sm:p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Inköp
                            </h1>
                            <p className="text-sm text-slate-500">
                                Granska och hantera inköp.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">

                            {/* Disabled create button */}
                            <button
                                type="button"
                                disabled
                                className="inline-flex w-full items-center justify-center rounded-full bg-slate-300 px-6 py-3 text-sm font-semibold text-white opacity-60 cursor-not-allowed sm:w-auto"
                            >
                                Skapa inköp
                            </button>

                            {/* View toggle (disabled but styled) */}
                            <div className="grid w-full grid-cols-2 rounded-full border border-slate-300 bg-slate-50 p-1 shadow-sm sm:w-auto sm:min-w-[220px]">
                                <button
                                    type="button"
                                    disabled
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-slate-900 shadow-sm"
                                >
                                    Lista
                                </button>

                                <button
                                    type="button"
                                    disabled
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500"
                                >
                                    Kort
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* SEARCH / FILTER BAR (disabled look) */}
                <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <button
                            type="button"
                            disabled
                            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed sm:w-auto"
                        >
                            Visa filter
                        </button>

                        <div className="flex-1">
                            <input
                                type="text"
                                disabled
                                placeholder="Sök inköp..."
                                className="w-full rounded-full border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* COUNT */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        0 inköp
                    </p>
                </div>

                {/* EMPTY STATE */}
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
                    Den här sidan är inte implementerad ännu.
                </div>

            </div>
        </div>
    );
}