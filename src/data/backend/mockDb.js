/**
 * Réponses SQL factices lorsque DISABLE_DATABASE=1 (tests UI sans MySQL).
 * Les correspondances sont heuristiques (fragments SQL).
 */

let insertSeq = 1000;

function demoContact(id = 1) {
  const now = new Date().toISOString();
  return {
    id,
    nom: 'Durand',
    prenom: 'Paul',
    email: 'paul.demo@local.test',
    telephone: '0612345678',
    sujet: 'Message factice (sans BDD)',
    message: 'Ce contact est simulé pour les tests.',
    status: 'pending',
    created_at: now,
    user_id: null,
    message_count: 1,
    last_message: 'Bonjour',
    last_message_at: now,
    user_prenom: null,
    user_nom: null,
    sujet_chat: undefined,
  };
}

function demoBlogPost(id = 1) {
  const now = new Date().toISOString();
  return {
    id,
    slug: 'article-demo-sans-bdd',
    title: 'Article factice',
    excerpt: 'Résumé de démonstration.',
    content: '<p>Contenu HTML factice.</p>',
    status: 'published',
    published_at: now,
    views: 42,
    author: 'Équipe Alt RH Formations',
    category_id: 1,
    updated_at: now,
    category_label: 'Formations',
    image_url: null,
  };
}

