"use client";

import Image from "next/image";
import { useState } from "react";

export function VideoPlayer({
  videoId,
  title,
  thumbnail,
}: {
  videoId: string;
  title: string;
  thumbnail: string;
}) {
  const [playing, setPlaying] = useState(false);
  return playing ? (
    <iframe
      className="video-embed"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-presentation"
    />
  ) : (
    <button className="video-poster" type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
      <Image src={thumbnail} alt={`${title} thumbnail`} fill sizes="(max-width: 700px) 100vw, 50vw" />
      <span aria-hidden="true">▶</span>
    </button>
  );
}
