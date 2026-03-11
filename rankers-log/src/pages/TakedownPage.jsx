import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function TakedownPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    contentUrl: '',
    originalWork: '',
    ownershipProof: '',
    contactEmail: '',
    contactName: '',
    signature: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.signature) return

    setSubmitting(true)

    await supabase.from('takedown_requests').insert({
      user_id: user?.id,
      content_url: formData.contentUrl,
      original_work: formData.originalWork,
      ownership_proof: formData.ownershipProof,
      contact_email: formData.contactEmail,
      contact_name: formData.contactName,
      status: 'pending'
    })

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Request Submitted</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Your takedown request has been received. We will review it and respond within 5-7 business days.
        </p>
        <p className="text-xs text-gray-500 font-mono mb-6">Request ID: TKD-{Date.now().toString(36).toUpperCase()}</p>
        <Link to="/feed" className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors">
          Return to Feed
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-red-500 pl-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/legal/copyright" className="hover:text-primary transition-colors">Copyright</Link>
            <span>/</span>
            <span className="text-white">Takedown Request</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
            Formal Claim
          </h1>
          <p className="text-red-400/80 font-mono text-sm tracking-widest mt-1">
            // TAKEDOWN_REQUEST // DMCA_NOTICE
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-yellow-500 text-xl">warning</span>
        <div>
          <p className="text-sm text-gray-400">
            Filing a false DMCA takedown request is illegal and may result in legal consequences. 
            Please only submit this form if you are the copyright owner or authorized to act on their behalf.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Infringing Content URL *</label>
            <input
              type="url"
              required
              value={formData.contentUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, contentUrl: e.target.value }))}
              placeholder="https://rankerslog.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Original Work Description *</label>
            <textarea
              required
              value={formData.originalWork}
              onChange={(e) => setFormData(prev => ({ ...prev, originalWork: e.target.value }))}
              placeholder="Describe the original copyrighted work..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Proof of Ownership *</label>
            <textarea
              required
              value={formData.ownershipProof}
              onChange={(e) => setFormData(prev => ({ ...prev, ownershipProof: e.target.value }))}
              placeholder="Provide links or evidence of your ownership..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                placeholder="Legal name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Contact Email *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.signature}
                onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.checked }))}
                className="mt-1 accent-red-500"
              />
              <span className="text-sm text-gray-400">
                I declare under penalty of perjury that I am the copyright owner or am authorized to act on their behalf, 
                that I have a good faith belief that use of the material is not authorized, and that the information in 
                this notification is accurate. I understand that filing a false claim may result in legal consequences.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formData.signature || submitting}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Submit Takedown Request
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
