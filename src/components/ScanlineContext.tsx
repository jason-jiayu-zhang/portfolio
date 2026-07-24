// ─────────────────────────────────────────────────────────────────────────────
// SCANLINE CONTEXT — global toggle for scanline overlay (retro vs. clean mode)
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

interface ScanlineContextValue {
  scanlineActive: boolean
  setScanlineActive: (v: boolean) => void
  toggleScanline: () => void
}

const ScanlineContext = createContext<ScanlineContextValue>({
  scanlineActive: true,
  setScanlineActive: () => {},
  toggleScanline: () => {},
})

export function ScanlineProvider({ children }: { children: React.ReactNode }) {
  const [scanlineActive, setScanlineActive] = useState(true)

  const toggleScanline = () => setScanlineActive((v) => !v)

  return (
    <ScanlineContext.Provider value={{ scanlineActive, setScanlineActive, toggleScanline }}>
      {children}
    </ScanlineContext.Provider>
  )
}

export function useScanline() {
  return useContext(ScanlineContext)
}
