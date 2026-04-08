import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const FeedbackForm = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const saveFeedback = () => {
    const existing = JSON.parse(localStorage.getItem('resolve_it_feedbacks') || '[]');
    const newEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `fb_${Date.now()}`,
      userId: user?.id ?? 'guest',
      userName: user?.name ?? 'Guest',
      message: feedback,
      rating,
      date: new Date().toISOString(),
    };
    localStorage.setItem('resolve_it_feedbacks', JSON.stringify([newEntry, ...existing]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return; // should never happen thanks to disabled button, but guard anyway

    saveFeedback();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedback('');
    setRating(0);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#22c55e' }}>Service Feedback</h3>
        <p className="text-zinc-400 mb-8 text-sm">Your feedback helps us improve public transport services.</p>
        
        {submitted && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-xl text-sm font-medium">
            Thank you for your valuable feedback!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="block text-sm font-medium text-zinc-300 mb-2">How would you rate your experience?</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="rounded-full p-2 transition-colors bg-transparent border border-zinc-700"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={
                        `w-6 h-6 ${
                          isActive ? 'text-amber-400' : 'text-zinc-600'
                        }`
                      }
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                  </button>
                );
              })}
              <span className="text-xs text-zinc-500">
                {rating ? `You rated this ${rating} star${rating > 1 ? 's' : ''}` : 'Select your rating'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Tell us more</label>
            <textarea
              required
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or what could be better..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!feedback.trim() || rating === 0}
            className={`w-full text-zinc-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              !feedback.trim() || rating === 0
                ? 'bg-zinc-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
