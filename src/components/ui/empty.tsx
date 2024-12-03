import { HeartCrack } from 'lucide-react';

const Empty = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white text-gray-500">
            <div className="flex flex-col items-center">
                <HeartCrack className="h-12 w-12 text-gray-400" /> {/* Adjust size and color */}
                <p className="mt-2 text-lg">Your list is empty</p>
            </div>
        </div>
    );
}

export default Empty;