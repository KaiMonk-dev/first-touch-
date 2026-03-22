import { CalendlyProvider } from './components/CalendlyModal'
import { LoadingScreen } from './components/LoadingScreen'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SpeedProof } from './components/SpeedProof'
import { Problem } from './components/Problem'
import { MeetAlex } from './components/MeetAlex'
import { HowItWorks } from './components/HowItWorks'
import { ComparisonTable } from './components/ComparisonTable'
import { ROICalculator } from './components/ROICalculator'
import { Pricing } from './components/Pricing'
import { FAQ } from './components/FAQ'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { StickyMobileCTA } from './components/StickyMobileCTA'
import { ExitIntent } from './components/ExitIntent'
import { BackToTop } from './components/BackToTop'

function App() {
  return (
    <CalendlyProvider>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <LoadingScreen />
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <SpeedProof />
          <Problem />
          <MeetAlex />
          <HowItWorks />
          <ComparisonTable />
          <ROICalculator />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <StickyMobileCTA />
        <ExitIntent />
        <BackToTop />
      </div>
    </CalendlyProvider>
  )
}

export default App
