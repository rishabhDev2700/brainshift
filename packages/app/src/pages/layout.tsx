import { AnimatePresence, motion } from "framer-motion"
import { AppSidebar } from '@/components/app-sidebar'
import SideSheet from '@/components/sidesheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import UserDropdown from '@/components/user-dropdown'
import { BellIcon, SearchIcon } from 'lucide-react'

import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { dataService } from "@/services/api-service";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { TaskSchema, GoalSchema, EventSchema } from "@/types"
import { CurrentStreakBadge } from "@/components/current-streak-badge"

function Layout() {
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ tasks: TaskSchema[]; goals: GoalSchema[]; events: EventSchema[]; } | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleSearch = async (query: string) => {
        if (query.length < 2) {
            setSearchResults(null);
            return;
        }
        setSearchLoading(true);
        try {
            const results = await dataService.searchAll(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching:", error);
            setSearchResults(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

    useEffect(() => {
        handleSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger className='hidden sticky top-2 lg:flex items-center' />
            <SideSheet />
            <div className="w-full">

                <div className='py-2 px-2 max-w-screen flex justify-end sticky top-0 backdrop-blur-md'>
                    <div className='relative w-54' ref={searchRef}>
                        <div className='w-full flex items-center border px-4 rounded-full outline-2 focus-within:outline-emerald-600 focus-within:border-emerald-500 ring-transparent focus-visible:ring-2'>
                            <SearchIcon />
                            <Input
                                type='text'
                                role="searchbox"
                                placeholder='Search'
                                className='border-0 focus-visible:ring-0'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowResults(true)}
                            />
                        </div>
                        {showResults && searchQuery.length > 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                                {searchLoading ? (
                                    <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
                                ) : searchResults && (searchResults.tasks.length > 0 || searchResults.goals.length > 0 || searchResults.events.length > 0) ? (
                                    <>
                                        {searchResults.tasks.length > 0 && (
                                            <div className="p-2">
                                                <h3 className="text-sm font-semibold text-muted-foreground">Tasks</h3>
                                                {searchResults.tasks.map((item) => (
                                                    <Link key={item.id} to={`/dashboard/tasks/${item.id}`} className="block p-2 hover:bg-accent rounded-md" onClick={() => setShowResults(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.goals.length > 0 && (
                                            <div className="p-2 border-t">
                                                <h3 className="text-sm font-semibold text-muted-foreground">Goals</h3>
                                                {searchResults.goals.map((item) => (
                                                    <Link key={item.id} to={`/dashboard/goals/${item.id}`} className="block p-2 hover:bg-accent rounded-md" onClick={() => setShowResults(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.events.length > 0 && (
                                            <div className="p-2 border-t">
                                                <h3 className="text-sm font-semibold text-muted-foreground">Events</h3>
                                                {searchResults.events.map((item) => (
                                                    <Link key={item.id} to={`/dashboard/calendar/${item.id}`} className="block p-2 hover:bg-accent rounded-md" onClick={() => setShowResults(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground">No results found.</div>
                                )}
                            </div>
                        )}
                    </div>
                    <Button variant="secondary" size="icon" className='mx-4 border-2 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-900'>
                        <BellIcon />
                    </Button>
                    <UserDropdown />
                </div>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='p-4 w-full block'
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </div>
            <CurrentStreakBadge />
        </SidebarProvider>
    )
}

export default Layout
