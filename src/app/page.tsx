import { PolaroidGrid } from "@/components/PolaroidGrid";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <Suspense>
        <PolaroidGrid/>
      </Suspense>
    </main>
  );
}
