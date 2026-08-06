export type WebsiteCardItem = {
  url: string;
  imageSrc: string;
  alt?: string;
};

type WebsiteCardProps = {
  website: WebsiteCardItem;
  index: number;
  shouldLoadMedia?: boolean;
};

const WebsiteCard = ({
  website,
  index,
  shouldLoadMedia = false,
}: WebsiteCardProps) => {
  return (
    <div
      className="websiteCard group h-full"
      style={{ position: "relative", overflow: "hidden", height: "100%" }}
    >
      <a
        href={website.url}
        target="_blank"
        rel="noopener noreferrer"
        className="screen block aspect-[19/27] md:aspect-[19/16] overflow-hidden relative mx-auto h-full"
      >
        {shouldLoadMedia ? (
          <img
            src={website.imageSrc}
            alt={website.alt || `Website ${index + 1}`}
            className="absolute inset-x-0 top-0 z-0 m-auto min-h-full w-full max-w-full object-cover p-0 motion-safe:transition-transform motion-safe:duration-[5000ms] motion-safe:ease-linear group-hover:-translate-y-1/3 group-focus-within:-translate-y-1/3"
            draggable={false}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width={640}
            height={900}
          />
        ) : (
          <div
            className="absolute inset-0 bg-neutral-900"
            aria-label={website.alt || `Website ${index + 1}`}
            role="img"
          />
        )}
      </a>
    </div>
  );
};

export default WebsiteCard;
