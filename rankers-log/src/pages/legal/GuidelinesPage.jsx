import { Link } from 'react-router-dom'

export function GuidelinesPage() {
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
            Community Guidelines
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest">
            // CODE OF CONDUCT // BE EXCELLENT TO EACH OTHER
          </p>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Do
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                Be respectful and kind to other users
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                Share your genuine experiences and opinions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                Use spoiler tags when discussing plot details
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                Report content that violates our guidelines
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">cancel</span>
              Don't
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Post harassment, hate speech, or discriminatory content
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Share illegal content or piracy links
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Spam or engage in self-promotion
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Impersonate other users or public figures
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Enforcement</h2>
            <p className="text-gray-300 leading-relaxed">
              Violations of these guidelines may result in content removal, temporary suspension, 
              or permanent ban from the platform. We review all reports and take appropriate action.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
