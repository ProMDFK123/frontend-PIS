export function UserDetailLoading() {
    return (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-white/10 rounded-full mb-6" />
            
            {/* Header skeleton */}
            <div className="mb-8 space-y-4">
                {/* Badge skeleton */}
                <div className="h-6 w-32 bg-white/20 rounded-full" />
                {/* Title skeleton */}
                <div className="h-12 bg-white/20 rounded-lg w-96" />
                {/* Subtitle skeleton */}
                <div className="h-6 bg-white/20 rounded-lg w-64" />
            </div>

            {/* Main white card skeleton */}
            <div className="bg-white text-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Left column (3/4 width) */}
                    <div className="w-full md:w-3/4 space-y-8">
                        {/* User detail sections skeleton */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-6 bg-slate-200 rounded-lg w-40" />
                                <div className="h-4 bg-slate-100 rounded w-full" />
                                <div className="h-4 bg-slate-100 rounded w-5/6" />
                            </div>
                        ))}

                        {/* Action button skeleton */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="h-12 bg-slate-200 rounded-xl w-full" />
                        </div>
                    </div>

                    {/* Right column (1/4 width) */}
                    <div className="w-full md:w-1/4 space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                            {/* Profile section skeleton */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-24" />
                                    <div className="h-6 bg-slate-100 rounded w-32" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}