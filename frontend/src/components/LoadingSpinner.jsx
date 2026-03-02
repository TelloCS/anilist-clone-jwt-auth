import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <span className="sr-only"><Loader /></span>
    </div>
  );
}