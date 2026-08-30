import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Detecte un payload HTML/JS evident (script, iframe, on=...) sans bloquer
// la ponctuation francaise (apostrophes, guillemets, accents).
const HTML_TAG_PATTERN = /<(?:\/?)(?:script|iframe|object|embed|svg|img)\b/i;
const EVENT_ATTRIBUTE_PATTERN = /\bon[a-z]+\s*=/i;

const looksLikeInjection = (v) =>
  HTML_TAG_PATTERN.test(v) || EVENT_ATTRIBUTE_PATTERN.test(v);

const safeStr = (min, max, label) =>
  z.string()
    .min(min, `${label} : ${min} caractères minimum`)
    .max(max, `${label} : ${max} caractères maximum`)
    .refine((v) => !looksLikeInjection(v), { message: 'Contenu invalide détecté' });

// Construit le schéma selon la variante : le sujet est obligatoire uniquement
// lorsque le formulaire complet affiche le champ correspondant.
const buildContactSchema = (requireSujet) => z.object({
  nom: safeStr(2, 50, 'Nom'),
  prenom: safeStr(2, 50, 'Prénom'),
  email: z.email({ error: "Veuillez saisir un format d'email valide" }).max(100),
  telephone: z.string().max(20).refine((v) => !v || !looksLikeInjection(v), 'Format invalide').optional().or(z.literal('')),
  sujet: requireSujet
    ? safeStr(2, 100, 'Sujet')
    : z.string().max(100).refine((v) => !v || !looksLikeInjection(v), 'Format invalide').optional().or(z.literal('')),
  message: safeStr(10, 1500, 'Message'),
  honeypot: z.string().max(0, 'Bot détecté'),
});

