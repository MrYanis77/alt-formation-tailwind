import React from 'react';
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CallToAction from '../components/CallToAction';

import Faq from '../components/Faq';

import faqData from '../data/json/faq.json';

export default function FaqPage() {
    const heroData = faqData[0].hero;
    const staticCategories = faqData.slice(1);
    // const user = null;

    // const [publishedItems, setPublishedItems] = useState([]);

    // useEffect(() => {
    //     fetch('/api/faq/published', { credentials: 'include' })
    //         .then((r) => r.ok ? r.json() : null)
    //         .then((data) => {
    //             if (data?.success) setPublishedItems(data.items);
    //         })
    //         .catch(() => { /* ignore */ });
    // }, []);

    // const mergedCategories = React.useMemo(() => {
    //     if (publishedItems.length === 0) return staticCategories;
    //
    //     const cloned = staticCategories.map((c) => ({
    //         ...c,
    //         questions: [...(c.questions || [])],
    //     }));
    //
    //     publishedItems.forEach((item) => {
    //         const cat = item.categorie || 'Général';
    //         let target = cloned.find((c) => c.categorie === cat);
    //         if (!target) {
    //             target = { categorie: cat, questions: [] };
    //             cloned.push(target);
    //         }
    //         target.questions.push({ q: item.question, a: item.reponse });
    //     });
    //
    //     return cloned;
    // }, [staticCategories, publishedItems]);

    return (
        <div className="bg-white min-h-screen antialiased">
            <Hero
                title={heroData.titre}
                subtitle={heroData.sousTitre}
                video={heroData.video}
            />

            <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]} />

            <main className="max-w-container-2xl mx-auto py-12 px-6" id="main-content">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-xl md:text-2xl font-extrabold text-primary uppercase tracking-wider mb-4">
                        Comment pouvons-nous vous aider ?
                    </h2>
                    <p className="text-content-muted text-sm leading-relaxed">
                        Parcourez nos catégories pour trouver rapidement la réponse que vous cherchez.
                    </p>
                </div>

                <Faq data={staticCategories} />

                {/* <AskQuestionSection user={user} /> */}
            </main>

            <CallToAction
                variante="sombre"
                titre="Encore une question ?"
                sousTitre="Nos conseillers sont disponibles pour vous répondre."
                texteBouton="Contactez-nous"
                lienBouton="/contact"
            />
        </div>
    );
}

// function AskQuestionSection({ user }) {
//     const [question, setQuestion] = useState('');
//     const [submitting, setSubmitting] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState('');
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         if (!question.trim()) return;
//         setSubmitting(true);
//         setError('');
//         setSuccess(false);
//         try {
//             const res = await fetch('/api/faq/requests', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ question: question.trim() }),
//             });
//             const data = await res.json();
//             if (!res.ok || !data.success) throw new Error(data.error || 'Erreur');
//             setSuccess(true);
//             setQuestion('');
//         } catch (err) {
//             setError(err.message || 'Erreur');
//         } finally {
//             setSubmitting(false);
//         }
//     };
//
//     return (
//         <section className="mt-16 bg-surface-soft rounded-2xl border border-gray-200 p-6 sm:p-10">
//             <div className="max-w-2xl mx-auto">
//                 <h3 className="font-heading text-lg md:text-xl font-extrabold text-primary uppercase tracking-wider mb-3 text-center">
//                     Vous n'avez pas trouvé votre réponse ?
//                 </h3>
//
//                 {!user ? (
//                     <div className="text-center">
//                         <p className="text-content-muted text-sm mb-5">
//                             Connectez-vous pour poser votre question directement à notre équipe. Vous recevrez la réponse dans votre espace personnel.
//                         </p>
//                         <div className="flex flex-wrap items-center justify-center gap-3">
//                             <Link
//                                 to="/connexion"
//                                 state={{ from: '/faq' }}
//                                 className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-lg no-underline text-sm"
//                             >
//                                 Se connecter
//                             </Link>
//                             <Link
//                                 to="/inscription"
//                                 className="border border-gray-300 hover:border-accent text-content-dark font-bold px-6 py-3 rounded-lg no-underline text-sm"
//                             >
//                                 Créer un compte
//                             </Link>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         <p className="text-content-muted text-sm mb-5 text-center">
//                             Posez votre question : un administrateur vous répondra et la réponse pourra être ajoutée à la FAQ.
//                         </p>
//
//                         {success && (
//                             <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
//                                 Merci ! Votre question a été envoyée à l'équipe. Vous pouvez suivre la réponse depuis <Link to="/mon-espace" className="font-bold underline">votre espace</Link>.
//                             </div>
//                         )}
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
//                                 {error}
//                             </div>
//                         )}
//
//                         <form onSubmit={onSubmit} className="space-y-3">
//                             <textarea
//                                 value={question}
//                                 onChange={(e) => setQuestion(e.target.value)}
//                                 placeholder="Quelle est votre question ?"
//                                 rows={4}
//                                 maxLength={1000}
//                                 className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-white"
//                             />
//                             <button
//                                 type="submit"
//                                 disabled={submitting || !question.trim()}
//                                 className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg text-sm w-full sm:w-auto"
//                             >
//                                 {submitting ? 'Envoi...' : 'Envoyer ma question'}
//                             </button>
//                         </form>
//                     </>
//                 )}
//             </div>
//         </section>
//     );
// }
