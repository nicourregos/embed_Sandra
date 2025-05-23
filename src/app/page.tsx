"use client"
import World from "./Components/world";
import { useState } from "react";
import Carrusel from "./Components/carrusel";

export default function Home() {

  const [currentPos, setCurrentPos] = useState<number[]>([-1, -4, 0]);
  const [currentRot, setCurrentRot] = useState<number[]>([0, 0, 0]);

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

  return (
    <>
      <section className="absolute w-full h-full">
        <World coordinates={currentPos} rotation={currentRot}></World>
      </section>
      <section className="relative w-full h-screen content-center z-0">
        <Carrusel setterCountry={setCountry}></Carrusel>
        {/* <div className="flex flex-row gap-4 items-center justify-center">
          <div className="flex flex-col w-60 h-48 bg-yellow/50 justify-self-center"
            onClick={() => { setCurrentPos([-1, -4, -0.5]); setCurrentRot([0.3, 0, 0]) }}>
            <h3 className="mx-8">hello</h3>
            <p className="mx-8">djhdhhd</p>
          </div>
          <Card></Card>
          <div className="flex flex-col w-60 h-96 bg-yellow/50 justify-self-center"
            onClick={() => { setCurrentPos([-1.5, -3, 2]); setCurrentRot([-0.7, 2.2, 0]) }}>
            <h3 className="mx-8">hello</h3>
            <div className="ml-8 w-52 bg-[#00ff00] justify-self-center p-4">
              <h4 className="text-right">Some text</h4>
            </div>
            <p className="mx-8">djhdhhd</p>
          </div>
          <div className="flex flex-col w-60 h-48 bg-yellow/50 justify-self-center"
            onClick={() => { setCurrentPos([-1, -3.5, 0.5]); setCurrentRot([-0.1, -0.4, 0.1]) }}>
            <h3 className="mx-8">hello</h3>
            <p className="mx-8">djhdhhd</p>
          </div>
        </div> */}
      </section >
    </>
  );
}
