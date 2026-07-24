import React from "react"
import { Link } from "react-router-dom"
import { MapPin, Mail, Phone } from "lucide-react"
import logoDark from "@/assets/Hassan Associates Logo.png"

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] border-t border-white/10 text-white pt-16 pb-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
        {/* Column 1: Logo & Newsletter */}
        <div className="flex flex-col gap-4">
          <img src={logoDark} alt="Hassan Associates Logo" className="h-16 w-auto object-contain self-start" />
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            Stay Updated with us! Get Registered for Newsletter
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-none border border-slate-200 outline-none text-sm"
            />
            <button className="w-fit bg-[#cca328] hover:bg-[#d4af37] text-white font-bold py-2.5 px-6 rounded-none transition-colors uppercase text-xs tracking-wider shadow-md mt-1 cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide font-sans mb-6">
            Navigation<span className="text-[#cca328]">.</span>
          </h3>
          <ul className="flex flex-col gap-3 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Societies</a></li>
            <li><Link to="/about" className="hover:text-[#cca328] transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#cca328] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Societies Links */}
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide font-sans mb-6">
            Societies<span className="text-[#cca328]">.</span>
          </h3>
          <ul className="flex flex-col gap-3 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Park View City</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Blue World Shenzhen City</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Lahore Smart City</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Bahria Town</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Al Noor Orchard</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">DHA Lahore</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Deluxe Home</a></li>
            <li><a href="#" className="hover:text-[#cca328] transition-colors">Lahore Meadows City</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Details & Socials */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-white tracking-wide font-sans mb-1">
            Get in touch<span className="text-[#cca328]">.</span>
          </h3>
          <div className="flex items-start gap-3 text-slate-400 text-sm">
            <MapPin className="h-5 w-5 text-[#cca328] shrink-0 mt-0.5" />
            <span>39 Tulip block, Main commercial zone Park View City Lahore, Lahore, Pakistan</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Mail className="h-5 w-5 text-[#cca328] shrink-0" />
            <a href="mailto:hassanassociatesofficial@gmail.com" className="hover:text-[#cca328] transition-colors truncate">
              hassanassociatesofficial@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Phone className="h-5 w-5 text-[#cca328] shrink-0" />
            <a href="tel:+923004803710" className="hover:text-[#cca328] transition-colors">
              +92 300 4803710
            </a>
          </div>

          {/* Social Media SVG Icons */}
          <div className="flex items-center gap-4 text-white/70 mt-3 pl-1">
              <a href="https://www.facebook.com/HassanAcssociates" className="hover:text-[#cca328] transition-colors">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/hassanassociates/profilecard/?igsh=MThtb29zZHIzM2s5aA==" className="hover:text-[#cca328] transition-colors">
              <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://youtube.com/@hassanassoc?si=ReKWpkP8P4q3XLQi" className="hover:text-[#cca328] transition-colors">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@userwzgkkprjqh?is_from_webapp=1&sender_device=pc" className="hover:text-[#cca328] transition-colors">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.63-.67-.07 2.24-.06 4.48-.07 6.71-.05 2.29-.64 4.65-2.26 6.27-1.72 1.76-4.32 2.45-6.73 2.1-2.67-.35-5.11-2.29-5.91-4.88-.93-2.93-.15-6.43 2.05-8.62 1.5-1.53 3.66-2.34 5.82-2.3v4.01c-1.28-.04-2.62.4-3.5 1.34-.96 1-.95 2.7-.02 3.73.91 1.05 2.52 1.25 3.69.52.75-.45 1.13-1.32 1.13-2.19.02-3.82.01-7.65.01-11.48z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright notice */}
      <div className="border-t border-white/10 mt-16 p-2 text-center text-slate-500 text-xs sm:text-sm">
        <p>2024 All Rights Reserved.</p>
      </div>
    </footer>
  )
}
