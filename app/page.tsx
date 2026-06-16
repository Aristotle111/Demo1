import Image from "next/image";
import Link from "next/link";
import BorderGlow from "@/components/BorderGlow";
import LiquidChrome from '@/components/LiquidChrome';
import Beams from '@/components/Beams';

export default function Home() {
  return (
    <div className="relative w-full flex-col min-h-screen items-center justify-center font-sans text-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Beams beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#d6d6d6"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30} 
        />
      </div>
      <main className="flex w-full flex-col items-center py-52 = text-black dark:bg-black space-y-4">
        <h1 className="relative w-full z-10 mx-auto max-w-5xl text-center text-2xl font-bold md:text-4xl lg:text-7xl dark:text-slate-300">
          Stat à Stat: Bilingual <br></br>Learning Meets Interactive <br></br>Problem Solving
        </h1>
        <p className="relative w-full z-10 mx-auto my-auto items-center text-center lg:text-xl">
          Switch languages. Adjust difficulty. View side-by-side explanations. <br></br>Learn probability and statistics in a way that works for you.
        </p>
        <BorderGlow className="mt-10 w-38 h-10 bg-white text-black rounded-full p-0 overflow-hidden">
          <Link href="/about" className="w-full h-full flex items-center justify-center font-medium cursor-pointer">
            Explore Now
          </Link>
        </BorderGlow>
      </main>
    </div>
  );
}
