import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { LucideSearch } from "lucide-react";
import { Link } from "react-router-dom";

import styles from './styles.module.css'

function SiteHeader() {
    return (
        <header className={styles.siteHeader}>
            <div className={styles.title}>fractal marketplace</div>
            <div className={styles.navBar}>
                <Link className={styles.navLink} to="/offers">offers</Link>
                <Link className={styles.navLink} to="/asks">asks</Link>
                <Link className={styles.navLink} to="/profile">profile</Link>
                <Link className={styles.navLink} to="/supportus">about</Link>
            </div>
            <div className={styles.searchDiv}> 
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