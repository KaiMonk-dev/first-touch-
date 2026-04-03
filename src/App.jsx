import { BookingProvider } from './components/BookingModal'
import { ThemeProvider } from './hooks/useTheme'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'
import { ScrollProgress } from './components/ScrollProgress'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SpeedProof } from './components/SpeedProof'
import { MeetAlex } from './components/MeetAlex'
import { HowItWorks } from './components/HowItWorks'
import { RevenueCalculator } from './components/RevenueCalculator'
import { DashboardPreview } from './components/DashboardPreview'
import { Pricing } from './components/Pricing'
import { WhoWeAre } from './components/WhoWeAre'
import { FAQ } from './components/FAQ'
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
import { EasterEggs } from './components/EasterEggs'
import { GHLWidgetLabel } from './components/GHLWidgetLabel'
import { GHLWidgetStyles } from './components/GHLWidgetStyles'
import { SectionBurst } from './components/SectionBurst'
import { ScrollReward } from './components/ScrollReward'
import { LiquidGlassEffects } from './components/LiquidGlassEffects'
import { LiquidDripDivider } from './components/LiquidDripDivider'
import { AmbientSound } from './components/AmbientSound'
import { ViewportEffects } from './components/ViewportEffects'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <BookingProvider>
        <div className="min-h-screen bg-black text-white overflow-x-hidden grain edge-glow">
          <LoadingScreen />
          <GalaxyBackground />
          <LiquidGlassEffects />
          <ScrollProgress />
          <Nav />
          <main>
            <Hero />
            <SpeedProof />
            <LiquidDripDivider />
            <SectionBurst />
            <MeetAlex />
            <LiquidDripDivider />
            <RevenueCalculator />
            <LiquidDripDivider />
            <HowItWorks />
            <LiquidDripDivider />
            <SectionBurst />
            <DashboardPreview />
            <LiquidDripDivider />
            <Pricing />
            <LiquidDripDivider />
            <WhoWeAre />
            <LiquidDripDivider />
            <FAQ />
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
          <GHLWidgetStyles />
          <GHLWidgetLabel />
          <EasterEggs />
          <ScrollReward />
        </div>
      </BookingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
