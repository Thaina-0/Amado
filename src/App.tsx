import { AppShell } from './app/AppShell'
import { PreferencesProvider } from './preferences/PreferencesProvider'
import { Splash } from './ui/Splash'

export function App() {
  return (
    <PreferencesProvider>
      <AppShell />
      <Splash />
    </PreferencesProvider>
  )
}
