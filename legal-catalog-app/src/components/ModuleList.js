import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/LegalDB.json';
import styles from './ModuleList.module.css';

export default function ModuleList() {
  const [query, setQuery] = useState('');

  const modules = data.modules || [];
  const filtered = modules.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

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
        {filtered.map(mod => (
          <article key={mod.id} className={styles.card}>
            <h3>{mod.title}</h3>
            <p className={styles.excerpt}>{mod.content.slice(0, 120)}...</p>
            <Link to={`/module/${mod.id}`} className={styles.link}>
              Ver detalle
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
