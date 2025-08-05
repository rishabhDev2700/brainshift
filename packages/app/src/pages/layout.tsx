import { AnimatePresence, motion } from "framer-motion"
import { AppSidebar } from '@/components/app-sidebar'
import SideSheet from '@/components/sidesheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import UserDropdown from '@/components/user-dropdown'
import { BellIcon, SearchIcon } from 'lucide-react'

import { Outlet, useLocation } from 'react-router-dom'
function Layout() {
    const location = useLocation()
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger className='hidden sticky top-2 lg:flex items-center' />
            <SideSheet />
            <div className="w-full">

                <div className='py-2 px-2 max-w-screen flex justify-end'>
                    <div className='w-54 flex items-center border px-4 rounded-full outline-2 focus-within:outline-emerald-600 focus-within:border-emerald-500 ring-transparent focus-visible:ring-2'>
                        <SearchIcon />
                        <Input type='text' role="searchbox" placeholder='Search' className='border-0 focus-visible:ring-0 dark:bg-neutral-950' />
                    </div>
                    <Button variant="secondary" size="icon" className='mx-4 border-2 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-900'>
                        <BellIcon />
                    </Button>
                    <UserDropdown />
                </div>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0.5 }}
                        whileInView={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='p-4 w-full block'
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </div>
        </SidebarProvider>
    )
}

export default Layout
