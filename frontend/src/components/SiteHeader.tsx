import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function SiteHeader() {
    return (
        <>
        <header className="grenze-gotisch-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '60px', margin: 0 }}>fractal marketplace</div>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </div>
    </header>
    </>
        
    )
}

export default SiteHeader;