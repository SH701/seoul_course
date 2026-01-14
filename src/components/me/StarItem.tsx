import { Stars } from "@/types";

import StarDelete from "./StarDelete";
import MoveNaver from "./MoveNaver";
interface StarItemProps {
  star: Stars;
}

export default function StarItem({ star }: StarItemProps) {
  return (
    <li className=" bg-white border border-gray-100 rounded-2xl shadow-md  overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 ">{star.title}</h3>
          <StarDelete placeId={star.placeId} />
        </div>
        <div className="flex flex-col ">
          <p className="text-sm text-gray-600 mb-3">{star.desc}</p>
          <p className=" text-xs text-gray-500 mb-3">{star.address}</p>
        </div>
        <MoveNaver star={star} />
      </div>
      <div className="h-1 bg-linear-to-r from-yellow-400 via-orange-400 to-red-400"></div>
    </li>
  );
}
