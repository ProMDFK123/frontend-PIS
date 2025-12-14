export function UserListLoading() {
    return (
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl animate-pulse">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar Skeleton */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/20"></div>
                </div>
                
                {/* User Info Skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-5 bg-white/20 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-white/20 rounded-lg w-2/3"></div>
                </div>

                {/* Badges & Stats Skeleton (hidden on mobile) */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="h-6 w-24 bg-white/20 rounded-full"></div>
                    <div className="h-4 w-24 bg-white/20 rounded-lg"></div>
                    <div className="h-4 w-16 bg-white/20 rounded-lg"></div>
                    <div className="h-6 w-20 bg-white/20 rounded-full"></div>
                </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="ml-4 h-10 w-24 bg-white/20 rounded-full"></div>
        </div>
    );
}