export function mockQuery(sql, params = []) {
  const q = sql.replace(/\s+/g, ' ').trim();
  const u = q.toUpperCase();
  const p0 = params[0];

  if (u.startsWith('INSERT')) {
    insertSeq += 1;
    return { affectedRows: 1, insertId: insertSeq };
  }

  if (u.startsWith('UPDATE') || u.startsWith('DELETE')) {
    return { affectedRows: 1 };
  }

  if (/COUNT\s*\(\s*\*\s*\)/i.test(q)) {
    if (u.includes('PAGE_VISITS')) {
      if (u.includes('INTERVAL 7 DAY')) return [{ c: 48 }];
      if (u.includes('INTERVAL 30 DAY')) return [{ c: 192 }];
      return [{ c: 48 }];
    }
    if (u.includes('USERS')) {
      if (u.includes('INTERVAL 7 DAY')) return [{ c: 2 }];
      return [{ c: 12 }];
    }
    if (u.includes('CONTACTS')) {
      if (u.includes('PENDING')) return [{ c: 3 }];
      return [{ c: 11 }];
    }
    if (u.includes('FAQ_REQUESTS')) {
      if (u.includes('PENDING')) return [{ c: 2 }];
      return [{ c: 7 }];
    }
    if (u.includes('LOGIN_ATTEMPTS')) return [{ c: 0 }];
    if (u.includes('NEWSLETTER_SUBSCRIBERS') && u.includes('CONFIRMED')) return [{ c: 56 }];
    if (u.includes('BLOG_POSTS')) {
      if (u.includes('PUBLISHED')) return [{ c: 4 }];
      if (u.includes('DRAFT')) return [{ c: 1 }];
      return [{ c: 5 }];
    }
    if (u.includes('CHATBOT_CONVERSATIONS') && u.includes('OPEN')) return [{ c: 2 }];
    if (u.includes('NEWSLETTER_CAMPAIGNS') && u.includes('SENT')) return [{ c: 1 }];
    if (u.includes('ADMIN_USERS') && u.includes('SUPERADMIN')) return [{ c: 1 }];
    return [{ c: 0 }];
  }

  if (u.includes('PAGE_VISITS') && u.includes('GROUP BY')) {
    const rows = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      rows.push({
        day: d.toISOString().slice(0, 10),
        c: 3 + ((i * 7) % 5),
      });
    }
    return rows;
  }

  // --- Sélections par id (existence / mise à jour) ---
  if (u.includes('FROM FAQ_REQUESTS') && u.includes('WHERE') && u.includes('ID')) {
    return [
      {
        id: Number(p0) || 1,
        question: 'Question utilisateur factice ?',
        admin_response: null,
        status: 'pending',
        published_question: null,
        published_response: null,
        created_at: new Date().toISOString(),
        replied_at: null,
        user_id: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@local.test',
      },
    ];
  }

  if (u.includes('FROM BLOG_POSTS') && u.includes('WHERE') && u.includes('ID') && !u.includes('JOIN')) {
    return [demoBlogPost(Number(p0) || 1)];
  }

  if (u.includes('FROM ADMIN_USERS') && u.includes('WHERE') && u.includes('ID') && !u.includes('JOIN')) {
    return [
      {
        id: Number(p0) || 1,
        username: 'demo',
        email: 'demo@local.test',
        role: 'superadmin',
        is_active: 1,
      },
    ];
  }

  if (u.includes('FROM CONTACTS') && u.includes('WHERE') && u.includes('ID')) {
    const row = demoContact(Number(p0) || 1);
    return [
      {
        ...row,
        user_id: row.user_id,
        prenom: row.prenom,
        nom: row.nom,
        email: row.email,
      },
    ];
  }

  if (u.includes('FROM CONTACTS') && u.includes('WHERE') && u.includes('USER_ID')) {
    return [];
  }

  if (u.includes('FROM FAQ_REQUESTS') && u.includes('WHERE') && u.includes('USER_ID')) {
    return [];
  }

  if (u.includes('FROM FAQ_ITEMS') && u.includes('WHERE') && u.includes('ID') && !u.includes('JOIN')) {
    const now = new Date().toISOString();
    return [
      {
        id: Number(p0) || 1,
        category_id: 1,
        question: 'Question démo',
        answer: 'Réponse démo.',
        sort_order: 0,
        is_active: 1,
        created_by: 1,
        updated_by: 1,
        created_at: now,
        updated_at: now,
      },
    ];
  }

  if (u.includes('FROM FAQ_CATEGORIES') && u.includes('WHERE') && u.includes('ID') && !u.includes('ORDER')) {
    const now = new Date().toISOString();
    return [
      {
        id: Number(p0) || 1,
        slug: 'formations',
        label: 'Nos Formations',
        sort_order: 1,
        is_active: 1,
        created_at: now,
        updated_at: now,
      },
    ];
  }

  // --- Listes ---
  if (u.includes('FAQ_CATEGORIES') && !u.includes('FAQ_ITEMS')) {
    const now = new Date().toISOString();
    return [
      { id: 1, slug: 'formations', label: 'Nos Formations', sort_order: 1, is_active: 1, created_at: now, updated_at: now },
      { id: 2, slug: 'financement', label: 'Financement', sort_order: 2, is_active: 1, created_at: now, updated_at: now },
    ];
  }

  if (u.includes('FAQ_ITEMS') && u.includes('JOIN') && u.includes('FAQ_CATEGORIES')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        category_id: 1,
        question: 'Que propose Alt RH Formations ?',
        reponse: 'Des parcours de formation professionnelle (données factices).',
        categorie: 'Nos Formations',
        ordre: 0,
        is_active: 1,
        created_at: now,
        updated_at: now,
        category_slug: 'formations',
        categorie_label: 'Nos Formations',
      },
    ];
  }

  if (u.includes('FROM FAQ_REQUESTS') && u.includes('JOIN') && u.includes('USERS')) {
    return [];
  }

  if (u.includes('FROM USERS') && u.includes('ORDER BY')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        prenom: 'Marie',
        nom: 'Martin',
        email: 'marie.martin@local.test',
        telephone: null,
        role: 'user',
        created_at: now,
        contacts_count: 1,
        faq_count: 0,
      },
    ];
  }

  if (u.includes('FROM CONTACTS') && u.includes('LEFT JOIN')) {
    const c = demoContact(1);
    return [
      {
        id: c.id,
        sujet: c.sujet,
        message: c.message,
        telephone: c.telephone,
        status: c.status,
        created_at: c.created_at,
        user_id: null,
        prenom: 'Paul',
        nom: 'Durand',
        email: c.email,
        message_count: c.message_count,
        last_message: c.last_message,
        last_message_at: c.last_message_at,
      },
    ];
  }

  if (u.includes('FROM CONTACTS') && u.includes('ORDER BY')) {
    const c = demoContact(1);
    return [
      {
        id: c.id,
        nom: c.nom,
        prenom: c.prenom,
        email: c.email,
        telephone: c.telephone,
        sujet: c.sujet,
        message: c.message,
        status: c.status,
        created_at: c.created_at,
        user_id: null,
        user_prenom: null,
        user_nom: null,
      },
    ];
  }

  if (u.includes('BLOG_POSTS') && u.includes('JOIN') && u.includes('BLOG_CATEGORIES')) {
    return [demoBlogPost(1)];
  }

  if (u.includes('FROM BLOG_CATEGORIES')) {
    const now = new Date().toISOString();
    return [
      { id: 1, slug: 'formations', label: 'Formations', sort_order: 1, is_active: 1, created_at: now },
      { id: 2, slug: 'digital', label: 'Digital', sort_order: 2, is_active: 1, created_at: now },
    ];
  }

  if (u.includes('FROM NEWSLETTER_SUBSCRIBERS') && u.includes('ORDER BY')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        email: 'abonne@local.test',
        first_name: null,
        last_name: null,
        is_confirmed: 1,
        source: 'site',
        subscribed_at: now,
        confirmed_at: now,
        unsubscribed_at: null,
      },
    ];
  }

  if (u.includes('FROM NEWSLETTER_LISTS')) {
    const now = new Date().toISOString();
    return [
      { id: 1, name: 'Tous les abonnés', description: 'Liste démo', is_active: 1, created_at: now },
    ];
  }

  if (u.includes('NEWSLETTER_CAMPAIGNS') && u.includes('LEFT JOIN')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        subject: 'Newsletter démo',
        status: 'draft',
        scheduled_at: null,
        sent_at: null,
        total_sent: 0,
        total_opened: 0,
        total_clicked: 0,
        created_at: now,
        list_id: 1,
        stat_unique_opens: 0,
        stat_unique_clicks: 0,
        stat_open_rate_pct: 0,
        stat_click_rate_pct: 0,
      },
    ];
  }

  if (u.includes('FROM NEWSLETTER_CAMPAIGNS') && u.includes('WHERE') && u.includes('ID')) {
    return [
      {
        id: Number(p0) || 1,
        subject: 'Newsletter démo',
        preview_text: null,
        body_html: '<p>Brouillon factice</p>',
        body_text: null,
        status: 'draft',
        list_id: 1,
        scheduled_at: null,
        from_name: 'Alt RH Formations',
        from_email: 'contact@altformations.fr',
      },
    ];
  }

  if (u.includes('CHATBOT_CONVERSATIONS') && u.includes('ORDER BY')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        session_id: 'demo-session',
        user_name: 'Visiteur',
        user_email: 'visiteur@local.test',
        status: 'open',
        handled_by: null,
        created_at: now,
        updated_at: now,
        handled_by_username: null,
        message_count: 2,
        last_message: 'Bonjour',
      },
    ];
  }

  if (u.includes('FROM CHATBOT_MESSAGES')) {
    const now = new Date().toISOString();
    return [
      { id: 1, sender: 'user', message: 'Bonjour', faq_item_id: null, created_at: now },
      { id: 2, sender: 'bot', message: 'Réponse bot factice.', faq_item_id: null, created_at: now },
    ];
  }

  if (u.includes('FROM CHATBOT_CONVERSATIONS') && u.includes('WHERE') && u.includes('ID')) {
    return [{ id: Number(p0) || 1 }];
  }

  if (u.includes('FROM ADMIN_USERS') && u.includes('ORDER BY')) {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        username: 'demo',
        email: 'demo@local.test',
        role: 'superadmin',
        is_active: 1,
        last_login: null,
        created_at: now,
      },
    ];
  }

  if (u.includes('FROM SESSIONS') && u.includes('JOIN') && u.includes('USERS')) {
    return [];
  }

  if (u.includes('CHAT_MESSAGES') && u.includes('LEFT JOIN')) {
    return [];
  }

  if (u.includes('FROM CHAT_MESSAGES')) {
    return [];
  }

  if (u.includes('FROM USERS') && u.includes('WHERE') && u.includes('EMAIL')) {
    return [];
  }

  return [];
}
