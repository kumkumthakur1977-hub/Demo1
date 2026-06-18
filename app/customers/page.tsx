"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";

export default function Customers() {
    const customers = useLiveQuery(() => db.customers.toArray());

    return (
        <>
            <Navbar />

            <div style={{ padding: 20 }}>
                <h2>👥 Customers</h2>

                {customers?.map(c => (
                    <div className="card" key={c.id}>
                        <h3>{c.name}</h3>
                        <p>Total Spent: ₹{c.totalSpent}</p>
                    </div>
                ))}
            </div>
        </>
    );
}