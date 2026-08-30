import React, { useState } from 'react';
import { submitCareerApplication } from '../../features/careers/api/careersApi';

export default function FormulaireCandidature({
  type,
  offerId = null,
  offerSlug = '',
  offerTitle = '',
}) {
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [lmFile, setLmFile] = useState(null);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    specificField: '',
    message: '',
    rgpd_consent: false,
    honeypot: '',
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({
      ...formData,
      [name]: inputType === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setServerError('');

    if (formData.honeypot.length > 0) {
      setStatus('error');
      setServerError('Une erreur de sécurité a été détectée. Veuillez rafraîchir la page.');
      return;
    }

    const illegalChars = /[<>{}"'`;]/g;
    const textFields = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      specificField: formData.specificField,
      message: formData.message,
    };
    const hasIllegalChars = Object.values(textFields).some(
      (val) => typeof val === 'string' && illegalChars.test(val),
    );

    if (hasIllegalChars) {
      setStatus('error');
      setServerError('Caractères non autorisés détectés (<, >, {, }, etc.)');
      return;
    }

    if (!formData.rgpd_consent) {
      setStatus('error');
      setServerError('Vous devez accepter la politique de confidentialité.');
      return;
    }

    if (!cvFile) {
      setStatus('error');
      setServerError('Le CV est obligatoire.');
      return;
    }

    const isFormateur = type === 'formateur';

    try {
      const payload = new FormData();
      payload.append('prenom', formData.prenom);
      payload.append('nom', formData.nom);
      payload.append('email', formData.email);
      payload.append('telephone', formData.telephone);
      payload.append('specificField', formData.specificField);
      payload.append('message', formData.message);
      payload.append('type', isFormateur ? 'formateur' : 'collaborateur');
      payload.append('rgpd_consent', '1');
      payload.append('honeypot', formData.honeypot);
      if (offerId) payload.append('offer_id', String(offerId));
      if (offerSlug) payload.append('offer_slug', offerSlug);
      if (offerTitle) payload.append('offer_title', offerTitle);
      payload.append('cv', cvFile);
      if (lmFile) payload.append('cover_letter', lmFile);

      await submitCareerApplication(payload);

      setStatus('success');
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        specificField: '',
        message: '',
        rgpd_consent: false,
        honeypot: '',
      });
      setCvFile(null);
      setLmFile(null);
      document.getElementById('postuler')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Erreur candidature:', err);
      setServerError(err.message);
      setStatus('error');
    }
  };

  const isFormateur = type === 'formateur';

  return (
    <section className="py-10 px-6 bg-white" id="postuler">
      <div className="max-w-container-lg mx-auto bg-gray-50 p-5 md:p-8 rounded-section border border-border shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-primary-light uppercase tracking-wider mb-2">
            Postuler en tant que {isFormateur ? 'Formateur' : 'Collaborateur'}
          </h2>
          {offerTitle ? (
            <p className="text-accent font-bold text-sm mb-2">Offre : {offerTitle}</p>
          ) : null}
          <p className="text-content-muted text-sm">
            {status === 'success'
              ? 'Merci ! Votre candidature a été transmise avec succès.'
              : 'Remplissez ce formulaire pour nous envoyer votre profil. Notre équipe vous recontactera rapidement.'}
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-100/50 border border-green-200 p-6 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-800">Candidature envoyée !</h3>
            <p className="text-green-700 text-sm">
              Votre CV a été transmis à notre service RH. Un email de confirmation vient de vous être
              envoyé à l&apos;adresse indiquée.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-green-600 font-bold underline hover:text-green-800 transition"
            >
              Envoyer une autre candidature
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div aria-hidden="true" className="hidden">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <span className="font-bold">Erreur :</span> {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-bold text-primary mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-bold text-primary mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  placeholder="jean.dupont@email.com"
                />
              </div>
              <div>
                <label htmlFor="telephone" className="block text-sm font-bold text-primary mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label htmlFor="specificField" className="block text-sm font-bold text-primary mb-2">
                {isFormateur ? "Domaines d'expertise *" : 'Type de contrat recherché *'}
              </label>
              {isFormateur ? (
                <input
                  type="text"
                  id="specificField"
                  name="specificField"
                  required
                  value={formData.specificField}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  placeholder="Ex: Cybersécurité, Intelligence Artificielle, RH..."
                />
              ) : (
                <select
                  id="specificField"
                  name="specificField"
                  required
                  value={formData.specificField}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white text-sm"
                >
                  <option value="" disabled>
                    Sélectionnez une option
                  </option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="alternance">Alternance</option>
                  <option value="stage">Stage</option>
                </select>
              )}
            </div>

            <div>
              <label htmlFor="candidature-cv" className="block text-sm font-bold text-primary mb-2">Curriculum Vitae (CV) *</label>
              <input
                id="candidature-cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
              />
              {cvFile ? (
                <p className="text-xs text-accent mt-1 font-medium">✓ {cvFile.name} chargé</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="candidature-motivation" className="block text-sm font-bold text-primary mb-2">
                Lettre de motivation (fichier PDF/DOC, optionnel)
              </label>
              <input
                id="candidature-motivation"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setLmFile(e.target.files?.[0] ?? null)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
              />
              {lmFile ? (
                <p className="text-xs text-accent mt-1 font-medium">✓ {lmFile.name} chargé</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-primary mb-2">
                Message / lettre de motivation (texte)
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-sm"
                placeholder="Expliquez-nous pourquoi vous souhaitez nous rejoindre..."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="rgpd_consent"
                checked={formData.rgpd_consent}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-content-muted leading-relaxed">
                J&apos;accepte que mes données et documents soient traités par Alt RH Formations dans le cadre de ma
                candidature, conformément à la politique de confidentialité. *
              </span>
            </label>

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-accent text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 mx-auto"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer ma candidature'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
