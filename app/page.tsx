import { redirect } from "next/navigation";

export default function RootPage() {
    // This triggers an instant server-side redirect to your dashboard layout
    redirect("/dashboard");
}