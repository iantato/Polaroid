import { getById, getScanned } from '@/lib/db/queries';
import { PolaroidGrid } from "@/components/PolaroidGrid";
import { SearchParams } from '@/types';

export default async function Home({ id }: SearchParams) {

  // const result = await getAllPolaroids();
  // const polaroids = result.data;
  // const total_pictures = polaroids?.length || 0;

  // const cols = calculateGridWidth(total_pictures);
  // const rows = calculateGridHeight(total_pictures);

  // if (!result.success) {
  //   console.error(result.error);
  // }

  // console.log(total_pictures);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <PolaroidGrid></PolaroidGrid>
    </main>
  );
}
