import React, { useState, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

export default function Hero() {
  const desktopImages = [
    "/assets/banner4-1.jpg",
    "/assets/IMG-20241118-WA0003.jpg",
    "/assets/jou-01-scaled.jpg",
  ]

  const mobileImages = [
    "/assets/mobile-banner-1.webp",
    "/assets/mobile-banner-2.webp",
    "/assets/mobile-banner-3.webp",
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect() // Set initial snap index

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000) // 6 seconds snap scroll autoplay

    return () => {
      emblaApi.off("select", onSelect)
      clearInterval(timer)
    }
  }, [emblaApi])

  const scrollTo = (index) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }

  return (
    <section className="relative w-full overflow-hidden aspect-[4/3.6] sm:aspect-none sm:h-[400px] md:h-[440px] lg:h-[520px] xl:h-[480px] 2xl:h-[630px] bg-slate-950">
      {/* Dynamic Background Image Carousel (Embla) */}
      <div className="embla w-full h-full overflow-hidden z-0" ref={emblaRef}>
        <div className="embla__container flex w-full h-full">
          {desktopImages.map((desktopSrc, index) => {
            const mobileSrc = mobileImages[index]
            return (
              <div
                className="embla__slide flex-[0_0_100%] min-w-0 h-full relative"
                key={index}
              >
                {/* Desktop Image */}
                <div
                  className="hidden sm:block w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${desktopSrc})` }}
                />
                {/* Mobile Image */}
                <div
                  className="block sm:hidden w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${mobileSrc})` }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {desktopImages.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              index === selectedIndex ? "bg-[#d4af37] w-6" : "bg-white/40 hover:bg-white/70 w-2.5"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
