import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { LucideSearch } from "lucide-react";

import styles from './styles.module.css'

function SiteHeader() {
    return (
        <header className={styles.siteHeader}>
            <div className={styles.title}>fractal marketplace</div>
            <div className={styles.navBar}>
                <div> feed </div>
                <div> profile </div>
                <div> about </div>
            </div>
            <div style={{display: 'flex'}}> 
                <LucideSearch className={styles.searchSvg} />
                <input className={styles.searchBar} onBlur={() => console.log('search blur')} onFocus={() => console.log('search focus')} type="text" placeholder="Search" /> 
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    )
}

export default SiteHeader;