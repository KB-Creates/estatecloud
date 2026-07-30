import React, { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PillBadge } from "@/components/ui/pill-badge"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export default function TrustedTeams() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [dragX, setDragX] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const testimonials = [
    {
      id: 0,
      name: "Muhammad Usman",
      role: "Managing Director at Zameen Marketing, Lahore",
      avatar: "/assets/waseem_avatar.png",
      fallback: "MU",
      rating: "5.0/5",
      quote:
        "“EstateCloud has completely revolutionized our property sales & client lead tracking in Lahore. We close deals 40% faster now!”",
    },
    {
      id: 1,
      name: "Syeda Fatima Ali",
      role: "Operations Lead at Bahria Estates, Karachi",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=256",
      fallback: "FA",
      rating: "4.9/5",
      quote:
        "“Managing rental agreements and tenant documentation across DHA Karachi was chaotic. EstateCloud automated everything smoothly.”",
    },
    {
      id: 2,
      name: "Hamza Tariq",
      role: "CEO at Capital Real Estate, Islamabad",
      avatar: "/assets/ali_avatar.png",
      fallback: "HT",
      rating: "5.0/5",
      quote:
        "“The instant analytics and client portal feature gave our Islamabad team a massive edge. Best investment for modern agencies.”",
    },
    {
      id: 3,
      name: "Ayesha Malik",
      role: "Head of Sales at Signature Builders, Faisalabad",
      avatar: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=256",
      fallback: "AM",
      rating: "5.0/5",
      quote:
        "“The automated document generation and transparent pricing tools made scaling our multi-city operations remarkably seamless.”",
    },
    {
      id: 4,
      name: "Zubair Ahmed",
      role: "Principal Broker at Paragon Marketing, Rawalpindi",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=256",
      fallback: "ZA",
      rating: "4.8/5",
      quote:
        "“From lead pipeline to lease collection, EstateCloud saves our sales team over 25 hours every week. Highly recommended!”",
    },
    {
      id: 5,
      name: "Bilal Chaudhry",
      role: "Director Projects at Etihad Properties, Multan",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=256",
      fallback: "BC",
      rating: "4.9/5",
      quote:
        "“EstateCloud is hands down the most reliable property management SaaS in Pakistan. Our client conversion jumped by 35% in two months.”",
    },
    {
      id: 6,
      name: "Tariq Mehmood",
      role: "Founder at Royal Developers, Peshawar",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256",
      fallback: "TM",
      rating: "5.0/5",
      quote:
        "“Outstanding real-time pipeline management. We can monitor property deals across all our regional branches live on one dashboard.”",
    },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  // Handle Drag End to change active index and rotate smooth
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50
    if (info.offset.x < -swipeThreshold) {
      handleNext()
    } else if (info.offset.x > swipeThreshold) {
      handlePrev()
    }
    setDragX(0)
  }

  // Auto rotation effect every 3.5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 3500)
    return () => clearInterval(timer)
  }, [isPaused, testimonials.length])

  return (
    <section className="w-full bg-slate-50/80 py-16 sm:py-24 relative z-20 overflow-hidden select-none">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        {/* Top Pill Badge */}
        <PillBadge tag="Trusted" label="Proof that it works" />

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight text-center mt-6 leading-[1.15] max-w-4xl">
          Trusted by Teams <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">🌍</span> Worldwide
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mt-4 font-normal leading-relaxed">
          Easily compare how top real estate teams scale their property operations and close deals faster with EstateCloud.
        </p>

        {/* 3 Cards Interactive Draggable Stack / Carousel */}
        <div 
          className="relative w-full max-w-5xl mt-12 py-8 flex items-center justify-center min-h-[420px] touch-pan-y"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Navigation Arrow Left */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 sm:left-2 z-30 rounded-full size-10 bg-white/90 backdrop-blur-md shadow-md border-slate-200 hover:bg-slate-100 hover:scale-105 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-5 text-slate-700" />
          </Button>

          {/* Cards Stack Container */}
          <div className="relative w-full flex items-center justify-center h-[380px]">
            {testimonials.map((item, index) => {
              // Calculate offset relative to activeIndex
              let offset = index - activeIndex

              // Handle cyclic wrapping distance for smooth infinite carousel feel
              const total = testimonials.length
              if (offset < -Math.floor(total / 2)) offset += total
              if (offset > Math.floor(total / 2)) offset -= total

              const isActive = offset === 0
              const isVisible = Math.abs(offset) <= 1 // Display center + 1 on left & 1 on right (3 cards total)

              if (!isVisible) return null

              // Dynamic Rotation angle calculation
              // Base rotation: left cards tilt negative (-6 to -12deg), right tilt positive (+6 to +12deg), active 0deg
              // Adding real-time drag rotation modifier (dragX / 15)
              const baseRotate = offset * 7
              const dynamicRotate = baseRotate + dragX / 15

              // Horizontal translation
              const translateX = offset * (window.innerWidth < 640 ? 180 : 310) + dragX

              // Scale & zIndex
              const scale = 1 - Math.abs(offset) * 0.08
              const zIndex = 20 - Math.abs(offset) * 5
              const opacity = 1 - Math.abs(offset) * 0.25

              return (
                <motion.div
                  key={item.id}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDrag={(e, info) => setDragX(info.offset.x)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    x: translateX,
                    rotate: dynamicRotate,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                  whileGrab={{ scale: scale * 1.03, cursor: "grabbing" }}
                  className="absolute w-[290px] sm:w-[340px] cursor-grab active:cursor-grabbing select-none"
                >
                  <Card
                    className={`rounded-[2rem] bg-white p-6 sm:p-8 flex flex-col justify-between items-center text-center ring-0 transition-all duration-300 ${
                      isActive
                        ? "border border-slate-200 shadow-md"
                        : "border border-slate-100 shadow-sm"
                    }`}
                  >
                    <CardContent className="p-0 flex flex-col items-center w-full">
                      {/* Avatar */}
                      <Avatar className="size-16 sm:size-20 border-2 border-slate-100 shadow-sm mb-4">
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback className="bg-slate-900 text-white font-semibold">
                          {item.fallback}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name & Role */}
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 mb-4">
                        {item.role}
                      </p>

                      {/* Star Ratings */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0"
                          />
                        ))}
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 ml-1.5">
                          {item.rating}
                        </span>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium font-sans">
                        {item.quote}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Navigation Arrow Right */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 sm:right-2 z-30 rounded-full size-10 bg-white/90 backdrop-blur-md shadow-md border-slate-200 hover:bg-slate-100 hover:scale-105 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-5 text-slate-700" />
          </Button>
        </div>

        {/* 7 Carousel Indicator Bars */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-10 bg-slate-900"
                  : "w-5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
