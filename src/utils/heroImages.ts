type HeroImageOptions = {
  systemImages?: string[];
  customImages?: string[];
  useSystemImages?: boolean;
  maxImages?: number;
};

export function buildHeroImages({
  systemImages = [],
  customImages = [],
  useSystemImages = true,
  maxImages = 10,
}: HeroImageOptions) {
  const safeCustom = customImages.filter(Boolean);
  const safeSystem = useSystemImages ? systemImages.filter(Boolean) : [];
  const combined = [...safeCustom, ...safeSystem];
  return combined.slice(0, maxImages);
}
