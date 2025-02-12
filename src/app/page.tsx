import { list }  from '@vercel/blob';
import { Polaroid } from "@/components/Polaroid";
import { testConnection } from "@/lib/db";
import { calculateGridWidth, calculateGridHeight, getTotalPictures } from '@/utils/grid';
import { getScanned } from '@/lib/db/queries';
import { PolaroidGrid } from "@/components/PolaroidGrid";

export default async function Home() {

  // const result = await getAllPolaroids();
  // const polaroids = result.data;
  // const total_pictures = polaroids?.length || 0;

  // const cols = calculateGridWidth(total_pictures);
  // const rows = calculateGridHeight(total_pictures);

  // if (!result.success) {
  //   console.error(result.error);
  // }

  // console.log(total_pictures);

  const query = await getScanned();
  const polaroids = query.data;
  const totalPictures = polaroids?.length || 0;
  console.log(polaroids);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <PolaroidGrid polaroids={polaroids}></PolaroidGrid>
      {/* <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {polaroids?.map((polaroid) => (
          <div
           key={polaroid.id}
           className='cursor-pointer'>
            <Polaroid
              key={polaroid.id}
              id={polaroid.id}
              src={polaroid.src}
              alt={polaroid.alt}
              caption={polaroid.caption}
            />
          </div>
          ))}
      </div> */}
      {/* <div className='grid gap-4' style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}>
        {polaroids?.map((polaroid) => (
          <Polaroid
            key={polaroid.id}
            id={polaroid.id}
            src={polaroid.src}
            alt={polaroid.alt}
            caption={polaroid.caption}
          />
        ))}
      </div> */}
    </main>
  );
}
