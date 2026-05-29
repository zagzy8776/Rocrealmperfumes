import { useMemo, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { whatsappNumber } from '../lib/api.js';

const options = {
  gender: ['Female', 'Male', 'Unisex'],
  budget: ['Under ₦20,000', '₦20,000 - ₦50,000', '₦50,000+'],
  mood: ['Sweet', 'Fresh', 'Oud', 'Floral', 'Woody', 'Musk'],
  occasion: ['Everyday', 'Office', 'Date night', 'Gift', 'Event'],
  strength: ['Soft', 'Moderate', 'Strong'],
};

export default function PerfumeFinder() {
  const [answers, setAnswers] = useState({ gender: '', budget: '', mood: '', occasion: '', strength: '' });
  const complete = Object.values(answers).every(Boolean);
  const recommendation = useMemo(() => complete ? `A ${answers.strength.toLowerCase()} ${answers.mood.toLowerCase()} ${answers.gender.toLowerCase()} scent for ${answers.occasion.toLowerCase()}, within ${answers.budget}.` : 'Answer the questions to get a scent direction.', [answers, complete]);
  const message = encodeURIComponent(`Hello Roc Realm Perfumes, this is my scent profile:\nGender: ${answers.gender}\nBudget: ${answers.budget}\nMood: ${answers.mood}\nOccasion: ${answers.occasion}\nStrength: ${answers.strength}\n\nRecommendation idea: ${recommendation}\nPlease suggest products for me.`);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12"><p className="text-sm uppercase tracking-[0.3em] text-amber-300">Perfume Finder</p><h1 className="mt-3 font-display text-5xl font-semibold">Find your signature scent.</h1><p className="mt-4 max-w-2xl text-stone-300">Answer a few questions and send your scent profile to Roc Realm for a personal WhatsApp recommendation.</p></section>
      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {Object.entries(options).map(([key, values]) => <div key={key} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl capitalize">{key === 'mood' ? 'Scent mood' : key}</h2><div className="mt-4 flex flex-wrap gap-3">{values.map((value) => <button key={value} onClick={() => setAnswers({ ...answers, [key]: value })} className={`rounded-full px-5 py-3 text-sm font-semibold ${answers[key] === value ? 'bg-stone-950 text-white' : 'bg-amber-50 text-amber-900'}`}>{value}</button>)}</div></div>)}
        </div>
        <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white"><Sparkles className="text-amber-300" /><h2 className="mt-4 font-display text-3xl">Your scent profile</h2><p className="mt-4 leading-7 text-stone-300">{recommendation}</p><a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-4 font-semibold ${complete ? 'bg-green-600 text-white' : 'pointer-events-none bg-white/10 text-stone-400'}`}><MessageCircle size={18} /> Send my scent profile</a></aside>
      </section>
    </main>
  );
}