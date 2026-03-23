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
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { StickyMobileCTA } from './components/StickyMobileCTA'
import { ExitIntent } from './components/ExitIntent'
import { BackToTop } from './components/BackToTop'
import { AmbientCursor } from './components/AmbientCursor'
import { GalaxyBackground } from './components/GalaxyBackground'
import { TestimonialPlaceholder } from './components/TestimonialPlaceholder'
import { EasterEggs } from './components/EasterEggs'
import { SectionBurst } from './components/SectionBurst'
import { GalaxyMinimap } from './components/GalaxyMinimap'
import { ScrollReward } from './components/ScrollReward'

function App() {
  return (
    <ErrorBoundary>
      <CalendlyProvider>
        <div className="min-h-screen bg-black text-white overflow-x-hidden grain">
          <LoadingScreen />
          <GalaxyBackground />
          <ScrollProgress />
          <Nav />
          <main>
            <Hero />
            <ProofTicker />
            <SpeedProof />
            <SectionBurst />
            <MeetAlex />
            <HowItWorks />
            <SectionBurst />
            <DashboardPreview />
            <TryAlex />
            <SectionBurst />
            <ComparisonTable />
            <TestimonialPlaceholder />
            <Pricing />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
          <StickyMobileCTA />
          <ExitIntent />
          <BackToTop />
          <AmbientCursor />
          <GalaxyMinimap />
          <EasterEggs />
          <ScrollReward />
        </div>
      </CalendlyProvider>
    </ErrorBoundary>
  )
}

export default App
