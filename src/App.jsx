import { CalendlyProvider } from './components/CalendlyModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProofTicker } from './components/ProofTicker'
import { SpeedProof } from './components/SpeedProof'
import { MeetAlex } from './components/MeetAlex'
import { HowItWorks } from './components/HowItWorks'
import { DashboardPreview } from './components/DashboardPreview'
import { TryAlex } from './components/TryAlex'
import { ComparisonTable } from './components/ComparisonTable'
import { Pricing } from './components/Pricing'
import { FAQ } from './components/FAQ'
import { WhoWeAre } from './components/WhoWeAre'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { StickyMobileCTA } from './components/StickyMobileCTA'
import { ExitIntent } from './components/ExitIntent'
import { BackToTop } from './components/BackToTop'
import { AmbientCursor } from './components/AmbientCursor'
import { MobileRipple } from './components/MobileRipple'
import { PortalEcho } from './components/PortalEcho'
import { StarRain } from './components/StarRain'
import { DebugOverlay } from './components/DebugOverlay'
import { GalaxyBackground } from './components/GalaxyBackground'
import { TestimonialPlaceholder } from './components/TestimonialPlaceholder'
import { EasterEggs } from './components/EasterEggs'
import { SectionBurst } from './components/SectionBurst'
import { ScrollReward } from './components/ScrollReward'
import { LiquidGlassEffects } from './components/LiquidGlassEffects'
import { LiquidDripDivider } from './components/LiquidDripDivider'
import { AmbientSound } from './components/AmbientSound'
import { ViewportEffects } from './components/ViewportEffects'

function App() {
  return (
    <ErrorBoundary>
      <CalendlyProvider>
        <div className="min-h-screen bg-black text-white overflow-x-hidden grain edge-glow">
          <LoadingScreen />
          <GalaxyBackground />
          <LiquidGlassEffects />
          <ScrollProgress />
          <Nav />
          <main>
            <Hero />
            <ProofTicker />
            <SpeedProof />
            <LiquidDripDivider />
            <SectionBurst />
            <MeetAlex />
            <LiquidDripDivider />
            <HowItWorks />
            <LiquidDripDivider />
            <SectionBurst />
            <DashboardPreview />
            <TryAlex />
            <LiquidDripDivider />
            <SectionBurst />
            <ComparisonTable />
            <TestimonialPlaceholder />
            <LiquidDripDivider />
            <Pricing />
            <LiquidDripDivider />
            <FAQ />
            <LiquidDripDivider />
            <WhoWeAre />
            <FinalCTA />
          </main>
          <Footer />
          <StickyMobileCTA />
          <ExitIntent />
          <BackToTop />
          <AmbientCursor />
          <AmbientSound />
          <ViewportEffects />
          <MobileRipple />
          <PortalEcho />
          <StarRain targetId="pricing" />
          <DebugOverlay />
          <EasterEggs />
          <ScrollReward />
        </div>
      </CalendlyProvider>
    </ErrorBoundary>
  )
}

export default App
