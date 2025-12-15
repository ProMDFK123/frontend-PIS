export function UserCardLoading() {
    return (
        <div className="relative flex flex-col h-full rounded-[2rem] bg-white shadow-xl overflow-hidden animate-pulse">
            {/* Header */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-start">
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>

            <div className="px-6 py-4 flex-1 flex flex-col">
                <div className="h-8 w-3/4 bg-slate-200 rounded-lg mb-4"></div>

                <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="flex-1">
                            <div className="h-3 w-12 bg-slate-200 rounded mb-1"></div>
                            <div className="h-4 w-full bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="flex-1">
                            <div className="h-3 w-12 bg-slate-200 rounded mb-1"></div>
                            <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="flex-1">
                            <div className="h-3 w-16 bg-slate-200 rounded mb-1"></div>
                            <div className="h-4 w-16 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 mt-2">
                <div className="w-full h-12 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    );
}