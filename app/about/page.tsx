'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiMapPin, 
  FiUsers, 
  FiShield, 
  FiGlobe, 
  FiCheckCircle, 
  FiActivity,
  FiArrowRight
} from 'react-icons/fi';

const stats = [
  { label: 'Active Travelers', value: '50K+', icon: FiUsers },
  { label: 'Verified Guides', value: '1,200+', icon: FiCheckCircle },
  { label: 'Global Destinations', value: '85+', icon: FiGlobe },
  { label: 'Tour Security', value: '100%', icon: FiShield },
];

const pillars = [
  {
    role: "The Traveler",
    title: "Seamless Exploration",
    desc: "Browse curated tours, pay securely via encrypted gateways, and manage bookings through a dedicated dashboard.",
    accent: "border-amber-600/20"
  },
  {
    role: "The Guide",
    title: "Expert Sovereignty",
    desc: "Local experts create specialized tours, manage their own availability, and retain 80% of every transaction.",
    accent: "border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.1)]"
  },
  {
    role: "The Admin",
    title: "Total Oversight",
    desc: "A centralized command center verifies credentials, manages disputes, and ensures platform integrity 24/7.",
    accent: "border-amber-600/20"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-amber-600 selection:text-black">
      
      {/* HERO SECTION - Dark Gray & Amber Focus */}
      <section className="relative pt-32 pb-20 px-6 border-b border-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-[2px] bg-amber-600" />
            <span className="text-amber-600 font-mono tracking-[0.3em] uppercase text-sm font-bold">
              Est. 2025 // Protocol
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-[120px] font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic"
          >
            THE <span className="text-amber-600">ARCHITECTS</span> <br /> OF TRAVEL.
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 leading-relaxed border-l-2 border-gray-800 pl-8"
            >
              We’ve built a high-performance ecosystem where local expertise meets 
              enterprise-grade security. Our platform empowers guides to lead and 
              travelers to explore without friction.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-end"
            >
              <div className="bg-gray-900 border border-gray-800 p-2 rounded-2xl">
                <div className="bg-amber-600 text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-white transition-colors cursor-pointer">
                   <Link href="/"> EXPLORE THE SYSTEM</Link> <FiArrowRight />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <span className="text-amber-600 mb-2"><stat.icon size={24} /></span>
              <span className="text-4xl font-black text-white">{stat.value}</span>
              <span className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PILLARS SECTION - Modern Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-white mb-20 uppercase italic tracking-tighter">
            System <span className="text-amber-600">Core</span>
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`p-10 bg-gray-900 rounded-3xl border ${pillar.accent} transition-all duration-500`}
              >
                <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center mb-8">
                  <FiActivity className="text-amber-600" />
                </div>
                <span className="text-amber-600 font-mono text-xs uppercase tracking-widest font-bold">
                  {pillar.role}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-4 uppercase">{pillar.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMIN CONTROL PREVIEW */}
      <section className="py-32 px-6 bg-gray-900/50 border-y border-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
              Platform <br /> <span className="text-amber-600">Governance</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Every guide profile is manually vetted. Every transaction is audited. Our administrative layer ensures that quality isn't just a promise—it's the standard.
            </p>
            <ul className="space-y-4">
              {['Identity Verification', 'Automated Payouts', 'Dispute Resolution'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white font-bold uppercase text-sm italic">
                  <FiCheckCircle className="text-amber-600" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full aspect-video bg-gray-950 border border-amber-600/20 rounded-3xl relative overflow-hidden flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-amber-600/5 group-hover:bg-amber-600/10 transition-colors" />
            <FiShield size={120} className="text-amber-600 opacity-20" />
            <div className="absolute bottom-8 left-8">
              <p className="text-amber-600 font-mono text-[10px] tracking-widest uppercase font-bold">Security Status: Active</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter mb-12">
            JOIN THE <span className="text-amber-600">FLOW.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-amber-600 text-black px-12 py-5 rounded-full font-black text-xl hover:shadow-[0_0_40px_rgba(217,119,6,0.4)] transition-all">
                <Link href="/explore">BOOK A TOUR</Link>
            </button>
            <button className="border border-gray-800 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-gray-900 transition-all">
               <Link href="/auth/register?role=guide"> BECOME A GUIDE</Link>
             
            </button>
          </div>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-gray-900 bg-black text-center">
        <p className="text-gray-600 font-mono text-[10px] tracking-[0.5em] uppercase font-bold">
          LocalGuide.Platform // SECURE_TRANSIT_ENABLED // {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}