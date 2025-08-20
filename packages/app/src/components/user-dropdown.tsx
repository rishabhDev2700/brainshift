import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth";
import { User2Icon } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router-dom";


function UserDropdown() {
    const { logout } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button className="border-2 md:mr-4" variant="outline"><User2Icon /></Button></DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/dashboard/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                <Link to="/dashboard/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
                
                <Link to="/dashboard/subscription"><DropdownMenuItem>Subscription</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
