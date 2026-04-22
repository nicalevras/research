import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema } from '~/lib/schema'
import { CircleAlertIcon } from '~/components/icons'

export const Route = createFileRoute('/calculator')({
  head: () => {
    const pageTitle = 'Peptide Reconstitution Calculator — Peptide Directory'
    const pageDescription = 'Free peptide reconstitution calculator. Calculate concentration, dose volume, and syringe units for any peptide vial.'
    const canonicalUrl = `${SITE_URL}/calculator`
    const ogImage = `${SITE_URL}/og-image.png`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
        { name: 'twitter:image', content: ogImage },
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
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Calculator', url: '/calculator' },
          ])),
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

function readDefaultSyringe(): SyringeOption {
  const syringe = SYRINGES[2] ?? SYRINGES[0]
  if (!syringe) throw new Error('At least one syringe option is required')
  return syringe
}

const DEFAULT_SYRINGE = readDefaultSyringe()

const VIAL_OPTIONS = [2, 5, 10, 15]
const WATER_OPTIONS = [1, 2, 3]
const DOSE_OPTIONS = [1, 2, 5, 10]

// ── Pill Button ────────────────────────────────────────────────────

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center justify-center shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ' +
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

function SyringeScale({ fillUnits, totalUnits }: { fillUnits: number; totalUnits: number }) {
  const clampedFill = Math.min(Math.max(fillUnits, 0), totalUnits)
  const fillPct = (clampedFill / totalUnits) * 100

  // Tick intervals based on syringe size
  const majorInterval = totalUnits <= 30 ? 5 : 10
  const minorInterval = totalUnits <= 30 ? 1 : 2

  const ticks: { pos: number; major: boolean; label?: string }[] = []
  for (let i = 0; i <= totalUnits; i += minorInterval) {
    if (i === 0) continue
    const isMajor = i % majorInterval === 0
    ticks.push({ pos: (i / totalUnits) * 100, major: isMajor, label: isMajor ? String(i) : undefined })
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] h-10 overflow-hidden">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 bg-emerald-400/20 dark:bg-emerald-400/15 transition-all duration-300"
          style={{ width: `${fillPct}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0">
          {ticks.map((tick) => (
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
            className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 z-10"
            style={{ left: `${fillPct}%` }}
          />
        )}
      </div>
      {/* Labels below */}
      <div className="relative h-4">
        <span className="absolute text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500" style={{ left: 0 }}>0</span>
        {ticks.filter((t) => t.label).map((tick) => {
          const isLast = tick.pos === 100
          return (
            <span
              key={tick.pos}
              className={`absolute text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500 ${isLast ? 'right-0' : '-translate-x-1/2'}`}
              style={isLast ? undefined : { left: `${tick.pos}%` }}
            >
              {tick.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Calculator ─────────────────────────────────────────────────────

function CalculatorPage() {
  const [syringe, setSyringe] = useState<SyringeOption>(DEFAULT_SYRINGE)
  const [vialMg, setVialMg] = useState(10)
  const [customVial, setCustomVial] = useState('')
  const [isCustomVial, setIsCustomVial] = useState(false)
  const [waterMl, setWaterMl] = useState(1)
  const [customWater, setCustomWater] = useState('')
  const [isCustomWater, setIsCustomWater] = useState(false)
  const [doseMg, setDoseMg] = useState(1)
  const [customDose, setCustomDose] = useState('')
  const [isCustomDose, setIsCustomDose] = useState(false)

  // Resolve actual values (custom overrides presets)
  const actualVial = isCustomVial ? parseFloat(customVial) || 0 : vialMg
  const actualWater = isCustomWater ? parseFloat(customWater) || 0 : waterMl
  const actualDoseMg = isCustomDose ? parseFloat(customDose) || 0 : doseMg

  // Compute results (internally use mg throughout)
  const concentrationMgPerMl = actualWater > 0 ? actualVial / actualWater : 0
  const doseVolume = concentrationMgPerMl > 0 ? actualDoseMg / concentrationMgPerMl : 0
  const syringeUnits = doseVolume * (syringe.units / syringe.mL)
  const exceedsSyringe = syringeUnits > syringe.units
  const hasResults = actualVial > 0 && actualWater > 0 && actualDoseMg > 0

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
    <div>
      <section className="py-16">
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">
            Peptide Reconstitution Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
            Free peptide reconstitution calculator for accurate dosing. Calculate concentrations, mixing volumes, and syringe units instantly for any peptide.
          </p>
        </div>
      </section>

      {/* Inputs */}
      <div className="glass-card-solid shadow-none p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Syringe Size */}
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] p-5 space-y-2.5">
          <Label>Syringe Size</Label>
          <div className="flex flex-wrap gap-2">
            {SYRINGES.map((s) => (
              <Pill key={s.units} active={syringe.units === s.units} onClick={() => setSyringe(s)}>
                <span className="flex flex-col items-center leading-tight">
                  <span>{s.label}</span>
                  <span className="font-normal text-xs opacity-60">{s.units} units</span>
                </span>
              </Pill>
            ))}
          </div>
        </div>

        {/* Peptide Vial Amount */}
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] p-5 space-y-2.5">
          <Label>Peptide Vial Amount (mg)</Label>
          <div className="flex flex-wrap gap-2">
            {VIAL_OPTIONS.map((mg) => (
              <Pill key={mg} active={!isCustomVial && vialMg === mg} onClick={() => handleSelectVial(mg)}>
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
              className="w-32 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
            />
          )}
        </div>

        {/* Bacteriostatic Water */}
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] p-5 space-y-2.5">
          <Label>Bacteriostatic Water (mL)</Label>
          <div className="flex flex-wrap gap-2">
            {WATER_OPTIONS.map((ml) => (
              <Pill key={ml} active={!isCustomWater && waterMl === ml} onClick={() => handleSelectWater(ml)}>
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
              className="w-32 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
            />
          )}
        </div>

        {/* Desired Dose */}
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] p-5 space-y-2.5">
          <Label>Desired Dose (mg)</Label>
          <div className="flex flex-wrap gap-2">
            {DOSE_OPTIONS.map((mg) => (
              <Pill key={mg} active={!isCustomDose && doseMg === mg} onClick={() => handleSelectDose(mg)}>
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
                className="w-32 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
              />
              <span className="text-xs text-neutral-400 dark:text-neutral-500">mg</span>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Results */}
      <div className="glass-card-solid shadow-none p-6 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-5">Results</h2>

        {hasResults ? (
          <div className="space-y-5">
            <SyringeScale fillUnits={syringeUnits} totalUnits={syringe.units} />

            {exceedsSyringe ? (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-200/60 dark:border-red-500/20 p-3.5">
                <CircleAlertIcon className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  This dose requires {syringeUnits.toFixed(1)} units, which exceeds your {syringe.label} ({syringe.units}u) syringe capacity. Use a larger syringe or reduce the dose.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  For a dose of{' '}
                  <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{actualDoseMg} mg</span>
                  {' '}pull the syringe to{' '}
                  <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{syringeUnits.toFixed(1)}</span>
                  {' '}units
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">Concentration</p>
                <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                  {concentrationMgPerMl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">mg/mL</p>
              </div>
              <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-4">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">Dose Volume</p>
                <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                  {doseVolume.toFixed(3)}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">mL</p>
              </div>
            </div>
          </div>
        ) : (
          <SyringeScale fillUnits={0} totalUnits={syringe.units} />
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center mt-6 max-w-lg mx-auto leading-relaxed">
        This calculator is for educational and research purposes only. It is not intended as medical advice, diagnosis, or treatment. Always consult a qualified professional.
      </p>
    </div>
  )
}
