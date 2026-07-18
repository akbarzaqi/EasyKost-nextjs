"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/styles/lib/utils"

interface CarouselProps {
  images: string[]
  alt?: string
  className?: string
  autoplay?: boolean
  interval?: number
}

export function Carousel({ images, alt = "Slide", className, autoplay = true, interval = 3000 }: CarouselProps) {
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollProgress, setScrollProgress] = React.useState(0)

  const autoplayPlugin = React.useMemo(() => Autoplay({ playOnInit: autoplay, delay: interval }), [autoplay, interval])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [autoplayPlugin]
  )

  React.useEffect(() => {
    if (!emblaApi) return
    const onScroll = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollProgress(emblaApi.scrollProgress())
    }
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollProgress(emblaApi.scrollProgress())
    }
    emblaApi.on("init", onInit)
    emblaApi.on("scroll", onScroll)
    emblaApi.on("select", onScroll)
    emblaApi.on("slideFocus", onScroll)
    return () => {
      emblaApi.off("init", onInit)
      emblaApi.off("scroll", onScroll)
      emblaApi.off("select", onScroll)
      emblaApi.off("slideFocus", onScroll)
    }
  }, [emblaApi])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const dots = React.useMemo(() => {
    return scrollSnaps.map((_, index) => (
      <button
        key={index}
        onClick={() => scrollTo(index)}
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          index === selectedIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
        )}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))
  }, [scrollSnaps, selectedIndex, scrollTo])

  if (!images.length) return null

  return (
    <div className={cn("relative w-full overflow-hidden", className)} ref={emblaRef}>
      <div className="overflow-hidden">
        <div className="flex" style={{ transform: `translate3d(${-scrollProgress * 100}%, 0, 0)` }}>
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
              style={{ minWidth: `${100 / (scrollSnaps.length || 1)}%` }}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center gap-1">{dots}</div>
      </div>

      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors",
          !scrollSnaps.length && "hidden"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors",
          !scrollSnaps.length && "hidden"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

interface CarouselCardProps {
  image: string
  title: string
  description?: string
  price?: string
  href?: string
  className?: string
}

export function CarouselCard({ image, title, description, price, href, className }: CarouselCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-white/80 mt-1 line-clamp-2">{description}</p>}
        {price && <p className="font-bold text-lg mt-2">{price}</p>}
      </div>
      {href && (
        <a href={href} className="absolute inset-0" aria-label={`View ${title}`} />
      )}
    </div>
  )
}

interface CarouselWithCardsProps {
  items: CarouselCardProps[]
  className?: string
  autoplay?: boolean
  interval?: number
}

export function CarouselWithCards({ items, className, autoplay = true, interval = 3000 }: CarouselWithCardsProps) {
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollProgress, setScrollProgress] = React.useState(0)

  const autoplayPlugin = React.useMemo(() => Autoplay({ playOnInit: autoplay, delay: interval }), [autoplay, interval])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [autoplayPlugin]
  )

  React.useEffect(() => {
    if (!emblaApi) return
    const onScroll = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollProgress(emblaApi.scrollProgress())
    }
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollProgress(emblaApi.scrollProgress())
    }
    emblaApi.on("init", onInit)
    emblaApi.on("scroll", onScroll)
    emblaApi.on("select", onScroll)
    emblaApi.on("slideFocus", onScroll)
    return () => {
      emblaApi.off("init", onInit)
      emblaApi.off("scroll", onScroll)
      emblaApi.off("select", onScroll)
      emblaApi.off("slideFocus", onScroll)
    }
  }, [emblaApi])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const dots = React.useMemo(() => {
    return scrollSnaps.map((_, index) => (
      <button
        key={index}
        onClick={() => scrollTo(index)}
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          index === selectedIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
        )}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))
  }, [scrollSnaps, selectedIndex, scrollTo])

  if (!items.length) return null

  return (
    <div className={cn("relative w-full overflow-hidden", className)} ref={emblaRef}>
      <div className="overflow-hidden">
        <div className="flex" style={{ transform: `translate3d(${-scrollProgress * 100}%, 0, 0)` }}>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
              style={{ minWidth: `${100 / (scrollSnaps.length || 1)}%` }}
            >
              <CarouselCard {...item} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center gap-1">{dots}</div>
      </div>

      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors",
          !scrollSnaps.length && "hidden"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors",
          !scrollSnaps.length && "hidden"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}