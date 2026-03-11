import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function AppealPage() {
  const { user } = useAuth()
  const [appealType, setAppealType] = useState('suspension')
  const [details, setDetails] = useState('')
  const [evidence, setEvidence] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!details) return

    setSubmitting(true)

    await supabase.from('appeals').insert({
      user_id: user.id,
      appeal_type: appealType,
      details,
      evidence,
      status: 'pending'
    })

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-primary">gavel</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Appeal Submitted</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Your appeal has been submitted for review. Our team will respond within 3-5 business days via email.
        </p>
        <p className="text-xs text-gray-500 font-mono">Appeal ID: APL-{Date.now().toString(36).toUpperCase()}</p>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-yellow-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}>
            Dispute Form
          </h1>
          <p className="text-yellow-400/80 font-mono text-sm tracking-widest mt-1">
            // APPEAL_REQUEST // DISPUTE_RESOLUTION
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#0a1016] border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-yellow-500 text-xl">balance</span>
        <div>
          <p className="text-sm text-gray-400">
            If you believe a moderation action was taken against you in error, you may submit an appeal. 
            Please provide all relevant information and evidence to support your case. 
            Appeals are reviewed in the order they are received.
          </p>
        </div>
      </div>

      {/* Appeal Form */}
      <form onSubmit={handleSubmit} className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-500">gavel</span>
          Submit an Appeal
        </h3>

        <div className="space-y-6">
          {/* Appeal Type */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Appeal Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'suspension', label: 'Account Suspension', icon: 'block' },
                { value: 'content_removal', label: 'Content Removal', icon: 'delete' },
                { value: 'warning', label: 'Warning/Strike', icon: 'warning' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setAppealType(type.value)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    appealType === type.value
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">{type.icon}</span>
                  <p className="text-sm font-bold">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Explain Your Case</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe why you believe the action was taken in error..."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Supporting Evidence (Optional)</label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Provide links, screenshots, or other evidence..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">You can paste URLs to images or documents</p>
          </div>

          {/* Terms */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              <span className="text-sm text-gray-400">
                I confirm that the information provided is accurate and complete. I understand that submitting false information may result in additional action against my account.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!details || submitting}
            className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Submit Appeal
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
