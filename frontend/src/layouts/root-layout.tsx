import { Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import SiteHeader from '../components/SiteHeader'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}


export default function RootLayout() {
    const navigate = useNavigate();

    return (
        <ClerkProvider
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
            publishableKey={PUBLISHABLE_KEY}
        >
            <header className="header">
                <div>
                    <div>
                        <p>Clerk + React + React Router App</p>
                    </div>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton />
                    </SignedOut>
                </div>
            </header>
            <SiteHeader />
            <main>
                <Outlet />
            </main>
        </ClerkProvider>
    )
}