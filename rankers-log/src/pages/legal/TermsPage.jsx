import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <div className="bg-[#050505] text-white font-display min-h-screen selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-glow mb-4">
            Terms of Service
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest">
            // LEGAL CODEX // LAST UPDATED: JANUARY 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Rankers Log, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">2. Use License</h2>
            <p className="text-gray-300 leading-relaxed">
              Permission is granted to temporarily use Rankers Log for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">3. User Account</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">4. Content Guidelines</h2>
            <p className="text-gray-300 leading-relaxed">
              Users must not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, 
              or otherwise objectionable. We reserve the right to remove any content that violates these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">5. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              The materials on Rankers Log are provided on an 'as is' basis. We make no warranties, 
              expressed or implied, and hereby disclaim and negate all other warranties.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
