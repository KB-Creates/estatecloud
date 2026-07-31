import React, { useState } from "react"
import { PillBadge } from "@/components/ui/pill-badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Search,
  Sparkles,
  ArrowRight,
  Headphones,
} from "lucide-react"

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "features", label: "Features & Tools" },
    { id: "security", label: "Security & Cloud" },
    { id: "pricing", label: "Pricing & Plans" },
  ]

  const faqs = [
    {
      id: "faq-1",
      category: "general",
      question: "What is EstateCloud and who is it designed for?",
      answer:
        "EstateCloud is an all-in-one real estate workspace designed for real estate agencies, property managers, brokers, and developers. It unifies property listings, unit management, lead tracking, rent collection, lease contracts, and financial analytics into one seamless cloud application.",
    },
    {
      id: "faq-2",
      category: "features",
      question: "Can I manage multiple properties and lease agreements in one place?",
      answer:
        "Yes! EstateCloud empowers you to manage unlimited residential and commercial properties, individual units, tenant records, and legal lease contracts across multiple cities or societies with real-time status updates and document generation.",
    },
    {
      id: "faq-3",
      category: "features",
      question: "How does the AI-assisted valuation and lead pipeline work?",
      answer:
        "EstateCloud includes built-in smart AI tools that analyze market trends, prioritize incoming lead inquiries, suggest property valuation ranges, auto-draft lease agreements, and notify agents on urgent lead follow-ups.",
    },
    {
      id: "faq-4",
      category: "security",
      question: "Is my agency's client and financial data secure?",
      answer:
        "Security is our top priority. EstateCloud employs enterprise-grade 256-bit SSL encryption, automated daily cloud backups, localized role-based permissions (RBAC), and full activity logging to keep your data protected.",
    },
    {
      id: "faq-5",
      category: "pricing",
      question: "Does EstateCloud offer a free trial or demo session?",
      answer:
        "Yes! We provide a 14-day free trial with unrestricted access to all features so your team can test-drive EstateCloud. No credit card is required. You can also request a live 1-on-1 walk-through with our team.",
    },
    {
      id: "faq-6",
      category: "general",
      question: "Can I assign custom access roles to my agents and staff?",
      answer:
        "Absolutely. You can create customized roles (Admin, Agent, Property Manager, Accountant, Owner) and fine-tune permission levels to control who can view, edit, or delete sensitive records and financial statements.",
    },
    {
      id: "faq-7",
      category: "security",
      question: "Can I export data, invoices, and financial reports anytime?",
      answer:
        "Yes, you have complete ownership of your data. All financial statements, rent ledgers, tenant lists, and property databases can be exported in Excel (.xlsx), CSV, or print-ready PDF formats with one click.",
    },
    {
      id: "faq-8",
      category: "pricing",
      question: "What payment options are available and can I switch plans?",
      answer:
        "We support all major credit cards, debit cards, direct bank wire transfers, and local payment methods. You can upgrade, downgrade, or cancel your subscription at any time without hidden fees.",
    },
  ]

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24 relative z-20 overflow-hidden select-none border-t border-slate-200/60">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Top Pill Badge */}
        <PillBadge tag="FAQ" label="Everything You Need To Know" />

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight text-center mt-6 leading-[1.15] max-w-3xl">
          Frequently Asked <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">💡</span> Questions
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mt-4 font-normal leading-relaxed">
          Have questions about EstateCloud? Find quick answers about our features, security, pricing, and how to get started.
        </p>

        {/* Search Input Bar */}
        <div className="relative w-full max-w-md mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., trial, security, lease)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#029474]/30 focus:border-[#029474] transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion FAQ List */}
        <div className="w-full mt-10 text-left">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-white border border-slate-200/80 rounded-2xl px-6 py-1 shadow-sm hover:border-slate-300 transition-all"
                >
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-slate-900 hover:no-underline py-4">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#029474] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1 pb-5 pl-8 font-normal">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No matching questions found.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-2 text-xs font-semibold text-[#029474] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Support Banner Box */}
        <div className="w-full mt-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#029474]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center md:text-left space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-emerald-300 border border-white/10 mb-1">
              <Headphones className="w-3.5 h-3.5" /> 24/7 Priority Support
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
              Still have questions?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Can't find the answer you're looking for? Speak directly with our dedicated property software specialists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <a href="/contact" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#029474] hover:bg-[#028065] text-white rounded-xl px-6 py-6 font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#029474]/25 transition-all">
                <MessageCircle className="w-4 h-4" /> Get in Touch <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
