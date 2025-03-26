import { cn } from "~/lib/utils";
import React from "react";

const Analytics: React.FC<{
  className?: string;
  color: string;
}> = ({ className, color }) => {
  return (
    <div className="md:[&>*]:scale-100 [&>*]:scale-75">
      <div
        className={cn(
          "w-[220px] h-[242px] rounded-2xl overflow-hidden bg-[#FFFFFF]",
          "shadow-[0px_7px_15px_0px_#3333331A,0px_27px_27px_0px_#33333317,0px_60px_36px_0px_#3333330D,0px_106px_43px_0px_#33333303,0px_166px_47px_0px_#33333300]",
          className
        )}
      >
        <div
          className={
            "h-10 font-normal text-sm flex items-center p-4 text-neutral-700"
          }
          style={{
            backgroundColor: color,
          }}
        >
          Analytics
        </div>
        <div className="p-2 space-y-2">
          <p className="text-sm p-1 text-neutral-700">Google meet</p>
          <div className="px-1">
            <p className="text-base -mb-1.5">Meeting with Elon</p>
            <label className="text-xs text-neutral-700">
              10:30 | Hyderabad
            </label>
          </div>
          <div className="px-1">
            <p className="text-base -mb-1.5">Aceternity Morning Call</p>
            <label className="text-xs text-neutral-700">14:30 | Remote</label>
          </div>
          <div className="px-1">
            <p className="text-base -mb-1.5">Evening Catchup</p>
            <label className="text-xs text-neutral-700">18:30 | Remote</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
