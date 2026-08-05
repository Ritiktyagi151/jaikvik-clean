"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Footer = dynamic(() => import("../common/footer/Footer"), {
  loading: () => <div style={{ minHeight: 260 }} aria-hidden="true" />,
});

const DeferredFooter = () => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || !hostRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={hostRef} style={!shouldRender ? { minHeight: 260 } : undefined}>
      {shouldRender ? <Footer /> : null}
    </div>
  );
};

export default DeferredFooter;
