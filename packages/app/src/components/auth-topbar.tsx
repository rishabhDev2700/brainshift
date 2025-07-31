import { ModeToggle } from './mode-toggle'
import { ZapIcon } from 'lucide-react'

function AuthTopbar() {
  return (
      <div className="py-2 px-4 flex justify-between border-b border-gray-200 shadow-sm md:text-2xl font-semibold">
          <nav className="flex items-center justify-start "><ZapIcon color="green" size={32} className="mx-4 fill-green-700" /><span>BrainShift</span></nav>
          <ModeToggle />
      </div>
  )
}

export default AuthTopbar
