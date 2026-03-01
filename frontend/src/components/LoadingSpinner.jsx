import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73E2A7]"></div>
      <span className="sr-only"><Loader /></span>
    </div>
  );
}