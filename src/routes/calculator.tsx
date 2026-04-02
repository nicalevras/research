import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { CircleAlertIcon } from '~/components/icons'

export const Route = createFileRoute('/calculator')({
  head: () => {
    const pageTitle = 'Peptide Reconstitution Calculator — Peptide Directory'
    const pageDescription = 'Free peptide reconstitution calculator. Calculate concentration, dose volume, and syringe units for any peptide vial. Supports all U-100 insulin syringe sizes.'
    const canonicalUrl = `${SITE_URL}/calculator`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Peptide Reconstitution Calculator',
            url: canonicalUrl,
            description: pageDescription,
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  }),
  component: CalculatorPage,
})

// ── Types ──────────────────────────────────────────────────────────

interface SyringeOption {
  mL: number
  units: number
  label: string
}

const SYRINGES: SyringeOption[] = [
  { mL: 0.3, units: 30, label: '0.3 mL' },
  { mL: 0.5, units: 50, label: '0.5 mL' },
  { mL: 1.0, units: 100, label: '1.0 mL' },
]

const VIAL_OPTIONS = [2, 5, 10, 15]
const WATER_OPTIONS = [1, 2, 3]
const DOSE_OPTIONS = [0.25, 0.5, 1, 2.5]

// ── Pill Button ────────────────────────────────────────────────────

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center justify-center shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ' +
        (active
          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border border-neutral-900 dark:border-white'
          : 'bg-white/70 dark:bg-white/[0.04] text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] border border-neutral-200/60 dark:border-white/[0.06] hover:text-neutral-900 dark:hover:text-white')
      }
    >
      {children}
    </button>
  )
}

// ── Section Label ──────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-neutral-900 dark:text-white">{children}</p>
}

// ── Syringe Scale ──────────────────────────────────────────────────

