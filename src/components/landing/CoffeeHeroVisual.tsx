"use client";

import Image from "next/image";
import coffeeImage from "@/images/coffee.png";

export function CoffeeHeroVisual() {
  return (
    <div
      className="coffee-hero-image relative mx-auto flex aspect-square w-full max-w-[19.5625rem] items-center justify-center sm:max-w-[21.5625rem] lg:max-w-[23.5625rem]"
      aria-hidden
    >
      <div className="coffee-hero-image-glow coffee-hero-image-glow--outer pointer-events-none absolute -inset-[12%]" />
      <div className="coffee-hero-image-glow pointer-events-none absolute inset-0" />

      <div className="coffee-hero-image-blob relative h-full w-full overflow-hidden bg-white/5">
        <Image
          src={coffeeImage}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 288px, 352px"
          className="coffee-hero-image-photo object-cover object-center"
        />
      </div>
    </div>
  );
}
