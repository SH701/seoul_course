import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";

interface PostCountProps {
  count: number;
}

export default function PostCount({ count }: PostCountProps) {
  return (
    <div className="flex items-center gap-1 text-purple-500 text-sm border bg-gray-100 py-1 px-2 rounded-3xl">
      <ChatBubbleBottomCenterIcon className="w-4 h-4" />
      <span>{count}</span>
    </div>
  );
}
