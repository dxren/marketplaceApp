import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { LucideSearch } from "lucide-react";

function SiteHeader() {
    return (
        <>
        <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginLeft: '4px', marginRight: '10px' }}>
            <div className="title" >fractal marketplace</div>
            <div style={{display: 'flex', gap: '80px', fontSize: '24px', fontFamily: 'Brygada 1918', marginTop: '10px', marginLeft: '20px'}}>
                <div> feed </div>
                <div> profile </div>
                <div> about </div>
            </div>
            <div style={{display: 'flex'}}> 
                <LucideSearch style={{marginRight: '8px', marginTop: '3px',}}/>
                <input onBlur={() => console.log('search blur')} onFocus={() => console.log('search focus')} type="text" placeholder="Search" style={{
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    marginRight: '30px',
                    paddingLeft: '8px',
                    background: 'transparent',
                    border: '2px solid #fff9e6',
                    color: '#fff9e6',
                    borderRadius: '4px',
                    width: '100px'
                }} /> 
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>

        </div>
    </header>
    </>
        
    )
}

export default SiteHeader;