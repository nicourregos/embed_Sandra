"use client"
import World from "./Components/world";
import { useState } from "react";
import Carrusel from "./Components/carrusel";

export default function Home() {

  const [currentPos, setCurrentPos] = useState<number[]>([-1, -4, 0]);
  const [currentRot, setCurrentRot] = useState<number[]>([0, 0, 0]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  function setCountry(country: string) {
    switch (country) {
      case "Colombia":
        setCurrentPos([-1.5, -4, 0.5]); setCurrentRot([-0.1, -0.4, 0]);
        break;
      case "USA":
        setCurrentPos([-1.3, -4, -1]); setCurrentRot([0.3, 0, 0]);
        break;
      case "Australia":
        setCurrentPos([-1.5, -3, 3]); setCurrentRot([-0.7, 2.2, 0]);
        break;
    }
  }

  const toggleSkill = (event: React.MouseEvent<HTMLAnchorElement>, skill: string) => {
    if (selectedSkill == skill) {
      setSelectedSkill(null)
    }
    else {
      setSelectedSkill(skill)
    };
    event.stopPropagation();
  }

  return (
    <>
      <section className="absolute w-full h-full">
        <World coordinates={currentPos} rotation={currentRot}></World>
      </section>
      <section className="relative w-full content-center z-0 flex flex-col">
        <Carrusel setterCountry={setCountry} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill}></Carrusel>
        <div className="grid grid-cols-1 lg:grid-cols-4 justify-center items-center m-4 gap-4 text-black" style={{ zIndex: 100 }}>
          <div className="flex flex-col bg-gradient-to-tr from-[#AAAAAA]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-center">
            <h4 className="text-3xl font-bold">Skills</h4>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#6FEB33]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Overarching Sustainability</h4>
            <p className="font-bold text-xs">Orients executive leadership by integrating climate science, ESG governance, and purpose-driven transformation into strategic decision-making.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#6FEB33] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "Sustainability")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#4DF5AC]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Commercial & Marketing</h4>
            <p className="font-bold text-xs">Transforms complex climate strategies into compelling narratives that attract clients, investment, and cross-sector partnerships.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#4DF5AC] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "Marketing")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#42CBE2]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Finance</h4>
            <p className="font-bold text-xs">Connects financial strategy with sustainability through climate finance, investment structuring, and ESG risk management.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#42CBE2] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "Finance")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#0087FF]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Human Resources</h4>
            <p className="font-bold text-xs">Integrates DEI, ethical leadership, and capacity-building into sustainability programs and organizational culture.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#0087FF] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "HR")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#874DF9]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Procurement & Supply</h4>
            <p className="font-bold text-xs">Applies circular economy principles and Scope 3 strategies to optimize impact across procurement systems.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#874DF9] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "Procurement")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#F42942]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Operation</h4>
            <p className="font-bold text-xs">Implements sustainability through technical project execution in renewable energy, infrastructure, and impact assessment.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#F42942] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "Operation")}>Explore the work →</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#F4B942]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between">
            <h4 className="text-xl">Research & Development</h4>
            <p className="font-bold text-xs">Generates applied research and innovation in environmental science, climate solutions, and clean technologies.</p>
            <a href="#timelineCarousel" className="text-sm bg-[#F4B942] text-white rounded-full text-center" onClick={(e) => toggleSkill(e, "R&D")}>Explore the work →</a>
          </div>
        </div>
      </section >
    </>
  );
}
