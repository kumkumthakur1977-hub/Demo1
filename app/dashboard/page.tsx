"use client";

import BottomNav from "@/components/BottomNav";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- SYSTEM ICON VECTORS ---
const IconReceipt = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2Z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
);
const IconList = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
);
const IconChart = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 4 4 4-7" />
    </svg>
);
const IconBox = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8Z" />
        <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
);
const IconArrow = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);
const IconFlame = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,220,100,0.9)" stroke="none">
        <path d="M12 2C9 7 6 8 6 13a6 6 0 0012 0c0-3-1.5-5-3-6-0.5 2-1.5 3-3 3 0-2 0-5 0-8z" />
    </svg>
);
const IconDownload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);
const IconUpload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export default function Dashboard() {
    const router = useRouter();

    // Live reactive database bindings
    const products = useLiveQuery(() => db.products.toArray());
    const sales = useLiveQuery(() => db.sales.toArray());

    // Safe client-side states to prevent Next.js hydration mismatches
    const [baseRevenue, setBaseRevenue] = useState(0);
    const [p, setP] = useState(0);

    // FIXED: Initial value altered from 125000 directly down to 0
    const currentSalesTotal = sales?.reduce((s, x) => s + x.total, 0) || 0;
    const totalSales = baseRevenue + currentSalesTotal;

    const totalProducts = products?.length || 0;
    const totalBills = sales?.length || 0;

    useEffect(() => {
        // Safe read from client environment after component mounts
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mithapur_revenue_base") || "0";
            setBaseRevenue(parseFloat(stored));
        }

        // Staggered interface component animation delay routines
        const t = [
            setTimeout(() => setP(1), 60),
            setTimeout(() => setP(2), 200),
            setTimeout(() => setP(3), 340),
            setTimeout(() => setP(4), 460),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    // --- SYSTEM UTILITIES: DATA PERSISTENCE RUNTIMES ---
    const handleGetBackup = async () => {
        const allProducts = await db.products.toArray();
        const allSales = await db.sales.toArray();

        const packageData = {
            products: allProducts,
            sales: allSales,
            revenueBase: baseRevenue.toString(),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `Mithapur_Store_Backup_${new Date().toISOString().split('T')[0]}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetFile = e.target.files?.[0];
        if (!targetFile) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const packageObj = JSON.parse(evt.target?.result as string);
                if (!packageObj.products || !Array.isArray(packageObj.products)) {
                    return alert("Invalid backup layout mapping data structure.");
                }

                if (confirm("CRITICAL: Restoring completely replaces your live database collections. Proceed?")) {
                    await db.products.clear();
                    await db.sales.clear();

                    await db.products.bulkAdd(packageObj.products);
                    if (packageObj.sales && Array.isArray(packageObj.sales)) {
                        await db.sales.bulkAdd(packageObj.sales);
                    }
                    if (packageObj.revenueBase) {
                        localStorage.setItem("mithapur_revenue_base", packageObj.revenueBase);
                        setBaseRevenue(parseFloat(packageObj.revenueBase));
                    }
                    alert("Database successfully synchronized!");
                    window.location.reload();
                }
            } catch (err) {
                alert("Failed to extract configuration matrix layers from file.");
            }
        };
        reader.readAsText(targetFile);
    };

    const handleEndDayCloseOut = async () => {
        if (totalBills === 0) return alert("System failure: Zero processing entries found on active ledger nodes.");
        if (!confirm("Complete daily process closure? Your data updates to an offline reference file, clears out current lists, and locks down revenue bases safely.")) return;

        const allProducts = await db.products.toArray();
        const allSales = await db.sales.toArray();
        const finalCalculatedRevenue = baseRevenue + currentSalesTotal;

        const closureSnapshot = {
            products: allProducts,
            sales: allSales,
            revenueBase: finalCalculatedRevenue.toString(),
            timestamp: new Date().toISOString(),
            type: "daily_closure_archive"
        };

        const blob = new Blob([JSON.stringify(closureSnapshot, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `Day_Closure_Ledger_${new Date().toISOString().split('T')[0]}.json`;
        anchor.click();
        URL.revokeObjectURL(url);

        localStorage.setItem("mithapur_revenue_base", finalCalculatedRevenue.toString());
        setBaseRevenue(finalCalculatedRevenue);
        await db.sales.clear();

        alert("Operational sequence complete! Operational arrays refreshed safely.");
    };

    // SYSTEM UTILITY FORCE RESETS CACHED REVENUE DATA
    const handleResetBaseRevenue = () => {
        if (confirm("Reset cumulative tracking revenue completely back to ₹0? This clears stale browser storage records.")) {
            localStorage.setItem("mithapur_revenue_base", "0");
            setBaseRevenue(0);
            alert("Revenue tracking parameters dropped to zero baseline layout state.");
        }
    };

    // Quick Action Array Maps linking operational functional component states
    const actions = [
        { icon: <IconReceipt />, label: "New Bill", sub: "Create invoice", path: "/dashboard/new-bill" },
        { icon: <IconList />, label: "All Bills", sub: "View history", path: "/dashboard/bills" },
        { icon: <IconChart />, label: "Reports", sub: "Analytics", path: "/dashboard/reports" },
        { icon: <IconBox />, label: "Inventory", sub: "Manage stock", path: "/dashboard/inventory" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #1a0800;
        }
 
        /* ── FULL FIRE CANVAS ── */
        .r {
          max-width: 430px;
          margin: 0 auto;
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          padding-bottom: 100px;
          background:
            radial-gradient(ellipse 80% 40% at 85% 8%, rgba(120,40,160,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 15% 25%, rgba(200,30,30,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 90% 60% at 50% 55%, rgba(255,90,0,0.35) 0%, transparent 70%),
            linear-gradient(170deg,
              #f1fa79e1 0%,
              #f1b05ae1 18%,
              #d93a00 38%,
              #ff5e00ff 58%,
              #e8920a 78%,
              #c97a08 100%
            );
        }
 
        .r::before {
          content: '';
          position: absolute;
          top: -100px; right: -80px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,140,0,0.13) 0%, transparent 65%);
          pointer-events: none;
        }
        .r::after {
          content: '';
          position: absolute;
          bottom: 60px; left: -100px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220,30,0,0.10) 0%, transparent 65%);
          pointer-events: none;
        }
 
        /* ── UTILITY STRIP CONTAINER SYSTEM ── */
        .sys-util-strip { display: flex; gap: 6px; margin: 44px 16px -24px; position: relative; z-index: 10; }
        .util-pill { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.22); border-radius: 12px; padding: 10px 6px; font-size: 11px; font-weight: 700; color: #fff; cursor: pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: transform 0.12s ease; }
        .util-pill:active { transform: scale(0.96); background: rgba(0,0,0,0.4); }
        .util-pill.close-day { background: rgba(255,80,0,0.25); border-color: rgba(255,200,60,0.4); color: #ffdca0; }
        .util-pill.reset-db { background: rgba(230,30,30,0.22); border-color: rgba(255,100,100,0.3); color: #ffb0b0; max-width: 44px; }

        /* ── TRANSITIONS ── */
        .fade-up {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.44s cubic-bezier(.22,1,.36,1),
                      transform 0.44s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.00s !important; }
        .d2 { transition-delay: 0.12s !important; }
        .d3 { transition-delay: 0.24s !important; }
        .d4 { transition-delay: 0.36s !important; }
 
        /* ── HEADER ── */
        .hdr { padding: 54px 22px 0; }
 
        .live-pill {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.18);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.80);
          letter-spacing: 1.3px; text-transform: uppercase;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ffd060;
          box-shadow: 0 0 6px 2px rgba(255,200,0,0.6);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
 
        .store-name {
          font-size: 28px; font-weight: 900;
          color: #fff; letter-spacing: -1px; line-height: 1.15;
          text-shadow: 0 2px 20px rgba(0,0,0,0.30);
        }
        .store-sub {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.52);
          margin-top: 4px;
        }
 
        /* ── REVENUE CARD ── */
        .rev-card {
          margin: 24px 16px 0;
          background: rgba(0,0,0,0.30);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 26px;
          padding: 26px 24px 22px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
        }
 
        .rev-eyebrow {
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1.6px; text-transform: uppercase;
          margin-bottom: 10px;
        }
 
        .rev-row { display: flex; align-items: flex-end; gap: 0; }
 
        .rev-symbol {
          font-size: 26px; font-weight: 800;
          color: rgba(255,255,255,0.65);
          line-height: 1; margin-bottom: 6px; margin-right: 4px;
        }
 
        .rev-amount {
          font-size: 54px; font-weight: 900;
          color: #fff; letter-spacing: -3px; line-height: 1;
        }
 
        .rev-divider {
          height: 1px;
          background: rgba(255,255,255,0.10);
          margin: 18px 0 14px;
        }
 
        .rev-footer {
          display: flex; align-items: center;
          justify-content: space-between;
        }
 
        .rev-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,210,60,0.18);
          border: 1px solid rgba(255,210,60,0.28);
          border-radius: 100px; padding: 4px 11px;
          font-size: 11px; font-weight: 700;
          color: rgba(255,230,130,0.95);
        }
 
        .rev-location {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.35);
        }
 
        /* ── STAT ROW ── */
        .stat-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin: 10px 16px 0;
        }
 
        .stat-card {
          background: rgba(0,0,0,0.26);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 20px;
          padding: 18px 18px 16px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
        }
 
        .stat-val {
          font-size: 30px; font-weight: 900;
          color: #fff; letter-spacing: -1.2px; line-height: 1;
        }
        .stat-lbl {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-top: 5px;
        }
 
        /* ── SECTION LABEL ── */
        .sec-lbl {
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.32);
          letter-spacing: 1.8px; text-transform: uppercase;
          margin: 22px 20px 10px;
        }
 
        /* ── ACTION GRID ── */
        .act-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin: 0 16px;
        }
 
        .act-btn {
          background: rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 22px;
          padding: 20px 16px 18px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.09);
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: flex-start;
          gap: 0;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
          position: relative; overflow: hidden;
          width: 100%;
          text-align: left;
        }
        .act-btn:active {
          transform: scale(0.94);
          background: rgba(0,0,0,0.44);
          box-shadow: 0 2px 10px rgba(0,0,0,0.30);
        }
 
        .act-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 12px; right: 12px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        }
 
        .icon-slot {
          width: 50px; height: 50px;
          border-radius: 14px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
        }
 
        .act-lbl {
          font-size: 15px; font-weight: 800;
          color: #fff; letter-spacing: -0.3px;
          line-height: 1;
        }
        .act-sub {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.38);
          margin-top: 4px; line-height: 1;
        }
 
        .act-arrow {
          position: absolute; bottom: 16px; right: 16px;
          opacity: 0.5;
        }
      `}</style>

            <div className="r">

                {/* MANAGEMENT AND MAINTENANCE ROW CONTROL MATRIX */}
                <div className={`sys-util-strip fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <button type="button" className="util-pill" onClick={handleGetBackup}>
                        <IconDownload /> Backup
                    </button>
                    <label className="util-pill" style={{ margin: 0 }}>
                        <IconUpload /> Restore
                        <input type="file" accept=".json" onChange={handleRestoreBackup} style={{ display: 'none' }} />
                    </label>
                    <button type="button" className="util-pill close-day" onClick={handleEndDayCloseOut}>
                        💥 End Day
                    </button>
                    <button type="button" className="util-pill reset-db" title="Reset Total Revenue" onClick={handleResetBaseRevenue}>
                        <IconTrash />
                    </button>
                </div>

                {/* HEADER */}
                <div className={`hdr fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <div className="live-pill">
                        <span className="live-dot" /> Live Dashboard
                    </div>
                    <div className="store-name">Mithapur Grocery</div>
                    <div className="store-sub">Smart Billing System</div>
                </div>

                {/* REVENUE */}
                <div className={`rev-card fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    <div className="rev-eyebrow">Total Revenue</div>
                    <div className="rev-row">
                        <span className="rev-symbol">₹</span>
                        <span className="rev-amount">{totalSales.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="rev-divider" />
                    <div className="rev-footer">
                        <div className="rev-badge">
                            <IconFlame /> All time earnings
                        </div>
                        <div className="rev-location">Mithapur · Patna</div>
                    </div>
                </div>

                {/* STATS */}
                <div className={`stat-row fade-up d3 ${p >= 3 ? "in" : ""}`}>
                    <div className="stat-card">
                        <div className="stat-val">{totalProducts}</div>
                        <div className="stat-lbl">Products</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-val">{totalBills}</div>
                        <div className="stat-lbl">Invoices</div>
                    </div>
                </div>

                {/* ACTIONS GRID CONTROLLERS */}
                <div className={`sec-lbl fade-up d4 ${p >= 4 ? "in" : ""}`}>Quick Actions</div>
                <div className={`act-grid fade-up d4 ${p >= 4 ? "in" : ""}`}>
                    {actions.map((action) => (
                        <button
                            className="act-btn"
                            key={action.label}
                            onClick={() => router.push(action.path)}
                        >
                            <div className="icon-slot">{action.icon}</div>
                            <div className="act-lbl">{action.label}</div>
                            <div className="act-sub">{action.sub}</div>
                            <div className="act-arrow"><IconArrow /></div>
                        </button>
                    ))}
                </div>

                <div style={{ height: 96 }} />
                <BottomNav />
            </div>
        </>
    );
}