import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  UserPlus, 
  FileText, 
  Search, 
  ShieldCheck, 
  Bell, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground.jsx';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-6 flex justify-between items-center text-left group transition-colors rounded-lg
          !bg-zinc-900 hover:!bg-emerald-700 focus:!bg-emerald-700
          ${isOpen ? '!bg-emerald-700 border border-emerald-500' : ''}
        `}
      >
        <span className="text-lg font-medium !text-zinc-100 group-hover:!text-emerald-400 transition-colors">
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-emerald-400 group-hover:text-emerald-500 transition-all duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Home = () => {
  const features = [
    {
      title: "User Registration & Login",
      description: "Secure and seamless onboarding process for citizens to access the platform.",
      icon: UserPlus,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Raise Complaints",
      description: "Easy-to-use forms to report grievances across various transport categories.",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Complaint Tracking",
      description: "Real-time visibility into the status and progress of your reported issues.",
      icon: Search,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Admin Management",
      description: "Powerful dashboard for authorities to monitor, assign, and resolve grievances.",
      icon: ShieldCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Notification System",
      description: "Instant alerts and updates on complaint status changes and resolutions.",
      icon: Bell,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Feedback System",
      description: "Direct channel for users to provide suggestions and rate transport services.",
      icon: MessageSquare,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    }
  ];

  const faqs = [
    {
      question: "How do I track my complaint?",
      answer: "Once you log in to your User Dashboard, navigate to the 'My Complaints' section. You can see the real-time status (Pending, In Progress, or Resolved) of all your submitted grievances."
    },
    {
      question: "What categories of complaints can I raise?",
      answer: "You can report issues related to Bus Services, Metro Services, Infrastructure (broken seats, lighting), Staff Behavior, Cleanliness, and Safety."
    },
    {
      question: "How long does it take to resolve a grievance?",
      answer: "Resolution times vary based on the complexity of the issue. However, our system is designed to streamline the process, and you will receive instant notifications as soon as there is an update."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, Resolve-It uses enterprise-grade encryption and secure authentication protocols to ensure that your personal data and grievances are protected."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden flex flex-col">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 font-bold text-xl">R</div>
          <span className="text-2xl font-bold tracking-tight">Resolve-It</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 text-zinc-400 hover:text-zinc-100 transition-colors font-medium">
            Sign In
          </Link>
          <Link to="/signup" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl font-bold transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 text-center max-w-7xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Smart Grievance <br /> Management
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A modern, efficient, and transparent feedback system for public transport. 
            Empowering citizens and streamlining administration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-32">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group transition-all"
            >
              Raise a Complaint
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 rounded-2xl font-bold text-lg transition-all"
            >
              Admin Portal
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="w-full mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-zinc-500">Everything you need for a seamless grievance resolution experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl text-left hover:border-zinc-700 transition-all group"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-500">Find answers to common questions about the Resolve-It platform.</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-2 sm:p-8 text-left">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full bg-emerald-500 rounded-[2.5rem] p-12 md:p-20 text-zinc-950 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to improve your commute?</h2>
            <p className="text-zinc-900/70 text-lg mb-10 max-w-xl mx-auto">Join thousands of citizens making public transport better for everyone.</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 text-emerald-500 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Get Started Now
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-12 border-t border-zinc-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold">R</div>
          <span className="text-xl font-bold tracking-tight">Resolve-It</span>
        </div>
        <p className="text-zinc-600 text-sm mb-4">
          Empowering citizens through smart grievance management.
        </p>
        <div className="flex justify-center gap-8 text-zinc-500 text-sm mb-8">
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Contact Us</a>
        </div>
        <p className="text-zinc-700 text-xs">
          &copy; 2026 Resolve-It. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
