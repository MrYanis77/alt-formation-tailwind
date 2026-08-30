import { useEffect, useState } from 'react';

/**
 * Execute une ressource asynchrone annulable et ignore les reponses devenues obsoletes.
 * `load` doit accepter `{ signal }` afin que la couche HTTP puisse interrompre la requete.
 */
export function useAsyncResource({ key, load, initialData, enabled = true }) {
  // La clé associe une réponse à ses paramètres et évite d'afficher un résultat obsolète.
  const [state, setState] = useState({ key: null, data: initialData, error: null });

  useEffect(() => {
    if (!enabled) return undefined;

    // Chaque exécution possède son signal, automatiquement annulé au démontage du composant.
    const controller = new AbortController();

    // Promise.resolve capture également une éventuelle exception synchrone de `load`.
    Promise.resolve()
      .then(() => load({ signal: controller.signal }))
      .then((data) => {
        if (!controller.signal.aborted) setState({ key, data, error: null });
      })
      .catch((error) => {
        // Une annulation normale ne doit pas être présentée à l'utilisateur comme une panne.
        if (controller.signal.aborted || error?.code === 'REQUEST_ABORTED') return;
        setState({ key, data: initialData, error });
      });

    return () => controller.abort();
  }, [enabled, initialData, key, load]);

  if (!enabled) {
    return { data: initialData, loading: false, error: null };
  }

  // Tant que la nouvelle clé n'a pas de réponse, on expose les données initiales et loading=true.
  const isCurrent = state.key === key;
  return {
    data: isCurrent ? state.data : initialData,
    loading: !isCurrent,
    error: isCurrent ? state.error : null,
  };
}
