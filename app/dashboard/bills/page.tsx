"use client";

import BottomNav from "@/components/BottomNav";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

// --- SYSTEM MATRIX GRAPHIC UTILS ---
const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const IconChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const IconChevronUp = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const IconPhone = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

export default function BillsHistoryPage() {
    // --- GLOBAL LICENSE STATUS COMPLIANCE AGENT ---
    useEffect(() => {
        const savedExpiry = localStorage.getItem("profile_expiry_date") || "2026-06-01";
        const today = new Date().toISOString().split('T')[0];
        if (today > savedExpiry) {
            window.location.href = "/dashboard/profile";
        }
    }, []);

    const salesHistory = useLiveQuery(() => db.sales.toArray()) || [];

    const [p, setP] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedBillId, setExpandedBillId] = useState<number | null>(null);

    useEffect(() => {
        const t = [
            setTimeout(() => setP(1), 50),
            setTimeout(() => setP(2), 150),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    const toggleExpandBill = (id: number) => {
        setExpandedBillId(expandedBillId === id ? null : id);
    };

    // Filter list chronologically while evaluating matching phone/name patterns
    const filteredBills = salesHistory
        .filter(bill => {
            const query = searchQuery.toLowerCase();
            return (
                (bill.customerName || "Walking Customer").toLowerCase().includes(query) ||
                (bill.customerPhone || "").includes(query)
            );
        })
        .reverse(); // Newest receipts appear first in lineage layout list

    const formatWeightUnits = (qty: number, unit: string) => {
        if (unit !== "kg") return `${qty} ${unit}`;
        if (qty < 1) return `${Math.round(qty * 1000)}g`;
        const wholeKg = Math.floor(qty);
        const remGrams = Math.round((qty - wholeKg) * 1000);
        return remGrams > 0 ? `${wholeKg}kg ${remGrams}g` : `${wholeKg}kg`;
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

                .bills-hdr { padding: 64px 22px 14px; }
                .main-title { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -0.8px; }
                .sub-title { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

                /* ── SEARCH STRIP CONTROLS ── */
                .search-card-wrapper { margin: 0 16px 14px; position: relative; display: flex; align-items: center; }
                .search-bar-input { width: 100%; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.13); border-radius: 16px; padding: 14px 14px 14px 42px; color: #fff; font-size: 14px; outline: none; backdrop-filter: blur(20px); }
                .search-bar-input::placeholder { color: rgba(255,255,255,0.25); }
                .search-icon-pos { position: absolute; left: 16px; display: flex; align-items: center; }

                /* ── BILL INVOICE CARD ELEMENT LAYOUTS ── */
                .ledger-list { display: flex; flex-direction: column; gap: 10px; margin: 0 16px; }
                .bill-card { background: rgba(0,0,0,0.24); border: 1px solid rgba(255,255,255,0.11); border-radius: 22px; padding: 16px; backdrop-filter: blur(24px); cursor: pointer; transition: background 0.2s ease; }
                .bill-card:active { background: rgba(0,0,0,0.35); }
                
                .bill-summary-row { display: flex; justify-content: space-between; align-items: center; }
                .bill-info-block { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
                
                .cust-name-line { font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .cust-phone-line { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 4px; }
                
                .bill-financials { text-align: right; display: flex; align-items: center; gap: 12px; margin-left: 10px; }
                .price-total-text { font-size: 16px; font-weight: 800; color: #ffd060; }
                .toggle-arrow { color: rgba(255,255,255,0.3); display: flex; align-items: center; }

                /* ── EXPANDABLE CART DROPDOWN MATRIX ── */
                .bill-dropdown-drawer { border-top: 1px dashed rgba(255,255,255,0.08); margin-top: 14px; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
                .dropdown-item-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: rgba(255,255,255,0.8); }
                .drop-item-title { font-weight: 600; color: #fff; }
                .drop-item-calc { font-size: 11px; color: rgba(255,255,255,0.4); margin-left: 6px; }
                .drop-item-total { font-weight: 700; color: #ffd060; }
                
                .bill-stamp-footer { font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 600; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
                .empty-history { text-align: center; color: rgba(255,255,255,0.35); font-size: 14px; padding: 40px 0; font-weight: 600; }
            `}</style>

            <div className="r">
                {/* COMPONENT TITLE DESCRIPTOR AREA */}
                <div className={`bills-hdr fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <h1 className="main-title">Sales History</h1>
                    <div className="sub-title">Review, inspect, and audit archived sales statements</div>
                </div>

                {/* FILTER SEARCH INPUT NODE */}
                <div className={`search-card-wrapper fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <span className="search-icon-pos"><IconSearch /></span>
                    <input
                        type="text"
                        className="search-bar-input"
                        placeholder="Search by client name or phone number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* INTERACTIVE CHRONOLOGY TIMELINE */}
                <div className={`ledger-list fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    {filteredBills.length === 0 ? (
                        <div className="empty-history">
                            {salesHistory.length === 0 ? "No invoices found in database." : "No matching invoices found."}
                        </div>
                    ) : (
                        filteredBills.map((bill) => {
                            const isExpanded = expandedBillId === bill.id;
                            return (
                                <div
                                    className="bill-card"
                                    key={bill.id}
                                    onClick={() => toggleExpandBill(bill.id!)}
                                >
                                    <div className="bill-summary-row">
                                        <div className="bill-info-block">
                                            <span className="cust-name-line">
                                                <IconUser /> {bill.customerName || "Walking Customer"}
                                            </span>
                                            {bill.customerPhone && bill.customerPhone !== "N/A" && (
                                                <span className="cust-phone-line">
                                                    <IconPhone /> {bill.customerPhone}
                                                </span>
                                            )}
                                        </div>
                                        <div className="bill-financials">
                                            <span className="price-total-text">
                                                ₹{bill.total?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="toggle-arrow">
                                                {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* COLLAPSIBLE CONTAINER SHEET DROPDOWN */}
                                    {isExpanded && (
                                        <div className="bill-dropdown-drawer" onClick={(e) => e.stopPropagation()}>
                                            {bill.items && bill.items.map((item: any, idx: number) => (
                                                <div className="dropdown-item-row" key={`${bill.id}-item-${idx}`}>
                                                    <div>
                                                        <span className="drop-item-title">{item.name}</span>
                                                        <span className="drop-item-calc">
                                                            ({formatWeightUnits(item.qty, item.unit)} &times; ₹{item.price})
                                                        </span>
                                                    </div>
                                                    <span className="drop-item-total">
                                                        ₹{(item.price * item.qty).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}

                                            <div className="bill-stamp-footer">
                                                Timestamp: {bill.date ? new Date(bill.date).toLocaleString("en-IN") : "N/A"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <BottomNav />
            </div>
        </>
    );
}