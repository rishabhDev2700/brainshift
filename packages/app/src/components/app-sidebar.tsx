import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { appRoutes } from "@/lib/data"
import { NavLink } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

export function AppSidebar() {

    return (
        <Sidebar className="hidden lg:block">
            <SidebarHeader className="flex flex-row justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="green" strokeWidth="1" strokeLinecap="square" strokeLinejoin="bevel" className="lucide lucide-zap-icon lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                <div>BrainShift</div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {appRoutes.map((r, i) => (
                        <NavLink key={i} className={`py-2 px-4 border-2 border-transparent hover:border-emerald-700 duration-100 ease-linear hover:bg-emerald-600 hover:text-white my-2 rounded-xl flex items-center`}
                            to={r.url}
                            end={r.url === "/dashboard"}
                        >
                            <r.icon className="mr-3 h-5 w-5" />
                            {r.text}
                        </NavLink>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
            </SidebarFooter>

        </Sidebar>
    )
}