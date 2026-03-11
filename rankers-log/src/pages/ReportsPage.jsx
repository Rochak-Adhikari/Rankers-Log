import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function ReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState('user')
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason || !details) return

    setSubmitting(true)

    await supabase.from('reports').insert({
      user_id: user.id,
      report_type: reportType,
      target_id: targetId || null,
      reason,
      details,
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
        <h2 className="text-2xl font-black text-white mb-2">Report Submitted</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Thank you for your report. Our moderation team will review it and take appropriate action.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false)
            setReason('')
            setDetails('')
            setTargetId('')
          }}
          className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors"
        >
          Submit Another Report
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-red-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
            Moderation Hub
          </h1>
          <p className="text-red-400/80 font-mono text-sm tracking-widest mt-1">
            // REPORT_SUBMISSION // FEEDBACK_SYSTEM
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#0a1016] border border-primary/30 rounded-lg p-4 mb-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-xl">info</span>
        <div>
          <p className="text-sm text-gray-400">
            Use this form to report violations of our community guidelines. All reports are reviewed by our moderation team within 24-48 hours. 
            False reports may result in action against your account.
          </p>
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-red-400">flag</span>
          Submit a Report
        </h3>

        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Report Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'user', label: 'User', icon: 'person' },
                { value: 'post', label: 'Post', icon: 'article' },
                { value: 'guild', label: 'Guild', icon: 'shield' },
                { value: 'bug', label: 'Bug', icon: 'bug_report' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setReportType(type.value)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    reportType === type.value
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">{type.icon}</span>
                  <p className="text-sm font-bold">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target ID */}
          {reportType !== 'bug' && (
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                {reportType === 'user' ? 'Username' : reportType === 'post' ? 'Post ID' : 'Guild Name'}
              </label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder={`Enter ${reportType} identifier...`}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            >
              <option value="">Select a reason...</option>
              <option value="harassment">Harassment or Bullying</option>
              <option value="spam">Spam or Scam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="impersonation">Impersonation</option>
              <option value="copyright">Copyright Violation</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!reason || !details || submitting}
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
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
