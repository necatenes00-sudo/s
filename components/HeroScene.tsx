"use client";

import { useEffect, useRef, useState } from "react";

type SceneController = {
  setProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

/** The abstract sculpture is artwork, not the Demir Digital brand mark. */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let controller: SceneController | undefined;
    let progress = 0;
    let intersecting = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onProgress = (event: Event) => {
      const value = (event as CustomEvent<{ progress: number }>).detail?.progress;
      if (typeof value !== "number" || !Number.isFinite(value)) return;
      progress = Math.min(1, Math.max(0, value));
      controller?.setProgress(progress);
    };
    const updateVisibility = () => controller?.setActive(intersecting && !document.hidden);
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion.matches) return;
      controller?.setPointer(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
    };
    const resetPointer = () => controller?.setPointer(0, 0);
    window.addEventListener("demir:hero-progress", onProgress);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisibility();
    }, { rootMargin: "120px" });
    observer.observe(element);
    const resizeObserver = new ResizeObserver(() => controller?.resize());
    resizeObserver.observe(element);

    const initialise = async () => {
      try {
        const { createHeroScene } = await import("./scene-engine");
        if (cancelled) return;
        controller = createHeroScene(element, reducedMotion.matches);
        controller.setProgress(progress);
        updateVisibility();
        setRenderer("webgl");
      } catch {
        if (!cancelled) setRenderer("fallback");
      }
    };
    // Leave the initial content and its typography free to paint first.
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const timer = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(() => void initialise(), { timeout: 700 });
      } else {
        void initialise();
      }
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("demir:hero-progress", onProgress);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", updateVisibility);
      controller?.dispose();
    };
  }, []);

  return (
    <div ref={host} className="hero-object" data-renderer={renderer} aria-hidden="true">
      <div className="sculpture-fallback" style={{
        position: "absolute", inset: "9% 12%", display: "grid", placeItems: "center",
        pointerEvents: "none", opacity: renderer === "webgl" ? 0 : 1,
        transition: "opacity 600ms ease", perspective: "900px",
      }}>
        <div style={{
          width: "61%", height: "80%", maxWidth: "360px", maxHeight: "510px",
          transform: "rotateY(-25deg) rotateX(9deg) rotateZ(-17deg)",
          background: "linear-gradient(130deg,#c2c6cc 0%,#363a42 20%,#14181f 43%,#424a55 70%,#14171d 88%,#6b7380 100%)",
          clipPath: "polygon(0 0,72% 0,100% 22%,100% 79%,73% 100%,0 100%,0 0,21% 17%,21% 83%,64% 83%,80% 69%,80% 31%,64% 17%,21% 17%)",
          filter: "drop-shadow(14px 28px 30px #0009)",
        }} />
      </div>
    </div>
  );
}
