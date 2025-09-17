import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Bell, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger className="h-8 w-8" />
              
              <div className="flex-1" />
              
              {/* Demo Badge */}
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                Modo Demonstração
              </Badge>
              
              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-border bg-card/50 backdrop-blur-sm px-6 py-3">
            <div className="text-xs text-muted-foreground text-center">
              <p>
                Lei 14.300/2022 (Geração Distribuída) — dados e regras não vinculantes nesta demonstração. 
                Créditos de carbono exibidos são estimativas didáticas sem valor de mercado.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}