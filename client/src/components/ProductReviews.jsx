import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { api } from '../lib/api.js';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      setReviews(res.data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await api.post('/reviews', { ...form, productId });
      setForm({ name: '', rating: 5, comment: '' });
      setShowForm(false);
      setMessage('Review submitted successfully!');
      await loadReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  if (loading) return <div className="mt-12 text-center text-stone-500">Loading reviews...</div>;

  return (
    <section className="mt-16 rounded-[2rem] bg-white p-8 shadow-sm">
      <h2 className="font-display text-3xl font-semibold">Customer Reviews</h2>
      
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-stone-950">{averageRating}</div>
            <div>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                    className={star <= Math.round(averageRating) ? 'text-amber-500' : 'text-stone-300'}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-stone-500">{reviews.length} reviews</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {ratingCounts.map(({ star, count }) => {
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8">{star} ★</span>
                  <div className="flex-1 h-2 rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-stone-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700"
            >
              <MessageSquare size={18} /> Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold">Share your experience</h3>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none"
              />
              <div>
                <label className="mb-2 block text-sm font-semibold">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-2 transition hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={star <= form.rating ? 'currentColor' : 'none'}
                        className={star <= form.rating ? 'text-amber-500' : 'text-stone-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Your review..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                required
                rows={3}
                className="w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-stone-300 px-6 py-3 font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
              </div>
              {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-stone-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="rounded-2xl bg-stone-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold">{review.name}</strong>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                          className={star <= review.rating ? 'text-amber-500' : 'text-stone-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{review.comment}</p>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
