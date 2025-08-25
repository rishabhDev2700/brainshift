import { ModeToggle } from './mode-toggle'
import { ZapIcon } from 'lucide-react'

function AuthTopbar() {
  return (
      <div className="py-2 px-4 flex justify-between border-b-2 border-black/20 shadow-sm md:text-2xl font-semibold fixed w-full backdrop-blur-3xl bg-white/10 z-50">
          <nav className="flex items-center justify-start text-emerald-600 md:text-white"><ZapIcon color="green" size={32} className="mx-4 fill-green-700" /><span>BrainShift</span></nav>
          <ModeToggle />
      </div>
  )
}

export default AuthTopbar
