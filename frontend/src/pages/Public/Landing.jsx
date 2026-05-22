import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, ShieldCheck, Truck, BarChart3, Activity } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              The Future of B2B Medical Supplies
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Smart Medical Supply <br className="hidden md:block"/> Management Platform
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Connect directly with verified suppliers, manage your inventory with real-time analytics, and streamline your entire procurement process on one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
                <Link to="/catalog">Browse Medicines <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-700 text-slate-900 hover:bg-slate-800 hover:text-white dark:text-white dark:hover:bg-slate-800" asChild>
                <Link to="/register">Become a Supplier</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Enterprise-Grade Architecture</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built for scale, security, and speed. HiMed provides the tools you need to manage your medical supply chain efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-emerald-500" />}
              title="Verified & Secure"
              description="All suppliers undergo a rigorous admin approval workflow. Multi-factor authentication keeps your data safe."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Truck className="h-8 w-8 text-blue-500" />}
              title="Seamless Procurement"
              description="Track orders in real-time. Automated notifications keep you updated from placement to delivery."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-indigo-500" />}
              title="Intelligent Analytics"
              description="Real-time dashboards, low-stock detection, and comprehensive analytics to optimize your inventory."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="500+" label="Verified Suppliers" />
            <StatCard number="10k+" label="Medical Products" />
            <StatCard number="$50M+" label="Transaction Volume" />
            <StatCard number="99.9%" label="Uptime SLA" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your supply chain?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Join hundreds of healthcare facilities and top-tier suppliers already using HiMed.</p>
          <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full text-primary font-bold shadow-xl hover:scale-105 transition-transform" asChild>
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
    >
      <div className="h-14 w-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-primary mb-2">{number}</div>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}
