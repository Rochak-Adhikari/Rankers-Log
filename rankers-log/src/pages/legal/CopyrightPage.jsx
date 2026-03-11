import { Link } from 'react-router-dom'

export function CopyrightPage() {
  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/legal/terms" className="hover:text-primary transition-colors">Legal</Link>
            <span>/</span>
            <span className="text-white">Copyright</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            DMCA & Copyright
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // CONTENT_RIGHTS // LEGAL_NOTICE
          </p>
        </div>
      </div>

      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 md:p-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">Last updated: January 2024</p>

          <h2 className="text-xl font-bold text-white mb-4">1. Copyright Policy</h2>
          <p className="text-gray-400 mb-6">
            Ranker's Log respects the intellectual property rights of others and expects users to do the same. 
            We will respond to notices of alleged copyright infringement that comply with applicable law and 
            are properly provided to us.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">2. DMCA Notice Requirements</h2>
          <p className="text-gray-400 mb-4">
            If you believe that your work has been copied in a way that constitutes copyright infringement, 
            please provide us with the following information:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>A physical or electronic signature of the copyright owner or authorized representative</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the infringing material and its location on our platform</li>
            <li>Your contact information (address, telephone number, email)</li>
            <li>A statement that you have a good faith belief the use is not authorized</li>
            <li>A statement under penalty of perjury that the information is accurate</li>
          </ul>

          <h2 className="text-xl font-bold text-white mb-4">3. Counter-Notification</h2>
          <p className="text-gray-400 mb-6">
            If you believe your content was removed in error, you may submit a counter-notification with:
            your signature, identification of the removed material, a statement under penalty of perjury 
            that you have a good faith belief the material was removed by mistake, and your consent to 
            jurisdiction of federal court.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">4. Repeat Infringers</h2>
          <p className="text-gray-400 mb-6">
            We will terminate the accounts of users who are determined to be repeat infringers. 
            A repeat infringer is a user who has been notified of infringing activity more than twice.
          </p>

          <h2 className="text-xl font-bold text-white mb-4">5. Contact Information</h2>
          <p className="text-gray-400 mb-6">
            Send DMCA notices to: <a href="mailto:dmca@rankerslog.com" className="text-primary hover:underline">dmca@rankerslog.com</a>
          </p>

          <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <h3 className="font-bold text-white mb-2">Need to file a takedown request?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Use our online form to submit a formal takedown request.
            </p>
            <Link 
              to="/takedown" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary/80 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">description</span>
              Submit Takedown Request
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
