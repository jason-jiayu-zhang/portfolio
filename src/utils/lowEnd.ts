/**
 * A rough guess at weak hardware (an older laptop, a budget phone): four or
 * fewer logical cores, or four or fewer GB of memory where the browser says.
 * Used to skip effects that cost main-thread time every frame.
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return true
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  return typeof memory === 'number' && memory > 0 && memory <= 4
}
