import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Briefcase, Users, FileText, Home, Menu } from "lucide-react";
import { useState } from "react";

const primaryRoutes = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Jobs Board", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Assessments", href: "/assessments", icon: FileText },
];

export function Navigation() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="bg-card/80 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-primary rounded-full shadow-sm flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-xs tracking-wider">TF</span>
            </div>
            <span className="font-semibold text-lg text-foreground tracking-tight">TalentFlow</span>
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex md:space-x-2">
            {primaryRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <NavLink
                  key={route.name}
                  to={route.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )
                  }
                  end={route.href === "/"}
                >
                  <Icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-card/95 border-b border-border shadow-lg z-10 backdrop-blur">
              <div className="flex flex-col space-y-2 p-4">
                {primaryRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <NavLink
                      key={route.name}
                      to={route.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )
                      }
                      end={route.href === "/"}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{route.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}