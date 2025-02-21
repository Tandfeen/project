import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Home, Info } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/">
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href="/settings">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href="/about">
          <Info className="h-5 w-5" />
          <span className="sr-only">About</span>
        </Link>
      </Button>
    </div>
  );
}