"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// --- SYSTEM ICON VECTOR DESIGNS ---
const IconHome = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,140,0,0.2)" : "none"} stroke={active ? "#ffd060" : "rgba(255,255,255,0.45)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const IconReceipt = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,140,0,0.2)" : "none"} stroke={active ? "#ffd060" : "rgba(255,255,255,0.45)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
        <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2Z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
);

const IconInventory = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,140,0,0.2)" : "none"} stroke={active ? "#ffd060" : "rgba(255,255,255,0.45)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8Z" />
        <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
);

const IconProfile = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,140,0,0.2)" : "none"} stroke={active ? "#ffd060" : "rgba(255,255,255,0.45)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", path: "/dashboard", icon: (active: boolean) => <IconHome active={active} /> },
        { label: "Billing", path: "/dashboard/new-bill", icon: (active: boolean) => <IconReceipt active={active} /> },
        { label: "Stock", path: "/dashboard/inventory", icon: (active: boolean) => <IconInventory active={active} /> },
        { label: "Profile", path: "/dashboard/profile", icon: (active: boolean) => <IconProfile active={active} /> },
    ];

    return (
        <>
            <style>{`
                .nav-container {
                    position: fixed;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    max-width: 430px;
                    background: rgba(20, 6, 1, 0.72);
                    border-top: 1px solid rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 12px 10px calc(12px + env(safe-area-inset-bottom, 0px));
                    z-index: 90;
                    box-shadow: 0 -10px 40px rgba(0,0,0,0.35);
                }

                .nav-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    text-decoration: none;
                    flex: 1;
                    height: 48px;
                    -webkit-tap-highlight-color: transparent;
                    transition: transform 0.1s ease;
                }

                .nav-link:active {
                    transform: scale(0.92);
                }

                .nav-label {
                    font-size: 10.5px;
                    font-weight: 700;
                    letter-spacing: 0.2px;
                    color: rgba(255, 255, 255, 0.4);
                    transition: color 0.2s ease;
                }

                .nav-link.active .nav-label {
                    color: #ffd060;
                    text-shadow: 0 0 10px rgba(255, 208, 96, 0.2);
                }

                .active-dot {
                    width: 4px;
                    height: 4px;
                    background: #ff6a00;
                    border-radius: 50%;
                    margin-top: -1px;
                    box-shadow: 0 0 6px #ff6a00;
                    animation: pop-dot 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes pop-dot {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <nav className="nav-container">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-link ${isActive ? "active" : ""}`}
                        >
                            {item.icon(isActive)}
                            <span className="nav-label">{item.label}</span>
                            {isActive && <span className="active-dot" />}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}