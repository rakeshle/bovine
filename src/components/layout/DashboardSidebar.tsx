
import {
  BarChart3,
  Baby,
  HeartPulse,
  Milk,
  Wheat,
  DollarSign,
  Bell,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, href: "/" },
  { title: "Animals", icon: Baby, href: "/animals" },
  { title: "Health", icon: HeartPulse, href: "/health" },
  { title: "Milk Production", icon: Milk, href: "/milk" },
  { title: "Feed & Nutrition", icon: Wheat, href: "/feed" },
  { title: "Financials", icon: DollarSign, href: "/financials" },
  { title: "Users", icon: Users, href: "/users" },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-[60px] flex items-center px-6">
        <h1 className="text-xl font-semibold text-primary">FarmMonitor</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary-100 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
