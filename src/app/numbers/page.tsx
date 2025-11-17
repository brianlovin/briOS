"use client";

import { Calculator } from "@/components/icons/Calculator";
import { LiveNumber } from "@/components/LiveNumber";
import { TopBar } from "@/components/TopBar";

export default function NumbersPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const birthsPerSecond = 4.3;
  const deathsPerSecond = 2.0;
  const populationRate = birthsPerSecond - deathsPerSecond;

  const populationBase = 8118000000;
  const populationBaseTime = new Date("2024-01-01T00:00:00Z");

  return (
    <div className="flex flex-1 flex-col">
      <TopBar>
        <Calculator />
        <div className="flex-1 text-sm font-semibold">Numbers</div>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid gap-8 text-4xl sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="text-secondary text-sm">World Population</div>
            <LiveNumber
              base={populationBase}
              baseTime={populationBaseTime}
              rate={populationRate}
              className="text-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-secondary text-sm">Births Today</div>
            <LiveNumber
              base={0}
              baseTime={startOfDay}
              rate={birthsPerSecond}
              className="text-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-secondary text-sm">Deaths Today</div>
            <LiveNumber
              base={0}
              baseTime={startOfDay}
              rate={deathsPerSecond}
              className="text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
