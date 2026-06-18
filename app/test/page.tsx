"use client";

import { db } from "@/lib/db/db";

export default function TestPage() {
    async function addProduct() {
        await db.table("products").add({
            id: crypto.randomUUID(),
            name: "Rice",
        });

        alert("Product Added");
    }

    return (
        <div className="p-10">
            <button
                onClick={addProduct}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Add Product
            </button>
        </div>
    );
}