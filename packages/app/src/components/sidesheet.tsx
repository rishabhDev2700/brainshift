import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"
import { appRoutes } from "@/lib/data"
import { NavLink } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"


function SideSheet() {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden fixed bottom-4 right-4 z-50" asChild>
                <Button className="rounded-full w-24 h-12 bg-emerald-600 border-2 border-black">
                    <MenuIcon color="black" size={32} />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="green" stroke="green" strokeWidth="1" strokeLinecap="square" strokeLinejoin="bevel" className="lucide lucide-zap-icon lucide-zap mx-2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                        <div>BrainShift</div></SheetTitle>
                    <SheetDescription className="flex flex-col">
                        {appRoutes.map((r, i) => <NavLink key={i} className={`py-2 px-4 border-2 border-transparent hover:border-emerald-700 duration-100 ease-linear hover:bg-emerald-600 hover:text-white my-2 rounded-xl`} to={r.url}>{r.text}</NavLink>)}
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <ModeToggle/>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
export default SideSheet