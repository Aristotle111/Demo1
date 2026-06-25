import Image from "next/image";
import Link from "next/link";
import BorderGlow from "@/components/BorderGlow";
import LiquidChrome from '@/components/LiquidChrome';
import Beams from '@/components/Beams';
import Particles from '@/components/ui/particles'

export default function Home() {
  return (
    <Particles
      quantity={100}
      staticity={50}
      color="#ffffff"
      className="absolute inset-0"
    >
      <div className="relative w-full flex flex-col min-h-screen items-center justify-center font-sans text-black">
        <main className="flex w-full flex-col items-center py-52 text-white dark:bg-black space-y-4">
          <h1 className="relative w-full z-10 mx-auto max-w-5xl text-center text-2xl font-bold md:text-3xl lg:text-6xl dark:text-slate-300">
            Stat à Stat: Bilingual <br></br>Learning Meets Interactive <br></br>Problem Solving
          </h1>
          <p className="relative w-full z-10 py-3 mx-auto my-auto items-center text-center lg:text-xl">
            Switch languages. Adjust difficulty. View side-by-side explanations. <br></br>Learn probability and statistics in a way that works for you.
          </p>
          <BorderGlow className="mt-10 w-38 h-10 bg-white text-black rounded-full p-0 overflow-hidden">
            <Link href="/about" className="w-full h-full flex items-center justify-center font-medium cursor-pointer">
              Explore Now
            </Link>
          </BorderGlow>
        </main>
      </div>
    </Particles>
  );
}
