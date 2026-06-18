"use client";

import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function PurchasePage() {
    const products = useLiveQuery(() => db.products.toArray());
    const [qty, setQty] = useState(1);

    const addStock = async (id: number) => {
        const p = await db.products.get(id);
        if (!p) return;

        await db.products.update(id, {
            stock: p.stock + qty
        });
    };

    return (
        <>
            <Navbar />

            <div style={{ padding: 20 }}>
                <h2>📥 Purchase Stock</h2>

                {products?.map(p => (
                    <div className="card" key={p.id}>
                        <h3>{p.name}</h3>
                        <input type="number" onChange={e => setQty(+e.target.value)} />
                        <button className="btn" onClick={() => addStock(p.id!)}>
                            Add Stock
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}