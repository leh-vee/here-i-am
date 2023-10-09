export function tenByTenArray() {
  const a = new Array(10);
  for (let i = 0; i < 10; i++) a[i] = new Array(10);
  return a;
}