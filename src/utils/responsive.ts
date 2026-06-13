export type ResponsiveMetrics = {
  contentMaxWidth: number;
  gutter: number;
  isCompactHeight: boolean;
  isCompactWidth: boolean;
  isWide: boolean;
  listColumns: number;
  listMaxWidth: number;
  shortestSide: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getResponsiveMetrics(width: number, height: number): ResponsiveMetrics {
  const shortestSide = Math.min(width, height);
  const isCompactWidth = width < 370;
  const isCompactHeight = height < 700;
  const isWide = width >= 720 || shortestSide >= 600;
  const gutter = clamp(Math.round(width * 0.055), isCompactWidth ? 14 : 18, isWide ? 32 : 24);
  const listColumns = width >= 820 ? 2 : 1;

  return {
    contentMaxWidth: isWide ? 620 : 520,
    gutter,
    isCompactHeight,
    isCompactWidth,
    isWide,
    listColumns,
    listMaxWidth: listColumns > 1 ? 1080 : 620,
    shortestSide,
  };
}
