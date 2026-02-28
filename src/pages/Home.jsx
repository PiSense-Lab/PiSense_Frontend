import React from "react";
import SmallContainer from "../components/SmallContainer";
import Graph from "../components/Graph";
import QuickActions from "../components/QuickActions";
import AIInsight from "../components/AIInsight";
import SystemMonitor from "../components/SystemMonitor";

const Home = () => {
  const TOPBAR_BOXES = [
    { name: "Active Project:", value: "Weather" },
    { name: "Last Update:", value: "2026-2-13 14:30" },
    { name: "Total Datasets:", value: "1,200" },
    { name: "Anomalies:", value: "4" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 4 Top Bar Containers */}
        {TOPBAR_BOXES.map((topic) => (
          <SmallContainer topic={topic} />
        ))}
      </div>

      <div className="grid md:flex gap-4">
        <div className="flex-2">
          <Graph />
        </div>
        <div className="flex-1">
          <QuickActions />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="">
          <AIInsight />
        </div>
        <div className="">
          <SystemMonitor />
        </div>
      </div>
    </div>
  );
};

export default Home;
