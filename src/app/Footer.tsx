import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 px-6 py-3 mt-auto bg-background">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Trump Quotes</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/legal/imprint" className="hover:text-foreground transition-colors">
            Imprint
          </Link>
          <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/withdrawal" className="hover:text-foreground transition-colors">
            Right of Withdrawal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
