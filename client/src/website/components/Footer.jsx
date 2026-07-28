import React from "react"
import { Link } from "react-router-dom"
import g1Logo from "/g1.svg"
 
export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-6 text-slate-500 text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo & Copyright */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src={g1Logo} alt="EstateCloud Logo" className="h-8 w-auto object-contain" />
          </Link>
          <span className="text-slate-400">|</span>
          <p className="text-slate-500">
            © {new Date().getFullYear()} EstateCloud. All rights reserved.
          </p>
        </div>

        {/* Right: Simple Links */}
        <div className="flex items-center gap-6 text-slate-600 font-medium text-xs sm:text-sm">
          <Link to="/" className="hover:text-[#029474] transition-colors">Home</Link>
          <Link to="/about" className="hover:text-[#029474] transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-[#029474] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
