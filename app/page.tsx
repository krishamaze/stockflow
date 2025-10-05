import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          StockFlow - Smart Inventory Management
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          AI-powered inventory system with Supabase backend
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/demo/combobox"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            View Combobox Demo
          </Link>
        </div>
      </div>
    </main>
  );
}

