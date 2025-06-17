"use client"
import World from "./Components/world";
import { useLayoutEffect, useState } from "react";
import Carrusel from "./Components/carrusel";

export default function Home() {

  const [currentPos, setCurrentPos] = useState<number[]>([-1, -4, 0]);
  const [currentRot, setCurrentRot] = useState<number[]>([0, 0, 0]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [openedSkill, setOpenedSkill] = useState<string | null>(null);
  const [small, setSmall] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (window.innerWidth < 768) {
      setSmall(true);
    }
  }, []);

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

  const toggleOpenedSkill = (event: React.MouseEvent<HTMLDivElement>, skill: string) => {
    if (openedSkill == skill) {
      setOpenedSkill(null)
    }
    else {
      setOpenedSkill(skill)
    };
    event.stopPropagation();
  }

  return (
    <>
      <section className="absolute w-full h-full">
        <World coordinates={currentPos} rotation={currentRot}></World>
      </section>
      <section className="relative w-full content-center z-0 flex flex-col items-center overflow-x-hidden">
        <Carrusel setterCountry={setCountry} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill}></Carrusel>
        <div id="skillDescriptions" className="lg:container grid grid-cols-1 lg:grid-cols-4 justify-center items-center m-4 gap-4 text-black" style={{ zIndex: 100 }}>
          <div className="flex flex-col bg-gradient-to-tr from-[#AAAAAA]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-center">
            <h4 className="skillDescriptionTitle">Skills</h4>
            <p className="text-xs">Each of these areas reflects the ability to integrate science, strategy, and empathetic leadership into concrete solutions. The expertise spans multiple sectors, always guided by the purpose of creating real, sustainable, and collective impact.</p>
          </div>

          <div className="flex flex-col bg-gradient-to-tr from-[#42CBE2]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "Finance")}>
            <h4 className="text-xl">Finance</h4>
            <p className="font-bold text-xs">Connects financial strategy with sustainability through climate finance, investment structuring, and ESG risk management.</p>
            {(openedSkill === "Finance" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#42CBE2]">
                  <p className="text-xs">Climate Finance & Risk Management</p>
                  <p className="text-xs">Financial Modeling & Analysis</p>
                  <p className="text-xs">Cost & Pricing Strategies</p>
                  <p className="text-xs">Sustainable Bonds & Loans Evaluation</p>
                  <p className="text-xs">ESG Ratings and Metrics</p>
                  <p className="text-xs">Decision-Making</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#42CBE2] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "Finance")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#0087FF]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "HR")}>
            <h4 className="text-xl">Human Resources</h4>
            <p className="font-bold text-xs">Integrates ethical leadership, and capacity-building into sustainability programs and organizational culture.</p>
            {(openedSkill === "HR" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#0087FF]">
                  <p className="text-xs">Leadership & Team Building</p>
                  <p className="text-xs">Diversity & Inclusion Facilitation</p>
                  <p className="text-xs">Stakeholder Negotiation & Influence</p>
                  <p className="text-xs">Social KPIs Understanding</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#0087FF] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "HR")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#874DF9]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "Procurement")}>
            <h4 className="text-xl">Procurement & Supply</h4>
            <p className="font-bold text-xs">Applies circular economy principles and carbon footprint strategies to enhance sustainability across procurement and supply chain operations.</p>
            {(openedSkill === "Procurement" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#874DF9]">
                  <p className="text-xs">Circular Economy & Resource Efficiency</p>
                  <p className="text-xs">Supply Chain Sustainability Analysis</p>
                  <p className="text-xs">Environmental and Social Compliance</p>
                  <p className="text-xs">Carbon Footprint Analysis</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#874DF9] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "Procurement")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#F42942]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "Operation")}>
            <h4 className="text-xl">Operation</h4>
            <p className="font-bold text-xs">Implements sustainability through technical project execution in renewable energy, infrastructure, and impact assessment.</p>
            {(openedSkill === "Operation" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#F42942]">
                  <p className="text-xs">Renewable Energy Feasibility & Wind Assessment</p>
                  <p className="text-xs">Clean Technology Development</p>
                  <p className="text-xs">Industrial Water Reuse & Sludge Recycling</p>
                  <p className="text-xs">Wastewater Treatment Applications</p>
                  <p className="text-xs">GIS & Database Management</p>
                  <p className="text-xs">Environmental Impact Assessment</p>
                  <p className="text-xs">Project Management</p>
                  <p className="text-xs">Risk Assessment & Mitigation</p>
                  <p className="text-xs">Time Management & Prioritization</p>
                  <p className="text-xs">Organizational Skills</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#F42942] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "Operation")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#F4B942]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "R&D")}>
            <h4 className="text-xl">Research & Development</h4>
            <p className="font-bold text-xs">Generates applied research and innovation in environmental science, climate solutions, and clean technologies.</p>
            {(openedSkill === "R&D" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#F4B942]">
                  <p className="text-xs">Soil Science & Pollution</p>
                  <p className="text-xs">Molecular & Cellular Biology</p>
                  <p className="text-xs">Thermodynamic & FRET Analysis</p>
                  <p className="text-xs">Experimental Design & Protocol Development</p>
                  <p className="text-xs">Material Characterization Techniques</p>
                  <p className="text-xs">Statistical Methods & Analysis</p>
                  <p className="text-xs">Research & Grant Writing</p>
                  <p className="text-xs">Innovation & Adaptability</p>
                  <p className="text-xs">Attention to Detail</p>
                  <p className="text-xs">Mentoring & Leadership</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#F4B942] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "R&D")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#6FEB33]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "Sustainability")}>
            <h4 className="text-xl">Overarching Sustainability</h4>
            <p className="font-bold text-xs">Orients executive leadership by integrating climate science, ESG governance, and purpose-driven transformation into strategic decision-making.</p>
            {(openedSkill === "Sustainability" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#6FEB33]">
                  <p className="text-xs">Sustainability Strategy & Frameworks</p>
                  <p className="text-xs">Regulatory & Policy Insight</p>
                  <p className="text-xs">Strategic Leadership & Vision</p>
                  <p className="text-xs">Change Management & Influence</p>
                  <p className="text-xs">Stakeholder Engagement & Advocacy</p>
                  <p className="text-xs">Analytical Problem-Solving</p>
                  <p className="text-xs">Communication & Presentation</p>
                  <p className="text-xs">Data Analytics & Reporting</p>
                  <p className="text-xs">Program Accreditation & Course Design</p>
                  <p className="text-xs">Collaboration & Coordination</p>
                  <p className="text-xs">Adaptability & Initiative</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#6FEB33] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "Sustainability")}>Explore the work ↑</a>
          </div>
          <div className="flex flex-col bg-gradient-to-tr from-[#4DF5AC]/40 to-60% to-white/50 rounded-xl shadow-lg p-4 h-full gap-2 justify-between" onClick={(e) => toggleOpenedSkill(e, "Marketing")}>
            <h4 className="text-xl">Commercial & Marketing</h4>
            <p className="font-bold text-xs">Translates ESG strategies, engineering projects, and business initiatives into compelling narratives that drive client engagement, unlock investment opportunities, and foster cross-sector partnerships.</p>
            {(openedSkill === "Marketing" || !small) && (
              <>
                <p className="font-bold text-xs">Related skills:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-px underline decoration-dotted decoration-[#4DF5AC]">
                  <p className="text-xs">Stakeholder Engagement and Strategic Relationship Management</p>
                  <p className="text-xs">Client Account Management and Business Development</p>
                  <p className="text-xs">Resource Allocation and Budget Oversight</p>
                  <p className="text-xs">Proposal Development and Contract Negotiation</p>
                  <p className="text-xs">Strategic Communication</p>
                  <p className="text-xs">Sustainability Reporting & Storytelling</p>
                  <p className="text-xs">Community Outreach & Engagement</p>
                  <p className="text-xs">Content Strategy for Sustainable Brands</p>
                  <p className="text-xs">Collaboration & Networking</p>
                </div>
              </>
            )}
            <a href="#timelineCarousel" className="text-sm bg-[#4DF5AC] text-white rounded-full text-center hover:underline" onClick={(e) => toggleSkill(e, "Marketing")}>Explore the work ↑</a>
          </div>
        </div>
      </section >
    </>
  );
}
