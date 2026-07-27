import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useParams, useLocation, useOutletContext } from 'react-router-dom'
import { getCampaign, getCampaignMeta } from './lib/data.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './views/Home.jsx'
import Sessions from './views/Sessions.jsx'
import Session from './views/Session.jsx'
import Party from './views/Party.jsx'
import Character from './views/Character.jsx'
import Lore from './views/Lore.jsx'
import LoreItem from './views/LoreItem.jsx'
import Timeline from './views/Timeline.jsx'
import EmptyCampaign from './views/EmptyCampaign.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  const { campaign: campaignId } = useParams()
  const meta = getCampaignMeta(campaignId)
  const campaign = getCampaign(campaignId)

  if (!meta) return <Navigate to="/oro" replace />

  const arcCount = campaign ? (campaign.arcs || []).length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header campaignId={campaignId} meta={meta} arcCount={arcCount} />
      {campaign && meta.populated ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Sidebar campaign={campaign} />
          <main style={{ flex: 1, minWidth: 0, padding: 'var(--space-8) var(--space-8) 64px', maxWidth: 1120 }}>
            <Outlet context={{ campaign }} />
          </main>
        </div>
      ) : (
        <EmptyCampaign name={meta.name} />
      )}
    </div>
  )
}

export function useCampaign() {
  return useOutletContext().campaign
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/oro" replace />} />
        <Route path="/:campaign" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sesiones" element={<Sessions />} />
          <Route path="sesion/:n" element={<Session />} />
          <Route path="personajes" element={<Party />} />
          <Route path="personajes/:id" element={<Character />} />
          <Route path="mundo" element={<Lore />} />
          <Route path="mundo/:id" element={<LoreItem />} />
          <Route path="linea-temporal" element={<Timeline />} />
        </Route>
        <Route path="*" element={<Navigate to="/oro" replace />} />
      </Routes>
    </>
  )
}
