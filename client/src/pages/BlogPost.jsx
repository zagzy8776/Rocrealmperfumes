import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts, getRelatedPosts } from '../lib/blogPosts.js';
import { setPageMeta, setArticleStructuredData, setFAQStructuredData } from '../lib/seo.js';
import { LOCATION_KEYWORD_LINE } from '../lib/keywords.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ReviewCTA from '../components/ReviewCTA.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);
  const related = getRelatedPosts(slug, 3);

  useEffect(() => {
    if (!post) return;
    setPageMeta({
      title: post.seoTitle || post.title,
      description: post.excerpt,
      type: 'article',
      image: post.image,
      keywords: (post.keywords || []).join(', '),
    });
    setArticleStructuredData(post);
    if (post.faq?.length) setFAQStructuredData(post.faq);
  }, [post]);

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Article not found</h1>
        <Link to="/blog" className="mt-5 inline-block text-amber-800">Back to blog</Link>
      </main>
    );
  }

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Fragrance Journal', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-sm uppercase tracking-[0.3em] text-amber-700">Roc Realm Journal</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{post.title}</h1>
      <p className="mt-3 text-sm text-stone-500">
        Published {new Date(post.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p className="mt-5 text-lg leading-8 text-stone-600">{post.excerpt}</p>

      <article className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        {post.sections?.length > 0
          ? post.sections.map((section) => (
              <section key={section.heading} className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-stone-950">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-8 text-stone-700">{paragraph}</p>
                ))}
              </section>
            ))
          : post.content.map((paragraph) => (
              <p key={paragraph} className="mb-5 leading-8 text-stone-700">{paragraph}</p>
            ))}

        {post.faq?.length > 0 && (
          <section className="mt-6 rounded-2xl bg-amber-50 p-5">
            <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
            {post.faq.map((item) => (
              <div key={item.question} className="mt-4">
                <h3 className="font-semibold text-stone-900">{item.question}</h3>
                <p className="mt-1 text-sm leading-7 text-stone-700">{item.answer}</p>
              </div>
            ))}
          </section>
        )}

        <div className="mt-8 rounded-2xl bg-amber-50 p-5">
          <strong>Need help choosing?</strong>
          <p className="mt-2 text-sm text-stone-600">
            Use our perfume finder quiz or chat with Roc Realm on WhatsApp for a personal recommendation. We deliver across {LOCATION_KEYWORD_LINE}.
          </p>
          <Link to="/perfume-finder" className="mt-4 inline-block rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Try perfume finder</Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-3xl font-semibold">More perfume guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} to={`/blog/${item.slug}`} className="rounded-[1.5rem] bg-white p-5 text-sm shadow-sm transition hover:-translate-y-1">
                <strong className="block font-display text-lg text-stone-950">{item.title}</strong>
                <span className="mt-2 block text-stone-600">{item.excerpt}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8"><ReviewCTA compact /></div>
    </main>
  );
}