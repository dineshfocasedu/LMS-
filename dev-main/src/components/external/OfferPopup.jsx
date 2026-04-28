import { useState, useEffect } from "react";
import offerConfig from "./offerConfig";

export default function OfferPopup() {
  const [open, setOpen]       = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!offerConfig.enabled) return;
    const t = setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => setAnimate(true));
    }, offerConfig.delayMs);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setAnimate(false);
    setTimeout(() => setOpen(false), 300);
  }

  if (!offerConfig.enabled || !open) return null;

  const {
    badge, title, subtitle, description,
    totalSlots, filledSlots, slotLabel, slotSubtext,
    tags, primaryButton, whatsappButton, footerNote,
  } = offerConfig;

  const remaining = totalSlots - filledSlots;
  const fillPct   = (filledSlots / totalSlots) * 100;
  const waLink    = `https://wa.me/${whatsappButton.number}?text=${encodeURIComponent(whatsappButton.message)}`;

  return (
    <>
      {/* Mobile-responsive styles */}
      <style>{`
        .offer-card {
          width: 100%;
          max-width: 520px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(29,78,216,0.18), 0 8px 32px rgba(0,0,0,0.12);
          background: #ffffff;
        }
        .offer-header {
          background: linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%);
          padding: 28px 28px 24px;
          position: relative;
          overflow: hidden;
        }
        .offer-body {
          padding: 24px 28px 28px;
          background: #ffffff;
        }
        .offer-title {
          font-size: 36px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0;
        }
        .offer-subtitle {
          margin: 8px 0 0;
          font-size: 15px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }
        .offer-description {
          margin: 14px 0 0;
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          font-weight: 400;
        }
        .offer-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);
          color: #ffffff;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
          transition: opacity 200ms, transform 200ms;
          border: none;
          cursor: pointer;
        }
        .offer-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        .offer-btn-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: #f0fdf4;
          color: #16a34a;
          border-radius: 14px;
          border: 1.5px solid #bbf7d0;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: background 200ms, transform 200ms;
        }
        .offer-btn-whatsapp:hover {
          background: #dcfce7;
          transform: translateY(-2px);
        }

        /* ── Mobile ── */
        @media (max-width: 540px) {
          .offer-card {
            border-radius: 20px;
            max-width: 100%;
          }
          .offer-header {
            padding: 22px 20px 20px;
          }
          .offer-body {
            padding: 18px 20px 24px;
          }
          .offer-title {
            font-size: 28px;
          }
          .offer-subtitle {
            font-size: 13px;
          }
          .offer-description {
            font-size: 13px;
          }
          .offer-btn-primary,
          .offer-btn-whatsapp {
            padding: 14px 18px;
            font-size: 14px;
            border-radius: 12px;
          }
        }

        @media (max-width: 360px) {
          .offer-title { font-size: 24px; }
          .offer-header { padding: 18px 16px 18px; }
          .offer-body   { padding: 16px 16px 20px; }
        }
      `}</style>

      {/* Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Special Offer"
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          backgroundColor: animate ? "rgba(15,23,42,0.65)" : "rgba(15,23,42,0)",
          backdropFilter: animate ? "blur(8px)" : "blur(0px)",
          transition: "background-color 300ms ease, backdrop-filter 300ms ease",
        }}
      >
        {/* Card */}
        <div
          className="offer-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: animate ? "translateY(0) scale(1)" : "translateY(40px) scale(0.94)",
            opacity: animate ? 1 : 0,
            transition: "transform 320ms cubic-bezier(0.34,1.2,0.64,1), opacity 300ms ease",
          }}
        >

          {/* ── Header ── */}
          <div className="offer-header">
            {/* Decorative circles */}
            <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-30px", left:"-20px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close offer"
              style={{
                position:"absolute", top:"14px", right:"14px",
                width:"32px", height:"32px", borderRadius:"50%",
                background:"rgba(255,255,255,0.15)", border:"none",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"background 200ms", zIndex:2,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,0.18)", borderRadius:"100px", padding:"5px 12px", marginBottom:"12px" }}>
              <span style={{ fontSize:"13px" }}>🔥</span>
              <span style={{ fontSize:"11px", fontWeight:700, color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>{badge}</span>
            </div>

            <h2 className="offer-title">{title}</h2>
            <p className="offer-subtitle">{subtitle}</p>
            <p className="offer-description">{description}</p>
          </div>

          {/* ── Body ── */}
          <div className="offer-body">

            {/* Slot card */}
            <div style={{
              borderRadius:"16px",
              border:"1.5px solid #BFDBFE",
              background:"#EFF6FF",
              padding:"18px 20px",
              marginBottom:"18px",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
                <div>
                  <p style={{ margin:0, fontSize:"15px", fontWeight:700, color:"#1E3A8A" }}>{slotLabel}</p>
                  <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#6B7280" }}>{slotSubtext}</p>
                </div>
                {/* Slot badge */}
                <div style={{
                  width:"60px", height:"60px", borderRadius:"14px", flexShrink:0,
                  background:"linear-gradient(135deg,#1E40AF,#3B82F6)",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 8px 24px rgba(37,99,235,0.35)",
                }}>
                  <span style={{ fontSize:"24px", fontWeight:900, color:"#fff", lineHeight:1 }}>{remaining}</span>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.85)", fontWeight:600 }}>LEFT</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ background:"#DBEAFE", borderRadius:"100px", height:"10px", overflow:"hidden" }}>
                <div style={{
                  width:`${fillPct}%`, height:"100%", borderRadius:"100px",
                  background:"linear-gradient(90deg,#1E40AF,#3B82F6)",
                  transition:"width 900ms ease",
                }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px" }}>
                <span style={{ fontSize:"12px", color:"#DC2626", fontWeight:700 }}>{filledSlots} slots taken</span>
                <span style={{ fontSize:"12px", color:"#9CA3AF" }}>{totalSlots} total</span>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
                {tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize:"11px", fontWeight:700, letterSpacing:"0.05em",
                    color:"#1D4ED8", background:"#EFF6FF",
                    border:"1px solid #BFDBFE",
                    borderRadius:"100px", padding:"5px 12px",
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <a href={primaryButton.link} target="_blank" rel="noopener noreferrer" className="offer-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {primaryButton.label}
              </a>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="offer-btn-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {whatsappButton.label}
              </a>
            </div>

            <p style={{ margin:"16px 0 0", textAlign:"center", fontSize:"12px", color:"#D1D5DB" }}>
              {footerNote}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
