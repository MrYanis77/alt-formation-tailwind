import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="bg-surface-soft px-10 py-2 text-xs text-content-muted" aria-label="Fil d'ariane">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index}>
            {!isLast && item.to ? (
              <>
                <Link 
                  to={item.to} 
                  className="text-content-muted hover:text-accent transition-colors duration-200"
                >
                  {item.label}
                </Link>
                {/* Séparateur › */}
                <span className="mx-1 opacity-60" aria-hidden="true"> &rsaquo; </span>
              </>
            ) : (
              <span className="text-accent font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}