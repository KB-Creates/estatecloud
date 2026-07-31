import React from "react"
import { Link } from "react-router-dom"
import g1Logo from "/g1.svg"

// Custom SVG Icons for maximum compatibility
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
    </svg>
  )
}

export default function Footer() {
  const productLinks = [
    { label: "Features", path: "/#features" },
    { label: "Integrations", path: "/#features" },
    { label: "Templates", path: "/#benefits" },
    { label: "Pricing Plans", path: "/subscription" },
  ]

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Meet Our Team", path: "/about" },
    { label: "Blog / Insights", path: "/#benefits" },
    { label: "FAQs", path: "/#faq" },
    { label: "Contact", path: "/contact" },
  ]

  const legalLinks = [
    { label: "Terms & Conditions", path: "/contact" },
    { label: "Privacy Policy", path: "/contact" },
    { label: "Cookie Policy", path: "/contact" },
    { label: "Help Center", path: "/contact" },
  ]

  return (
    <footer className="w-full bg-white relative z-20 overflow-hidden select-none border-t border-slate-100">
      {/* Perspective Grid Background Pattern matching reference image */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203, 213, 225, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203, 213, 225, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: 'perspective(450px) rotateX(60deg) translateY(-80px) scale(2.2)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Logo, Tagline, Social Icons */}
          <div className="lg:col-span-6 space-y-8">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={g1Logo} alt="EstateCloud Logo" className="h-9 w-auto object-contain" />
            </Link>

            {/* Headline exact copy style from image */}
            <h6 className=" font-semibold text-slate-900 tracking-tight leading-[1.22] max-w-md">
              Helping you grow smarter, faster with AI-powered tools.
            </h6>

            {/* Social Icons (Round Outlined Buttons) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <XIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Columns: Product, Company, Legal & Support */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Product Column */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-900 tracking-tight">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 font-normal">
                {productLinks.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-900 tracking-tight">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 font-normal">
                {companyLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support Column */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-900 tracking-tight">
                Legal & Support
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 font-normal">
                {legalLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EstateCloud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
