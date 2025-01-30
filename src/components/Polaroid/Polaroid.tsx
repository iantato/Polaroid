import Image from "next/image";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
}

export const Polaroid = ({ src, alt, caption }: PolaroidProps) => {
  return (
    <div className="bg-white p-4 shadow-lg rotate-2 w-[300px]">
      <div className="relative w-full aspect-square mb-2">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>
      {caption && (
        <div className="text-center font-mono text-sm pb-2">
          {caption}
        </div>
      )}
    </div>
  );
};