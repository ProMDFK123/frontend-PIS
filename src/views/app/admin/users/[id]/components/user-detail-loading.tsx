export function UserDetailLoading() {
    return (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-24 bg-white/10 rounded-full mb-6" />
            
            {/* Header skeleton */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 mb-6">
                <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-full bg-white/20" />
                    <div className="flex-1 space-y-4">
                        <div className="h-8 bg-white/20 rounded-lg w-64" />
                        <div className="h-4 bg-white/20 rounded w-48" />
                        <div className="h-4 bg-white/20 rounded w-32" />
                    </div>
                </div>
            </div>

            {/* Content grid skeleton */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white/10 rounded-2xl" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-white/10 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}