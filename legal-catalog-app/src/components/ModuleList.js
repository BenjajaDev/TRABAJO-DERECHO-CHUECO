import React, { useState, useContext, useEffect } from 'react';
import ModuleContext from '../context/ModulesContext';
import styles from './ModuleList.module.css';

export default function ModuleList() {
  const [query, setQuery] = useState('');

  const { modules = [], isPurchased } = useContext(ModuleContext);

  const handleNavigate = (moduleId) => {
    window.location.href = `/module/${moduleId}`;
  };

  const filtered = modules.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">½</span>);
    }
    return <span className={styles.rating}>{stars} ({rating})</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar módulos por título..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Buscar módulos"
        />
      </div>
      <div className={styles.grid}>
        {filtered.map(mod => {
          const purchased = isPurchased(mod.id);
          return (
            <article key={mod.id} className={styles.card}>
              {purchased && (
                <span className={styles.purchasedBadge}>✓ Comprado</span>
              )}
              <h3>{mod.title}</h3>
              <p className={styles.excerpt}>{mod.content.slice(0, 120)}...</p>
              <div className={styles.metadata}>
                <span className={styles.duration}>⏱️ {mod.stimated_time}</span>
                {mod.rating && renderStars(mod.rating)}
              </div>
              {mod.price && (
                <div className={styles.price}>
                  <strong>{formatPrice(mod.price)}</strong>
                </div>
              )}
              <button 
                onClick={() => handleNavigate(mod.id)}
                className={purchased ? styles.linkPurchased : styles.link}
              >
                {purchased ? '📖 Acceder al Curso' : '🛒 Ver detalle y Comprar'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
