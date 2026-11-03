import { useEffect, type ReactNode } from 'react'
import { AttendantScreen } from '../features/emergency/AttendantScreen'
import { EmergencyScreen } from '../features/emergency/EmergencyScreen'
import { ExploreCategoryScreen } from '../features/explore/ExploreCategoryScreen'
import { ExploreScreen } from '../features/explore/ExploreScreen'
import { CircuitScreen } from '../features/circuits/CircuitScreen'
import { findCircuit } from '../features/circuits/circuits'
import { AccountScreen } from '../features/account/AccountScreen'
import { LoginScreen } from '../features/account/LoginScreen'
import { SignupScreen } from '../features/account/SignupScreen'
import { TravelProfileScreen } from '../features/account/TravelProfileScreen'
import { PlanScreen } from '../features/plan/PlanScreen'
import { findEvent } from '../features/events/data'
import { EventScreen } from '../features/events/EventScreen'
import { EventsScreen } from '../features/events/EventsScreen'
import { useSession } from '../features/account/session'
import { WelcomeScreen } from '../features/onboarding/WelcomeScreen'
import { SportSpotsScreen } from '../features/sports/SportSpotsScreen'
import { DirectionsScreen } from '../features/places/DirectionsScreen'
import { ConsentScreen } from '../features/onboarding/ConsentScreen'
import { LanguageScreen } from '../features/onboarding/LanguageScreen'
import { findPlace, type Place } from '../features/places/places'
import { HomeScreen } from '../features/places/HomeScreen'
import { NearbyScreen } from '../features/places/NearbyScreen'
import { PlaceScreen } from '../features/places/PlaceScreen'
import { EverydayScreen } from '../features/urgencias/EverydayScreen'
import { PrivacyScreen } from '../features/profile/PrivacyScreen'
import { ProfileScreen } from '../features/profile/ProfileScreen'
import { usePreferences } from '../preferences/context'
import { navigate, useHash } from './navigation'
import { parseHash, resolveRoute, showsBar, tabFor, toHash, type Route } from './routes'
import { TabBar } from './TabBar'

type PlacesLoader = () => Promise<readonly Place[]>

const knowsPlace = (id: string) => findPlace(id) !== undefined
const knowsCircuit = (id: string) => findCircuit(id) !== undefined
const knowsEvent = (id: string) => findEvent(id) !== undefined

// why: resolveRoute already bounces unknown ids away, so the null is only a type-level guard
const withPlace = (id: string, render: (place: Place) => ReactNode) => {
  const place = findPlace(id)
  return place ? render(place) : null
}

function Screen({ route, load }: { route: Route; load?: PlacesLoader }) {
  switch (route.name) {
    case 'welcome':
      return <WelcomeScreen />
    case 'language':
      return <LanguageScreen />
    case 'consent':
      return <ConsentScreen />
    case 'home':
      return <HomeScreen load={load} />
    case 'explore':
      return <ExploreScreen />
    case 'explore-category':
      return <ExploreCategoryScreen category={route.id} load={load} />
    case 'circuit': {
      const circuit = findCircuit(route.id)
      return circuit ? <CircuitScreen circuit={circuit} /> : null
    }
    case 'everyday':
      return <EverydayScreen />
    case 'nearby':
      return <NearbyScreen load={load} />
    case 'place':
      return withPlace(route.id, (place) => <PlaceScreen place={place} />)
    case 'emergency':
      return <EmergencyScreen />
    case 'emergency-show':
      return <AttendantScreen />
    case 'profile':
      return <ProfileScreen />
    case 'privacy':
      return <PrivacyScreen />
    case 'login':
      return <LoginScreen />
    case 'signup':
      return <SignupScreen />
    case 'account':
      return <AccountScreen />
    case 'plan':
      return <PlanScreen />
    case 'events':
      return <EventsScreen />
    case 'event': {
      const event = findEvent(route.id)
      return event ? <EventScreen event={event} /> : null
    }
    case 'travel-profile':
      return <TravelProfileScreen />
    case 'sport-spots':
      return withPlace(route.id, (place) => <SportSpotsScreen place={place} />)
    case 'directions':
      return withPlace(route.id, (place) => <DirectionsScreen place={place} />)
  }
}

export function AppShell({ load }: { load?: PlacesLoader }) {
  const { preferences } = usePreferences()
  const hash = useHash()
  const signedIn = useSession() !== null
  const route = resolveRoute(
    parseHash(hash),
    preferences.onboarding,
    knowsPlace,
    knowsCircuit,
    signedIn,
    knowsEvent,
  )

  useEffect(() => {
    if (toHash(route) !== hash) navigate(route, true)
  }, [route, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <div key={toHash(route)} className="flex flex-1 animate-screen-in flex-col *:w-full">
        <Screen route={route} load={load} />
      </div>
      {showsBar(route, preferences.onboarding) && <TabBar active={tabFor(route)} />}
    </div>
  )
}
