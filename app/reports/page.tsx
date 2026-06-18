"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";

export default function Reports() {
    const sales = useLiveQuery(() => db.sales.toArray());

    const total = sales?.reduce((s, a) => s + a.total, 0) || 0;

    return (
        <>
            <Navbar />

            <div style={{ padding: 20 }}>
                <h2>📈 Reports</h2>

                <div className="card">
                    Total Sales: ₹{total}
                </div>
            </div>
        </>
    );
}