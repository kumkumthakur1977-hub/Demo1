"use client";

import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";

// --- SYSTEM COMPONENT GRAPHICS ---
const IconShieldAlert = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const IconShieldCheck = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 11 11 13 15 9"></polyline>
    </svg>
);

const IconKey = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
);

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export default function ProfilePage() {
    const [p, setP] = useState(0);
    const [expiryDate, setExpiryDate] = useState("2026-06-01");
    const [isLocked, setIsLocked] = useState(false);
    const [licenseInput, setLicenseInput] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

    // --- INITIAL ANALYTICAL LOAD BALANCE SYNC ---
    useEffect(() => {
        // Hydrate expiry milestone timestamp bounds safely from client browser state
        const savedExpiry = localStorage.getItem("profile_expiry_date") || "2026-06-01";
        setExpiryDate(savedExpiry);

        const today = new Date().toISOString().split('T')[0];
        if (today > savedExpiry) {
            setIsLocked(true);
        }

        const t = [
            setTimeout(() => setP(1), 50),
            setTimeout(() => setP(2), 150),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    // --- LICENSE REGISTRATION DECODING ENGINE ---
    const handleActivateKey = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        const cleanKey = licenseInput.trim();

        if (!cleanKey) {
            return setMessage({ text: "Please input an activation code string.", type: "error" });
        }

        // Hardcoded matching patterns for system license profiles
        let computationalMonthsToAdd = 0;
        if (cleanKey === "MITHAPUR-GROW-30") {
            computationalMonthsToAdd = 1;
        } else if (cleanKey === "MITHAPUR-BIZ-180") {
            computationalMonthsToAdd = 6;
        } else if (cleanKey === "MITHAPUR-PREMIUM-365") {
            computationalMonthsToAdd = 12;
        } else {
            return setMessage({ text: "Invalid license key pattern sequence. Please cross-check.", type: "error" });
        }

        // Calculate dynamic programmatic timeline target bounds forward from current checkpoint date
        const baseDate = isLocked ? new Date() : new Date(expiryDate);
        baseDate.setMonth(baseDate.getMonth() + computationalMonthsToAdd);

        const freshlyExtendedDateStr = baseDate.toISOString().split('T')[0];

        // Commit configuration variables permanently to client system registries
        localStorage.setItem("profile_expiry_date", freshlyExtendedDateStr);
        setExpiryDate(freshlyExtendedDateStr);
        setIsLocked(false);
        setLicenseInput("");
        setMessage({
            text: `Success! License extended by ${computationalMonthsToAdd} Month(s). Valid until ${freshlyExtendedDateStr}.`,
            type: "success"
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: #1a0800; }
                
                .r { 
                    max-width: 430px; 
                    margin: 0 auto; 
                    min-height: 100svh; 
                    position: relative; 
                    padding-bottom: 120px; 
                    background: 
                        radial-gradient(ellipse 80% 40% at 85% 8%, rgba(120,40,160,0.55) 0%, transparent 60%), 
                        radial-gradient(ellipse 60% 50% at 15% 25%, rgba(200,30,30,0.4) 0%, transparent 55%), 
                        radial-gradient(ellipse 90% 60% at 50% 55%, rgba(255,90,0,0.35) 0%, transparent 70%), 
                        linear-gradient(170deg, #f1fa79e1 0%, #f1b05ae1 18%, #d93a00 38%, #ff5e00ff 58%, #e8920a 78%, #c97a08 100%); 
                }

                .fade-up { opacity: 0; transform: translateY(22px); transition: opacity 0.4s cubic-bezier(.22,1,.36,1), transform 0.4s cubic-bezier(.22,1,.36,1); }
                .fade-up.in { opacity: 1; transform: translateY(0); }
                .d1 { transition-delay: 0.0s; } .d2 { transition-delay: 0.1s; }

                .prof-hdr { padding: 64px 22px 14px; }
                .main-title { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -0.8px; }
                .sub-title { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

                /* ── PROTECTION LOCKOUT DISPLAY BANNER STYLES ── */
                .status-display-card { margin: 12px 16px 0; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.13); border-radius: 26px; padding: 22px 20px; backdrop-filter: blur(24px); box-shadow: 0 12px 40px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 16px; }
                .status-display-card.lockout { background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.28); }
                .status-meta-zone { display: flex; flex-direction: column; gap: 3px; }
                .status-verdict { font-size: 16px; font-weight: 800; color: #fff; }
                .status-subtext { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 5px; }

                /* ── LICENSE RENEWAL MATRIX SUBELEMENT CONTAINER ── */
                .activation-wrapper-card { margin: 14px 16px 0; background: rgba(0,0,0,0.24); border: 1px solid rgba(255,255,255,0.11); border-radius: 24px; padding: 22px 20px; backdrop-filter: blur(28px); }
                .section-eyebrow { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
                
                .form-layout { display: flex; flex-direction: column; gap: 12px; }
                .key-input-element { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; color: #fff; font-size: 14px; font-weight: 700; outline: none; letter-spacing: 0.5px; text-transform: uppercase; }
                .key-input-element::placeholder { color: rgba(255,255,255,0.2); text-transform: none; font-weight: 500; }
                
                .btn-submit-action { background: linear-gradient(135deg, #ff7e00, #d93a00); border: none; border-radius: 12px; padding: 14px; font-size: 12px; font-weight: 800; color: #fff; text-transform: uppercase; cursor: pointer; letter-spacing: 0.3px; }
                
                /* FEEDBACK ALERT CHANNELS */
                .feedback-container { padding: 12px; border-radius: 10px; font-size: 12px; font-weight: 600; line-height: 1.4; text-align: center; }
                .feedback-container.error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.25); color: #f87171; }
                .feedback-container.success { background: rgba(74, 222, 128, 0.15); border: 1px solid rgba(74, 222, 128, 0.25); color: #4ade80; }

                /* CRITICAL SYSTEM BANNER IF INTERFACE LOCKED OUT */
                .lock-alert-banner { background: #cf2a2a; color: #fff; padding: 12px; border-radius: 14px; font-size: 12px; font-weight: 700; text-align: center; margin: 14px 16px 0; border: 1px solid rgba(255,255,255,0.2); }
            `}</style>

            <div className="r">
                {/* INTERFACE BRAND LAYER GRAPHIC HEADER */}
                <div className={`prof-hdr fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <h1 className="main-title">Profile Account</h1>
                    <div className="sub-title">Terminal license compliance security registers</div>
                </div>

                {/* CRITICAL ATTENTION LOCK BANNER FOR IMMEDIATE ACTIONS */}
                {isLocked && (
                    <div className="lock-alert-banner fade-up d1 in">
                        ⚠️ SOFTWARE LOCKOUT TRIGGERED: Please input an activation passkey below to recover core business operations dashboards.
                    </div>
                )}

                {/* REALTIME SYSTEM AUDIT STATE GRAPHIC SHEET CONTAINER */}
                <div className={`status-display-card ${isLocked ? "lockout" : ""} fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <div>
                        {isLocked ? <IconShieldAlert /> : <IconShieldCheck />}
                    </div>
                    <div className="status-meta-zone">
                        <span className="status-verdict">
                            {isLocked ? "License Access Suspended" : "Active & Verified"}
                        </span>
                        <span className="status-subtext" style={{ color: isLocked ? "#f87171" : "rgba(255,255,255,0.45)" }}>
                            <IconCalendar /> Expiration Bound: {expiryDate}
                        </span>
                    </div>
                </div>

                {/* INTERACTIVE COMPLIANCE PASSCODE DISPATCHER LAYER */}
                <div className={`activation-wrapper-card fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    <div className="section-eyebrow"><IconKey /> Software License Management</div>

                    <form className="form-layout" onSubmit={handleActivateKey}>
                        <input
                            type="text"
                            className="key-input-element"
                            placeholder="Enter 16-digit alphanumeric token..."
                            value={licenseInput}
                            onChange={(e) => setLicenseInput(e.target.value)}
                        />
                        <button type="submit" className="btn-submit-action">
                            Validate Activation Key
                        </button>
                    </form>

                    {message.text && (
                        <div style={{ marginTop: '14px' }}>
                            <div className={`feedback-container ${message.type}`}>
                                {message.text}
                            </div>
                        </div>
                    )}
                </div>

                {/* BACK NAVIGATION BLOCK COMPONENT */}
                <BottomNav />
            </div>
        </>
    );
}