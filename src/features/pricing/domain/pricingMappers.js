/**
 * Transforme les plans BDD en structure `tarifs.formules` pour le bilan de compétences.
 * Cette fonction reste pure pour être testée sans React, réseau ou base de données.
 */
export function mapPricingPlansToBilanFormules(plans) {
  // `null` signifie « aucune tarification dynamique » et autorise le repli de la page.
  if (!plans?.length) return null;
  return plans.map((plan) => {
    const meta = plan.meta ?? {};
    // Le libellé éditorial est prioritaire ; le code technique sert de solution de repli.
    const fromLabel = plan.label?.replace(/^Bilan\s+/i, '').trim();
    const fromCode = plan.plan_code
      ? plan.plan_code.charAt(0).toUpperCase() + plan.plan_code.slice(1)
      : '';
    return {
      nom: fromLabel || fromCode,
      heures: meta.heures ?? null,
      prix: Number(plan.amount_eur),
      resume: meta.resume || plan.description || '',
      programme: meta.programme || plan.description || '',
      dureeDetails: meta.dureeDetails || [],
      situations: meta.situations || [],
      modalite: meta.modalite || '',
    };
  });
}
