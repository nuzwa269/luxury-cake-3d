import Image from "next/image";

export function SceneStill({ failed = false }: { failed?: boolean }) {
  return (
    <div
      className="scene-still"
      data-scene-fallback={failed ? "unavailable" : "loading"}
    >
      <Image
        src="/images/signature-noire.webp"
        alt="Chocolate cake with ganache and chocolate curls on a pedestal"
        fill
        sizes="(max-width: 900px) 100vw, 55vw"
        preload
        loading="eager"
        unoptimized
        className="hero-image"
      />
      <span className="scene-loading" role="status">
        {failed
          ? "The signature, in still life."
          : "Preparing a little indulgence…"}
      </span>
    </div>
  );
}
