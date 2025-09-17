import { NavLink, useLocation } from "react-router-dom";
import { 
  Activity,
  BarChart3, 
  Zap, 
  Server, 
  FileText,
  Settings
} from "lucide-react";
import voltEraLogo from "@/assets/voltera-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Visão Geral", 
    url: "/", 
    icon: Activity,
    description: "Dashboard principal"
  },
  { 
    title: "Energia & Carbono", 
    url: "/energia", 
    icon: Zap,
    description: "Monitoramento energético"
  },
  { 
    title: "Recursos Ociosos", 
    url: "/recursos", 
    icon: BarChart3,
    description: "Marketplace de recursos"
  },
  { 
    title: "Saúde do Servidor", 
    url: "/saude", 
    icon: Server,
    description: "Métricas SRE e hardware"
  },
  { 
    title: "Relatórios", 
    url: "/relatorios", 
    icon: FileText,
    description: "Exportação e análises"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar 
      className="border-r border-sidebar-border bg-sidebar backdrop-blur-md"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img 
              src={voltEraLogo} 
              alt="VoltEra Logo" 
              className="h-10 w-10 object-contain"
            />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-primary">VoltEra</h2>
              <p className="text-xs text-muted-foreground">Sustainable Datacenter</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navegação Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild
                    className={`
                      relative overflow-hidden transition-all duration-200 hover:bg-sidebar-accent
                      ${isActive(item.url) ? 
                        'bg-sidebar-accent text-sidebar-primary border-l-2 border-primary' : 
                        'text-sidebar-foreground hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {state === "expanded" && (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </div>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-md" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state === "expanded" && (
          <div className="mt-auto px-3 py-4 border-t border-sidebar-border">
            <div className="rounded-lg bg-gradient-glass p-3 backdrop-blur-sm border border-glass-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="h-3 w-3" />
                <span>Dados de demonstração</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Todas as métricas são simuladas para fins de demo
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}