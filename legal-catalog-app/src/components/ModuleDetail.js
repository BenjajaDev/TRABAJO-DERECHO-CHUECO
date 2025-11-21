import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ModuleContext from '../context/ModulesContext';
import AuthModal from './AuthModal';
import data from '../data/LegalDB.json';
import styles from './ModuleDetail.module.css';

export default function ModuleDetail() {
  const { id } = useParams();
  const { modules, purchaseCourse, isPurchased, isAuthenticated } = useContext(ModuleContext);
  const [openRefId, setOpenRefId] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Verificar si el curso está comprado
    const checkPurchaseStatus = () => {
      setPurchased(isPurchased(parseInt(id)));
    };
    checkPurchaseStatus();
  }, [id, isPurchased]);

  const mod = modules.find(m => String(m.id) === String(id)) || 
              (data.modules || []).find(m => String(m.id) === String(id));

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const result = await purchaseCourse(parseInt(id));
      
      if (result.needsAuth) {
        setShowAuthModal(true);
      } else if (result.success) {
        setPurchased(true);
        alert('¡Curso comprado exitosamente! Ahora puedes acceder al contenido.');
        window.location.reload(); // Recargar para actualizar estado
      } else {
        alert(result.message || 'Error al procesar la compra');
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Error al procesar la compra. Por favor intenta de nuevo.');
    }
  };

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
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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
                  {r.filePath && (
                    <a 
                      href={process.env.PUBLIC_URL + r.filePath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.pdfLink}
                    >
                      Ver PDF de Referencia
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <section className={styles.detail}>
        <div className={styles.header}>
          <h2>{mod.title}</h2>
          {purchased && (
            <span className={styles.badge}>✓ Pagado</span>
          )}
        </div>
        
        <p className={styles.content}>{mod.content}</p>

        {mod.stimated_time && (
          <div className={styles.info}>
            <span>⏱️ {mod.stimated_time}</span>
          </div>
        )}

        {!purchased ? (
          <div className={styles.purchaseSection}>
            {mod.price && (
              <div className={styles.priceBox}>
                <span className={styles.priceLabel}>Precio:</span>
                <span className={styles.priceAmount}>
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                  }).format(mod.price)}
                </span>
                <span className={styles.paymentNote}>Pago único</span>
              </div>
            )}
            <button onClick={handlePurchase} className={styles.purchaseButton}>
              🛒 Comprar Curso
            </button>
          </div>
        ) : (
          <>
            {mod.filePath && (
              <div className={styles.pdfLinkRow}>
                <button className={styles.accessButton}>
                  📖 Acceder al Curso
                </button>
                <a 
                  href={process.env.PUBLIC_URL + mod.filePath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.pdfLink}
                >
                  Ver PDF del Módulo
                </a>
              </div>
            )}
          </>
        )}

        <div className={styles.backRow}>
          <Link to="/" className={styles.backLink}>&larr; Volver al catálogo</Link>
        </div>
      </section>
      </div>
    </>
  );
}
