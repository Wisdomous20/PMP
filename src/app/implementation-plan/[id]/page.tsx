"use client";

import {use} from "react";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page(props: PageProps) {
  const _ = use(props.params);
  return (
    <Image
      src="/images/test.jpg"
      alt="hee hee"
      height={window.screen.height}
      width={window.screen.width}
      priority={true}
      className="h-full w-full"
    />
  )
}
