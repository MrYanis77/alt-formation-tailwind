import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contactData } from '../../data/contact';

// === SÉCURITÉ : SCHÉMA ZOD STRICT ===
const noHtmlRegex = /^[^<>{}"'`]*$/;

const contactSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court").max(50).regex(noHtmlRegex, "Caractères illégaux détectés"),
  prenom: z.string().min(2, "Le prénom est trop court").max(50).regex(noHtmlRegex, "Caractères illégaux détectés"),
  email: z.string().email("Veuillez saisir un format d'email valide").max(100),
  telephone: z.string().max(20).regex(noHtmlRegex, "Format invalide").optional().or(z.literal('')),
  sujet: z.string().min(2, "Sujet requis").max(100).regex(noHtmlRegex, "Caractères illégaux détectés"),
  message: z.string().min(10, "Message trop court (10 caractères mini)").max(1500).regex(noHtmlRegex, "Caractères illégaux détectés"),
  honeypot: z.string().max(0, "Bot détecté")
});

export default function ContactForm({ variant = "section", title }) {
  const isSection = variant === "section";

  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: '',
      honeypot: ''
    }
  });

  const onSubmit = async (data) => {
    setStatus('loading');
    setServerError('');

    try {
      const emailItem = contactData.coordonnees.items.find(item => item.type === "Email");
      const destinationEmail = emailItem ? emailItem.valeur : 'formations@alt-rh.com';

      const payload = {
        ...data,
        destinataire: destinationEmail
      };

      // 🔴 CORRECTION ICI : URL COMPLÈTE POINTANT VERS LE PORT 3001
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (responseData.success) {
        setStatus('success');
        reset();
      } else {
        throw new Error(responseData.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("Erreur serveur:", err);
      setStatus('error');
      setServerError("Impossible de joindre le serveur ou erreur interne.");
    }
  };

  const resetStatus = () => setStatus('idle');

  const FormWrapper = isSection ? "section" : "div";
  const wrapperClass = isSection ? "bg-content-dark py-[60px] px-10 text-center" : "w-full";
  const containerClass = isSection ? "max-w-[600px] mx-auto" : "w-full";

  const getInputClass = (hasError) => {
    let base = isSection
      ? "w-full p-[12px_14px] border rounded-[3px] bg-white font-body text-small text-content-dark outline-none focus:border-accent transition-colors placeholder:text-content-muted "
      : "w-full p-3 border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ";

    return base + (hasError ? "border-red-500 bg-red-50/50 " : (isSection ? "border-transparent" : "border-gray-200"));
  };

  const buttonClass = isSection
    ? "bg-accent hover:bg-accent-dark text-white p-[14px] rounded-sm font-heading text-sm font-bold cursor-pointer transition-colors duration-200 uppercase tracking-wide border-none flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed w-full"
    : "w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4";

  return (
    <FormWrapper className={wrapperClass} id={isSection ? "contact" : undefined}>
      {(title || isSection) && (
        <h2 className={isSection ? "font-heading text-[26px] font-extrabold text-white mb-[30px] uppercase tracking-wider" : "text-primary font-bold text-[24px] mb-8"}>
          {title || "Contactez-nous"}
        </h2>
      )}

      <div className={containerClass}>
        {status === 'success' && (
          <div className={isSection ? "bg-green-100/10 border border-success/30 p-5 rounded-md mb-6 transition-all flex flex-col items-center gap-2" : "bg-green-50 border border-green-200 text-green-700 p-6 sm:p-10 rounded-xl flex flex-col items-center justify-center text-center gap-4 transition-all"}>
            <svg className={isSection ? "w-8 h-8 text-success mb-1" : "w-16 h-16 text-green-500"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {isSection ? (
              <p className="text-success font-semibold text-sm" role="alert">
                ✓ Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.<br />
              </p>
            ) : (
              <div>
                <h3 className="font-bold text-xl text-green-800">Message sécurisé envoyé !</h3>
                <p className="text-green-600 mt-2">Nous reviendrons vers vous rapidement.</p>
              </div>
            )}
            <button onClick={resetStatus} className={isSection ? "mt-2 text-xs text-success underline hover:text-white transition" : "mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"}>
              Nouveau message
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className={isSection ? "" : "md:col-span-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3 mb-6"}>
            {!isSection && (
              <svg className="w-5 h-5 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <p className={isSection ? "text-red-500 font-semibold mb-6 text-sm bg-red-100/10 border border-red-500/30 p-3 rounded" : "text-medium font-medium"} role="alert">
              {serverError}
            </p>
          </div>
        )}

        {status !== 'success' && (
          <form ref={formRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>

            <div aria-hidden="true" className="hidden">
              <input type="text" {...register('honeypot')} tabIndex="-1" autoComplete="off" />
            </div>

            <div className="flex flex-col gap-1">
              {!isSection && <label className="text-sm font-medium text-primary">Nom *</label>}
              <input type="text" placeholder={isSection ? "Nom *" : ""} className={getInputClass(errors.nom)} disabled={status === 'loading'}
                {...register('nom')} />
              {errors.nom && <span className="text-xs text-red-500 font-semibold">{errors.nom.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              {!isSection && <label className="text-sm font-medium text-primary">Prénom *</label>}
              <input type="text" placeholder={isSection ? "Prénom *" : ""} className={getInputClass(errors.prenom)} disabled={status === 'loading'}
                {...register('prenom')} />
              {errors.prenom && <span className="text-xs text-red-500 font-semibold">{errors.prenom.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Email *</label>}
              <input type="email" placeholder={isSection ? "Email *" : ""} className={getInputClass(errors.email)} disabled={status === 'loading'}
                {...register('email')} />
              {errors.email && <span className="text-xs text-red-500 font-semibold">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Téléphone</label>}
              <input type="tel" placeholder={isSection ? "Téléphone" : ""} className={getInputClass(errors.telephone)} disabled={status === 'loading'}
                {...register('telephone')} />
              {errors.telephone && <span className="text-xs text-red-500 font-semibold">{errors.telephone.message}</span>}
            </div>

            {!isSection && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-primary">Sujet *</label>
                <input type="text" className={getInputClass(errors.sujet)} disabled={status === 'loading'}
                  {...register('sujet')} />
                {errors.sujet && <span className="text-xs text-red-500 font-semibold">{errors.sujet.message}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Message *</label>}
              <textarea placeholder={isSection ? "Votre message *" : ""} className={getInputClass(errors.message) + (isSection ? " h-[120px]" : " h-[160px]") + " resize-none"} disabled={status === 'loading'}
                {...register('message')} />
              {errors.message && <span className="text-xs text-red-500 font-semibold">{errors.message.message}</span>}
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={status === 'loading'} className={buttonClass}>
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sécurisation et Envoi...
                  </>
                ) : "Envoyer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </FormWrapper>
  );
}