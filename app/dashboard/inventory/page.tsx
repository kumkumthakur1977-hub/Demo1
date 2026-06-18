"use client";

import BottomNav from "@/components/BottomNav";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

// --- SYSTEM COMPONENT VECTOR GRAPHICS ---
const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const IconPackage = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
        <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon>
        <polygon points="12 12 21 6.92 21 17.08 12 22.08"></polygon>
        <polygon points="12 2 21 6.92 12 12 3 6.92 12 2"></polygon>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export default function InventoryPage() {
    // --- GLOBAL LICENSE AUTH CHECKPOINT ---
    useEffect(() => {
        const savedExpiry = localStorage.getItem("profile_expiry_date") || "2026-06-01";
        const today = new Date().toISOString().split('T')[0];
        if (today > savedExpiry) {
            window.location.href = "/dashboard/profile";
        }
    }, []);

    const productCatalog = useLiveQuery(() => db.products.toArray()) || [];

    const [p, setP] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form registration inputs states
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [unit, setUnit] = useState("kg");

    useEffect(() => {
        const t = [
            setTimeout(() => setP(1), 50),
            setTimeout(() => setP(2), 150),
        ];
        return () => t.forEach(clearTimeout);
    }, []);

    // Filter dynamic item listing array matching sequence criteria
    const filteredCatalog = productCatalog.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- ADD FRESH PRODUCT NODE ENTRY ---
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !stock) return alert("Please fill out all product fields.");

        try {
            await db.products.add({
                name: name.strip ? name.strip() : name,
                price: parseFloat(price),
                stock: parseFloat(stock),
                unit: unit
            });

            // Clear configuration registers
            setName("");
            setPrice("");
            setStock("");
            setUnit("kg");
            setIsFormOpen(false);
        } catch (err) {
            console.error("Failed to append structural inventory node item:", err);
        }
    };

    // --- ⭐ NEW FEATURE: INLINE QUICK-INCREMENT STOCK RE-SUPPLY ENGINE ⭐ ---
    const handleQuickAddStock = async (id: number, currentStock: number, unitType: string) => {
        const promptLabel = unitType === "kg" ? "kilograms (e.g., 5 or 0.250 for 250g)" : "units";
        const inboundValue = window.prompt(`Enter additional stock volume to add in ${promptLabel}:`);

        if (inboundValue === null) return; // Action aborted by client user

        const parsedVolume = parseFloat(inboundValue);
        if (isNaN(parsedVolume) || parsedVolume <= 0) {
            return alert("Invalid quantity configuration. Please enter a valid number greater than 0.");
        }

        try {
            const freshRecalibratedStock = parseFloat((currentStock + parsedVolume).toFixed(3));
            await db.products.update(id, { stock: freshRecalibratedStock });
        } catch (err) {
            console.error("Failed to append added stock volume context layer:", err);
        }
    };

    // --- DELETE ITEM DISPATCH ENTRY ---
    const handleDeleteProduct = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to completely erase "${name}" from your catalog indices?`)) return;
        try {
            await db.products.delete(id);
        } catch (err) {
            console.error("Failed to safely prune item structure database index mapping row:", err);
        }
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

                .inv-hdr { padding: 64px 22px 14px; display: flex; justify-content: space-between; align-items: flex-end; }
                .main-title { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -0.8px; }
                .sub-title { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }
                
                .btn-trigger-add { background: #fff; border: none; color: #000; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-radius: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.2px; }

                .search-panel-box { margin: 0 16px 14px; position: relative; display: flex; align-items: center; }
                .search-input-node { width: 100%; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.13); border-radius: 16px; padding: 14px 14px 14px 42px; color: #fff; font-size: 14px; outline: none; backdrop-filter: blur(20px); }
                .search-icon-pos { position: absolute; left: 16px; display: flex; align-items: center; }

                /* ── CATALOG CONTAINER ITEM WRAPPERS ── */
                .catalog-stack { display: flex; flex-direction: column; gap: 10px; margin: 0 16px; }
                .catalog-card { background: rgba(0,0,0,0.24); border: 1px solid rgba(255,255,255,0.11); border-radius: 22px; padding: 16px; backdrop-filter: blur(24px); display: flex; justify-content: space-between; align-items: center; }
                
                .item-details-zone { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
                .item-brand-title { font-size: 15px; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .item-price-tag { font-size: 12px; font-weight: 600; color: #ffd060; }
                
                .action-matrix-dock { display: flex; align-items: center; gap: 8px; }
                .stock-indicator-pill { text-align: right; display: flex; flex-direction: column; gap: 2px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); padding: 6px 12px; border-radius: 12px; min-width: 85px; }
                .stock-indicator-pill.low { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); }
                .stock-qty-lbl { font-size: 13px; font-weight: 800; color: #fff; }
                .stock-title-tag { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; }

                /* QUICK BUTTON STRUCTURAL DESIGN ELEMENTS */
                .btn-action-control { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; }
                .btn-action-control.add-stock { background: rgba(255,208,96,0.12); border-color: rgba(255,208,96,0.25); color: #ffd060; font-size: 10px; font-weight: 800; width: auto; padding: 0 10px; height: 32px; text-transform: uppercase; gap: 4px; }

                /* ── DRAWER SHEET FORM WINDOW ── */
                .modal-mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 5, 0, 0.75); backdrop-filter: blur(15px); z-index: 100; display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
                .modal-mask.open { opacity: 1; pointer-events: auto; }
                .modal-sheet { background: #1f0b02; border-top: 1px solid rgba(255,255,255,0.15); border-radius: 32px 32px 0 0; padding: 24px 20px 42px; display: flex; flex-direction: column; gap: 16px; transform: translateY(100%); transition: transform 0.35s cubic-bezier(.16,1,.3,1); }
                .modal-mask.open .modal-sheet { transform: translateY(0); }
                .modal-hdr { display: flex; justify-content: space-between; align-items: center; color: #fff; }
                .modal-title { font-size: 18px; font-weight: 800; }
                .modal-close { background: rgba(255,255,255,0.08); border: none; color: #fff; padding: 6px 14px; border-radius: 100px; cursor: pointer; font-size: 12px; font-weight: 700; }

                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .label-lbl { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; }
                .input-element { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 14px; font-weight: 600; outline: none; }
                .select-element { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; appearance: none; }
                .submit-btn-dock { background: linear-gradient(135deg, #ff7e00, #d93a00); border: none; border-radius: 14px; padding: 14px; font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; margin-top: 8px; cursor: pointer; width: 100%; }

                .empty-catalog { text-align: center; color: rgba(255,255,255,0.35); font-size: 14px; padding: 40px 0; font-weight: 600; }
            `}</style>

            <div className="r">
                {/* COMPONENT TITLE INTERFACE DESCRIPTOR HEADER */}
                <div className={`inv-hdr fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <div>
                        <h1 className="main-title">Inventory</h1>
                        <div className="sub-title">Manage grocery prices, metrics & stock values</div>
                    </div>
                    <button type="button" className="btn-trigger-add" onClick={() => setIsFormOpen(true)}>
                        <IconPlus /> Add Item
                    </button>
                </div>

                {/* SEARCH INPUT BAR MATRIX CONTROLLER */}
                <div className={`search-panel-box fade-up d1 ${p >= 1 ? "in" : ""}`}>
                    <span className="search-icon-pos"><IconSearch /></span>
                    <input
                        type="text"
                        className="search-input-node"
                        placeholder="Search product profile by description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* DYNAMIC PRODUCT LISTING VIEW CONTAINER */}
                <div className={`catalog-stack fade-up d2 ${p >= 2 ? "in" : ""}`}>
                    {filteredCatalog.length === 0 ? (
                        <div className="empty-catalog">
                            {productCatalog.length === 0 ? "Inventory warehouse database is empty." : "No matching catalog elements."}
                        </div>
                    ) : (
                        filteredCatalog.map((item) => {
                            const isLowStock = item.stock <= 5;
                            return (
                                <div className="catalog-card" key={item.id}>
                                    <div className="item-details-zone">
                                        <span className="item-brand-title">{item.name}</span>
                                        <span className="item-price-tag">₹{item.price} / {item.unit || "kg"}</span>
                                    </div>

                                    <div className="action-matrix-dock">
                                        {/* STOCK STATUS MONITOR CARD DISPLAY BLOCK */}
                                        <div className={`stock-indicator-pill ${isLowStock ? "low" : ""}`}>
                                            <span className="stock-qty-lbl" style={{ color: isLowStock ? "#f87171" : "#fff" }}>
                                                {item.stock} {item.unit}
                                            </span>
                                            <span className="stock-title-tag">
                                                {isLowStock ? "LOW STOCK" : "REMAINING"}
                                            </span>
                                        </div>

                                        {/* ⭐ ADD STOCK INTERACTIVE TRIGGER BUTTON FEATURE ⭐ */}
                                        <button
                                            type="button"
                                            className="btn-action-control add-stock"
                                            title="Add additional stock to this item"
                                            onClick={() => handleQuickAddStock(item.id!, item.stock, item.unit || "kg")}
                                        >
                                            <IconPackage /> +Stock
                                        </button>

                                        {/* PRUNE DELETE ITEM CONTROL BUTTON ENTRY */}
                                        <button
                                            type="button"
                                            className="btn-action-control"
                                            onClick={() => handleDeleteProduct(item.id!, item.name)}
                                        >
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* EXPANDABLE BOTTOM MODAL DIALOG DRAWER SHEET */}
                <div className={`modal-mask ${isFormOpen ? "open" : ""}`} onClick={() => setIsFormOpen(false)}>
                    <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleCreateProduct}>
                        <div className="modal-hdr">
                            <span className="modal-title">New Catalog Record</span>
                            <button type="button" className="modal-close" onClick={() => setIsFormOpen(false)}>Cancel</button>
                        </div>

                        <div className="form-group">
                            <span className="label-lbl">Product Description Name</span>
                            <input type="text" className="input-element" placeholder="Example: Basmati Rice Mini" value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group">
                                <span className="label-lbl">Unit Valuation Type</span>
                                <select className="select-element" value={unit} onChange={e => setUnit(e.target.value)}>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="packet">Packet (pkt)</option>
                                    <option value="piece">Piece (pc)</option>
                                    <option value="liter">Liter (L)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <span className="label-lbl">Retail Price (₹)</span>
                                <input type="number" step="0.01" className="input-element" placeholder="60.00" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <span className="label-lbl">Opening Stock Quantity Balance</span>
                            <input type="number" step="0.001" className="input-element" placeholder="Example: 50 or 10.500" value={stock} onChange={e => setStock(e.target.value)} required />
                        </div>

                        <button type="submit" className="submit-btn-dock">Save to Catalog Register</button>
                    </form>
                </div>

                <BottomNav />
            </div>
        </>
    );
}