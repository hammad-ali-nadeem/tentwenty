'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

type Client = {
  id: number
  image: string
  name: string
  place: string
}

type ClientSliderProps = {
  clients: Client[]
}

const ClientSlider = ({ clients }: ClientSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const animationRef = useRef<number>()
  const slideWidth = 400 // Fixed slide width

  // Infinite scroll setup
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider || clients.length <= 1) return

    const handleScroll = () => {
      if (slider.scrollLeft <= 0) {
        slider.scrollLeft = slideWidth * clients.length
      } else if (slider.scrollLeft >= slideWidth * (clients.length + 1)) {
        slider.scrollLeft = slideWidth
      }
      setScrollPosition(slider.scrollLeft)
      updateTransforms()
      updateSlideClasses()
    }

    slider.addEventListener('scroll', handleScroll)
    return () => slider.removeEventListener('scroll', handleScroll)
  }, [clients.length])

  // Initialize infinite scroll and classes
  useEffect(() => {
    const slider = sliderRef.current
    if (slider && clients.length > 1) {
      slider.scrollLeft = slideWidth // Start at first real slide
      updateSlideClasses()
    }
  }, [clients.length])

  // Update slide classes based on position
  const updateSlideClasses = () => {
    const slider = sliderRef.current
    const container = containerRef.current
    if (!slider || !container) return

    const slides = container.querySelectorAll('.slide')
    const containerWidth = container.offsetWidth
    const centerPosition = slider.scrollLeft + containerWidth / 2

    slides.forEach((slide) => {
      const slideElement = slide as HTMLElement
      const slidePosition = slideElement.offsetLeft + slideElement.offsetWidth / 2
      const distanceFromCenter = slidePosition - centerPosition

      // Clear all classes first
      slideElement.classList.remove('active', 'prev', 'next')

      // Add appropriate class based on position
      if (Math.abs(distanceFromCenter) < slideWidth * 0.3) { // Center area
        slideElement.classList.add('active')
      } else if (distanceFromCenter < 0) { // Left side
        slideElement.classList.add('prev')
      } else { // Right side
        slideElement.classList.add('next')
      }
    })
  }

  // Update transforms on scroll
  const updateTransforms = () => {
    const container = containerRef.current
    const slider = sliderRef.current
    if (!container || !slider) return

    const slides = container.querySelectorAll('.slide')
    const containerWidth = container.offsetWidth
    const centerPosition = slider.scrollLeft + containerWidth / 2

    slides.forEach((slide) => {
      const slideElement = slide as HTMLElement
      const slidePosition = slideElement.offsetLeft + slideElement.offsetWidth / 2
      const distanceFromCenter = (slidePosition - centerPosition) / containerWidth
      const absDistance = Math.abs(distanceFromCenter)

      // Calculate rotation (max 30 degrees when at edge)
      const rotation = distanceFromCenter * 60
      
      // Calculate scale (smaller when rotated more)
      const scale = 1 - absDistance * 0.3
      
      // Calculate z-index (bring center forward)
      const zIndex = 100 - Math.abs(rotation * 2)
      
      // Text animation values
      const textOpacity = 1 - absDistance * 2 // Faster fade out
      const textTranslateY = (1 - textOpacity) * 20 // Moves down as fades out
      
      // Apply transforms to slide
      slideElement.style.transform = `perspective(1000px) rotateY(${rotation}deg) scale(${scale})`
      slideElement.style.zIndex = `${zIndex}`
      
      // Apply styles to text container
      const textElement = slideElement.querySelector('.slide-text') as HTMLElement
      if (textElement) {
        textElement.style.opacity = `${textOpacity}`
        textElement.style.transform = `translateY(${textTranslateY}px)`
      }
    })
  }

  // Drag handling
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    startX.current = clientX
    scrollLeft.current = sliderRef.current?.scrollLeft || 0
    document.body.style.cursor = 'grabbing'
    cancelAnimationFrame(animationRef.current)
  }

  const duringDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const walk = (clientX - startX.current) * 2 // Adjust multiplier for sensitivity
    sliderRef.current.scrollLeft = scrollLeft.current - walk
  }

  const endDrag = () => {
    setIsDragging(false)
    document.body.style.cursor = ''
    snapToNearest()
  }

  const snapToNearest = () => {
    const slider = sliderRef.current
    if (!slider) return

    const targetScroll = Math.round(slider.scrollLeft / slideWidth) * slideWidth
    
    const start = slider.scrollLeft
    const change = targetScroll - start
    const startTime = performance.now()
    const duration = 300 // ms

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeOutCubic(progress)
      
      slider.scrollLeft = start + change * easeProgress
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScroll)
      }
    }
    
    animationRef.current = requestAnimationFrame(animateScroll)
  }

  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3)
  }

  // Initialize transforms and classes
  useEffect(() => {
    updateTransforms()
    updateSlideClasses()
    window.addEventListener('resize', () => {
      updateTransforms()
      updateSlideClasses()
    })
    return () => {
      window.removeEventListener('resize', () => {
        updateTransforms()
        updateSlideClasses()
      })
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Duplicate slides for infinite effect
  const infiniteSlides = clients.length > 1 ? [...clients, ...clients, ...clients] : clients

  return (
    <div className="py-12 overflow-hidden relative">
      <div className="">
        <div 
          ref={containerRef}
          className="relative h-[800px] perspective-1000"
        >
          <div
            ref={sliderRef}
            className="absolute top-0 left-0 right-0 flex overflow-x-auto scrollbar-hide cursor-grab select-none h-full items-center"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: isDragging ? 'auto' : 'smooth',
            }}
            onMouseDown={startDrag}
            onMouseMove={duringDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={startDrag}
            onTouchMove={duringDrag}
            onTouchEnd={endDrag}
          >
            {infiniteSlides.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="slide flex-shrink-0 w-[250px] h-[450px] md:w-[400px] md:h-[600px] relative transition-all duration-300 ease-out md:px-4 md:mx-8"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="w-full h-full relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={`/${client.image}`}
                    alt={client.name}
                    fill
                    className="object-cover"
                    draggable="false"
                  />
                </div>
                <div className="slide-text mt-4 transition-all duration-300 ease-out">
                  <p className="text-center text-[36px] font-light text-black">
                    {client.name}
                  </p>
                  <p className="text-center text-[24px] font-light text-[7A7777]">
                    {client.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientSlider