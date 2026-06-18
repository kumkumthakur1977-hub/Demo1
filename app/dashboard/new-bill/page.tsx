"use client";

import BottomNav from "@/components/BottomNav";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

// --- ICONS ---
const IconPrint = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);

const IconWhatsApp = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconMinus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const IconSave = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

interface CartItem {
    id: number;
    name: string;
    price: number;
    unit: string;
    qty: number;
}

export default function BillingPage() {
    // --- GLOBAL LICENSE EXPIRES DETECTOR NODE ---
    useEffect(() => {
        const savedExpiry = localStorage.getItem("profile_expiry_date") || "2026-06-01";
        const today = new Date().toISOString().split('T')[0];
        if (today > savedExpiry) {
            window.location.href = "/dashboard/profile";
        }
    }, []);

    const dbProducts = useLiveQuery(() => db.products.toArray()) || [];
    const allBills = useLiveQuery(() => db.sales.toArray()) || [];

    const [p, setP] = useState(0);
    const [viewIndex, setViewIndex] = useState(0); // Tracks current active invoice sequence position

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const t = [
            setTimeout(() => setP(1), 50),
            setTimeout(() => setP(2), 150),
            setTimeout(() => setP(3), 280),
            setTimeout(() => setP(4), 400),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    // Set layout sequence focus pointer to absolute end (New Invoice screen) once bills finish loading
    useEffect(() => {
        if (allBills && allBills.length > 0) {
            setViewIndex(allBills.length);
        }
    }, [allBills.length]);

    // Handle structural data changes when changing index sequence pointers
    useEffect(() => {
        if (allBills && viewIndex < allBills.length) {
            const targetedBill = allBills[viewIndex];
            setCustomerName(targetedBill.customerName || "");
            setCustomerPhone(targetedBill.customerPhone || "");
            setCart(targetedBill.items || []);
        } else {
            setCustomerName("");
            setCustomerPhone("");
            setCart([]);
        }
    }, [viewIndex, allBills]);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const filteredProducts = dbProducts.filter(prod => prod.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleAddProductToCart = (prod: any) => {
        setCart(prevCart => {
            const index = prevCart.findIndex(item => item.id === prod.id);
            if (index > -1) {
                const updated = [...prevCart];
                updated[index].qty += 1;
                return updated;
            } else {
                return [...prevCart, { id: prod.id, name: prod.name, price: prod.price, unit: prod.unit || "kg", qty: 1 }];
            }
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: parseFloat(newQty.toFixed(3)) } : item;
                }
                return item;
            }).filter(item => item.qty > 0)
        );
    };

    const handleManualQtyChange = (id: number, value: string) => {
        const parsed = parseFloat(value);
        setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, qty: isNaN(parsed) ? 0 : parsed } : item));
    };

    const setPresetWeight = (id: number, kgValue: number) => {
        setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, qty: kgValue } : item));
    };

    const handleRemoveItem = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // --- TRANSACTION LOG ENGINE: CREATE OR REVISE EXHAUSTIVE BILL RECORD ---
    const handleSaveBill = async () => {
        if (cart.length === 0) return alert("Cart is empty!");

        try {
            if (viewIndex < allBills.length) {
                // EDIT MODE: Revert inventory balances from past state version first
                const pristineBillSnapshot = allBills[viewIndex];
                for (const oldItem of pristineBillSnapshot.items) {
                    const product = await db.products.get(oldItem.id);
                    if (product) {
                        await db.products.update(oldItem.id, { stock: parseFloat((product.stock + oldItem.qty).toFixed(3)) });
                    }
                }

                // Apply fresh structural deductions based on your modifications
                for (const newItem of cart) {
                    const product = await db.products.get(newItem.id);
                    if (product) {
                        await db.products.update(newItem.id, { stock: parseFloat(Math.max(0, product.stock - newItem.qty).toFixed(3)) });
                    }
                }

                // Update specific historical ledger row
                await db.sales.put({
                    id: pristineBillSnapshot.id,
                    customerName: customerName || "Walking Customer",
                    customerPhone: customerPhone || "N/A",
                    items: cart,
                    total: parseFloat(totalAmount.toFixed(2)),
                    date: pristineBillSnapshot.date
                });

                alert("Invoice updated & inventory balances recalibrated!");
            } else {
                // NEW INVOICE MODE: Commit directly and decrease stock levels
                for (const item of cart) {
                    const product = await db.products.get(item.id);
                    if (product) {
                        await db.products.update(item.id, { stock: parseFloat(Math.max(0, product.stock - item.qty).toFixed(3)) });
                    }
                }

                await db.sales.add({
                    customerName: customerName || "Walking Customer",
                    customerPhone: customerPhone || "N/A",
                    items: cart,
                    total: parseFloat(totalAmount.toFixed(2)),
                    date: new Date().toISOString()
                });

                alert("Invoice saved! Revenue synced & stock level managed.");
            }
            setViewIndex(allBills.length); // Re-focus interface target to dynamic endpoint position
        } catch (error) {
            console.error("Ledger Mutation Error:", error);
        }
    };

    // --- INVOICE DELETION DISPATCH ENGINE ---
    const handleDeleteBill = async () => {
        if (viewIndex >= allBills.length) return;
        if (!confirm("Are you sure you want to permanently cancel and delete this invoice? This will restore item stock levels.")) return;

        try {
            const targetBill = allBills[viewIndex];

            // Return products back into operational item levels safely
            for (const item of targetBill.items) {
                const product = await db.products.get(item.id);
                if (product) {
                    await db.products.update(item.id, { stock: parseFloat((product.stock + item.qty).toFixed(3)) });
                }
            }

            await db.sales.delete(targetBill.id);
            alert("Invoice cancelled. Items successfully returned to active inventory.");
            setViewIndex(Math.max(0, allBills.length - 2));
        } catch (error) {
            console.error("Failed to safely remove invoice ledger:", error);
        }
    };

    const formatWeightUnits = (qty: number, unit: string) => {
        if (unit !== "kg") return `${qty} ${unit}`;
        if (qty < 1) return `${Math.round(qty * 1000)} grams`;
        const wholeKg = Math.floor(qty);
        const remGrams = Math.round((qty - wholeKg) * 1000);
        return remGrams > 0 ? `${wholeKg}kg ${remGrams}g` : `${wholeKg} kg`;
    };

    const handleWhatsApp = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        let text = `*Mithapur Grocery - Invoice*\n`;
        if (customerName) text += `Customer: ${customerName}\n`;
        text += `---------------------------\n`;
        cart.forEach((item, idx) => {
            text += `${idx + 1}. ${item.name}\n   ${formatWeightUnits(item.qty, item.unit)} x ₹${item.price}/${item.unit} = ₹${(item.price * item.qty).toFixed(2)}\n`;
        });
        text += `---------------------------\n*Grand Total: ₹${totalAmount.toFixed(2)}*`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: #1a0800; }
                .r { max-width: 430px; margin: 0 auto; min-height: 100svh; position: relative; padding-bottom: 110px; background: radial-gradient(ellipse 80% 40% at 85% 8%, rgba(120,40,160,0.55) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 25%, rgba(200,30,30,0.4) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 50% 55%, rgba(255,90,0,0.35) 0%, transparent 70%), linear-gradient(170deg, #f1fa79e1 0%, #f1b05ae1 18%, #d93a00 38%, #ff5e00ff 58%, #e8920a 78%, #c97a08 100%); }
                .fade-up { opacity: 0; transform: translateY(22px); transition: opacity 0.4s cubic-bezier(.22,1,.36,1), transform 0.4s cubic-bezier(.22,1,.36,1); }
                .fade-up.in { opacity: 1; transform: translateY(0); }
                .d1 { transition-delay: 0.0s; } .d2 { transition-delay: 0.1s; } .d3 { transition-delay: 0.2s; } .d4 { transition-delay: 0.3s; }
                
                /* ── SEQUENTIAL INVOICE CONTROLLER STRIP ── */
                .seq-nav-bar { display: flex; align-items: center; justify-content: space-between; margin: 54px 16px 0; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 8px 12px; backdrop-filter: blur(20px); }
                .seq-btn { background: rgba(255,255,255,0.1); border: none; border-radius: 10px; padding: 8px 14px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }
                .seq-btn:disabled { opacity: 0.25; cursor: not-allowed; }
                .seq-title { color: #fff; font-size: 14px; font-weight: 800; letter-spacing: -0.3px; }
                .seq-badge-edit { font-size: 10px; font-weight: 800; background: #ff4500; padding: 2px 8px; border-radius: 6px; color: #fff; margin-left: 6px; vertical-align: middle; }

                .cust-card { margin: 14px 16px 0; background: rgba(0,0,0,0.30); border: 1px solid rgba(255,255,255,0.13); border-radius: 24px; padding: 20px 18px; backdrop-filter: blur(28px); box-shadow: 0 8px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 12px; }
                .cust-row { display: flex; gap: 10px; } .cust-group { flex: 1; display: flex; flex-direction: column; gap: 6px; }
                .label-text { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase; }
                .cust-input { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 14px; font-weight: 600; outline: none; }
                .cust-input::placeholder { color: rgba(255,255,255,0.2); }
         
                .cart-card { margin: 14px 16px 0; background: rgba(0,0,0,0.24); border: 1px solid rgba(255,255,255,0.11); border-radius: 24px; padding: 22px 20px; backdrop-filter: blur(24px); }
                .cart-empty-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 0; }
                .cart-empty-text { color: rgba(255,255,255,0.35); font-size: 14px; font-weight: 600; margin-bottom: 16px; }
                .btn-add-trigger { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; padding: 12px 24px; color: #fff; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }

                .cart-item { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px; }
                .cart-item:last-child { border-bottom: none; padding-bottom: 0; }
                .cart-item-main { display: flex; justify-content: space-between; align-items: center; }
                .item-meta { display: flex; flex-direction: column; gap: 3px; }
                .item-title { font-size: 15px; font-weight: 700; color: #fff; }
                .item-subtext { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45); }
                
                .qty-controls { display: flex; align-items: center; background: rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); padding: 2px; }
                .qty-btn { background: transparent; border: none; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .qty-field-input { background: transparent; border: none; width: 55px; text-align: center; font-size: 14px; font-weight: 700; color: #ffd060; outline: none; }

                .gram-shortcuts-strip { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
                .shortcut-pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 6px; color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; cursor: pointer; }

                .modal-mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 5, 0, 0.75); backdrop-filter: blur(15px); z-index: 100; display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
                .modal-mask.open { opacity: 1; pointer-events: auto; }
                .modal-sheet { background: #1f0b02; border-top: 1px solid rgba(255,255,255,0.15); border-radius: 32px 32px 0 0; padding: 24px 20px 40px; max-height: 75svh; display: flex; flex-direction: column; gap: 16px; transform: translateY(100%); transition: transform 0.35s cubic-bezier(.16,1,.3,1); }
                .modal-mask.open .modal-sheet { transform: translateY(0); }
                .modal-hdr { display: flex; justify-content: space-between; align-items: center; color: #fff; }
                .modal-title { font-size: 18px; font-weight: 800; }
                .modal-close { background: rgba(255,255,255,0.08); border: none; color: #fff; padding: 6px 14px; border-radius: 100px; cursor: pointer; font-size: 12px; font-weight: 700; }

                .search-container { position: relative; display: flex; align-items: center; }
                .search-bar { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px 14px 12px 38px; color: #fff; outline: none; }
                .search-icon { position: absolute; left: 14px; }

                .menu-list { overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
                .menu-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                .menu-info { display: flex; flex-direction: column; gap: 2px; } .menu-name { font-size: 15px; font-weight: 700; color: #fff; } .menu-pricing { font-size: 13px; font-weight: 600; color: #ffd060; }
                .menu-add-btn { background: linear-gradient(135deg, #ff7e00, #d93a00); border: none; border-radius: 10px; width: 32px; height: 32px; color: #fff; display: flex; align-items: center; justify-content: center; }

                .bottom-summary { margin: 18px 20px 0; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: flex-end; }
                .total-lbl { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.45); text-transform: uppercase; }
                .total-val { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; }

                .action-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 16px; }
                .action-button { background: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 16px 8px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #fff; font-size: 11px; font-weight: 700; cursor: pointer; text-transform: uppercase; }
                .action-button.whatsapp { background: rgba(37, 211, 102, 0.14); border-color: rgba(37, 211, 102, 0.28); color: #4ade80; }
                .action-button.danger { background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.25); color: #f87171; }

                .print-receipt { display: none; }
                @media print {
                  body, html { background: #fff !important; color: #000 !important; }
                  .no-print { display: none !important; }
                  .print-receipt { display: block; width: 100%; max-width: 280px; margin: 0 auto; font-family: monospace; font-size: 13px; }
                  .p-center { text-align: center; } .p-row { display: flex; justify-content: space-between; } .p-divider { border-bottom: 1px dashed #000; margin: 8px 0; }
                }
            `}</style>

            <div className="r no-print">
                {/* SEQUENTIAL NAVIGATION HEADER BAR */}
                <div className={`seq-nav-bar fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <button type="button" className="seq-btn" disabled={viewIndex === 0} onClick={() => setViewIndex(viewIndex - 1)}>
                        &larr; Prev
                    </button>
                    <div className="seq-title">
                        {viewIndex === allBills.length ? (
                            `New Bill (#${viewIndex + 1})`
                        ) : (
                            <>Bill #{viewIndex + 1} <span className="seq-badge-edit">PAST RECORD</span></>
                        )}
                    </div>
                    <button type="button" className="seq-btn" disabled={viewIndex === allBills.length} onClick={() => setViewIndex(viewIndex + 1)}>
                        {viewIndex === allBills.length - 1 ? "New Bill +" : "Next &rarr;"}
                    </button>
                </div>

                {/* CUSTOMER INFO CARD */}
                <div className={`cust-card fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    <div className="cust-row">
                        <div className="cust-group">
                            <span className="label-text">Customer Name</span>
                            <input type="text" className="cust-input" placeholder="Walking Customer" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        </div>
                    </div>
                    <div className="cust-row">
                        <div className="cust-group">
                            <span className="label-text">Phone Number</span>
                            <input type="tel" className="cust-input" placeholder="Enter 10-digit number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* BASKET COMPONENT */}
                <div className={`cart-card fade-up d3 ${p >= 3 ? "in" : ""}`}>
                    {cart.length === 0 ? (
                        <div className="cart-empty-container">
                            <div className="cart-empty-text">Cart is empty</div>
                            <button type="button" className="btn-add-trigger" onClick={() => setIsMenuOpen(true)}>
                                <IconPlus /> Add Product
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                                <span className="label-text">Basket Items</span>
                                <button type="button" className="btn-add-trigger" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }} onClick={() => setIsMenuOpen(true)}>
                                    <IconPlus /> Add More
                                </button>
                            </div>

                            {cart.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <div className="cart-item-main">
                                        <div className="item-meta">
                                            <span className="item-title">{item.name}</span>
                                            <span className="item-subtext" style={{ color: item.unit === 'kg' ? '#ff9d42' : 'rgba(255,255,255,0.45)' }}>
                                                {formatWeightUnits(item.qty, item.unit)} (₹{item.price}/{item.unit})
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="qty-controls">
                                                <button type="button" className="qty-btn" onClick={() => updateQty(item.id, item.unit === "kg" ? -0.1 : -1)}>
                                                    <IconMinus />
                                                </button>
                                                <input type="number" step={item.unit === "kg" ? "0.001" : "1"} className="qty-field-input" value={item.qty === 0 ? "" : item.qty} onChange={(e) => handleManualQtyChange(item.id, e.target.value)} />
                                                <button type="button" className="qty-btn" onClick={() => updateQty(item.id, item.unit === "kg" ? 0.1 : 1)}>
                                                    <IconPlus />
                                                </button>
                                            </div>
                                            <div style={{ textAlign: 'right', minWidth: '70px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                                <span className="item-title" style={{ color: '#ffd060' }}>₹{(item.price * item.qty).toFixed(2)}</span>
                                                <button className="qty-btn" style={{ padding: '4px' }} onClick={() => handleRemoveItem(item.id)}>
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {item.unit === "kg" && (
                                        <div className="gram-shortcuts-strip">
                                            <div className="shortcut-pill" onClick={() => setPresetWeight(item.id, 0.100)}>100g</div>
                                            <div className="shortcut-pill" onClick={() => setPresetWeight(item.id, 0.250)}>250g</div>
                                            <div className="shortcut-pill" onClick={() => setPresetWeight(item.id, 0.500)}>500g</div>
                                            <div className="shortcut-pill" onClick={() => setPresetWeight(item.id, 1.000)}>1kg</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* CONTROL MATRIX STRIP */}
                <div className={`fade-up d4 ${p >= 4 ? "in" : ""}`}>
                    <div className="bottom-summary">
                        <span className="total-lbl">Bill Amount</span>
                        <span className="total-val">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="action-container">
                        {viewIndex < allBills.length ? (
                            <button className="action-button danger" onClick={handleDeleteBill}>
                                <IconTrash /> Delete Bill
                            </button>
                        ) : (
                            <button className="action-button" onClick={handleSaveBill}>
                                <IconSave /> Save Bill
                            </button>
                        )}
                        {viewIndex < allBills.length && (
                            <button className="action-button" onClick={handleSaveBill}>
                                <IconSave /> Update
                            </button>
                        )}
                        <button className="action-button whatsapp" onClick={handleWhatsApp}>
                            <IconWhatsApp /> WhatsApp
                        </button>
                        <button className="action-button" onClick={() => window.print()}>
                            <IconPrint /> Print
                        </button>
                    </div>
                </div>

                {/* DRAWER MODAL SHEET */}
                <div className={`modal-mask ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}>
                    <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-hdr">
                            <span className="modal-title">Select Grocery Items</span>
                            <button type="button" className="modal-close" onClick={() => setIsMenuOpen(false)}>Done</button>
                        </div>
                        <div className="search-container">
                            <span className="search-icon"><IconSearch /></span>
                            <input type="text" className="search-bar" placeholder="Search product profile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="menu-list">
                            {filteredProducts.map((prod) => {
                                const matchedItem = cart.find(c => c.id === prod.id);
                                return (
                                    <div className="menu-item" key={prod.id} onClick={() => handleAddProductToCart(prod)}>
                                        <div className="menu-info">
                                            <span className="menu-name">{prod.name}</span>
                                            <span className="menu-pricing">₹{prod.price} / {prod.unit || "kg"}</span>
                                            <span style={{ fontSize: '11px', color: prod.stock <= 5 ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                                                Stock: {prod.stock} {prod.unit}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {matchedItem && (
                                                <span style={{ fontSize: '11px', background: 'rgba(255,210,60,0.15)', color: '#ffd060', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                                    {formatWeightUnits(matchedItem.qty, matchedItem.unit)}
                                                </span>
                                            )}
                                            <button type="button" className="menu-add-btn"><IconPlus /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ height: 96 }} />
                <BottomNav />
            </div>

            {/* PRINT COMPATIBLE ROW RECEIPT */}
            <div className="print-receipt">
                <div className="p-center">
                    <h3>MITHAPUR GROCERY</h3>
                    <span>POS Terminal Invoice</span><br />
                    <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="p-divider" />
                <div>Customer: {customerName || "Walking Customer"}</div>
                <div className="p-divider" />
                {cart.map((item) => (
                    <div key={`p-${item.id}`} className="p-row" style={{ margin: '4px 0' }}>
                        <span>{item.name} ({formatWeightUnits(item.qty, item.unit)})</span>
                        <span>₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                ))}
                <div className="p-divider" />
                <div className="p-row" style={{ fontWeight: 'bold' }}>
                    <span>Grand Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </>
    );
}