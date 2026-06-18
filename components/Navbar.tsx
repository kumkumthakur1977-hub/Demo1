import Link from "next/link";

export default function Navbar() {
    return (
        <div
            style={{
                position: "sticky",
                top: 0,
                background: "white",
                padding: 12,
                display: "flex",
                justifyContent: "space-around",
                borderBottom: "1px solid #eee"
            }}
        >
            <Link href="/dashboard">🏠</Link>
            <Link href="/products">📦</Link>
            <Link href="/billing">🧾</Link>
            <Link href="/reports">📊</Link>
        </div>
    );
}