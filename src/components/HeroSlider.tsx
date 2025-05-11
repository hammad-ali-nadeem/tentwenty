'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

type Slide = {
  id: number;
  image: string;
  heading: string;
  text: string;
};

type HeroSliderProps = {
  slides: Slide[];
  interval?: number;
};

const HeroSlider = ({ slides, interval = 15000 }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatingSlide, setAnimatingSlide] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const totalSlides = slides.length;

  const getNextSlideIndex = () => (currentSlide + 1) % totalSlides;

  useEffect(() => {
    const changeSlide = () => {
      const nextIndex = getNextSlideIndex();
      setAnimatingSlide(nextIndex);
      setProgress(0);

      setTimeout(() => {
        setCurrentSlide(nextIndex);
        setAnimatingSlide(null);
        startTimeRef.current = Date.now();
      }, 1000);
    };

    const timer = setInterval(changeSlide, interval);

    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / interval) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(animateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(animateProgress);

    return () => {
      clearInterval(timer);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [currentSlide, interval, totalSlides]);

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isIncoming = index === animatingSlide;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              isIncoming
                ? 'animate-slideOpen z-20 opacity-100'
                : isActive
                ? 'z-10 opacity-100'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            <Image
              src={`/${slide.image}`}
              alt={slide.heading}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute left-4 md:left-18 inset-0 bg-opacity-40 flex items-center justify-start">
              <div className={`text-left text-white max-w-2xl px-4 transition-all duration-1000 ease-in-out transform ${
              isIncoming
                ? 'animate-fadeInTop opacity-100'
                : isActive
                ? 'opacity-100'
                : 'opacity-0'
            }`}>
                <p className="text-[#EEF4F9] text-[16px] font-light">{slide.text}</p>
                <h2 className="text-[34px] leading-[24px] md:text-[64px] leading-[56px] text-[#EEF4F9] font-normal mb-4">{slide.heading}</h2>
                
              </div>
            </div>
          </div>
        );
      })}

      {/* Thumbnail & Progress */}
      <div className="absolute bottom-8 left-4 md:left-18 flex flex-row items-center gap-3 bg-opacity-50 p-3 rounded-lg z-30">
        <div className="relative p-[2px] flex items-center justify-center w-[110px] h-[112px] rounded-md overflow-hidden">
          <div className="absolute inset-0 overflow-hidden rounded-md border border-[#ffffff6e]">
            {progress > 0 && (
              <div
                className="absolute top-0 left-0 h-[2px] bg-white"
                style={{ width: `${progress >= 25 ? 100 : (progress / 25) * 100}%` }}
              />
            )}
            {progress > 25 && (
              <div
                className="absolute top-0 right-0 w-[2px] bg-white"
                style={{ height: `${progress >= 50 ? 100 : ((progress - 25) / 25) * 100}%` }}
              />
            )}
            {progress > 50 && (
              <div
                className="absolute bottom-0 right-0 h-[2px] bg-white"
                style={{ width: `${progress >= 75 ? 100 : ((progress - 50) / 25) * 100}%` }}
              />
            )}
            {progress > 75 && (
              <div
                className="absolute bottom-0 left-0 w-[2px] bg-white"
                style={{ height: `${progress >= 100 ? 100 : ((progress - 75) / 25) * 100}%` }}
              />
            )}
          </div>
          <button
            onClick={() => {
              const next = getNextSlideIndex();
              setAnimatingSlide(next);
              setTimeout(() => {
                setCurrentSlide(next);
                setAnimatingSlide(null);
                setProgress(0);
                startTimeRef.current = Date.now();
              }, 1000);
            }}
            className="relative w-[93px] h-[93px] rounded-md overflow-hidden"
            aria-label="Go to next slide"
          >
            <Image
              src={`/${slides[getNextSlideIndex()].image}`}
              alt={slides[getNextSlideIndex()].heading}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 text-white top-[38%] text-2xl">NEXT</div>
            <div className="absolute inset-0 bg-opacity-10 hover:bg-opacity-5 transition-all" />
          </button>
        </div>
        <div className="text-white text-sm font-mono flex flex-row items-center font-medium tracking-wider">
          {(currentSlide + 1).toString().padStart(2, '0')}
          <div className="h-[2px] w-[75px] bg-white bg-opacity-30 mx-2" />
          {totalSlides.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
