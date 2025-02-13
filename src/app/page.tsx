import { PolaroidGrid } from "@/components/PolaroidGrid";
import { SearchParams } from '@/types';

export default async function Home({ id }: SearchParams) {


  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <PolaroidGrid></PolaroidGrid>
    </main>
  );
}
