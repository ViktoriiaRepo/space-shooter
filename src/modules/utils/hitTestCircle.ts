export function hitTestCircle(r1: any, r2: any, reduction: number): boolean {
  const r1Bounds = r1.getBounds();
  const r2Bounds = r2.getBounds();

  const r1Radius = Math.min(r1Bounds.width, r1Bounds.height) / 2 - reduction;
  const r2Radius = Math.min(r2Bounds.width, r2Bounds.height) / 2 - reduction;

  const dx = r1Bounds.x + r1Radius - (r2Bounds.x + r2Radius);
  const dy = r1Bounds.y + r1Radius - (r2Bounds.y + r2Radius);

  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < r1Radius + r2Radius;
}
