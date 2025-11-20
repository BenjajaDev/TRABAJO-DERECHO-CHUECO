import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/LegalDB.json';
import styles from './ModuleDetail.module.css';

export default function ModuleDetail() {
  const { id } = useParams();
  const mod = (data.modules || []).find(m => String(m.id) === String(id));
  const [openRefId, setOpenRefId] = useState(null);

  if (!mod) {
    return (
      <div className={styles.notFound}>
        <p>Módulo no encontrado.</p>
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  const refs = (data.references || []).filter(r => mod.related_refs.includes(r.id));

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h4>Referencias relacionadas</h4>
        {refs.length === 0 && <p>No hay referencias vinculadas.</p>}
        <ul className={styles.refList}>
          {refs.map(r => (
            <li key={r.id}>
              <button
                className={styles.refButton}
                onClick={() => setOpenRefId(openRefId === r.id ? null : r.id)}
                aria-expanded={openRefId === r.id}
              >
                {r.title} — {r.articulo}
              </button>
              {openRefId === r.id && (
                <div className={styles.refContent}>
                  <strong>{r.title} ({r.articulo})</strong>
                  <p>{r.content}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <section className={styles.detail}>
        <h2>{mod.title}</h2>
        <p className={styles.content}>{mod.content}</p>

        <div className={styles.backRow}>
          <Link to="/" className={styles.backLink}>&larr; Volver al catálogo</Link>
        </div>
      </section>
    </div>
  );
}
