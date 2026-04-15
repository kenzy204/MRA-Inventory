export default function SkeletonBlock({
  height = 16,
  width = '100%',
  radius = 12
}) {
  return (
    <div
      className="skeleton-block"
      style={{
        height,
        width,
        borderRadius: radius
      }}
    />
  );
}
