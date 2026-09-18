"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play, Plus } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type GalleryPhoto = { title: string; category: string; image: string; alt: string; detail: string };

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); setPlaying(!media.matches); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    const stop = () => setPlaying(false);
    update(); api.on("select", update); api.on("pointerDown", stop);
    return () => { api.off("select", update); api.off("pointerDown", stop); };
  }, [api]);
  useEffect(() => {
    if (!api || !playing || hovered || focused || selected !== null || reducedMotion) return;
    const timer = window.setInterval(() => { if (!document.hidden) api.scrollNext(); }, 6000);
    return () => window.clearInterval(timer);
  }, [api, playing, hovered, focused, selected, reducedMotion]);

  return <>
    <Carousel setApi={setApi} opts={{ align: "start", loop: true, duration: reducedMotion ? 0 : 35 }} className="business-carousel" aria-label="Aura business photographs"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <CarouselContent className="business-track">
        {photos.map((photo, index) => <CarouselItem key={photo.image} className="business-slide" aria-label={`${index + 1} of ${photos.length}`}>
          <button className="project-card business-photo" onClick={() => { setPlaying(false); setSelected(index); }} aria-label={`View ${photo.title}`}>
            <div className="project-image"><img src={photo.image} alt={photo.alt} loading="lazy" decoding="async"/><span className="view-circle"><Plus size={22}/></span></div>
            <div className="project-info"><div><span>{photo.category}</span><h3>{photo.title}</h3></div><ArrowUpRight size={22}/></div>
          </button>
        </CarouselItem>)}
      </CarouselContent>
      <div className="gallery-toolbar">
        <span className="gallery-count"><b>{String(current + 1).padStart(2, "0")}</b> / {String(photos.length).padStart(2, "0")}<span className="swipe-hint">Swipe to explore</span></span>
        <div className="gallery-controls">
          {!reducedMotion && <button className="gallery-play" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause automatic scrolling" : "Start automatic scrolling"}>{playing ? <Pause size={15}/> : <Play size={15}/>}<span>{playing ? "Pause" : "Play"}</span></button>}
          <CarouselPrevious className="gallery-arrow" onClick={() => { setPlaying(false); api?.scrollPrev(); }}/>
          <CarouselNext className="gallery-arrow" onClick={() => { setPlaying(false); api?.scrollNext(); }}/>
        </div>
      </div>
    </Carousel>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="project-dialog business-dialog">
      {selected !== null && <><img src={photos[selected].image} alt={photos[selected].alt}/><div className="dialog-copy"><p className="eyebrow">AURA · BUSINESS GALLERY</p><DialogTitle>{photos[selected].title}</DialogTitle><DialogDescription>{photos[selected].detail}</DialogDescription><a className="button" href="/contact">Discuss your space <ArrowUpRight size={17}/></a></div></>}
    </DialogContent></Dialog>
  </>;
}
