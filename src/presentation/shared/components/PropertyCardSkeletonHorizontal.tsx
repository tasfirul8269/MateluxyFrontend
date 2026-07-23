'use client';

export const PropertyCardSkeletonHorizontal = () => {
    return (
        <div className="container mx-auto p-0 bg-white rounded-xl grid md:grid-cols-2 gap-4 border border-gray-200 my-6 shadow-sm overflow-hidden animate-pulse">
            {/* Image Placeholder */}
            <div className="relative h-[300px] flex gap-1">
                <div className="w-2/3 h-full bg-gray-200 rounded-l-xl" />
                <div className="flex w-1/3 flex-col gap-1">
                    <div className="w-full h-1/2 bg-gray-200 rounded-tr-xl" />
                    <div className="w-full h-1/2 bg-gray-200" />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col items-start justify-start h-full p-4 w-full">
                {/* Price and Location */}
                <div className="w-full space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />

                    {/* Title */}
                    <div className="h-6 bg-gray-200 rounded w-3/4" />

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-5 py-3 border-t border-b border-gray-100 mt-4">
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Agent Info */}
                <div className="flex items-center gap-4 mt-4 w-full">
                    <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-2 w-full">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full items-center gap-3 border-t border-gray-200 mt-4 pt-4">
                    <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                    <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                    <div className="hidden md:block h-10 bg-gray-200 rounded-lg flex-1" />
                </div>
            </div>
        </div>
    );
};