function SyringeScale({ fillUnits, maxUnits }: { fillUnits: number; maxUnits: number }) {
  // Always render 0-100 scale (U-100 syringe)
  const totalUnits = 100
  const clampedFill = Math.min(Math.max(fillUnits, 0), totalUnits)
  const fillPct = (clampedFill / totalUnits) * 100

  const ticks: { pos: number; major: boolean; label?: string; hidden?: boolean }[] = []
  for (let i = 0; i <= totalUnits; i += 2) {
    const isMajor = i % 10 === 0
    ticks.push({ pos: (i / totalUnits) * 100, major: isMajor, label: isMajor ? String(i) : undefined, hidden: i === 0 })
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] h-10 overflow-hidden">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 bg-neutral-900/10 dark:bg-white/10 transition-all duration-300"
          style={{ width: `${fillPct}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0">
          {ticks.filter((t) => !t.hidden).map((tick) => (
            <div
              key={tick.pos}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${tick.pos}%` }}
            >
              <div className={`w-px ${tick.major ? 'h-full bg-neutral-300 dark:bg-neutral-600' : 'h-1/3 bg-neutral-200 dark:bg-neutral-700'}`} />
            </div>
          ))}
        </div>
        {/* Fill marker line */}
        {clampedFill > 0 && clampedFill <= totalUnits && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-neutral-900 dark:bg-white transition-all duration-300 z-10"
            style={{ left: `${fillPct}%` }}
          />
        )}
        {/* Max syringe capacity indicator */}
        {maxUnits < totalUnits && (
          <div
            className="absolute top-0 bottom-0 w-px bg-red-400/50 dark:bg-red-500/50 z-10"
            style={{ left: `${(maxUnits / totalUnits) * 100}%` }}
          />
        )}
      </div>
      {/* Labels below */}
      <div className="relative h-4">
        {ticks.filter((t) => t.label).map((tick) => (
          <span
            key={tick.pos}
            className="absolute text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500 -translate-x-1/2"
            style={{ left: `${tick.pos}%` }}
          >
            {tick.label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Units</span>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">U-100 insulin syringe</span>
      </div>
    </div>
  )
}

// ── Calculator ─────────────────────────────────────────────────────

function CalculatorPage() {
  const [syringe, setSyringe] = useState<SyringeOption | null>(null)
  const [vialMg, setVialMg] = useState<number | null>(null)
  const [customVial, setCustomVial] = useState('')
  const [isCustomVial, setIsCustomVial] = useState(false)
  const [waterMl, setWaterMl] = useState<number | null>(null)
  const [customWater, setCustomWater] = useState('')
  const [isCustomWater, setIsCustomWater] = useState(false)
  const [doseMg, setDoseMg] = useState<number | null>(null)
  const [customDose, setCustomDose] = useState('')
  const [isCustomDose, setIsCustomDose] = useState(false)

  // Resolve actual values (custom overrides presets)
  const actualVial = isCustomVial ? parseFloat(customVial) || 0 : (vialMg ?? 0)
  const actualWater = isCustomWater ? parseFloat(customWater) || 0 : (waterMl ?? 0)
  const actualDoseMg = isCustomDose ? parseFloat(customDose) || 0 : (doseMg ?? 0)

  // Compute results (internally use mg throughout)
  const concentrationMgPerMl = actualWater > 0 ? actualVial / actualWater : 0
  const doseVolume = concentrationMgPerMl > 0 ? actualDoseMg / concentrationMgPerMl : 0
  const activeSyringe = syringe ?? SYRINGES[2] // default to 1.0mL for computation
  const syringeUnits = doseVolume * (activeSyringe.units / activeSyringe.mL)
  const exceedsSyringe = syringe ? syringeUnits > syringe.units : false
  const hasResults = actualVial > 0 && actualWater > 0 && actualDoseMg > 0 && syringe !== null

  const handleSelectVial = (mg: number) => {
    setVialMg(mg)
    setIsCustomVial(false)
    setCustomVial('')
  }

  const handleSelectWater = (ml: number) => {
    setWaterMl(ml)
    setIsCustomWater(false)
    setCustomWater('')
  }

  const handleSelectDose = (mg: number) => {
    setDoseMg(mg)
    setIsCustomDose(false)
    setCustomDose('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Peptide Reconstitution Calculator
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl text-pretty mt-1.5">
          Calculate the exact concentration and syringe units for reconstituting peptides with bacteriostatic water.
        </p>
      </div>

      {/* Inputs */}
      <div className="glass-card-solid p-6 space-y-6">
        {/* Syringe Size */}
        <div className="space-y-2.5">
          <Label>Syringe Size</Label>
          <div className="flex flex-wrap gap-2">
            {SYRINGES.map((s) => (
              <Pill key={s.units} active={syringe?.units === s.units} onClick={() => setSyringe(s)}>
                {s.label} ({s.units}u)
              </Pill>
            ))}
          </div>
        </div>

        {/* Peptide Vial Amount */}
        <div className="space-y-2.5">
          <Label>Peptide Vial Amount (mg)</Label>
          <div className="flex flex-wrap gap-2">
            {VIAL_OPTIONS.map((mg) => (
              <Pill key={mg} active={!isCustomVial && vialMg !== null && vialMg === mg} onClick={() => handleSelectVial(mg)}>
                {mg} mg
              </Pill>
            ))}
            <Pill active={isCustomVial} onClick={() => setIsCustomVial(true)}>
              Other
            </Pill>
          </div>
          {isCustomVial && (
            <input
              type="number"
              inputMode="decimal"
              value={customVial}
              onChange={(e) => setCustomVial(e.target.value)}
              placeholder="Enter mg"
              autoFocus
              className="w-32 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
            />
          )}
        </div>

        {/* Bacteriostatic Water */}
        <div className="space-y-2.5">
          <Label>Bacteriostatic Water (mL)</Label>
          <div className="flex flex-wrap gap-2">
            {WATER_OPTIONS.map((ml) => (
              <Pill key={ml} active={!isCustomWater && waterMl !== null && waterMl === ml} onClick={() => handleSelectWater(ml)}>
                {ml} mL
              </Pill>
            ))}
            <Pill active={isCustomWater} onClick={() => setIsCustomWater(true)}>
              Other
            </Pill>
          </div>
          {isCustomWater && (
            <input
              type="number"
              inputMode="decimal"
              value={customWater}
              onChange={(e) => setCustomWater(e.target.value)}
              placeholder="Enter mL"
              autoFocus
              className="w-32 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
            />
          )}
        </div>

        {/* Desired Dose */}
        <div className="space-y-2.5">
          <Label>Desired Dose (mg)</Label>
          <div className="flex flex-wrap gap-2">
            {DOSE_OPTIONS.map((mg) => (
              <Pill key={mg} active={!isCustomDose && doseMg !== null && doseMg === mg} onClick={() => handleSelectDose(mg)}>
                {mg} mg
              </Pill>
            ))}
            <Pill active={isCustomDose} onClick={() => setIsCustomDose(true)}>
              Other
            </Pill>
          </div>
          {isCustomDose && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={customDose}
                onChange={(e) => setCustomDose(e.target.value)}
                placeholder="Enter mg"
                autoFocus
                className="w-32 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
              />
              <span className="text-xs text-neutral-400 dark:text-neutral-500">mg</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="glass-card-solid p-6 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-5">Results</h2>

        {hasResults ? (
          <div className="space-y-5">
            {exceedsSyringe ? (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200/60 dark:border-red-500/20 p-3.5">
                <CircleAlertIcon className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  This dose requires {syringeUnits.toFixed(1)} units, which exceeds your {syringe!.label} ({syringe!.units}u) syringe capacity. Use a larger syringe or reduce the dose.
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  For a dose of{' '}
                  <span className="font-semibold text-neutral-900 dark:text-white">{actualDoseMg} mg</span>
                  {' '}pull the syringe to{' '}
                  <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{syringeUnits.toFixed(1)}</span>
                  {' '}units
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">Concentration</p>
                <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                  {concentrationMgPerMl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">mg/mL</p>
              </div>
              <div className="rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">Dose Volume</p>
                <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                  {doseVolume.toFixed(3)}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">mL</p>
              </div>
              <div className={`rounded-xl border p-4 ${exceedsSyringe ? 'bg-red-50 dark:bg-red-500/5 border-red-200/60 dark:border-red-500/20' : 'bg-neutral-50 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/[0.06]'}`}>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">Syringe Units</p>
                <p className={`text-2xl font-bold tabular-nums ${exceedsSyringe ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
                  {syringeUnits.toFixed(1)}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">units</p>
              </div>
            </div>

            <SyringeScale fillUnits={syringeUnits} maxUnits={syringe!.units} />
          </div>
        ) : (
          <SyringeScale fillUnits={0} maxUnits={100} />
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center mt-6 max-w-lg mx-auto leading-relaxed">
        This calculator is for educational and research purposes only. It is not intended as medical advice, diagnosis, or treatment. Always consult a qualified professional.
      </p>
    </div>
  )
}
