import { Link } from 'react-router-dom'

export function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest">
            // DATA RIGHTS // LAST UPDATED: JANUARY 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, 
              log your activities, or contact us for support. This includes your username, email address, 
              and activity logs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, 
              to process your requests, and to send you technical notices and support messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">3. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not share your personal information with third parties except as described in this policy. 
              We may share information with your consent or to comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We take reasonable measures to help protect your personal information from loss, theft, 
              misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">5. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You may access, update, or delete your account information at any time through your account settings. 
              You may also request a copy of your data or request that we delete your account entirely.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
