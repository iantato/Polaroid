'use client'
import { Polaroid } from "@/components/Polaroid";

export default function Home() {

  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <Polaroid
        id="polaroid-1"
        src="/pfp.jpg"
        alt=""
        caption="Test"
      />
    </main>
  );
}
