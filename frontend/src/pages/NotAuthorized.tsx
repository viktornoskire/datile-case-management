export default function NotAuthorized() {
    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-10">

                {/* HEADER */}
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur sm:mb-5 sm:p-4">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Åtkomst nekad
                        </h1>
                        <p className="text-sm text-slate-500">
                            Du har inte behörighet att visa denna sida.
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
                    <p className="mb-4 text-4xl font-bold text-slate-700">
                        403
                    </p>
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
                        Begärd sida
                    </p>
                    <p className="mb-4 text-sm text-slate-500 break-all">
                        {window.location.href}
                    </p>
                    <p className="mb-6">
                        Du saknar rättigheter för att komma åt denna resurs.
                    </p>

                    <button
                        onClick={() => window.location.href = "/"}
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Till ärenden
                    </button>
                </div>

            </div>
        </div>
    );
}