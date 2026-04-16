import React, { useState } from 'react';
import { jsPDF } from "jspdf";

export default function FormulaireCandidature({ type }) {
    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        specificField: '', // Expertise (formateur) ou type de contrat (collaborateur)
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // --- 1. Génération du PDF de confirmation ---
        const doc = new jsPDF();

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
        doc.text(`Poste visé : ${type === 'formateur' ? 'Formateur Expert' : 'Collaborateur'}`, 20, 80);
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

        // --- 2. Notification utilisateur (et simulation d'envoi serveur) ---
        console.log("Candidature soumise :", formData);
        alert(`Votre candidature a bien été envoyée ! Votre récapitulatif PDF a été téléchargé.`);

        // Optionnel : Réinitialiser le formulaire
        setFormData({ prenom: '', nom: '', email: '', telephone: '', specificField: '', message: '' });
    };

    const isFormateur = type === 'formateur';

    return (
        <section className="py-16 px-6 bg-white" id="postuler">
            <div className="max-w-container-md mx-auto bg-gray-50 p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">

                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-primary-light uppercase tracking-wider mb-2">
                        Postuler en tant que {isFormateur ? 'Formateur' : 'Collaborateur'}
                    </h2>
                    <p className="text-content-muted text-sm">
                        Remplissez ce formulaire pour nous envoyer votre profil. Notre équipe vous recontactera rapidement.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <input type="file" accept=".pdf,.doc,.docx" required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20" />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-primary mb-2">Lettre de motivation / Message</label>
                        <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                            placeholder="Expliquez-nous pourquoi vous souhaitez nous rejoindre..."></textarea>
                    </div>

                    <div className="pt-4 text-center">
                        <button type="submit" className="bg-accent text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-md hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto">
                            Envoyer ma candidature
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
}