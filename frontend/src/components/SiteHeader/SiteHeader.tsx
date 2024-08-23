import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../appStore";
import { DEFAULT_AVATAR_URL } from "../../constants";
import { LogOut, Menu, ArrowLeftToLine } from "lucide-react";
import styles from './styles.module.css'
import  Avatar  from "../Common/Avatar";

function SiteHeader() {
    const { currentUser } = useAppStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !(dropdownRef.current as Node).contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const DesktopHeader = () => (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0px 10px 10px 4px',
            marginBottom: '10px'
        }}>
            <Link className={styles.title} to="/">fractal marketplace</Link>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-around',
                fontSize: '24px',
                fontFamily: 'Brygada 1918',
                margin: '0 40px'
            }}>
                <Link style={{color: '#fff9e6', textDecoration: 'none'}} to="/offers">offers</Link>
                <Link style={{color: '#fff9e6', textDecoration: 'none'}} to="/asks">asks</Link>
                <Link style={{color: '#fff9e6', textDecoration: 'none'}} to="/profile">profile</Link>
                <Link style={{color: '#fff9e6', textDecoration: 'none'}} to="/supportus">about</Link>
            </div>
            <UserMenu />
        </header>
    );

    const MobileHeader = () => (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 91%) -15% -15%, rgb(84% 0% 55% / 91%) 132% 132%)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <button onClick={() => setSidebarOpen(true)} style={{
                background: 'none',
                border: 'none',
                color: '#fff9e6',
                fontSize: '24px',
                cursor: 'pointer'
            }}>
                <Menu />
            </button>
            <Link style={{
                fontFamily: 'cursive',
                color: '#fff9e6',
                textDecoration: 'none',
                textShadow: '0 0 3px #fff9e6',
            }} className={styles.title} to="/">fractal marketplace</Link>
            <div style={{ width: '24px' }}></div> {/* Placeholder for balance */}
        </header>
    );

    const Sidebar = () => (
        <>
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    display: sidebarOpen ? 'block' : 'none'
                }}
                onClick={closeSidebar}
            />
            <div ref={sidebarRef} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '220px',
                height: '100%',
                background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 100%) -15% -15%, rgb(84% 0% 55% / 100%) 132% 132%)',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 1001,
                padding: '20px 30px',
            }}>
                <button onClick={closeSidebar} style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#fff9e6',
                    fontSize: '24px',
                    cursor: 'pointer'
                }}>
                    <ArrowLeftToLine size={24} />
                </button>
                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginTop: '50px'
                }}>
                    <Avatar avatarUrl={currentUser?.avatarUrl} userId={currentUser?.id} onClick={() => setSidebarOpen(false)} />
                    <Link style={{color: '#fff9e6', textDecoration: 'none', fontSize: '20px'}} to="/profile" onClick={() => setSidebarOpen(false)}>profile</Link>
                    <Link style={{color: '#fff9e6', textDecoration: 'none', fontSize: '20px'}} to="/" onClick={() => setSidebarOpen(false)}>front page</Link>
                    <Link style={{color: '#fff9e6', textDecoration: 'none', fontSize: '20px'}} to="/offers" onClick={() => setSidebarOpen(false)}>offers</Link>
                    <Link style={{color: '#fff9e6', textDecoration: 'none', fontSize: '20px'}} to="/asks" onClick={() => setSidebarOpen(false)}>asks</Link>
                    <Link style={{color: '#fff9e6', textDecoration: 'none', fontSize: '20px'}} to="/supportus" onClick={() => setSidebarOpen(false)}>about</Link>
                    <SignedIn>
                        <SignOutButton>
                             <div style={{fontSize: "20px", display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => setSidebarOpen(false)}> log out <LogOut size={20} /> </div> 
                            
                        </SignOutButton>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <button style={{
                                background: 'linear-gradient(to left, #1a1a66, #2a2a88)',
                                color: '#fff9e6',
                                border: '1px solid #fff9e6',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                textShadow: '0 0 6px #fff9e6'
                            }} onClick={() => setSidebarOpen(false)}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                </nav>
            </div>
        </>
    );

    const UserMenu = () => (
        <div style={{display: 'flex'}}>
            <SignedIn>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                    <img 
                        src={currentUser?.avatarUrl || DEFAULT_AVATAR_URL} 
                        alt="User avatar" 
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '100%',
                            cursor: 'pointer'
                        }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: '#fff',
                            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                            zIndex: 1,
                            borderRadius: '4px',
                            marginTop: '8px'
                        }}>
                            <SignOutButton>
                                <button style={{
                                    background: '#f5f5f5',
                                    color: '#544bcc',
                                    border: '1px solid #d3d3d3',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    gap: '8px',
                                    display: 'flex',
                                    fontSize: '16px',
                                    textShadow: '0 0 6px #d3d3d3',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>Sign Out <LogOut size={16} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} /></button>
                            </SignOutButton>
                        </div>
                    )}
                </div>
            </SignedIn>
            <SignedOut>
                <SignInButton>
                    <button style={{
                        background: 'linear-gradient(to left, #1a1a66, #2a2a88)',
                        color: '#fff9e6',
                        border: '1px solid #fff9e6',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        textShadow: '0 0 6px #fff9e6',
                        marginLeft: '20px'
                    }}>Sign In</button>
                </SignInButton>
            </SignedOut>
        </div>
    );

    return (
        <>
            <div className={styles.desktopHeader}>
                <DesktopHeader />
            </div>
            <div className={styles.mobileHeader}>
                <MobileHeader />
                <Sidebar />
            </div>
        </>
    );
}

export default SiteHeader;