export default function ContactForm({ variant = 'section', title }) {
  // La variante « section » adopte une présentation compacte intégrée à la page.
  const isSection = variant === 'section';

  // Pilote les différents états visuels de la requête d'envoi.
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');
  const [contactId, setContactId] = useState(null);

  const formRef = useRef(null);

  // React Hook Form délègue la validation des champs au schéma Zod.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildContactSchema(!isSection)),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: '',
      honeypot: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setStatus('loading');

    try {
      // Crée automatiquement un sujet lorsque la variante compacte ne le demande pas.
      const sujet = data.sujet?.trim()
        ? data.sujet.trim()
        : `Demande de contact – ${data.prenom} ${data.nom}`;

      // Envoie uniquement les données validées à l'API PHP au format JSON.
      const res = await fetch('/api/send-mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          sujet,
          message: data.message,
          honeypot: data.honeypot,
        }),
      });

      const json = await res.json();
      // Le statut HTTP et le résultat métier doivent tous les deux être positifs.
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erreur lors de l'envoi");
      }

      setStatus('success');
      reset();
    } catch (err) {
      setServerError(err.message || 'Erreur réseau');
      setStatus('error');
    }
  };

  const resetStatus = () => {
    // Réinitialise l'interface afin de permettre l'envoi d'un nouveau message.
    setStatus('idle');
    setContactId(null);
    setServerError('');
  };

  const FormWrapper = isSection ? 'section' : 'div';
  const wrapperClass = isSection ? 'bg-content-dark py-[60px] px-10 text-center' : 'w-full';
  const containerClass = isSection ? 'max-w-[600px] mx-auto' : 'w-full';

  // Adapte le style des champs à la variante et à leur état de validation.
  const getInputClass = (hasError) => {
    const base = isSection
      ? 'w-full p-[12px_14px] border rounded-[3px] bg-white font-body text-small text-content-dark outline-none focus:border-accent transition-colors placeholder:text-content-muted '
      : 'w-full p-3 border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ';
    if (hasError) return `${base}border-red-500 bg-red-50/50 `;
    return `${base}${isSection ? 'border-transparent' : 'border-gray-200'}`;
  };

  const buttonClass = isSection
    ? 'bg-accent hover:bg-accent-dark text-white p-[14px] rounded-sm font-heading text-sm font-bold cursor-pointer transition-colors duration-200 uppercase tracking-wide border-none flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed w-full'
    : 'w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4';

  return (
    <FormWrapper className={wrapperClass} id={isSection ? 'contact' : undefined}>
      {(title || isSection) && (
        <h2 className={isSection ? 'font-heading text-[26px] font-extrabold text-white mb-[30px] uppercase tracking-wider' : 'text-primary font-bold text-[24px] mb-8'}>
          {title || 'Contactez-nous'}
        </h2>
      )}

      <div className={containerClass}>
        {/* Remplace le formulaire par une confirmation lorsque l'envoi réussit. */}
        {status === 'success' && (
          <div className={isSection ? 'bg-white text-content-dark p-6 rounded-md text-left' : 'bg-green-50/50 border border-green-200 text-content-dark p-6 sm:p-8 rounded-xl text-left'}>
            <div className="flex items-start gap-3 mb-5">
              <svg className="w-8 h-8 shrink-0 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className="font-bold text-lg text-primary">Message envoyé !</h3>
                <p className="text-sm text-content-muted mt-1">
                  Notre équipe a bien reçu votre message {contactId && <span className="font-mono">(#{contactId})</span>} et vous répondra rapidement.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm mb-4">
                <strong>Astuce :</strong> Notre équipe vous répondra dans les plus brefs délais.
              </div>

            <button type="button" onClick={resetStatus} className="px-5 py-2.5 border border-gray-300 text-content-dark hover:bg-gray-50 font-medium rounded-lg transition text-sm">
              Envoyer un autre message
            </button>
          </div>
        )}

        {/* Présente clairement toute erreur renvoyée par l'API ou le réseau. */}
        {status === 'error' && (
          <div className={isSection ? '' : 'md:col-span-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3 mb-6'}>
            <p className={isSection ? 'text-red-200 font-semibold mb-6 text-sm bg-red-900/30 border border-red-500/30 p-3 rounded' : 'text-medium font-medium'} role="alert">
              {serverError}
            </p>
          </div>
        )}

        {status !== 'success' && (
          <form ref={formRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Champ anti-spam invisible : un visiteur réel doit le laisser vide. */}
            <div aria-hidden="true" className="hidden">
              <input type="text" {...register('honeypot')} tabIndex="-1" autoComplete="off" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="contact-nom" className={isSection ? 'sr-only' : 'text-sm font-medium text-primary'}>Nom *</label>
              <input id="contact-nom" type="text" placeholder={isSection ? 'Nom *' : ''} className={getInputClass(errors.nom)} disabled={status === 'loading'} aria-invalid={Boolean(errors.nom)} aria-describedby={errors.nom ? 'contact-nom-error' : undefined} {...register('nom')} />
              {errors.nom && <span id="contact-nom-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.nom.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="contact-prenom" className={isSection ? 'sr-only' : 'text-sm font-medium text-primary'}>Prénom *</label>
              <input id="contact-prenom" type="text" placeholder={isSection ? 'Prénom *' : ''} className={getInputClass(errors.prenom)} disabled={status === 'loading'} aria-invalid={Boolean(errors.prenom)} aria-describedby={errors.prenom ? 'contact-prenom-error' : undefined} {...register('prenom')} />
              {errors.prenom && <span id="contact-prenom-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.prenom.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="contact-email" className={isSection ? 'sr-only' : 'text-sm font-medium text-primary'}>Email *</label>
              <input id="contact-email" type="email" placeholder={isSection ? 'Email *' : ''} className={getInputClass(errors.email)} disabled={status === 'loading'} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} {...register('email')} />
              {errors.email && <span id="contact-email-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="contact-telephone" className={isSection ? 'sr-only' : 'text-sm font-medium text-primary'}>Téléphone</label>
              <input id="contact-telephone" type="tel" placeholder={isSection ? 'Téléphone' : ''} className={getInputClass(errors.telephone)} disabled={status === 'loading'} aria-invalid={Boolean(errors.telephone)} aria-describedby={errors.telephone ? 'contact-telephone-error' : undefined} {...register('telephone')} />
              {errors.telephone && <span id="contact-telephone-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.telephone.message}</span>}
            </div>

            {/* Le sujet est visible uniquement dans la version complète. */}
            {!isSection && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="contact-sujet" className="text-sm font-medium text-primary">Sujet *</label>
                <input id="contact-sujet" type="text" className={getInputClass(errors.sujet)} disabled={status === 'loading'} aria-invalid={Boolean(errors.sujet)} aria-describedby={errors.sujet ? 'contact-sujet-error' : undefined} {...register('sujet')} />
                {errors.sujet && <span id="contact-sujet-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.sujet.message}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="contact-message" className={isSection ? 'sr-only' : 'text-sm font-medium text-primary'}>Message *</label>
              <textarea id="contact-message" placeholder={isSection ? 'Votre message *' : ''} className={getInputClass(errors.message) + (isSection ? ' h-[120px]' : ' h-[160px]') + ' resize-none'} disabled={status === 'loading'} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} {...register('message')} />
              {errors.message && <span id="contact-message-error" role="alert" className="text-xs text-red-600 font-semibold">{errors.message.message}</span>}
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={status === 'loading'} className={buttonClass}>
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : 'Envoyer le message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </FormWrapper>
  );
}
