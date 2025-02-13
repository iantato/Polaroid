'use client';
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import { Polaroid } from "../Polaroid";
import { PolaroidProps } from "../Polaroid/types";
import { useSearchParams } from "next/navigation";
import gsap from 'gsap';
import { AudioBarProps } from "../AudioBar/types";

export function PolaroidGrid() {

  const [polaroids, setPolaroids] = useState<PolaroidProps[]>([]);
  const [musicCache, setMusicCache] = useState<Record<string, AudioBarProps>>({});
  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidProps | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<AudioBarProps | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldResetFlip, setShouldResetFlip] = useState(false);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const initialFetchDoneRef = useRef(false);

  const searchParams = useSearchParams();
  const newPolaroidId = searchParams.get('new');

  // Fetch all the scanned polaroids.
  useEffect(() => {
    async function fetchPolaroidsAndMusic() {
      const response = await fetch('/api/polaroids')
      const data = await response.json();
      if (!data.success) return;
      setPolaroids(data.data);

      const musicData: Record<string, AudioBarProps> = {};
      await Promise.all(
        data.data.map(async (polaroid: PolaroidProps) => {
          const music = await getMusic(parseInt(polaroid.id));
          if (music) {
            musicData[polaroid.id] = music[0];
          }
        })
      );

      setMusicCache(musicData);
      initialFetchDoneRef.current = true;
    }

    fetchPolaroidsAndMusic();
  }, [])

  // Using the urlSearchParams, we can check if there is a new
  // polaroid to add. This also updates the database.
  useEffect(() => {
    async function checkNewPolaroid() {
      if (!initialFetchDoneRef.current || !newPolaroidId) return;

      const response = await fetch(`/api/scan/${newPolaroidId}`);
      const data = await response.json();
      if (!data.success) return;

      const exists = polaroids.some(p => p.id == newPolaroidId);
      if (exists) return;

      setPolaroids(prev => [...prev, data.data]);

      setTimeout(() => {

        const gridItem = document.getElementById(newPolaroidId);
        if (gridItem) {
          setIsAnimating(true);

          gridItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          gsap.set(gridItem, {
            scale: 1.5
          });

          const tl = gsap.timeline({
            onComplete: () => {
              setIsAnimating(false);
              setShouldResetFlip(false);
            }
          });

          tl.to(gridItem, {
            x: 30,
            duration: 0.2,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut"
          })
          .to(gridItem, {
            x: 30,
            duration: 0.2,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut"
          })
          .to(gridItem, {
            x: 0, // Reset position
            duration: 0.1
          })

          tl.fromTo(
            gridItem.querySelector('.image-object'),
            {
              webkitFilter: "brightness(0.)",
              filter: "brightness(0)",
            },
            {
              webkitFilter: "brightness(1)",
              filter: "brightness(1)",
              duration: 0.3,
              delay: 0.5,
              ease: "power2.inOut"
            }
          );

          tl.to(gridItem, {
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(gridItem, {
                position: 'relative',
                zIndex: 1,
                duration: 0,
                clearProps: "transform, position",
              });
            }
          });
        }
      }, 100);

      await fetch(`/api/scan/${newPolaroidId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanned: true })
      });
    }

    checkNewPolaroid();
  }, [initialFetchDoneRef.current, newPolaroidId])

  async function getMusic(id: number) {
    const response = await fetch(`/api/music/${id}`);
    const data = await response.json();
    if (!data.success) return;
    else return data.data;
  }

  const handlePolaroidClick = (polaroid: PolaroidProps, index: number) => {
    if (isAnimating) return;
    const gridItem = gridItemsRef.current[index]?.querySelector('.polaroid');

    if (gridItem && modalContentRef.current) {
      setIsAnimating(true);

      const musicData:AudioBarProps = musicCache[polaroid.id];

      setSelectedMusic(musicData || null);

      gridItem.setAttribute('data-index', index.toString());
      modalContentRef.current.appendChild(gridItem);

      gsap.to(gridItem, {
        scale: 1.5,
        zIndex: 50,
        duration: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    }

    setSelectedPolaroid(polaroid);
  };

  const handleModalClose = (gridItem: Element | null | undefined) => {
    if (!gridItem || isAnimating) return;
    setIsAnimating(true);
    setShouldResetFlip(true);
    setSelectedMusic(null); // Clear the selected music when closing

    const index = Number(gridItem.getAttribute('data-index'));
    const originalParent = gridItemsRef.current[index];

    const currentRotation = gsap.getProperty(gridItem, "rotationY") as number;
    const needsToFlip = currentRotation > 90;

    if (originalParent) {

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          setShouldResetFlip(false);
        }
      })

     tl.set(gridItem, {
        zIndex: 1000,
        position: 'relative'
      });

      originalParent.appendChild(gridItem);

      gridItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      if (needsToFlip) {
        tl.to(gridItem, {
          rotationY: 0,
          duration: 0.3,
        })
      } else {
        tl.to(gridItem, {
          rotationY: 0,
          duration: 0.3
        })
      }

      tl.to(gridItem, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(gridItem, {
            position: 'relative',
            zIndex: 1,
            duration: 0,
            clearProps: "transform, position",
          });
        }
      });
    }

    setSelectedPolaroid(null);
  }


  return (
    <div className={`grid gap-6 grid-cols-1 ${
      polaroids.length >= 3
        ? 'md:grid-cols-2 lg:grid-cols-3'
        : polaroids.length === 2
          ? 'md:grid-cols-2'
          : ''
    }`}>
      {(polaroids || []).map((polaroid, index) => (
        <div
          key={polaroid.id}
          ref={el => { gridItemsRef.current[index] = el; }}
          onClick={() => handlePolaroidClick(polaroid, index)}
          className='cursor-pointer'>
          <Polaroid
            key={polaroid.id}
            id={polaroid.id}
            src={polaroid.src}
            alt={polaroid.alt}
            caption={polaroid.caption}
            isDraggable={selectedPolaroid?.id === polaroid.id}
            resetFlip={shouldResetFlip}
          />
        </div>
      ))}

      <Modal
        ref={modalContentRef}
        isOpen={selectedPolaroid !== null}
        musicData={selectedMusic || undefined}
        onClose={() => {
          const gridItem = modalContentRef.current?.querySelector('.polaroid');
          if (newPolaroidId && selectedPolaroid?.id === newPolaroidId) {
            setPolaroids(prev => [...prev, selectedPolaroid]);
          }
          handleModalClose(gridItem);
        }}>
      </Modal>
    </div>
  );
}