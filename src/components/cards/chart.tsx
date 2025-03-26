import { InfoIcon, SandWatch } from "~/components/icons";
import Image from "next/image";
import React from "react";
import { ContentCard } from "./ContentCard";
import { graphData } from "~/lib/data";

const ChartCard = (): JSX.Element => {
  return (
    <div className="relative lg:h-[483px] h-full lg:w-3/5 w-full flex flex-col items-center rounded-2xl overflow-hidden p-5 pt-20 border border-[#DBDCDF]">
      <div>
        <div className="absolute -right-24 top-5 z-20 w-[350px] gap-4 bg-white rounded-2xl h-16 flex items-center px-5 border shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000]">
          <span>✅</span>
          <span>Do not hire Manu, please.</span>
        </div>
        <div className="absolute -right-[115px] top-10 z-10 w-[350px] gap-4 bg-white rounded-2xl h-16 flex items-center px-5 border shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000]"></div>
      </div>

      <Chart />
      <ContentCard
        title="Rank interviee, effortlessly"
        description="State of the art bar chart depiction of interviee's performance"
        className="mt-4"
      />
    </div>
  );
};

export default ChartCard;

const Chart = (): JSX.Element => {
  return (
    <div>
      <div className="relative lg:w-[532px] h-[275px] lg:[&>*]:scale-[0.8] [&>*]:scale-[0.6] bg-[#FFFFFF] rounded-3xl overflow-hidden border border-solid border-[#EFEFEF]">
        <header className="flex w-[488px] items-center justify-between bg-transparent m-5">
          <div className="inline-flex items-center gap-2">
            <div className="w-6 h-6">
              <SandWatch />
            </div>

            <div className="gap-1 flex items-center justify-center">
              <div className="w-fit mt-[-1.00px] font-heading-h5-semibold font-normal text-[#080808] text-xl leading-[var(--heading-h5-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-h5-semibold-font-style)]">
                Time Tracker
              </div>

              <div className="w-10 ml-1">
                <InfoIcon />
              </div>
            </div>
          </div>
        </header>

        <div className="flex w-[416px] items-center gap-0.5 absolute top-[237px] left-[42px]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow"
            >
              <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-[#888888] text-center tracking-normal leading-4 whitespace-nowrap">
                {day}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute w-[475px] h-[145px] top-20 left-[27px]">
          <div className="absolute w-[456px] h-[145px] top-0 left-[19px]">
            <div className="flex w-[416px] items-end gap-4 absolute top-[23px] left-0 border-b border-[#E9E9E9] pb-2">
              {graphData.map((data) => (
                <div
                  key={data.id}
                  className="flex flex-col items-start relative flex-1 grow"
                  style={{
                    height: data.currentHeight,
                  }}
                >
                  <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />

                  <div
                    style={{ height: data.previousHeight }}
                    className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                  />
                </div>
              ))}

              <div className="flex flex-col h-[13px] items-start relative flex-1 grow">
                <div className="bg-[#EFEFEF] rounded-xl relative flex-1 self-stretch w-full grow" />
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[27px] absolute top-0 left-[435px]">
              {["8h", "4h", "2h", "0"].map((time) => (
                <div
                  key={time}
                  className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-[#888888] text-right tracking-normal leading-4 whitespace-nowrapleading-4"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <Image
            alt="Vector"
            src={"/assets/VerticalDots.svg"}
            width={447}
            height={1}
            className="absolute w-[447px] h-0.5 top-[67px] left-0"
          />

          <div className="inline-flex items-start absolute top-[57px] left-[407px] rotate-180 h-[22px] overflow-hidden ml-1">
            <div className="inline-flex items-start gap-2.5 pl-1 pr-0.5 py-px relative flex-[0_0_auto] bg-[#030303] rounded-[4px_0px_0px_4px] overflow-hidden">
              <div className="relative w-fit mt-[-1.00px] h-[21px] rotate-180 [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                Avg
              </div>
            </div>

            <div className="relative w-[9.65px] h-[22px] -rotate-180">
              <svg
                width="10"
                height="22"
                viewBox="0 0 10 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.611521 10.3273C0.264775 10.7087 0.264775 11.2913 0.611521 11.6727L10 22L10 -4.37114e-07L0.611521 10.3273Z"
                  fill="#030303"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
