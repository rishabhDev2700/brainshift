import {
    SidebarInset,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { appRoutes } from "@/lib/data"
import { NavLink } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

export function AppSidebar() {
    const { open } = useSidebar();

    return (
        <SidebarInset>

            <Sidebar variant="inset" collapsible="icon" className="hidden lg:block bg-emerald-600/10 backdrop-blur-lg border rounded-lg">
                <SidebarHeader className="flex flex-row justify-center items-center text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="green" strokeWidth="1" strokeLinecap="square" strokeLinejoin="bevel" className="lucide lucide-zap-icon lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                    {open && <div>BrainShift</div>}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="list-none">
                        {appRoutes.map((r) => (

                            <SidebarMenuItem key={r.text}>
                                <SidebarMenuButton asChild tooltip={r.text}>
                                    <NavLink key={r.text} className={`py-2 px-4 border-2 border-transparent hover:border-emerald-700/30 duration-100 ease-linear hover:bg-emerald-600/20 dark:hover:text-white my-2 rounded-xl flex items-center hover:text-emerald-600 &.active:bg-emerald-600/30 &.active:border-emerald-700/50 &.active:text-white`}
                                        to={r.url}
                                        end={r.url === "/dashboard"}
                                    >
                                        {r.icon && <r.icon className="mr-3 h-5 w-5" />}
                                        <span>{r.text}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <ModeToggle />
                </SidebarFooter>

            </Sidebar>
        </SidebarInset>
    )
}