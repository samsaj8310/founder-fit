import React from 'react';
import RadarChart from './dashboard/RadarChart';
import LineChart from './dashboard/LineChart';

export default function DetailedReport({ 
  onClose,
  nameA,
  nameB,
  overall,
  catScores,
  scoresA,
  scoresB,
  riskData,
  weakCats
}) {

  const handlePrint = () => {
    window.print();
  };

  const getGaugePath = (score) => {
    const S = Math.min(100, Math.max(0, score));
    const phi = Math.PI - (S / 100) * Math.PI;
    const x = 130 + 100 * Math.cos(phi);
    const y = 130 - 100 * Math.sin(phi);
    return `M 30 130 A 100 100 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  };

  const getPercentile = (score) => {
    if (score >= 90) return 'Top 5%';
    if (score >= 80) return 'Top 15%';
    if (score >= 70) return 'Top 25%';
    if (score >= 60) return 'Top 40%';
    return 'Bottom 50%';
  };

  const getFitPill = (score) => {
    if (score >= 85) return 'Excellent Fit';
    if (score >= 75) return 'Strong Alignment';
    if (score >= 60) return 'Moderate Fit';
    return 'Caution Required';
  };

  const getPersonaName = (score) => {
    if (score >= 85) return 'Visionary Synergy';
    if (score >= 75) return 'Complementary Partners';
    if (score >= 60) return 'Aligned Leadership';
    return 'Divergent Founders';
  };

  const aboveAverageCount = Object.values(catScores).filter(s => s >= 70).length;

  const sortedCats = Object.keys(catScores).sort((a, b) => catScores[b] - catScores[a]);
  const topDimension = sortedCats[0];
  const lowestDimension = sortedCats[sortedCats.length - 1];

  const dimensionKeys = [
    { key: 'Strategy', name: 'Strategy & Vision', desc: 'Measures long-term alignment on exit goals, growth speed, and startup direction.', color: '#8b5cf6' },
    { key: 'Roles', name: 'Roles & Responsibilities', desc: 'Allocation of leadership duties, decision-making boundaries, and execution ownership.', color: '#6c2bd9' },
    { key: 'Market Approach', name: 'Market & Product Strategy', desc: 'Focus on target customer segments, product features priority, and go-to-market execution.', color: '#10b981' },
    { key: 'Leadership', name: 'Leadership & Communication', desc: 'Communication frequency, management styles, and handling team culture.', color: '#f59e0b' },
    { key: 'Resilience', name: 'Resilience & Stress Handling', desc: 'Coping with financial runway pressure, pivot decisions, and team burnout.', color: '#06b6d4' },
    { key: 'Conflict Resolution', name: 'Conflict Resolution', desc: 'Style of addressing disagreements, directness of feedback, and emotional regulation.', color: '#f97316' },
    { key: 'Equity', name: 'Equity & Cap Table Split', desc: 'Fairness of the cap table split, vesting schedules, and long-term financial expectations.', color: '#ec4899' }
  ];

  const dimensionMetadata = {
    'Strategy': {
      insightHigh: 'Your strategic visions are in lockstep. You share the same expectations for company scaling, raising venture capital, and potential exit timelines.',
      insightMed: 'Moderate alignment. While you agree on the core business concept, there are minor differences regarding growth velocity or funding strategies that need discussion.',
      insightLow: 'High strategic divergence. You have fundamentally different visions for the company’s future (e.g., lifestyle business vs. hyper-growth venture). This requires immediate alignment.'
    },
    'Roles': {
      insightHigh: 'Role boundaries are clearly defined with zero overlap. Both founders respect each other’s operational ownership and domain authority.',
      insightMed: 'Some overlap exists in leadership duties. Clarity is needed around who holds final authority on product vs. business decisions to avoid stepping on each other’s toes.',
      insightLow: 'Significant operational overlap. You both expect to drive the same key areas, or roles remain ambiguous. Clear division of responsibilities is critical to avoid friction.'
    },
    'Market Approach': {
      insightHigh: 'Exceptional alignment on market strategy. You share a common target demographic and product priority list, ensuring synchronized development.',
      insightMed: 'Minor disagreements on product priorities or target markets. One founder favors rapid feature releases, while the other prefers polishing existing ones.',
      insightLow: 'Fundamental split in product direction. One founder favors a broad B2B solution while the other is focused on a B2C niche. This will cause engineering and product friction.'
    },
    'Leadership': {
      insightHigh: 'Management styles are highly compatible. You communicate transparently and handle external stakeholders and employee culture with unified messages.',
      insightMed: 'Varying communication preferences. Regular synchronization meetings are needed to keep both founders on the same page regarding team management.',
      insightLow: 'Divergent leadership styles. Differences in managing teams or communicating updates could create mixed signals for employees and investors.'
    },
    'Resilience': {
      insightHigh: 'Excellent resilience match. You support each other during dry spells and share similar thresholds for personal financial risk and runway tolerance.',
      insightMed: 'Varying risk tolerance. One founder is more comfortable with low financial runways, while the other experiences stress, which may impact business decisions.',
      insightLow: 'Highly mismatched stress tolerances. Dissimilar reactions to pivot opportunities or runway constraints could cause emotional strain between founders.'
    },
    'Conflict Resolution': {
      insightHigh: 'Extremely healthy conflict resolution. Disagreements are handled constructively and directly with zero personal friction or emotional escalation.',
      insightMed: 'Conflicts are managed reasonably well, but you tend to avoid addressing disagreements directly, letting them simmer under the surface.',
      insightLow: 'Unhealthy conflict patterns. One founder prefers direct debate while the other retreats or avoids, leading to unresolved communication bottlenecks.'
    },
    'Equity': {
      insightHigh: 'CAP table split and compensation expectations are completely aligned. Standard vesting schedules are accepted by both founders.',
      insightMed: 'Minor equity adjustments or vesting terms are still unresolved. Ensure written agreements are finalized to avoid future legal disputes.',
      insightLow: 'Significant friction regarding equity split or vesting. Immediate cap table restructuring or salary renegotiation is needed to ensure long-term stability.'
    }
  };

  const getInsight = (dim, score) => {
    const meta = dimensionMetadata[dim];
    if (!meta) return '';
    if (score >= 80) return meta.insightHigh;
    if (score >= 50) return meta.insightMed;
    return meta.insightLow;
  };

  const getBandName = (score) => {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Med';
    return 'Low';
  };

  const getBandColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f97316';
    return '#f43f5e';
  };

  return (
    <div className="detailed-report-overlay">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --b900:#061228; --b800:#0d2040; --b700:#0f3460; --b600:#1144a0; --b500:#1a56db;
          --b400:#3b82f6; --b300:#93c5fd; --b200:#bfdbfe; --b100:#dbeafe; --b50:#eff6ff;
          --surface:#f0f4ff; --border:rgba(17,68,160,0.14); --ink:#1e293b; --inkL:#64748b;
          --green:#10b981; --red:#f43f5e; --orange:#f97316; --purple:#86198f; --cyan:#06b6d4;
        }

        .detailed-report-overlay * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .detailed-report-overlay {
          font-family: 'Inter', sans-serif;
          color: var(--ink);
        }

        .mono { font-family: 'IBM Plex Mono', monospace; }
        .serif { font-family: 'Playfair Display', serif; }

        .wp-page, .page {
          width: 210mm;
          min-height: 297mm;
          margin: 20px auto;
          background: #fff;
          box-shadow: 0 8px 40px rgba(15,30,60,0.12);
          position: relative;
          padding: 15mm 16mm 12mm;
          display: flex;
          flex-direction: column;
          page-break-after: always;
          overflow: hidden;
        }

        .wp-serif { font-family: 'Playfair Display', serif; }
        .wp-mono { font-family: 'IBM Plex Mono', monospace; }

        @media print {
          body > *:not(.detailed-report-overlay) {
            display: none !important;
          }
          .detailed-report-overlay {
            position: static;
            background: transparent;
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .detailed-report-header {
            display: none !important;
          }
          .detailed-report-body {
            display: block;
            padding: 0;
            margin: 0;
            background: transparent;
            overflow: visible;
          }
          .wp-page, .page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
        }

        .pg-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 9px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }

        .brand {
          font-size: 11.6px;
          font-weight: 700;
          letter-spacing: .14em;
          color: var(--b900);
          text-transform: uppercase;
        }

        .brand span { color: var(--b500); }
        .pg-num { font-size: 11.02px; color: var(--inkL); letter-spacing: .08em; }

        .pg-ftr {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9.86px;
          color: #94a3b8;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .eyebrow {
          font-size: 11.6px;
          font-weight: 700;
          letter-spacing: .15em;
          color: var(--b500);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .pg-title {
          font-size: 27.84px;
          font-weight: 700;
          color: var(--b900);
          margin-bottom: 4px;
          line-height: 1.24;
        }

        .pg-sub {
          font-size: 12.76px;
          color: var(--inkL);
          max-width: 560px;
          line-height: 1.67;
          margin-bottom: 18px;
        }

        h3.sec {
          font-size: 13.92px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--b900);
          margin: 20px 0 10px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        h3.sec:first-of-type {
          border-top: none;
          padding-top: 0;
          margin-top: 14px;
        }

        p.body {
          font-size: 12.53px;
          line-height: 1.78;
          color: #334155;
          margin-bottom: 8px;
        }

        p.body b { color: var(--b900); }

        .callout {
          background: var(--b50);
          border: 1px solid var(--b200);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 12.18px;
          color: #334155;
          line-height: 1.73;
          margin: 10px 0;
        }

        .callout b { color: var(--b900); }
        .callout.insight { background: #fffbeb; border-color: #fde68a; }
        .callout.insight .lbl { color: #b45309; }
        .lbl {
          font-size: 10.44px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--b500);
          margin-bottom: 5px;
          display: block;
        }

        .stat-row { display: flex; gap: 14px; margin: 14px 0 4px; }
        .stat-box {
          flex: 1;
          background: var(--b50);
          border: 1px solid var(--b200);
          border-radius: 9px;
          padding: 10px 12px;
          text-align: center;
        }

        .stat-box .n {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 20px;
          font-weight: 700;
          color: var(--b700);
        }

        .stat-box .l {
          font-size: 9px;
          color: var(--inkL);
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-top: 2px;
        }

        .gauge-wrap { display: flex; align-items: center; gap: 30px; margin: 10px 0; }
        .gauge-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 60.32px;
          font-weight: 700;
          fill: var(--b900);
        }

        .gauge-label { font-size: 10.44px; fill: var(--inkL); letter-spacing: .1em; }
        .tag-pill {
          display: inline-block;
          background: var(--b100);
          color: var(--b700);
          font-size: 12.18px;
          font-weight: 700;
          padding: 4px 13px;
          border-radius: 16px;
          margin-bottom: 6px;
        }

        .persona-name {
          font-size: 20.88px;
          font-weight: 700;
          color: var(--b900);
          font-family: 'Playfair Display', serif;
        }

        .dim-block { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .dim-block:last-child { border-bottom: none; }
        .dim-score-col { width: 66px; flex-shrink: 0; text-align: center; }
        .dim-score-col .n { font-family: 'IBM Plex Mono', monospace; font-size: 25.52px; font-weight: 700; }
        .dim-score-col .band { font-size: 8.7px; text-transform: uppercase; letter-spacing: .04em; color: var(--inkL); margin-top: 1px; }
        .dim-body { flex: 1; }
        .dim-name { font-size: 13.92px; font-weight: 700; color: var(--b900); margin-bottom: 2px; }
        .dim-desc { font-size: 11.6px; color: var(--inkL); line-height: 1.67; }
        .dim-tell { font-size: 11.02px; color: #475569; line-height: 1.67; margin-top: 3px; padding-left: 10px; border-left: 2px solid var(--b100); }

        .glance-table { width: 100%; border-collapse: collapse; margin: 10px 0 4px; }
        .glance-table td { padding: 6px 8px; font-size: 11.37px; border-bottom: 1px solid var(--border); }
        .glance-table .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 7px; }
        .glance-table .nm { font-weight: 600; color: var(--b900); }
        .glance-table .sc { font-family: 'IBM Plex Mono', monospace; font-weight: 700; text-align: right; }

        .action-item { display: flex; gap: 11px; padding: 11px 0; border-bottom: 1px solid var(--border); }
        .action-item:last-child { border-bottom: none; }
        .action-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          color: #fff;
          font-size: 11.6px;
          font-weight: 700;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .action-dim { font-size: 10.44px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2px; }
        .action-text { font-size: 12.18px; color: #334155; line-height: 1.67; }
        .action-why { font-size: 11.02px; color: var(--inkL); line-height: 1.62; margin-top: 3px; font-style: italic; }

        .seq-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .seq-table th { text-align: left; font-size: 9.63px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--inkL); padding: 6px 8px; border-bottom: 1.5px solid var(--b900); }
        .seq-table td { padding: 7px 8px; font-size: 11.37px; border-bottom: 1px solid var(--border); vertical-align: top; }
      ` }} />

      {/* Document Viewer Header Bar */}
      <header className="detailed-report-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>⚡ FounderSync</span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Detailed Partnership Report</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="report-print-btn" onClick={handlePrint}>
            Print / Save as PDF 🖨️
          </button>
          <button className="report-close-btn" onClick={onClose}>
            Close ×
          </button>
        </div>
      </header>

      {/* Pages Container */}
      <div className="detailed-report-body">

        {/* ================= PAGE 1: COVER PAGE ================= */}
        <div className="wp-page" style={{ border: '1px solid var(--border)' }}>
          <div style={{ padding: '14mm 16mm 0' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#1a56db' }}>FounderSync Assessment Report</span>
            </div>
          </div>

          <div style={{ padding: '24mm 16mm 0', position: 'relative', zIndex: 2 }}>
            <div className="wp-mono" style={{ fontSize: '11.5px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#1a56db', fontWeight: 600, marginBottom: '6mm' }}>AI ASSESSMENT REPORT · DETAILED SYNERGY SUMMARY</div>
            <div style={{ fontWeight: 800, fontSize: '50px', lineHeight: 1.08, color: '#061228', letterSpacing: '-.01em' }}>Co-Founder</div>
            <div style={{ fontWeight: 800, fontSize: '50px', lineHeight: 1.08, color: '#1a56db', letterSpacing: '-.01em' }}>Compatibility Fit</div>
            <div style={{ fontSize: '13.8px', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#334155', marginTop: '8mm' }}>Prepared For: {nameA} & {nameB}</div>
          </div>

          <div style={{ position: 'relative', flex: 1, minHeight: '120mm', marginTop: '-4mm' }}>
            <svg width="760" height="480" viewBox="0 0 760 480" style={{ position: 'absolute', left: '-30px', bottom: 0 }}>
              <path d="M 0.0 23.8 Q 17.3 25.4 25.9 26.2 Q 51.8 28.9 60.5 29.8 Q 86.4 32.5 95.0 33.3 Q 120.9 35.8 129.5 36.6 Q 155.5 38.8 164.1 39.5 Q 190.0 41.4 198.6 42.0 Q 224.5 43.6 233.2 44.0 Q 259.1 45.2 267.7 45.5 Q 293.6 46.1 302.3 46.0 Q 328.2 45.6 336.8 45.2 Q 362.7 43.7 371.4 42.9 Q 397.3 40.0 405.9 38.8 Q 431.8 34.9 440.5 33.4 Q 466.4 28.7 475.0 27.0 Q 500.9 21.9 509.5 20.1 Q 535.5 14.8 544.1 13.1 Q 570.0 7.9 578.6 6.2 Q 604.5 1.2 613.2 -0.3 Q 639.1 -4.8 647.7 -6.1 Q 673.6 -9.9 682.3 -10.9 Q 708.2 -13.7 716.8 -14.3 Q 742.7 -15.6 751.4 -15.7" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.75" strokeLinecap="round"/>
              <path d="M 0.0 30.0 Q 17.3 31.7 25.9 32.5 Q 51.8 35.2 60.5 36.1 Q 86.4 38.7 95.0 39.6 Q 120.9 42.0 129.5 42.8 Q 155.5 45.0 164.1 45.7 Q 190.0 47.7 198.6 48.3 Q 224.5 49.9 233.2 50.4 Q 259.1 51.4 267.7 51.6 Q 293.6 51.7 302.3 51.5 Q 328.2 50.5 336.8 49.9 Q 362.7 47.6 371.4 46.5 Q 397.3 42.9 405.9 41.5 Q 431.8 37.0 440.5 35.3 Q 466.4 30.2 475.0 28.4 Q 500.9 23.0 509.5 21.1 Q 535.5 15.7 544.1 13.9 Q 570.0 8.6 578.6 6.9 Q 604.5 1.9 613.2 0.4 Q 639.1 -4.0 647.7 -5.3 Q 673.6 -8.7 682.3 -9.5 Q 708.2 -11.6 716.8 -12.0 Q 742.7 -12.5 751.4 -12.3" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.70" strokeLinecap="round"/>
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 16mm 14mm' }}>
            <div className="wp-mono" style={{ fontSize: '10.3px', color: '#94a3b8' }}>Prepared By Infopace Management Pvt. Ltd.</div>
            <div style={{ fontWeight: 800, fontSize: '57.5px', color: '#061228', lineHeight: 1.1 }}>2026</div>
          </div>
        </div>

        {/* ================= PAGE 2: TABLE OF CONTENTS ================= */}
        <div className="wp-page">
          <div style={{ padding: '16mm 16mm 12mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div className="pg-hdr">
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
              </div>
              <div className="pg-num wp-mono">02 / 12</div>
            </div>
            
            <div className="wp-mono" style={{ fontSize: '11.5px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a56db', fontWeight: 600, marginBottom: '3mm' }}>In This Report</div>
            <div className="wp-serif" style={{ fontSize: '36.8px', fontWeight: 700, color: '#061228', marginBottom: '9mm' }}>Contents</div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Our Assessment Suite<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>An overview of the Infopace diagnostic platform</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>03</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Executive Summary<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Overall compatibility score & alignment persona</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>04</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Compatibility Dimensions deep-dive I<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Alignment insights on Strategy, Roles, Market, and Leadership</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>05</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Compatibility Dimensions deep-dive II<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Alignment insights on Resilience, Conflict, and Equity</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>06</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Strategic Alignment Radar<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Comparative alignment radar and decision style matrix</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>07</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Partnership Risk Map<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Dimension variance, risk levels and key watch-outs</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>08</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Action Plan & Recommendations<span style={{ display: 'block', fontSize: '9.8px', color: '#94a3b8', marginTop: '1mm' }}>Co-founder communication triggers and alignment goals</span></div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>09</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>Disclaimer, Privacy and Terms</div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>10</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5mm', padding: '5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div className="wp-serif" style={{ fontSize: '17px', color: '#0f172a', flexShrink: 0 }}>About Infopace</div>
              <div style={{ flex: 1, borderBottom: '1px dotted #cbd5e1', marginBottom: '1.5mm' }}></div>
              <div className="wp-mono" style={{ fontSize: '10.5px', color: '#94a3b8', flexShrink: 0 }}>11</div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
              <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
              <div>AI-Evaluated Report</div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 3: ASSESSMENT SUITE ================= */}
        <div className="wp-page">
          <div style={{ padding: '16mm 16mm 12mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div className="pg-hdr">
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
              </div>
              <div className="pg-num wp-mono">03 / 12</div>
            </div>
            
            <div className="wp-mono" style={{ fontSize: '11.5px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a56db', fontWeight: 600, marginBottom: '3mm' }}>Company Overview</div>
            <div className="wp-serif" style={{ fontSize: '36.8px', fontWeight: 700, color: '#061228', marginBottom: '6mm' }}>Our Assessment Suite</div>
            
            <p style={{ fontSize: '12.6px', color: '#334155', lineHeight: '1.87', marginBottom: '4mm', textAlign: 'left' }}>Infopace continued to strengthen its portfolio of AI-powered business assessment tools, delivering data-driven solutions that assist entrepreneurs, startups, and organizations make informed strategic decisions.</p>
            <p style={{ fontSize: '12.6px', color: '#334155', lineHeight: '1.87', marginBottom: '8mm', textAlign: 'left' }}>Each assessment leverages AI to analyze user responses and generate comprehensive reports containing actionable insights, key findings, strengths, improvement areas, and tailored recommendations. The current suite includes the following five tools:</p>
            
            <div className="wp-mono" style={{ fontSize: '10.3px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '2mm' }}>The Assessment Suite</div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '3px', background: '#a21caf', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Market Research Assessment</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Validates business ideas by analyzing market demand, customer needs, industry trends, and competition, enabling informed market-entry decisions.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '3px', background: '#06b6d4', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Market Potential</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Evaluates the growth potential and commercial viability of a product or business by assessing market size, demand, scalability and risk opportunities.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '3px', background: '#1a56db', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Creative Innovation Index</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Measures innovation capability by assessing creativity, problem-solving and adaptability, assisting individuals and organizations strengthen their innovation potential.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '3px', background: '#f97316', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Business Risk Assessment</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Identifies strategic, operational, financial and market risks, enabling businesses to proactively mitigate challenges and improve resilience.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '3px', background: '#f43f5e', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Founder and Co-Founder Compatibility</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Assesses alignment between founders in leadership, communication, values, and decision-making to build stronger partnerships and reduce future conflicts.</div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
              <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
              <div>AI-Evaluated Report</div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 4: EXECUTIVE SUMMARY ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">04 / 12</div>
          </div>

          <div className="eyebrow">Section One</div>
          <div className="pg-title">Executive Summary</div>
          <div className="pg-sub">An overview of your overall compatibility profile — your score, what it means, and where your alignment is strongest.</div>

          <div className="gauge-wrap">
            <svg width="190" height="110" viewBox="0 0 260 150">
              <path d="M 30 130 A 100 100 0 0 1 230 130" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round"/>
              <path d={getGaugePath(overall)} fill="none" stroke="#1a56db" strokeWidth="18" strokeLinecap="round"/>
              <text x="130" y="108" textAnchor="middle" className="gauge-num">{overall}</text>
              <text x="130" y="130" text-anchor="middle" className="gauge-label mono">FIT SCORE / 100</text>
            </svg>
            <div>
              <div className="tag-pill">{getFitPill(overall)}</div>
              <div className="persona-name">{getPersonaName(overall)}</div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-box"><div className="n">{overall}%</div><div className="l">Fit Score</div></div>
            <div className="stat-box"><div className="n">{getPercentile(overall)}</div><div className="l">Percentile</div></div>
            <div className="stat-box"><div className="n">{aboveAverageCount}/7</div><div className="l">High Synergy</div></div>
            <div className="stat-box"><div className="n" style={{ fontSize: '11px' }}>{topDimension}</div><div className="l">Top Dimension</div></div>
          </div>

          <p style={{ fontSize: '9.5px', color: 'var(--inkL)', margin: '6px 0 4px', lineHeight: 1.5 }}>
            A compatibility score of {overall}% places this partnership in the <b style={{ color: 'var(--b700)' }}>{getPercentile(overall)} of all co-founding teams</b> assessed. The benchmark for startup partnerships sits at 68%, putting this alignment ahead of the average startup team.
          </p>

          <h3 className="sec">Synergy Summary</h3>
          <p className="body">Across the seven dimensions of founder compatibility, your answers demonstrate a <b>{overall >= 75 ? 'highly aligned, strategic partnership' : 'solid partnership with target areas for negotiation'}</b>. Strategy & Vision and Roles & Responsibilities are key strengths, showing that you share the same exit timelines and respect operational boundaries. </p>
          <p className="body">Your highest area of alignment is <b>{topDimension}</b>, representing a shared foundation of values. When stress rises or capital runs low, this shared perspective acts as an anchor for the relationship.</p>
          <p className="body">The primary area requiring discussion is <b>{lowestDimension}</b>. Divergences here, if left unaddressed, could lead to friction when scaling. Refer to the sequenced recommendations for tactical alignment exercises.</p>

          <h3 className="sec">Compatibility Dimensions At A Glance</h3>
          <table className="glance-table">
            <tbody>
              {dimensionKeys.map(d => (
                <tr key={d.key}>
                  <td><span className="dot" style={{ background: d.color }}></span><span className="nm">{d.name}</span></td>
                  <td style={{ color: 'var(--inkL)' }}>{d.desc}</td>
                  <td className="sc" style={{ color: getBandColor(catScores[d.key] || 0) }}>{catScores[d.key] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 5: DIMENSION BREAKDOWN I ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">05 / 12</div>
          </div>

          <div className="eyebrow">Section Two</div>
          <div className="pg-title">Compatibility Dimensions I</div>
          <div className="pg-sub">Detailed alignment insights for the first four core compatibility categories.</div>

          {dimensionKeys.slice(0, 4).map(dim => {
            const score = catScores[dim.key] || 0;
            return (
              <div className="dim-block" key={dim.key}>
                <div className="dim-score-col">
                  <div className="n" style={{ color: getBandColor(score) }}>{score}</div>
                  <div className="band">{getBandName(score)}</div>
                </div>
                <div className="dim-body">
                  <div className="dim-name">{dim.name}</div>
                  <div className="dim-desc">{dim.desc}</div>
                  <div className="dim-tell">{getInsight(dim.key, score)}</div>
                  <div className="dim-extra">
                    <span className="k">{nameA}:</span> {scoresA[dim.key] || 0} | <span className="k">{nameB}:</span> {scoresB[dim.key] || 0}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 6: DIMENSION BREAKDOWN II ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">06 / 12</div>
          </div>

          <div className="eyebrow">Section Two</div>
          <div className="pg-title">Compatibility Dimensions II</div>
          <div className="pg-sub">Detailed alignment insights for the remaining compatibility categories.</div>

          {dimensionKeys.slice(4).map(dim => {
            const score = catScores[dim.key] || 0;
            return (
              <div className="dim-block" key={dim.key}>
                <div className="dim-score-col">
                  <div className="n" style={{ color: getBandColor(score) }}>{score}</div>
                  <div className="band">{getBandName(score)}</div>
                </div>
                <div className="dim-body">
                  <div className="dim-name">{dim.name}</div>
                  <div className="dim-desc">{dim.desc}</div>
                  <div className="dim-tell">{getInsight(dim.key, score)}</div>
                  <div className="dim-extra">
                    <span className="k">{nameA}:</span> {scoresA[dim.key] || 0} | <span className="k">{nameB}:</span> {scoresB[dim.key] || 0}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 7: STRATEGIC ALIGNMENT RADAR ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">07 / 12</div>
          </div>

          <div className="eyebrow">Section Three</div>
          <div className="pg-title">Strategic Alignment Charts</div>
          <div className="pg-sub">Live visual mapping of the profile overlap between the founders.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '15px 0' }}>
            <div>
              <div className="lbl">Strategic Alignment Radar</div>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <RadarChart 
                  labels={Object.keys(catScores).map(c => c.split(' ')[0])} 
                  datasets={[
                    { label: nameA, data: Object.keys(catScores).map(c => scoresA[c]), borderColor: '#00A9D6', backgroundColor: 'rgba(0, 169, 214, 0.1)' },
                    { label: nameB, data: Object.keys(catScores).map(c => scoresB[c]), borderColor: '#2E2A8C', backgroundColor: 'rgba(46, 42, 140, 0.1)' }
                  ]} 
                />
              </div>
            </div>

            <div>
              <div className="lbl">Decision Style Matrix</div>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <LineChart 
                  labels={Object.keys(catScores).map(c => c.split(' ')[0])} 
                  datasets={[
                    { label: nameA, data: Object.keys(catScores).map(c => scoresA[c]), borderColor: '#00A9D6', backgroundColor: '#00A9D6' },
                    { label: nameB, data: Object.keys(catScores).map(c => scoresB[c]), borderColor: '#2E2A8C', backgroundColor: '#2E2A8C' }
                  ]} 
                />
              </div>
            </div>
          </div>

          <h3 className="sec">Visual Insights</h3>
          <p className="body">The <b>Radar Chart</b> overlays the individual profiles of {nameA} and {nameB}. Areas where the lines closely touch represent high synergy. Divergent gaps highlight areas where decision frameworks should be established to prevent executive paralysis.</p>
          <p className="body">The <b>Style Matrix</b> indicates how founders approach execution. A gap of more than 20 points in any dimension represents a risk of operational drag (e.g. one founder executing faster than the other has agreed).</p>

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 8: RISK MAP ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">08 / 12</div>
          </div>

          <div className="eyebrow">Section Four</div>
          <div className="pg-title">Partnership Risk Map</div>
          <div className="pg-sub">Strategic variance mapping of the co-founder compatibility split.</div>

          <table className="seq-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>{nameA}</th>
                <th>{nameB}</th>
                <th>Match</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {dimensionKeys.map(d => {
                const score = catScores[d.key] || 0;
                const riskLevel = score >= 80 ? 'Low' : (score >= 50 ? 'Med' : 'High');
                const riskColor = score >= 80 ? '#10b981' : (score >= 50 ? '#f97316' : '#f43f5e');
                return (
                  <tr key={d.key}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td className="mono">{scoresA[d.key] || 0}</td>
                    <td className="mono">{scoresB[d.key] || 0}</td>
                    <td className="mono" style={{ fontWeight: 700 }}>{score}%</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        color: '#fff', 
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: riskColor
                      }}>{riskLevel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="callout insight">
            <span className="lbl">Partnership Watch-outs</span>
            Pay close attention to dimensions marked as <b>High Risk</b>. These represent alignment gaps where standard corporate agreements (vesting, cap table clauses, exit triggers) should be configured carefully.
          </div>

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 9: ACTION PLAN & RECOMMENDATIONS ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
            </div>
            <div className="pg-num mono">09 / 12</div>
          </div>

          <div className="eyebrow">Section Five</div>
          <div className="pg-title">Action Plan & Recommendations</div>
          <div className="pg-sub">Sequenced alignment steps for the partnership.</div>

          <div className="action-item">
            <div className="action-num" style={{ background: '#1a56db' }}>1</div>
            <div style={{ flex: 1 }}>
              <div className="action-dim" style={{ color: '#1a56db' }}>Strategy & Vesting Alignment</div>
              <div className="action-text">Review and finalize Vesting terms. Ensure there is a minimum 1-year cliff on both cap splits, shielding the startup if a co-founder leaves early.</div>
            </div>
          </div>

          <div className="action-item">
            <div className="action-num" style={{ background: '#f97316' }}>2</div>
            <div style={{ flex: 1 }}>
              <div className="action-dim" style={{ color: '#f97316' }}>Role & Responsibility Clarity</div>
              <div className="action-text">Create a Roles matrix separating tech development from business metrics. Define exact decision boundaries to eliminate executive overlaps.</div>
            </div>
          </div>

          <div className="action-item">
            <div className="action-num" style={{ background: '#10b981' }}>3</div>
            <div style={{ flex: 1 }}>
              <div className="action-dim" style={{ color: '#10b981' }}>Conflict Trigger Exercises</div>
              <div className="action-text">Agree on a conflict escalation path. In case of tiebreaks, determine if you will defer to advisory board votes or specify single-person tiebreakers.</div>
            </div>
          </div>

          <div className="callout">
            These steps are designed to protect the founders' relationship and the startup's equity structure. Discuss them directly.
          </div>

          <div className="pg-ftr">
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>AI-Evaluated Report</div>
          </div>
        </div>

        {/* ================= PAGE 10: LEGAL/DISCLAIMER ================= */}
        <div className="wp-page" style={{ border: '1px solid var(--border)' }}>
          <div style={{ padding: '16mm 16mm 12mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9mm' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
              <div className="wp-mono" style={{ fontSize: '10.3px', color: '#94a3b8' }}>10 / 12</div>
            </div>
            
            <div className="wp-serif" style={{ fontSize: '28.7px', fontWeight: 700, color: '#061228', marginBottom: '8mm' }}>Disclaimer, Privacy and Terms</div>
            
            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>⚠️</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Disclaimer</div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  The AI-evaluated compatibility report is for informational purposes only. The findings and recommendations are directional indicators and do not constitute legal, financial, or corporate governance advice.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>🔒</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Privacy Policy</div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  Assessment responses are handled with strict confidentiality and secure encryption. Your personal responses are not used to train external models or disclosed to third parties.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>📄</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Terms and Conditions</div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  By using this assessment, you agree that Infopace does not guarantee specific business outcomes or liability resulting from actions taken based on these diagnostics.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
                <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
                <div>AI-Evaluated Report</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 11: ABOUT INFOPACE ================= */}
        <div className="wp-page">
          <div style={{ padding: '16mm 16mm 4mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div className="pg-hdr">
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a56db' }}>FounderSync</span>
              <div className="wp-mono" style={{ fontSize: '10.3px', color: '#94a3b8' }}>11 / 12</div>
            </div>

            <div className="wp-serif" style={{ fontSize: '32px', fontWeight: 700, color: '#061228', marginBottom: '4mm' }}>About Infopace</div>
            <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.85, marginBottom: '6mm', textAlign: 'left' }}>
              Infopace Management Pvt. Ltd. is a global specialist services provider helping corporate leaders, fast-growing startups, and investors validate strategy, build aligned teams, and evaluate market potential.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '8mm' }}>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div className="wp-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#1a56db' }}>200+</div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Specialists</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div className="wp-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#1a56db' }}>850+</div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Clients</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div className="wp-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#1a56db' }}>7000+</div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Projects</div>
              </div>
            </div>

            <h3 className="sec">Our Leadership Core</h3>
            <p className="body">Infopace specializes in cross-border strategy validation and executive alignment. Through our proprietary diagnostic methodologies and strategic advisory partners, we assist organizations in identifying operational risks and configuring corporate structures for sustainable scaling.</p>

            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
                <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
                <div>AI-Evaluated Report</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 12: THANK YOU ================= */}
        <div className="wp-page" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#061228', color: '#f8fafc' }}>
          <div style={{ padding: '16mm 16mm 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '220mm' }}>
            <div className="wp-serif" style={{ fontSize: '50px', fontWeight: 700, color: '#fff', marginBottom: '6mm', lineHeight: '1.1' }}>Thank You.</div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.8', maxWidth: '440px', marginBottom: '8mm' }}>
              We appreciate your trust in Infopace assessments. For further custom alignment advisory, contact our senior consultants.
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8mm', display: 'flex', flexDirection: 'column', gap: '4mm' }}>
              <div>
                <div className="wp-mono" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.1em', color: '#38bdf8', marginBottom: '1.5mm' }}>Bengaluru HQ Office</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  2nd Floor, Halkatti Icon, 14, Sankey Rd,<br/>
                  Sadashiva Nagar, Guttahalli, Bengaluru,<br/>
                  Karnataka 560003
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8mm', fontSize: '12px', color: '#cbd5e1' }}>
                <div><span style={{ color: '#38bdf8' }}>Phone:</span> +91 98452 63775</div>
                <div><span style={{ color: '#38bdf8' }}>Email:</span> info@infopaceindia.com</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12mm 16mm 12mm', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#64748b' }}>
            <div>©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            <div>infopaceindia.com</div>
          </div>
        </div>

      </div>
    </div>
  );
}
