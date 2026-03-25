import { useState } from 'react';

const initialState = {
  nom: '', prenom: '', email: '', telephone: '', message: '',
};

export default function ContactForm() {
  const [fields, setFields] = useState(initialState);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nom, prenom, email, message } = fields;

    if (!nom.trim() || !prenom.trim() || !email.trim() || !message.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setSuccess(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse e-mail invalide.');
      setSuccess(false);
      return;
    }

    // Logique d'envoi simulée
    setError('');
    setSuccess(true);
    setFields(initialState);
  };

  return (
    <section className="bg-dark py-[60px] px-10 text-center" id="contact">
      <h2 className="font-heading text-[26px] font-extrabold text-white mb-[30px] uppercase tracking-wider">
        Contactez-nous
      </h2>

      <div className="max-w-[600px] mx-auto">
        {/* Messages d'état */}
        {success && (
          <p className="text-[#6fcf97] font-semibold mb-4 text-sm" role="alert">
            ✓ Votre message a bien été envoyé ! Nous vous répondrons dans les 24h.
          </p>
        )}
        {error && (
          <p className="text-[#eb5757] font-semibold mb-4 text-sm" role="alert">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          {/* Ligne Nom / Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text" name="nom" placeholder="Nom" required
              className="w-full p-[12px_14px] border-none rounded-[3px] bg-white font-body text-[13px] text-dark outline-none placeholder:text-[#aaa]"
              value={fields.nom} onChange={handleChange}
            />
            <input
              type="text" name="prenom" placeholder="Prénom" required
              className="w-full p-[12px_14px] border-none rounded-[3px] bg-white font-body text-[13px] text-dark outline-none placeholder:text-[#aaa]"
              value={fields.prenom} onChange={handleChange}
            />
          </div>

          <input
            type="email" name="email" placeholder="Email" required
            className="w-full p-[12px_14px] border-none rounded-[3px] bg-white font-body text-[13px] text-dark outline-none placeholder:text-[#aaa]"
            value={fields.email} onChange={handleChange}
          />
          <input
            type="tel" name="telephone" placeholder="Téléphone"
            className="w-full p-[12px_14px] border-none rounded-[3px] bg-white font-body text-[13px] text-dark outline-none placeholder:text-[#aaa]"
            value={fields.telephone} onChange={handleChange}
          />
          <textarea
            name="message" placeholder="Votre message" required
            className="w-full p-[12px_14px] border-none rounded-[3px] bg-white font-body text-[13px] text-dark outline-none placeholder:text-[#aaa] h-[120px] resize-y"
            value={fields.message} onChange={handleChange}
          />

          <button 
            type="submit" 
            className="bg-orange hover:bg-orange-dark text-white p-[14px] rounded-default font-heading text-sm font-bold cursor-pointer transition-colors duration-200 uppercase tracking-wide border-none"
          >
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}