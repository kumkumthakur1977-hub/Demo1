"use client";

import BottomNav from "@/components/BottomNav";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

// --- SYSTEM DIAGNOSTIC ICONS ---
const IconTrendingUp = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const IconPieChart = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
);

const IconLayers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 22"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
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

export default function ReportsPage() {
    // --- GLOBAL LICENSE EXPIRES CHECKPOINT ---
    useEffect(() => {
        const savedExpiry = localStorage.getItem("profile_expiry_date") || "2026-06-01";
        const today = new Date().toISOString().split('T')[0];
        if (today > savedExpiry) {
            window.location.href = "/dashboard/profile";
        }
    }, []);

    const salesHistory = useLiveQuery(() => db.sales.toArray()) || [];
    const totalProductsCount = useLiveQuery(() => db.products.count()) || 0;

    const [p, setP] = useState(0);

    useEffect(() => {
        const t = [
            setTimeout(() => setP(1), 50),
            setTimeout(() => setP(2), 140),
            setTimeout(() => setP(3), 260),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    // --- REVENUE & ANALYTICS CALCULATION PARSER ---
    const totalRevenue = salesHistory.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalInvoicesCount = salesHistory.length;

    // Aggregate product sales to extract top velocity moving items
    const productSalesMap: { [key: string]: { qty: number; totalSalesVal: number; unit: string } } = {};

    salesHistory.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach((item: any) => {
                if (!productSalesMap[item.name]) {
                    productSalesMap[item.name] = { qty: 0, totalSalesVal: 0, unit: item.unit || "kg" };
                }
                productSalesMap[item.name].qty += item.qty || 0;
                productSalesMap[item.name].totalSalesVal += (item.price * item.qty) || 0;
            });
        }
    });

    const topSellingProducts = Object.entries(productSalesMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.totalSalesVal - a.totalSalesVal)
        .slice(0, 5); // Limit matrix view to top 5 items

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
                .d1 { transition-delay: 0.0s; } .d2 { transition-delay: 0.1s; } .d3 { transition-delay: 0.2s; }

                .reports-hdr { padding: 64px 22px 16px; }
                .main-title { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -0.8px; }
                .sub-title { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

                /* ── STATS HERO OVERVIEW STRIP ── */
                .hero-analytics-card { margin: 12px 16px 0; background: rgba(0,0,0,0.38); border: 1px solid rgba(255,255,255,0.15); border-radius: 28px; padding: 24px 20px; backdrop-filter: blur(24px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
                .rev-eyebrow { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.2px; display: flex; align-items: center; gap: 6px; }
                .rev-huge-val { font-size: 38px; font-weight: 900; color: #fff; letter-spacing: -1.5px; margin: 6px 0 16px; }
                
                .split-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
                .mini-stat-box { display: flex; flex-direction: column; gap: 2px; }
                .mini-lbl { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; }
                .mini-val { font-size: 18px; font-weight: 800; color: #ffd060; }

                /* ── DATA LISTING CONTAINER CARDS ── */
                .report-card { margin: 14px 16px 0; background: rgba(0,0,0,0.24); border: 1px solid rgba(255,255,255,0.11); border-radius: 24px; padding: 20px; backdrop-filter: blur(28px); }
                .section-lbl { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
                
                .report-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .report-row:last-child { border-bottom: none; padding-bottom: 0; }
                
                .row-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
                .row-title { font-size: 14px; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .row-subtitle { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 4px; }
                .row-right { text-align: right; font-size: 14px; font-weight: 800; color: #ffd060; min-width: 80px; }
                
                .empty-state { padding: 30px 0; text-align: center; color: rgba(255,255,255,0.3); font-size: 13px; font-weight: 600; }
            `}</style>

            <div className="r">
                {/* BRAND HEADER TITLE BLOCK */}
                <div className={`reports-hdr fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <h1 className="main-title">Business Reports</h1>
                    <div className="sub-title">Real-time ledger analytics & sales velocities</div>
                </div>

                {/* REVENUE OVERVIEW SUMMARY HERO */}
                <div className={`hero-analytics-card fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    <div className="rev-eyebrow"><IconTrendingUp /> Accumulated Gross Revenue</div>
                    <div className="rev-huge-val">₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>

                    <div className="split-stats-grid">
                        <div className="mini-stat-box">
                            <span className="mini-lbl">Invoices Raised</span>
                            <span className="mini-val">{totalInvoicesCount} Receipts</span>
                        </div>
                        <div className="mini-stat-box">
                            <span className="mini-lbl">Tracked Catalog Items</span>
                            <span className="mini-val">{totalProductsCount} Products</span>
                        </div>
                    </div>
                </div>

                {/* TOP VELOCITY PRODUCT SCORING MODULE */}
                <div className={`report-card fade-up d3 ${p >= 3 ? "in" : ""}`}>
                    <div className="section-lbl"><IconPieChart /> Top Performing Products</div>

                    {topSellingProducts.length === 0 ? (
                        <div className="empty-state">No transaction records logged to compute item metrics.</div>
                    ) : (
                        topSellingProducts.map((prod, index) => (
                            <div className="report-row" key={`top-${index}`}>
                                <div className="row-left">
                                    <span className="row-title">{index + 1}. {prod.name}</span>
                                    <span className="row-subtitle">Total Volume: {formatWeightUnits(prod.qty, prod.unit)}</span>
                                </div>
                                <div className="row-right">
                                    ₹{prod.totalSalesVal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RECENT INVOICE CHRONOLOGY LEDGER MODULE */}
                <div className={`report-card fade-up d3 ${p >= 3 ? "in" : ""}`} style={{ marginBottom: '24px' }}>
                    <div className="section-lbl"><IconLayers /> Recent Transactions Ledger</div>

                    {salesHistory.length === 0 ? (
                        <div className="empty-state">No invoice entries discovered in database.</div>
                    ) : (
                        [...salesHistory].reverse().slice(0, 5).map((sale, idx) => (
                            <div className="report-row" key={`sale-${idx}`}>
                                <div className="row-left">
                                    <span className="row-title">{sale.customerName || "Walking Customer"}</span>
                                    <span className="row-subtitle">
                                        <IconCalendar />
                                        {sale.date ? new Date(sale.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                    </span>
                                </div>
                                <div className="row-right" style={{ color: '#fff' }}>
                                    ₹{sale.total?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <BottomNav />
            </div>
        </>
    );
}