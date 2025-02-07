import { list }  from '@vercel/blob';
import { Polaroid } from "@/components/Polaroid";
import { testConnection } from "@/lib/db";
import { calculateGridWidth, calculateGridHeight, getTotalPictures } from '@/utils/grid';
import { getAllPolaroids } from '@/lib/db/queries';

export default async function Home() {

  const result = await getAllPolaroids();
  const polaroids = result.data;
  const total_pictures = polaroids?.length || 0;

  const cols = calculateGridWidth(total_pictures);
  const rows = calculateGridHeight(total_pictures);

  if (!result.success) {
    console.error(result.error);
  }

  polaroids?.forEach((polaroid) => {
    console.log(polaroid.scanned);
  });

  return (
    <main className="min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <div className='grid gap-4' style={{
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
      </div>
    </main>
  );
}
