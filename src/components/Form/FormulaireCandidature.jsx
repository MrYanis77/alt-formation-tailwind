import React, { useState } from 'react';
import { jsPDF } from "jspdf";

export default function FormulaireCandidature({ type }) {
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [serverError, setServerError] = useState('');
    const [attachment, setAttachment] = useState(null); // { filename, content }

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        specificField: '', // Expertise (formateur) ou type de contrat (collaborateur)
        message: '',
        honeypot: '' // Sécurité : champ invisible pour piéger les bots
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Content = event.target.result.split(',')[1];
            setAttachment({
                filename: file.name,
                content: base64Content
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setServerError('');

        // 1. SÉCURITÉ : Vérification du Honeypot (Piège à bots)
        if (formData.honeypot.length > 0) {
            console.warn("Detection bot : Honeypot rempli");
            setStatus('error');
            setServerError("Une erreur de sécurité a été détectée. Veuillez rafraîchir la page.");
            return;
        }

        // 2. SÉCURITÉ : Nettoyage basique des entrées (Anti-XSS / Injection)
        const illegalChars = /[<>{}""'`;]/g;
        const hasIllegalChars = Object.values(formData).some(val => typeof val === 'string' && illegalChars.test(val));
        
        if (hasIllegalChars) {
            setStatus('error');
            setServerError("Caractères non autorisés détectés (<, >, {, }, etc.)");
            return;
        }

        const isFormateur = type === 'formateur';

        try {
            // --- 1. Envoi au serveur API ---
            const payload = {
                ...formData,
                type: isFormateur ? 'formateur' : 'collaborateur',
                attachment: attachment
            };

            const response = await fetch('/api/rejoindre', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Une erreur est survenue lors de l'envoi.");
            }

            // --- 2. Génération du PDF de confirmation (Client-side) ---
            const doc = new jsPDF();
            // ... (PDF logic remains the same)

        // Design de l'en-tête (Couleur Navy)
        doc.setFillColor(30, 47, 71);
        doc.rect(0, 0, 210, 40, 'F');

        // Titre de l'entreprise
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("ALT-RH & FORMATIONS", 20, 25);

        // Titre du document
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text("Confirmation de Candidature", 20, 60);

        // Données du candidat
        doc.setFontSize(12);
        doc.text(`Poste visé : ${isFormateur ? 'Formateur Expert' : 'Collaborateur'}`, 20, 80);
        doc.text(`Candidat : ${formData.prenom} ${formData.nom}`, 20, 90);
        doc.text(`Email : ${formData.email}`, 20, 100);
        doc.text(`Téléphone : ${formData.telephone}`, 20, 110);
        doc.text(`Spécificité : ${formData.specificField}`, 20, 120);
        doc.text(`Date de soumission : ${new Date().toLocaleDateString()}`, 20, 130);

        // Ligne de séparation Orange
        doc.setDrawColor(242, 146, 66);
        doc.line(20, 140, 190, 140);

        // Message de fin
        doc.text("Merci pour votre intérêt envers Alt-RH & Formations.", 20, 160);
        doc.text("Notre équipe RH va étudier votre profil et vous recontactera", 20, 170);
        doc.text("dans les meilleurs délais.", 20, 180);

        // Téléchargement du fichier
        doc.save(`Candidature_AltRH_${formData.nom}.pdf`);

        // --- 3. Notification utilisateur et Reset ---
        setStatus('success');
        setFormData({ prenom: '', nom: '', email: '', telephone: '', specificField: '', message: '' });
        setAttachment(null);
        
        // On scroll vers le haut du formulaire pour voir le message de succès
        document.getElementById('postuler')?.scrollIntoView({ behavior: 'smooth' });

        } catch (err) {
            console.error("Erreur candidature:", err);
            setServerError(err.message);
            setStatus('error');
        }
    };


    const isFormateur = type === 'formateur';

    return (
        <section className="py-16 px-6 bg-white" id="postuler">
            <div className="max-w-container-2xl mx-auto bg-gray-50 p-8 md:p-12 rounded-section border border-border shadow-sm">

                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-primary-light uppercase tracking-wider mb-2">
                        Postuler en tant que {isFormateur ? 'Formateur' : 'Collaborateur'}
                    </h2>
                    <p className="text-content-muted text-sm">
                        {status === 'success' 
                          ? "Merci ! Votre candidature a été transmise avec succès." 
                          : "Remplissez ce formulaire pour nous envoyer votre profil. Notre équipe vous recontactera rapidement."}
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-100/50 border border-green-200 p-8 rounded-xl text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-green-800">Candidature Envoyée !</h3>
                        <p className="text-green-700">Votre CV a été transmis à notre service RH. Votre récapitulatif PDF a également été généré.</p>
                        <button onClick={() => setStatus('idle')} className="text-green-600 font-bold underline hover:text-green-800 transition">Envoyer une autre candidature</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ Honeypot invisible pour les humains, utilisé pour piéger les bots */}
                        <div aria-hidden="true" className="hidden">
                            <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                        </div>

                        {status === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                                <span className="font-bold">Erreur:</span> {serverError}
                            </div>
                        )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-bold text-primary mb-2">Prénom *</label>
                            <input type="text" id="prenom" name="prenom" required value={formData.prenom} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="Jean" />
                        </div>
                        <div>
                            <label htmlFor="nom" className="block text-sm font-bold text-primary mb-2">Nom *</label>
                            <input type="text" id="nom" name="nom" required value={formData.nom} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="Dupont" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-primary mb-2">Email *</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="jean.dupont@email.com" />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-bold text-primary mb-2">Téléphone *</label>
                            <input type="tel" id="telephone" name="telephone" required value={formData.telephone} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="06 12 34 56 78" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="specificField" className="block text-sm font-bold text-primary mb-2">
                            {isFormateur ? "Domaines d'expertise *" : "Type de contrat recherché *"}
                        </label>
                        {isFormateur ? (
                            <input type="text" id="specificField" name="specificField" required value={formData.specificField} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="Ex: Cybersécurité, Intelligence Artificielle, RH..." />
                        ) : (
                            <select id="specificField" name="specificField" required value={formData.specificField} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white">
                                <option value="" disabled>Sélectionnez une option</option>
                                <option value="cdi">CDI</option>
                                <option value="cdd">CDD</option>
                                <option value="alternance">Alternance</option>
                                <option value="stage">Stage</option>
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Curriculum Vitae (CV) *</label>
                        <input type="file" accept=".pdf,.doc,.docx" required onChange={handleFileChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20" />
                        {attachment && <p className="text-xs text-accent mt-1 font-medium">✓ {attachment.filename} chargé</p>}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-primary mb-2">Lettre de motivation / Message</label>
                        <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                            placeholder="Expliquez-nous pourquoi vous souhaitez nous rejoindre..."></textarea>
                    </div>

                    <div className="pt-4 text-center">
                        <button type="submit" disabled={status === 'loading'} className="bg-accent text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-md hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2">
                            {status === 'loading' ? (
                                <>
                                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Envoi en cours...
                                </>
                            ) : "Envoyer ma candidature"}
                        </button>
                    </div>
                </form>
                )}

            </div>
        </section>
    );
}