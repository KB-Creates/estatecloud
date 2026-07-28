import React from "react"
import { PillBadge } from "@/components/ui/pill-badge"
import { Plus, Filter } from "lucide-react"

export default function Features() {
  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24 relative z-20 overflow-hidden select-none">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        {/* Top Pill Badge */}
        <PillBadge tag="Features" label="Built for Real Estate" />

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight text-center mt-6 leading-[1.15] max-w-4xl">
          Foundation <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">🏢</span> for <br />
          <span className="inline-block hover:scale-110 transition-transform cursor-pointer">🚀</span> High-Performing Teams
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 text-center max-w-xl mx-auto leading-relaxed font-normal">
          Empower your property managers, brokers, and agents with tools that simplify listings, contracts, and tenant operations. All under one unified cloud.
        </p>

        {/* 2-Column Grid Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-14 w-full text-left">
          
          {/* Card 1 (Left - Smart Property & Unit Management) */}
          <div className="lg:col-span-7 bg-slate-100/80 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl sm:text-2xl font-medium text-slate-900 flex items-center gap-2">
                <span>🏢</span> Smart Property & Unit Management
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Assign, prioritize, and track property units with clarity. Stay focused with real-time tenant updates, unit statuses, and visual boards.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal"></p>
            </div>

            {/* Kanban Mockup UI Container */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm text-xs select-none mt-4 overflow-x-auto">
              {/* Kanban Navigation Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3 font-semibold text-slate-700">
                  <span className="text-slate-900 border-b-2 border-[#029474] pb-0.5">Units</span>
                  <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Properties</span>
                  <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Leases</span>
                </div>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 text-xs font-medium">
                  <Filter className="w-3 h-3" /> Filter
                </button>
              </div>

              {/* Kanban Board Columns */}
              <div className="grid grid-cols-3 gap-3 min-w-[500px]">
                {/* Column 1: New Listings */}
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                    <span>Listings (2)</span>
                    <Plus className="w-3.5 h-3.5 cursor-pointer text-slate-400" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs space-y-2">
                    <p className="font-semibold text-slate-800 text-xs">Luxury Apartment Unit 402</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-600 font-medium">Available</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">Residential</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Occupied / Active Leases */}
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-blue-600 font-semibold text-[11px] uppercase tracking-wider mb-1">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px]">Occupied (3)</span>
                    <Plus className="w-3.5 h-3.5 cursor-pointer text-slate-400" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs space-y-2">
                    <p className="font-semibold text-slate-800 text-xs">Penthouse Lease Renewal</p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                      <span className="text-slate-400 font-medium">May 17</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Maintenance */}
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-purple-600 font-semibold text-[11px] uppercase tracking-wider mb-1">
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md text-[10px]">Maintenance (1)</span>
                    <Plus className="w-3.5 h-3.5 cursor-pointer text-slate-400" />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs space-y-2">
                    <p className="font-semibold text-slate-800 text-xs">HVAC Repair & Inspection</p>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">In Progress</span>
                      <span className="text-slate-400 font-medium">May 11</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 (Right - Track Property Performance) */}
          <div className="lg:col-span-5 bg-slate-100/80 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl sm:text-2xl font-medium text-slate-900 flex items-center gap-2">
                <span>📊</span> Track Property Performance
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Get detailed insights on rent collection, occupancy rates, and revenue performance with customizable reports.
              </p>
            </div>

            {/* Analytics Chart Mockup UI Container */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-xs mt-4 flex flex-col justify-between h-full min-h-[220px]">
              {/* Curve Chart Graphic */}
              <div className="relative w-full h-36 flex items-center justify-center">
                {/* Tooltip Badge */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#029474] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md animate-bounce">
                  1,200+ Units Managed
                </div>
                
                {/* SVG Curve Line */}
                <svg className="w-full h-full text-[#029474]" viewBox="0 0 300 100" fill="none">
                  <path
                    d="M 10,80 Q 50,70 80,40 T 150,20 T 220,50 T 290,70"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10,80 Q 50,70 80,40 T 150,20 T 220,50 T 290,70 L 290,100 L 10,100 Z"
                    fill="url(#emerald-gradient)"
                    opacity="0.15"
                  />
                  <circle cx="150" cy="20" r="5" fill="#029474" className="animate-ping" />
                  <circle cx="150" cy="20" r="5" fill="#029474" />
                  <defs>
                    <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#029474" />
                      <stop offset="100%" stopColor="#029474" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Stat Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                <div>
                  <p className="text-lg sm:text-xl font-medium text-slate-900">98%</p>
                  <p className="text-[10px] text-slate-500 font-medium">Occupancy</p>
                </div>
                <div className="border-x border-slate-100">
                  <p className="text-lg sm:text-xl font-medium text-slate-900">Rs. 2.4M</p>
                  <p className="text-[10px] text-slate-500 font-medium">Rent Collected</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-medium text-slate-900">100%</p>
                  <p className="text-[10px] text-slate-500 font-medium">On-Time Leases</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3-Column Grid Row (Collaborate, Lease & Contract Alerts, Track Operations) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full text-left">
          
          {/* Card 1: Team Collaboration */}
          <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 mb-6">
              <h3 className="text-base sm:text-lg font-medium text-slate-900 flex items-center gap-2 tracking-tight whitespace-nowrap">
                <span>👥</span> Team Collaboration
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Assign property listings, share lease contracts, and collaborate seamlessly with your real estate team.
              </p>
            </div>

            {/* Mockup UI Container */}
            <div className="relative pt-6">
              {/* Floating Pill Toolbar */}
              <div className="mx-auto w-max bg-white/90 backdrop-blur border border-slate-200 shadow-md rounded-full px-3 py-1.5 flex items-center gap-3 text-slate-600 text-xs mb-3 z-10 relative">
                <span className="cursor-pointer hover:text-slate-900">✓</span>
                <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700 text-xs cursor-pointer hover:bg-slate-200">+</span>
                <span className="cursor-pointer hover:text-slate-900">🔗</span>
                <span className="cursor-pointer hover:text-slate-900">✏️</span>
              </div>

              {/* Assignees Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm text-xs space-y-3">
                <p className="font-semibold text-slate-700 text-xs">Property Agents</p>

                {/* Team member item 1 */}
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Michael Dam" className="w-8 h-8 rounded-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Michael Dam</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>💬 Chat</span>
                      <span>⊕ Quick Assign</span>
                    </div>
                  </div>
                </div>

                {/* Team member item 2 */}
                <div className="flex items-center gap-3 p-1.5 text-slate-600">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Lucas Gouvea" className="w-8 h-8 rounded-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Lucas Gouvea</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>💬 Chat</span>
                      <span>⊕ Quick Assign</span>
                    </div>
                  </div>
                </div>

                {/* Team member item 3 */}
                <div className="flex items-center gap-3 p-1.5 text-slate-600">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Jack Finnigan" className="w-8 h-8 rounded-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Jack Finnigan</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>💬 Chat</span>
                      <span>⊕ Quick Assign</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Real-Time Alerts */}
          <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 mb-6">
              <h3 className="text-base sm:text-lg font-medium text-slate-900 flex items-center gap-2 tracking-tight whitespace-nowrap">
                <span>🔔</span> Real-Time Alerts
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Get instant notifications about upcoming lease renewals, maintenance requests, and tenant updates in real-time.
              </p>
            </div>

            {/* Mockup UI Container */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm text-xs space-y-3 mt-4">
              <div>
                <p className="font-bold text-slate-900 text-xs">Property Activity</p>
                <p className="text-[11px] text-slate-500">You have <span className="text-blue-600 font-semibold cursor-pointer">5 notifications</span> today.</p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {/* Activity 1 */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] mt-0.5 shrink-0">✓</div>
                  <div>
                    <p className="text-slate-700 leading-snug"><span className="font-bold text-slate-900">Liam</span> marked <span className="font-bold text-slate-900">Penthouse Lease Agreement</span> as signed</p>
                    <span className="text-[10px] text-slate-400">Aug 11</span>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] mt-0.5 shrink-0">✏️</div>
                  <div>
                    <p className="text-slate-700 leading-snug"><span className="font-bold text-slate-900">Emma</span> created a new listing: <span className="font-bold text-slate-900">Commercial Villa 204</span></p>
                    <span className="text-[10px] text-slate-400">Aug 11</span>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] mt-0.5 shrink-0">🚩</div>
                  <div>
                    <p className="text-slate-700 leading-snug"><span className="font-bold text-slate-900">Ava</span> updated the due date of <span className="font-bold text-slate-900">Tenant Move-in Inspection</span> to Aug 14</p>
                    <span className="text-[10px] text-slate-400">Aug 11</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Track Operations */}
          <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 mb-6">
              <h3 className="text-base sm:text-lg font-medium text-slate-900 flex items-center gap-2 tracking-tight whitespace-nowrap">
                <span>⏱️</span> Track Operations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Keep track of progress on property listings, unit inspections, and lease contracts with real-time reporting.
              </p>
            </div>

            {/* Mockup UI Container */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm text-xs space-y-3.5 mt-4">
              <p className="font-bold text-slate-900 text-xs">Operations Progress</p>

              {/* Progress Bar 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>Property Listings</span>
                  <span className="text-slate-400 font-normal">3/8</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full w-[37.5%] rounded-full"></div>
                </div>
              </div>

              {/* Progress Bar 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>Unit Inspections</span>
                  <span className="text-slate-400 font-normal">6/10</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[60%] rounded-full"></div>
                </div>
              </div>

              {/* Progress Bar 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>Lease Agreements</span>
                  <span className="text-slate-400 font-normal">2/7</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[28.5%] rounded-full"></div>
                </div>
              </div>

              {/* Progress Bar 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>Maintenance Deals</span>
                  <span className="text-slate-400 font-normal">4/7</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[57%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
