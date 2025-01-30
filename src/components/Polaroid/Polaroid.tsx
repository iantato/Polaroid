import Image from "next/image";
import { useMemo } from "react";

interface PolaroidProps {
  src: string;
  alt: string;
}

export const Polaroid = ({ src, alt }: PolaroidProps) => {
  const rotation = useMemo(() => {
    return Math.floor(Math.random() * 11) - 5;
  }, []);

  return (
    <div className="bg-white p-4 pb-16 shadow-lg w-[300px]" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="relative w-full aspect-square mb-2">
        <Image
          src={src}
          alt={alt}
          fill
          draggable="false"
          className="object-cover select-none"
          sizes="300px"
        />
      </div>
    </div>
  );
};