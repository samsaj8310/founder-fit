import React from 'react';
import RadarChart from './dashboard/RadarChart';
import LineChart from './dashboard/LineChart';
import { LOGO_BASE64 } from '../utils/logo';
import { PHOTO_BASE64 } from '../utils/photo';

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

  React.useEffect(() => {
    // Delay of 1000ms to allow chart animations to complete and render on canvas
    const timer = setTimeout(() => {
      window.print();
      onClose();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

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
      insightLow: 'High strategic divergence. You have fundamentally different visions for the companyâ€™s future (e.g., lifestyle business vs. hyper-growth venture). This requires immediate alignment.'
    },
    'Roles': {
      insightHigh: 'Role boundaries are clearly defined with zero overlap. Both founders respect each otherâ€™s operational ownership and domain authority.',
      insightMed: 'Some overlap exists in leadership duties. Clarity is needed around who holds final authority on product vs. business decisions to avoid stepping on each otherâ€™s toes.',
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

        .detailed-report-overlay {
          position: absolute !important;
          left: -9999px !important;
          top: 0 !important;
          width: 210mm !important;
          height: auto !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
          background: #fff !important;
          display: block !important;
          overflow: visible !important;
        }

        .detailed-report-overlay * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .detailed-report-overlay, .wp-page, .page, body {
          font-family: 'Times New Roman', Times, serif !important;
          color: var(--ink);
        }

        .mono, .wp-mono, .pg-num, .stat-box .n, .sc {
          font-family: 'Times New Roman', Times, serif !important;
        }

        .serif, .wp-serif, h3.sec, .persona-name, .pg-title {
          font-family: 'Times New Roman', Times, serif !important;
        }

        .wp-page, .page {
          width: 210mm;
          height: 297mm;
          margin: 20px auto;
          background: #fff;
          box-shadow: 0 8px 40px rgba(15,30,60,0.12);
          position: relative;
          display: flex;
          flex-direction: column;
          page-break-after: always;
          overflow: hidden;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          padding: 15mm 16mm 12mm;
        }

        .wp-page {
          padding: 0;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          .app-bg-glow, .global-menu-btn, .top-purple-bar, .dashboard-screen {
            display: none !important;
          }
          
          #root, .dashboard-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          .detailed-report-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 99999 !important;
          }
          
          .detailed-report-header {
            display: none !important;
          }
          
          .detailed-report-body {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            overflow: visible !important;
          }
          
          .wp-page, .page {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            background-color: #ffffff;
            box-sizing: border-box !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .page {
            padding: 15mm 16mm 12mm !important;
          }

          .wp-page {
            padding: 0 !important;
          }
        }

        .pg-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 9px;
          margin-bottom: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
        }

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
        }

        .dim-block { display: flex; gap: 14px; padding: 22px 0; border-bottom: 1px solid var(--border); }
        .dim-block:last-child { border-bottom: none; }
        .dim-score-col { width: 66px; flex-shrink: 0; text-align: center; }
        .dim-score-col .n { font-size: 25.52px; font-weight: 700; }
        .dim-score-col .band { font-size: 8.7px; text-transform: uppercase; letter-spacing: .04em; color: var(--inkL); margin-top: 1px; }
        .dim-body { flex: 1; }
        .dim-name { font-size: 14.5px; font-weight: 700; color: var(--b900); margin-bottom: 4px; }
        .dim-desc { font-size: 12px; color: var(--inkL); line-height: 1.72; }
        .dim-tell { font-size: 11.5px; color: #475569; line-height: 1.72; margin-top: 5px; padding-left: 12px; border-left: 2px solid var(--b100); }

        .glance-table { width: 100%; border-collapse: collapse; margin: 16px 0 8px; }
        .glance-table td { padding: 10px 8px; font-size: 12px; border-bottom: 1px solid var(--border); }
        .glance-table .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 7px; }
        .glance-table .nm { font-weight: 600; color: var(--b900); }
        .glance-table .sc { font-weight: 700; text-align: right; }

        .action-item { display: flex; gap: 14px; padding: 24px 0; border-bottom: 1px solid var(--border); }
        .action-item:last-child { border-bottom: none; }
        .action-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #fff;
          font-size: 12.5px;
          font-weight: 700;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .action-dim { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
        .action-text { font-size: 13px; color: #334155; line-height: 1.75; }
        .action-why { font-size: 11.8px; color: var(--inkL); line-height: 1.68; margin-top: 5px; font-style: italic; }

        .seq-table { width: 100%; border-collapse: collapse; margin: 18px 0; }
        .seq-table th { text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--inkL); padding: 10px 10px; border-bottom: 1.5px solid var(--b900); }
        .seq-table td { padding: 14px 10px; font-size: 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
      ` }} />

      {/* Document Viewer Header Bar */}
      <header className="detailed-report-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>âš¡ FounderSync</span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Detailed Partnership Report</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="report-print-btn" onClick={handlePrint}>
            Print / Save as PDF ðŸ–¨ï¸
          </button>
          <button className="report-close-btn" onClick={onClose}>
            Close Ã—
          </button>
        </div>
      </header>

      {/* Pages Container */}
      <div className="detailed-report-body">

        {/* ================= PAGE 1: COVER PAGE ================= */}
        <div className="wp-page" style={{ border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14mm 16mm 0' }}>
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
          </div>

          <div style={{ padding: '14mm 16mm 0', position: 'relative', zIndex: 2 }}>
            <div className="wp-mono" style={{ fontSize: '11.5px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#1a56db', fontWeight: 600, marginBottom: '6mm' }}>ASSESSMENT REPORT · DETAILED SYNERGY SUMMARY</div>
            <div style={{ fontWeight: 800, fontSize: '50px', lineHeight: 1.08, color: '#061228', letterSpacing: '-.01em' }}>Co-Founder</div>
            <div style={{ fontWeight: 800, fontSize: '50px', lineHeight: 1.08, color: '#1a56db', letterSpacing: '-.01em' }}>Compatibility Fit</div>
            <div style={{ fontSize: '13.8px', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#334155', marginTop: '8mm' }}>Prepared For: {nameA} & {nameB}</div>
          </div>

          <div style={{ position: 'relative', flex: 1, height: '150mm', marginTop: '-4mm' }}>
            <svg width="760" height="480" viewBox="0 0 760 480" style={{ position: 'absolute', left: '-30px', bottom: 0 }}>
              <path d="M 0.0 23.8 Q 17.3 25.4 25.9 26.2 Q 51.8 28.9 60.5 29.8 Q 86.4 32.5 95.0 33.3 Q 120.9 35.8 129.5 36.6 Q 155.5 38.8 164.1 39.5 Q 190.0 41.4 198.6 42.0 Q 224.5 43.6 233.2 44.0 Q 259.1 45.2 267.7 45.5 Q 293.6 46.1 302.3 46.0 Q 328.2 45.6 336.8 45.2 Q 362.7 43.7 371.4 42.9 Q 397.3 40.0 405.9 38.8 Q 431.8 34.9 440.5 33.4 Q 466.4 28.7 475.0 27.0 Q 500.9 21.9 509.5 20.1 Q 535.5 14.8 544.1 13.1 Q 570.0 7.9 578.6 6.2 Q 604.5 1.2 613.2 -0.3 Q 639.1 -4.8 647.7 -6.1 Q 673.6 -9.9 682.3 -10.9 Q 708.2 -13.7 716.8 -14.3 Q 742.7 -15.6 751.4 -15.7" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.75" strokeLinecap="round"/>
              <path d="M 0.0 30.0 Q 17.3 31.7 25.9 32.5 Q 51.8 35.2 60.5 36.1 Q 86.4 38.7 95.0 39.6 Q 120.9 42.0 129.5 42.8 Q 155.5 45.0 164.1 45.7 Q 190.0 47.7 198.6 48.3 Q 224.5 49.9 233.2 50.4 Q 259.1 51.4 267.7 51.6 Q 293.6 51.7 302.3 51.5 Q 328.2 50.5 336.8 49.9 Q 362.7 47.6 371.4 46.5 Q 397.3 42.9 405.9 41.5 Q 431.8 37.0 440.5 35.3 Q 466.4 30.2 475.0 28.4 Q 500.9 23.0 509.5 21.1 Q 535.5 15.7 544.1 13.9 Q 570.0 8.6 578.6 6.9 Q 604.5 1.9 613.2 0.4 Q 639.1 -4.0 647.7 -5.3 Q 673.6 -8.7 682.3 -9.5 Q 708.2 -11.6 716.8 -12.0 Q 742.7 -12.5 751.4 -12.3" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.70" strokeLinecap="round"/>
              <path d="M 0.0 41.2 Q 17.3 44.2 25.9 45.7 Q 51.8 50.3 60.5 51.8 Q 86.4 56.4 95.0 57.8 Q 120.9 62.2 129.5 63.5 Q 155.5 67.5 164.1 68.7 Q 190.0 72.1 198.6 73.0 Q 224.5 75.5 233.2 76.1 Q 259.1 77.3 267.7 77.3 Q 293.6 76.7 302.3 76.1 Q 328.2 73.6 336.8 72.3 Q 362.7 67.7 371.4 65.8 Q 397.3 59.5 405.9 57.0 Q 431.8 49.3 440.5 46.4 Q 466.4 37.6 475.0 34.5 Q 500.9 25.0 509.5 21.7 Q 535.5 11.8 544.1 8.4 Q 570.0 -1.6 578.6 -4.9 Q 604.5 -14.5 613.2 -17.6 Q 639.1 -26.4 647.7 -29.0 Q 673.6 -36.4 682.3 -38.4 Q 708.2 -43.7 716.8 -45.0 Q 742.7 -47.9 751.4 -48.3" fill="none" stroke="#1a56db" strokeWidth="1.30" strokeOpacity="0.65" strokeLinecap="round"/>
              <path d="M 0.0 47.3 Q 17.3 49.5 25.9 50.6 Q 51.8 53.8 60.5 54.8 Q 86.4 58.0 95.0 59.0 Q 120.9 61.9 129.5 62.8 Q 155.5 65.3 164.1 66.0 Q 190.0 67.9 198.6 68.3 Q 224.5 69.2 233.2 69.2 Q 259.1 68.7 267.7 68.1 Q 293.6 66.0 302.3 64.9 Q 328.2 61.1 336.8 59.5 Q 362.7 54.3 371.4 52.3 Q 397.3 46.0 405.9 43.8 Q 431.8 36.9 440.5 34.5 Q 466.4 27.4 475.0 25.1 Q 500.9 18.1 509.5 15.8 Q 535.5 9.2 544.1 7.2 Q 570.0 1.3 578.6 -0.5 Q 604.5 -5.2 613.2 -6.4 Q 639.1 -9.6 647.7 -10.2 Q 673.6 -11.3 682.3 -11.2 Q 708.2 -10.1 716.8 -9.2 Q 742.7 -5.7 751.4 -4.0" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.60" strokeLinecap="round"/>
              <path d="M 0.0 53.7 Q 17.3 55.2 25.9 56.0 Q 51.8 58.2 60.5 58.9 Q 86.4 61.0 95.0 61.6 Q 120.9 63.6 129.5 64.2 Q 155.5 65.9 164.1 66.4 Q 190.0 67.5 198.6 67.7 Q 224.5 67.9 233.2 67.7 Q 259.1 66.8 267.7 66.2 Q 293.6 64.0 302.3 63.0 Q 328.2 59.7 336.8 58.3 Q 362.7 54.1 371.4 52.6 Q 397.3 47.8 405.9 46.1 Q 431.8 41.0 440.5 39.3 Q 466.4 34.1 475.0 32.3 Q 500.9 27.1 509.5 25.4 Q 535.5 20.3 544.1 18.6 Q 570.0 13.9 578.6 12.5 Q 604.5 8.5 613.2 7.4 Q 639.1 4.5 647.7 3.8 Q 673.6 2.4 682.3 2.2 Q 708.2 2.4 716.8 2.9 Q 742.7 4.7 751.4 5.6" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.55" strokeLinecap="round"/>
              <path d="M 0.0 60.3 Q 17.3 62.3 25.9 63.3 Q 51.8 66.3 60.5 67.3 Q 86.4 70.3 95.0 71.2 Q 120.9 73.8 129.5 74.6 Q 155.5 76.6 164.1 77.1 Q 190.0 78.0 198.6 78.0 Q 224.5 77.6 233.2 77.0 Q 259.1 74.9 267.7 73.9 Q 293.6 70.2 302.3 68.7 Q 328.2 63.8 336.8 61.9 Q 362.7 56.0 371.4 53.9 Q 397.3 47.4 405.9 45.1 Q 431.8 38.4 440.5 36.1 Q 466.4 29.3 475.0 27.1 Q 500.9 20.5 509.5 18.4 Q 535.5 12.4 544.1 10.7 Q 570.0 5.7 578.6 4.4 Q 604.5 1.0 613.2 0.4 Q 639.1 -1.0 647.7 -1.0 Q 673.6 -0.1 682.3 0.7 Q 708.2 3.9 716.8 5.4 Q 742.7 10.8 751.4 13.0" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.50" strokeLinecap="round"/>
              <path d="M 0.0 67.3 Q 17.3 69.2 25.9 70.1 Q 51.8 72.8 60.5 73.7 Q 86.4 76.4 95.0 77.2 Q 120.9 79.4 129.5 80.0 Q 155.5 81.5 164.1 81.8 Q 190.0 82.1 198.6 81.9 Q 224.5 80.8 233.2 80.1 Q 259.1 77.6 267.7 76.5 Q 293.6 72.7 302.3 71.2 Q 328.2 66.5 336.8 64.7 Q 362.7 59.3 371.4 57.4 Q 397.3 51.5 405.9 49.4 Q 431.8 43.2 440.5 41.1 Q 466.4 34.7 475.0 32.6 Q 500.9 26.3 509.5 24.3 Q 535.5 18.5 544.1 16.8 Q 570.0 11.9 578.6 10.6 Q 604.5 7.3 613.2 6.5 Q 639.1 4.9 647.7 4.8 Q 673.6 5.2 682.3 5.8 Q 708.2 8.2 716.8 9.5 Q 742.7 13.8 751.4 15.6" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.48" strokeLinecap="round"/>
              <path d="M 0.0 82.1 Q 17.3 84.6 25.9 85.9 Q 51.8 89.7 60.5 90.9 Q 86.4 94.4 95.0 95.4 Q 120.9 98.2 129.5 98.9 Q 155.5 100.6 164.1 100.8 Q 190.0 100.9 198.6 100.6 Q 224.5 99.0 233.2 98.1 Q 259.1 95.0 267.7 93.6 Q 293.6 89.0 302.3 87.2 Q 328.2 81.4 336.8 79.3 Q 362.7 72.5 371.4 70.1 Q 397.3 62.5 405.9 59.8 Q 431.8 51.5 440.5 48.6 Q 466.4 39.9 475.0 37.0 Q 500.9 28.3 509.5 25.5 Q 535.5 17.3 544.1 14.8 Q 570.0 7.8 578.6 5.9 Q 604.5 0.5 613.2 -0.8 Q 639.1 -4.0 647.7 -4.6 Q 673.6 -5.5 682.3 -5.2 Q 708.2 -3.7 716.8 -2.7 Q 742.7 1.3 751.4 3.1" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.46" strokeLinecap="round"/>
              <path d="M 0.0 99.0 Q 17.3 102.8 25.9 104.7 Q 51.8 110.1 60.5 111.8 Q 86.4 116.4 95.0 117.6 Q 120.9 120.8 129.5 121.4 Q 155.5 122.5 164.1 122.4 Q 190.0 121.1 198.6 120.1 Q 224.5 116.4 233.2 114.7 Q 259.1 108.6 267.7 106.2 Q 293.6 98.2 302.3 95.1 Q 328.2 85.4 336.8 81.9 Q 362.7 70.8 371.4 66.9 Q 397.3 54.8 405.9 50.7 Q 431.8 38.2 440.5 34.0 Q 466.4 21.7 475.0 17.7 Q 500.9 6.4 509.5 3.0 Q 535.5 -6.3 544.1 -8.9 Q 570.0 -15.5 578.6 -17.0 Q 604.5 -20.2 613.2 -20.5 Q 639.1 -20.0 647.7 -19.0 Q 673.6 -14.6 682.3 -12.3 Q 708.2 -4.2 716.8 -0.6 Q 742.7 11.1 751.4 15.8" fill="none" stroke="#93c5fd" strokeWidth="1.30" strokeOpacity="0.44" strokeLinecap="round"/>
              <path d="M 0.0 103.2 Q 17.3 105.7 25.9 106.9 Q 51.8 110.3 60.5 111.3 Q 86.4 113.8 95.0 114.4 Q 120.9 115.6 129.5 115.6 Q 155.5 115.2 164.1 114.6 Q 190.0 112.5 198.6 111.4 Q 224.5 107.6 233.2 106.0 Q 259.1 100.9 267.7 98.9 Q 293.6 92.7 302.3 90.4 Q 328.2 83.2 336.8 80.6 Q 362.7 72.7 371.4 69.9 Q 397.3 61.5 405.9 58.7 Q 431.8 50.2 440.5 47.5 Q 466.4 39.6 475.0 37.1 Q 500.9 30.4 509.5 28.5 Q 535.5 23.6 544.1 22.4 Q 570.0 19.9 578.6 19.6 Q 604.5 19.6 613.2 20.2 Q 639.1 22.9 647.7 24.3 Q 673.6 29.6 682.3 32.0 Q 708.2 39.7 716.8 42.8 Q 742.7 52.9 751.4 56.7" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.42" strokeLinecap="round"/>
              <path d="M 0.0 110.8 Q 17.3 112.6 25.9 113.5 Q 51.8 115.7 60.5 116.3 Q 86.4 117.6 95.0 117.7 Q 120.9 117.9 129.5 117.6 Q 155.5 116.5 164.1 115.8 Q 190.0 113.4 198.6 112.4 Q 224.5 109.1 233.2 107.7 Q 259.1 103.5 267.7 102.0 Q 293.6 97.0 302.3 95.2 Q 328.2 89.5 336.8 87.4 Q 362.7 81.1 371.4 78.9 Q 397.3 72.1 405.9 69.8 Q 431.8 62.9 440.5 60.7 Q 466.4 54.2 475.0 52.3 Q 500.9 46.8 509.5 45.2 Q 535.5 41.2 544.1 40.2 Q 570.0 37.8 578.6 37.4 Q 604.5 36.8 613.2 37.1 Q 639.1 38.4 647.7 39.2 Q 673.6 42.5 682.3 44.0 Q 708.2 49.1 716.8 51.2 Q 742.7 58.2 751.4 61.0" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.40" strokeLinecap="round"/>
              <path d="M 0.0 117.6 Q 17.3 119.5 25.9 120.3 Q 51.8 122.4 60.5 122.9 Q 86.4 123.8 95.0 123.8 Q 120.9 123.5 129.5 123.1 Q 155.5 121.4 164.1 120.5 Q 190.0 117.7 198.6 116.5 Q 224.5 112.5 233.2 111.0 Q 259.1 106.1 267.7 104.3 Q 293.6 98.5 302.3 96.3 Q 328.2 89.7 336.8 87.3 Q 362.7 79.9 371.4 77.4 Q 397.3 69.8 405.9 67.3 Q 431.8 59.9 440.5 57.5 Q 466.4 51.0 475.0 49.1 Q 500.9 43.9 509.5 42.6 Q 535.5 39.2 544.1 38.5 Q 570.0 37.1 578.6 37.1 Q 604.5 37.8 613.2 38.5 Q 639.1 41.3 647.7 42.7 Q 673.6 47.7 682.3 49.8 Q 708.2 56.9 716.8 59.8 Q 742.7 68.8 751.4 72.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.38" strokeLinecap="round"/>
              <path d="M 0.0 131.9 Q 17.3 133.3 25.9 133.7 Q 51.8 134.6 60.5 134.5 Q 86.4 133.6 95.0 133.0 Q 120.9 130.3 129.5 129.0 Q 155.5 124.7 164.1 123.0 Q 190.0 117.3 198.6 115.1 Q 224.5 108.2 233.2 105.7 Q 259.1 97.8 267.7 95.1 Q 293.6 86.5 302.3 83.5 Q 328.2 74.6 336.8 71.7 Q 362.7 63.0 371.4 60.2 Q 397.3 52.4 405.9 50.1 Q 431.8 44.0 440.5 42.4 Q 466.4 38.6 475.0 37.9 Q 500.9 36.9 509.5 37.2 Q 535.5 39.2 544.1 40.5 Q 570.0 45.5 578.6 47.8 Q 604.5 55.5 613.2 58.7 Q 639.1 69.0 647.7 72.9 Q 673.6 85.4 682.3 90.0 Q 708.2 104.1 716.8 109.1 Q 742.7 124.3 751.4 129.4" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.36" strokeLinecap="round"/>
              <path d="M 0.0 142.2 Q 17.3 143.6 25.9 144.1 Q 51.8 145.3 60.5 145.3 Q 86.4 145.1 95.0 144.7 Q 120.9 143.1 129.5 142.3 Q 155.5 139.4 164.1 138.1 Q 190.0 134.0 198.6 132.4 Q 224.5 127.0 233.2 124.9 Q 259.1 118.3 267.7 115.8 Q 293.6 108.0 302.3 105.2 Q 328.2 96.5 336.8 93.5 Q 362.7 84.4 371.4 81.4 Q 397.3 72.5 405.9 69.7 Q 431.8 61.7 440.5 59.4 Q 466.4 52.9 475.0 51.1 Q 500.9 46.4 509.5 45.3 Q 535.5 42.7 544.1 42.3 Q 570.0 42.0 578.6 42.4 Q 604.5 44.5 613.2 45.7 Q 639.1 50.3 647.7 52.4 Q 673.6 59.6 682.3 62.6 Q 708.2 72.3 716.8 76.0 Q 742.7 87.9 751.4 92.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.34" strokeLinecap="round"/>
              <path d="M 0.0 155.7 Q 17.3 156.6 25.9 156.8 Q 51.8 156.8 60.5 156.5 Q 86.4 154.9 95.0 154.1 Q 120.9 151.0 129.5 149.6 Q 155.5 145.1 164.1 143.2 Q 190.0 137.2 198.6 134.8 Q 224.5 127.3 233.2 124.5 Q 259.1 115.6 267.7 112.4 Q 293.6 102.4 302.3 99.0 Q 328.2 88.4 336.8 84.9 Q 362.7 74.5 371.4 71.2 Q 397.3 61.7 405.9 58.8 Q 431.8 50.8 440.5 48.6 Q 466.4 42.6 475.0 41.1 Q 500.9 37.5 509.5 36.9 Q 535.5 35.9 544.1 36.2 Q 570.0 38.0 578.6 39.3 Q 604.5 44.0 613.2 46.3 Q 639.1 54.1 647.7 57.3 Q 673.6 68.1 682.3 72.3 Q 708.2 85.8 716.8 90.8 Q 742.7 106.4 751.4 112.0" fill="none" stroke="#93c5fd" strokeWidth="1.30" strokeOpacity="0.32" strokeLinecap="round"/>
              <path d="M 0.0 156.4 Q 17.3 156.6 25.9 156.5 Q 51.8 155.6 60.5 155.0 Q 86.4 152.6 95.0 151.5 Q 120.9 147.6 129.5 146.0 Q 155.5 140.8 164.1 138.7 Q 190.0 132.0 198.6 129.5 Q 224.5 121.5 233.2 118.6 Q 259.1 109.6 267.7 106.4 Q 293.6 96.9 302.3 93.8 Q 328.2 84.5 336.8 81.5 Q 362.7 73.2 371.4 70.8 Q 397.3 64.2 405.9 62.5 Q 431.8 58.1 440.5 57.3 Q 466.4 55.5 475.0 55.5 Q 500.9 56.5 509.5 57.5 Q 535.5 61.3 544.1 63.2 Q 570.0 69.8 578.6 72.7 Q 604.5 82.1 613.2 85.8 Q 639.1 97.8 647.7 102.3 Q 673.6 116.4 682.3 121.5 Q 708.2 137.1 716.8 142.5 Q 742.7 158.7 751.4 164.1" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.30" strokeLinecap="round"/>
              <path d="M 0.0 155.0 Q 17.3 154.6 25.9 154.2 Q 51.8 152.5 60.5 151.7 Q 86.4 148.9 95.0 147.7 Q 120.9 143.7 129.5 142.1 Q 155.5 136.9 164.1 135.0 Q 190.0 128.7 198.6 126.4 Q 224.5 119.1 233.2 116.6 Q 259.1 108.7 267.7 106.1 Q 293.6 98.2 302.3 95.7 Q 328.2 88.5 336.8 86.4 Q 362.7 80.5 371.4 79.0 Q 397.3 74.9 405.9 74.0 Q 431.8 72.1 440.5 72.0 Q 466.4 72.3 475.0 72.9 Q 500.9 75.6 509.5 77.0 Q 535.5 81.9 544.1 84.1 Q 570.0 91.3 578.6 94.3 Q 604.5 103.7 613.2 107.3 Q 639.1 118.7 647.7 122.9 Q 673.6 135.7 682.3 140.2 Q 708.2 153.8 716.8 158.4 Q 742.7 171.9 751.4 176.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.28" strokeLinecap="round"/>
              <path d="M 0.0 163.5 Q 17.3 163.1 25.9 162.7 Q 51.8 161.2 60.5 160.4 Q 86.4 157.7 95.0 156.6 Q 120.9 152.7 129.5 151.1 Q 155.5 145.9 164.1 143.9 Q 190.0 137.6 198.6 135.2 Q 224.5 127.9 233.2 125.4 Q 259.1 117.7 267.7 115.1 Q 293.6 107.7 302.3 105.4 Q 328.2 98.8 336.8 96.9 Q 362.7 91.8 371.4 90.5 Q 397.3 87.3 405.9 86.7 Q 431.8 85.4 440.5 85.5 Q 466.4 86.4 475.0 87.3 Q 500.9 90.4 509.5 92.0 Q 535.5 97.4 544.1 99.8 Q 570.0 107.5 578.6 110.6 Q 604.5 120.4 613.2 124.2 Q 639.1 135.8 647.7 139.9 Q 673.6 152.7 682.3 157.1 Q 708.2 170.2 716.8 174.5 Q 742.7 187.3 751.4 191.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.26" strokeLinecap="round"/>
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
              <div className="brand">
                <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
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
              <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 3: ASSESSMENT SUITE ================= */}
        <div className="wp-page">
          <div style={{ padding: '16mm 16mm 12mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div className="pg-hdr">
              <div className="brand">
                <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
              </div>
              <div className="pg-num wp-mono">03 / 12</div>
            </div>
            
            <div className="wp-mono" style={{ fontSize: '11.5px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a56db', fontWeight: 600, marginBottom: '3mm' }}>Company Overview</div>
            <div className="wp-serif" style={{ fontSize: '36.8px', fontWeight: 700, color: '#061228', marginBottom: '6mm' }}>Our Assessment Suite</div>
            
            <p style={{ fontSize: '12.6px', color: '#334155', lineHeight: '1.87', marginBottom: '4mm', textAlign: 'left' }}>Over the reporting period, Infopace continued to strengthen its portfolio of AI-powered business assessment tools, delivering intelligent, data-driven solutions that assist entrepreneurs, startups, and organizations make informed strategic decisions.</p>
            <p style={{ fontSize: '12.6px', color: '#334155', lineHeight: '1.87', marginBottom: '8mm', textAlign: 'left' }}>Each assessment leverages AI to analyze user responses and generate comprehensive reports containing actionable insights, key findings, strengths, improvement areas, and tailored recommendations. The current suite includes the following five tools:</p>
            
            <div className="wp-mono" style={{ fontSize: '10.3px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '2mm' }}>The Assessment Suite</div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ borderLeft: '3px solid #a21caf', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Market Research Assessment</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Validates business ideas by analyzing market demand, customer needs, industry trends, and competition, enabling informed market-entry decisions.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ borderLeft: '3px solid #06b6d4', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Market Potential</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Evaluates the growth potential and commercial viability of a product or business by assessing market size, demand, scalability and risk opportunities.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ borderLeft: '3px solid #1a56db', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Creative Innovation Index</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Measures innovation capability by assessing creativity, problem-solving and adaptability, assisting individuals and organizations strengthen their innovation potential.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ borderLeft: '3px solid #f97316', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Business Risk Assessment</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Identifies strategic, operational, financial and market risks, enabling businesses to proactively mitigate challenges and improve resilience.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5mm', padding: '4.5mm 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ borderLeft: '3px solid #f43f5e', borderRadius: '2px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.4px', color: '#0f172a', marginBottom: '1.5mm' }}>Founder and Co-Founder Compatibility</div>
                <div style={{ fontSize: '11.8px', color: '#475569', lineHeight: 1.76 }}>Assesses alignment between founders in leadership, communication, values, and decision-making to build stronger partnerships and reduce future conflicts.</div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
              <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 4: EXECUTIVE SUMMARY ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">04 / 12</div>
          </div>

          <div className="pg-title">Executive Summary</div>
          <div className="pg-sub">An overview of your overall compatibility profile â€” your score, what it means, and where your alignment is strongest.</div>

          <div className="gauge-wrap">
            <svg width="190" height="110" viewBox="0 0 260 150">
              <path d="M 30 130 A 100 100 0 0 1 230 130" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round"/>
              <path d={getGaugePath(overall)} fill="none" stroke="#1a56db" strokeWidth="18" strokeLinecap="round"/>
              <text x="130" y="108" textAnchor="middle" className="gauge-num">{overall}</text>
              <text x="130" y="130" textAnchor="middle" className="gauge-label mono">FIT SCORE / 100</text>
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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 5: DIMENSION BREAKDOWN I ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">05 / 12</div>
          </div>

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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 6: DIMENSION BREAKDOWN II ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">06 / 12</div>
          </div>

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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 7: STRATEGIC ALIGNMENT RADAR ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">07 / 12</div>
          </div>

          <div className="pg-title">Strategic Alignment Charts</div>
          <div className="pg-sub">Live visual mapping of the profile overlap between the founders.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '10px 0 40px' }}>
            <div>
              <div className="lbl">Strategic Alignment Radar</div>
              <div style={{ height: '220px', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
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
              <div style={{ height: '220px', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 8: RISK MAP ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">08 / 12</div>
          </div>

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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 9: ACTION PLAN & RECOMMENDATIONS ================= */}
        <div className="page">
          <div className="pg-hdr">
            <div className="brand">
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            </div>
            <div className="pg-num mono">09 / 12</div>
          </div>

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
            <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
          </div>
        </div>

        {/* ================= PAGE 10: LEGAL/DISCLAIMER ================= */}
        <div className="wp-page" style={{ border: '1px solid var(--border)' }}>
          <div style={{ padding: '16mm 16mm 12mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            <div className="pg-hdr">
              <div className="brand">
                <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
              </div>
              <div className="pg-num wp-mono">10 / 12</div>
            </div>
            
            <div className="wp-serif" style={{ fontSize: '28.7px', fontWeight: 700, color: '#061228', marginBottom: '8mm', whiteSpace: 'nowrap' }}>Disclaimer, Privacy and Terms</div>

            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>⚠️</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17.2px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Disclaimer</div>
                <div style={{ fontSize: '11.7px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  <p style={{ marginBottom: '2mm' }}>The <b>assessment report</b> is intended for informational and decision-support purposes only. Results are based on the information provided by the user and analysis and should not be considered legal, financial, investment, or professional advice.</p>
                  <p style={{ marginBottom: '2mm' }}>Users are encouraged to validate critical decisions with relevant experts before taking action. Infopace makes no representation or warranty as to the completeness or accuracy of assessment interpretations, and scores should be read as directional indicators rather than absolute measurements.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>🔒</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17.2px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Privacy Policy</div>
                <div style={{ fontSize: '11.7px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  <p style={{ marginBottom: '2mm' }}>All information shared during the assessment is handled with confidentiality and used solely for generating personalized assessment reports and improving the quality of the assessment platform.</p>
                  <p style={{ marginBottom: '2mm' }}>User data is processed securely and is not shared with third parties without consent, except where required by applicable law. Individual open-ended responses are never used to train external models or shared outside Infopace's assessment infrastructure.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5mm', marginBottom: '7mm' }}>
              <div style={{ width: '11mm', height: '11mm', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18.4px', flexShrink: 0 }}>📄</div>
              <div>
                <div className="wp-serif" style={{ fontSize: '17.2px', fontWeight: 700, color: '#061228', marginBottom: '2mm' }}>Terms and Conditions</div>
                <div style={{ fontSize: '11.7px', color: '#334155', lineHeight: 1.78, textAlign: 'left' }}>
                  <p style={{ marginBottom: '2mm' }}>By using Infopace's assessment tools, users acknowledge that the assessment results are generated based on the information they provide and the evaluation methodology. The reports are intended to support decision-making and should not be considered a substitute for professional legal, financial, or business advice.</p>
                  <p style={{ marginBottom: '2mm' }}>Users are responsible for ensuring the accuracy of the information submitted and for any decisions or actions taken based on the report. Infopace does not guarantee specific business outcomes or success resulting from the recommendations provided.</p>
                  <p style={{ marginBottom: '2mm' }}>All assessment content, methodologies, reports, and related intellectual property remain the exclusive property of Infopace and may not be copied, reproduced, modified, or distributed without prior written consent. Infopace reserves the right to update, modify, or discontinue the assessment tools, methodologies, and these terms at any time without prior notice.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8', letterSpacing: '.02em' }}>
                <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 11: ABOUT INFOPACE ================= */}
        <div className="wp-page" style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
          <div style={{ padding: '16mm 16mm 4mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7mm' }}>
              <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
              <div className="wp-mono" style={{ fontSize: '10.3px', color: '#94a3b8' }}>11 / 12</div>
            </div>
            
            <div className="wp-serif" style={{ fontSize: '34px', fontWeight: 700, color: '#061228', lineHeight: '1.1', marginBottom: '5mm' }}>
              About <span style={{ color: '#1a56db' }}>Infopace</span>
            </div>

            <div style={{ fontSize: '11.2px', color: '#334155', lineHeight: '1.68', textAlign: 'left' }}>
              <p style={{ marginBottom: '2.5mm' }}>Infopace Management Pvt. Ltd is a Bengaluru-based strategic change management and business transformation company established in 1999, providing advisory and technology-driven solutions that help businesses improve operational efficiency, accelerate growth and adapt to changing market conditions.</p>
              <p style={{ marginBottom: '2.5mm' }}>Our approach combines deep sector expertise with data-driven methodology â€” every engagement begins with understanding the specific operational and market context a client is working within, rather than applying a generic playbook. This is the same philosophy behind the AI-powered assessment tools used to generate this report: structured, evidence-based, and built to reflect the individual, not a template.</p>
            </div>

            <div style={{ marginTop: '5mm' }}>
              <div className="wp-mono" style={{ fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '2mm' }}>What We Do</div>
              <div style={{ display: 'flex', gap: '8mm' }}>
                <div style={{ flex: 1 }}>
                  {[
                    "Growth Acceleration Partner",
                    "Global Capabilities Center",
                    "Strategic Change Management",
                    "Strategic Investment and Funding",
                    "Data Analytics Solutions",
                    "Digital Transformation"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm', padding: '1.6mm 0' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1a56db', flexShrink: 0, marginTop: '1.5mm' }}></div>
                      <div style={{ fontSize: '9.8px', color: '#334155', lineHeight: '1.4' }}>{item}</div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    "AI-Enabled Solutions",
                    "Enabling the Entrepreneurial Ecosystem",
                    "Go To Market Strategy and Research",
                    "Market Access and Readiness",
                    "Pivoting and Repurposing Businesses",
                    "Radical Innovation"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm', padding: '1.6mm 0' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1a56db', flexShrink: 0, marginTop: '1.5mm' }}></div>
                      <div style={{ fontSize: '9.8px', color: '#334155', lineHeight: '1.4' }}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '5mm' }}>
              <div className="wp-mono" style={{ fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '3mm' }}>Industries We Serve</div>
              <div>
                {[
                  "Automobile", "Education", "Health Care", "ITES", "Information Technology",
                  "Manufacturing", "Retail", "Telecom", "Energy", "NGO", "Food Processing",
                  "Agritech", "Aerospace", "Semiconductor", "ESDM"
                ].map((item, idx) => (
                  <span key={idx} style={{ display: 'inline-block', fontSize: '9.2px', color: '#1a56db', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '2mm 4mm', margin: '0 2mm 2mm 0' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4mm', marginTop: '5mm' }}>
              {[
                { count: "200+", label: "Specialists, avg. 7 years expertise" },
                { count: "850+", label: "Long-lasting client partnerships" },
                { count: "7000+", label: "Projects in digital transformation" }
              ].map((card, idx) => (
                <div key={idx} style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '10px', padding: '4mm 3mm', textAlign: 'left', background: '#f8faff' }}>
                  <div style={{ fontWeight: 800, fontSize: '25.3px', color: '#1a56db' }}>{card.count}</div>
                  <div style={{ fontSize: '9.2px', color: '#64748b', marginTop: '1.5mm', lineHeight: '1.54' }}>{card.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '89mm', position: 'relative', backgroundImage: `url(${PHOTO_BASE64})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>

        {/* ================= PAGE 12: THANK YOU ================= */}
        <div className="wp-page" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', zIndex: 2, padding: '12mm 16mm 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={LOGO_BASE64} alt="Infopace" style={{ height: '56px' }} />
            <div className="wp-mono" style={{ fontSize: '10.3px', color: '#94a3b8' }}>12 / 12</div>
          </div>
          <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '6mm 16mm 0' }}>
            <div className="wp-serif" style={{ fontWeight: 700, fontSize: '48.3px', lineHeight: '1.21', color: '#061228', marginBottom: '7mm' }}>Thank you<br/>for reading.</div>
            <p style={{ fontSize: '13.2px', color: '#475569', lineHeight: '1.87', maxWidth: '105mm', marginBottom: '9mm' }}>If you have any questions or would like to discuss these findings further, please don't hesitate to reach out to us.</p>
            <div style={{ width: '60mm', height: '1px', background: 'var(--border)', marginBottom: '7mm' }}></div>
            <div style={{ fontSize: '12.1px', color: '#334155', lineHeight: '2.09' }}>
              <div>2nd Floor, Halkatti Icon, 14, Sankey Rd, Sadashiva Nagar, Guttahalli, Bengaluru, Karnataka 560003</div>
              <div style={{ color: '#1a56db', fontWeight: 700, marginTop: '2mm' }}>+91 98452 63775</div>
              <div style={{ marginTop: '1mm' }}>info@infopaceindia.com &nbsp;Â·&nbsp; infopaceindia.com</div>
            </div>
          </div>
          <div style={{ position: 'relative', height: '120mm', marginTop: '-4mm' }}>
            <svg width="760" height="480" viewBox="0 0 760 480" style={{ position: 'absolute', left: '-30px', bottom: 0 }}>
              <path d="M 0.0 23.8 Q 17.3 25.4 25.9 26.2 Q 51.8 28.9 60.5 29.8 Q 86.4 32.5 95.0 33.3 Q 120.9 35.8 129.5 36.6 Q 155.5 38.8 164.1 39.5 Q 190.0 41.4 198.6 42.0 Q 224.5 43.6 233.2 44.0 Q 259.1 45.2 267.7 45.5 Q 293.6 46.1 302.3 46.0 Q 328.2 45.6 336.8 45.2 Q 362.7 43.7 371.4 42.9 Q 397.3 40.0 405.9 38.8 Q 431.8 34.9 440.5 33.4 Q 466.4 28.7 475.0 27.0 Q 500.9 21.9 509.5 20.1 Q 535.5 14.8 544.1 13.1 Q 570.0 7.9 578.6 6.2 Q 604.5 1.2 613.2 -0.3 Q 639.1 -4.8 647.7 -6.1 Q 673.6 -9.9 682.3 -10.9 Q 708.2 -13.7 716.8 -14.3 Q 742.7 -15.6 751.4 -15.7" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.75" strokeLinecap="round"/>
              <path d="M 0.0 30.0 Q 17.3 31.7 25.9 32.5 Q 51.8 35.2 60.5 36.1 Q 86.4 38.7 95.0 39.6 Q 120.9 42.0 129.5 42.8 Q 155.5 45.0 164.1 45.7 Q 190.0 47.7 198.6 48.3 Q 224.5 49.9 233.2 50.4 Q 259.1 51.4 267.7 51.6 Q 293.6 51.7 302.3 51.5 Q 328.2 50.5 336.8 49.9 Q 362.7 47.6 371.4 46.5 Q 397.3 42.9 405.9 41.5 Q 431.8 37.0 440.5 35.3 Q 466.4 30.2 475.0 28.4 Q 500.9 23.0 509.5 21.1 Q 535.5 15.7 544.1 13.9 Q 570.0 8.6 578.6 6.9 Q 604.5 1.9 613.2 0.4 Q 639.1 -4.0 647.7 -5.3 Q 673.6 -8.7 682.3 -9.5 Q 708.2 -11.6 716.8 -12.0 Q 742.7 -12.5 751.4 -12.3" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.70" strokeLinecap="round"/>
              <path d="M 0.0 41.2 Q 17.3 44.2 25.9 45.7 Q 51.8 50.3 60.5 51.8 Q 86.4 56.4 95.0 57.8 Q 120.9 62.2 129.5 63.5 Q 155.5 67.5 164.1 68.7 Q 190.0 72.1 198.6 73.0 Q 224.5 75.5 233.2 76.1 Q 259.1 77.3 267.7 77.3 Q 293.6 76.7 302.3 76.1 Q 328.2 73.6 336.8 72.3 Q 362.7 67.7 371.4 65.8 Q 397.3 59.5 405.9 57.0 Q 431.8 49.3 440.5 46.4 Q 466.4 37.6 475.0 34.5 Q 500.9 25.0 509.5 21.7 Q 535.5 11.8 544.1 8.4 Q 570.0 -1.6 578.6 -4.9 Q 604.5 -14.5 613.2 -17.6 Q 639.1 -26.4 647.7 -29.0 Q 673.6 -36.4 682.3 -38.4 Q 708.2 -43.7 716.8 -45.0 Q 742.7 -47.9 751.4 -48.3" fill="none" stroke="#1a56db" strokeWidth="1.30" strokeOpacity="0.65" strokeLinecap="round"/>
              <path d="M 0.0 47.3 Q 17.3 49.5 25.9 50.6 Q 51.8 53.8 60.5 54.8 Q 86.4 58.0 95.0 59.0 Q 120.9 61.9 129.5 62.8 Q 155.5 65.3 164.1 66.0 Q 190.0 67.9 198.6 68.3 Q 224.5 69.2 233.2 69.2 Q 259.1 68.7 267.7 68.1 Q 293.6 66.0 302.3 64.9 Q 328.2 61.1 336.8 59.5 Q 362.7 54.3 371.4 52.3 Q 397.3 46.0 405.9 43.8 Q 431.8 36.9 440.5 34.5 Q 466.4 27.4 475.0 25.1 Q 500.9 18.1 509.5 15.8 Q 535.5 9.2 544.1 7.2 Q 570.0 1.3 578.6 -0.5 Q 604.5 -5.2 613.2 -6.4 Q 639.1 -9.6 647.7 -10.2 Q 673.6 -11.3 682.3 -11.2 Q 708.2 -10.1 716.8 -9.2 Q 742.7 -5.7 751.4 -4.0" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.60" strokeLinecap="round"/>
              <path d="M 0.0 53.7 Q 17.3 55.2 25.9 56.0 Q 51.8 58.2 60.5 58.9 Q 86.4 61.0 95.0 61.6 Q 120.9 63.6 129.5 64.2 Q 155.5 65.9 164.1 66.4 Q 190.0 67.5 198.6 67.7 Q 224.5 67.9 233.2 67.7 Q 259.1 66.8 267.7 66.2 Q 293.6 64.0 302.3 63.0 Q 328.2 59.7 336.8 58.3 Q 362.7 54.1 371.4 52.6 Q 397.3 47.8 405.9 46.1 Q 431.8 41.0 440.5 39.3 Q 466.4 34.1 475.0 32.3 Q 500.9 27.1 509.5 25.4 Q 535.5 20.3 544.1 18.6 Q 570.0 13.9 578.6 12.5 Q 604.5 8.5 613.2 7.4 Q 639.1 4.5 647.7 3.8 Q 673.6 2.4 682.3 2.2 Q 708.2 2.4 716.8 2.9 Q 742.7 4.7 751.4 5.6" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.55" strokeLinecap="round"/>
              <path d="M 0.0 60.3 Q 17.3 62.3 25.9 63.3 Q 51.8 66.3 60.5 67.3 Q 86.4 70.3 95.0 71.2 Q 120.9 73.8 129.5 74.6 Q 155.5 76.6 164.1 77.1 Q 190.0 78.0 198.6 78.0 Q 224.5 77.6 233.2 77.0 Q 259.1 74.9 267.7 73.9 Q 293.6 70.2 302.3 68.7 Q 328.2 63.8 336.8 61.9 Q 362.7 56.0 371.4 53.9 Q 397.3 47.4 405.9 45.1 Q 431.8 38.4 440.5 36.1 Q 466.4 29.3 475.0 27.1 Q 500.9 20.5 509.5 18.4 Q 535.5 12.4 544.1 10.7 Q 570.0 5.7 578.6 4.4 Q 604.5 1.0 613.2 0.4 Q 639.1 -1.0 647.7 -1.0 Q 673.6 -0.1 682.3 0.7 Q 708.2 3.9 716.8 5.4 Q 742.7 10.8 751.4 13.0" fill="none" stroke="#1a56db" strokeWidth="1.05" strokeOpacity="0.50" strokeLinecap="round"/>
              <path d="M 0.0 67.3 Q 17.3 69.2 25.9 70.1 Q 51.8 72.8 60.5 73.7 Q 86.4 76.4 95.0 77.2 Q 120.9 79.4 129.5 80.0 Q 155.5 81.5 164.1 81.8 Q 190.0 82.1 198.6 81.9 Q 224.5 80.8 233.2 80.1 Q 259.1 77.6 267.7 76.5 Q 293.6 72.7 302.3 71.2 Q 328.2 66.5 336.8 64.7 Q 362.7 59.3 371.4 57.4 Q 397.3 51.5 405.9 49.4 Q 431.8 43.2 440.5 41.1 Q 466.4 34.7 475.0 32.6 Q 500.9 26.3 509.5 24.3 Q 535.5 18.5 544.1 16.8 Q 570.0 11.9 578.6 10.6 Q 604.5 7.3 613.2 6.5 Q 639.1 4.9 647.7 4.8 Q 673.6 5.2 682.3 5.8 Q 708.2 8.2 716.8 9.5 Q 742.7 13.8 751.4 15.6" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.48" strokeLinecap="round"/>
              <path d="M 0.0 82.1 Q 17.3 84.6 25.9 85.9 Q 51.8 89.7 60.5 90.9 Q 86.4 94.4 95.0 95.4 Q 120.9 98.2 129.5 98.9 Q 155.5 100.6 164.1 100.8 Q 190.0 100.9 198.6 100.6 Q 224.5 99.0 233.2 98.1 Q 259.1 95.0 267.7 93.6 Q 293.6 89.0 302.3 87.2 Q 328.2 81.4 336.8 79.3 Q 362.7 72.5 371.4 70.1 Q 397.3 62.5 405.9 59.8 Q 431.8 51.5 440.5 48.6 Q 466.4 39.9 475.0 37.0 Q 500.9 28.3 509.5 25.5 Q 535.5 17.3 544.1 14.8 Q 570.0 7.8 578.6 5.9 Q 604.5 0.5 613.2 -0.8 Q 639.1 -4.0 647.7 -4.6 Q 673.6 -5.5 682.3 -5.2 Q 708.2 -3.7 716.8 -2.7 Q 742.7 1.3 751.4 3.1" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.46" strokeLinecap="round"/>
              <path d="M 0.0 99.0 Q 17.3 102.8 25.9 104.7 Q 51.8 110.1 60.5 111.8 Q 86.4 116.4 95.0 117.6 Q 120.9 120.8 129.5 121.4 Q 155.5 122.5 164.1 122.4 Q 190.0 121.1 198.6 120.1 Q 224.5 116.4 233.2 114.7 Q 259.1 108.6 267.7 106.2 Q 293.6 98.2 302.3 95.1 Q 328.2 85.4 336.8 81.9 Q 362.7 70.8 371.4 66.9 Q 397.3 54.8 405.9 50.7 Q 431.8 38.2 440.5 34.0 Q 466.4 21.7 475.0 17.7 Q 500.9 6.4 509.5 3.0 Q 535.5 -6.3 544.1 -8.9 Q 570.0 -15.5 578.6 -17.0 Q 604.5 -20.2 613.2 -20.5 Q 639.1 -20.0 647.7 -19.0 Q 673.6 -14.6 682.3 -12.3 Q 708.2 -4.2 716.8 -0.6 Q 742.7 11.1 751.4 15.8" fill="none" stroke="#93c5fd" strokeWidth="1.30" strokeOpacity="0.44" strokeLinecap="round"/>
              <path d="M 0.0 103.2 Q 17.3 105.7 25.9 106.9 Q 51.8 110.3 60.5 111.3 Q 86.4 113.8 95.0 114.4 Q 120.9 115.6 129.5 115.6 Q 155.5 115.2 164.1 114.6 Q 190.0 112.5 198.6 111.4 Q 224.5 107.6 233.2 106.0 Q 259.1 100.9 267.7 98.9 Q 293.6 92.7 302.3 90.4 Q 328.2 83.2 336.8 80.6 Q 362.7 72.7 371.4 69.9 Q 397.3 61.5 405.9 58.7 Q 431.8 50.2 440.5 47.5 Q 466.4 39.6 475.0 37.1 Q 500.9 30.4 509.5 28.5 Q 535.5 23.6 544.1 22.4 Q 570.0 19.9 578.6 19.6 Q 604.5 19.6 613.2 20.2 Q 639.1 22.9 647.7 24.3 Q 673.6 29.6 682.3 32.0 Q 708.2 39.7 716.8 42.8 Q 742.7 52.9 751.4 56.7" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.42" strokeLinecap="round"/>
              <path d="M 0.0 110.8 Q 17.3 112.6 25.9 113.5 Q 51.8 115.7 60.5 116.3 Q 86.4 117.6 95.0 117.7 Q 120.9 117.9 129.5 117.6 Q 155.5 116.5 164.1 115.8 Q 190.0 113.4 198.6 112.4 Q 224.5 109.1 233.2 107.7 Q 259.1 103.5 267.7 102.0 Q 293.6 97.0 302.3 95.2 Q 328.2 89.5 336.8 87.4 Q 362.7 81.1 371.4 78.9 Q 397.3 72.1 405.9 69.8 Q 431.8 62.9 440.5 60.7 Q 466.4 54.2 475.0 52.3 Q 500.9 46.8 509.5 45.2 Q 535.5 41.2 544.1 40.2 Q 570.0 37.8 578.6 37.4 Q 604.5 36.8 613.2 37.1 Q 639.1 38.4 647.7 39.2 Q 673.6 42.5 682.3 44.0 Q 708.2 49.1 716.8 51.2 Q 742.7 58.2 751.4 61.0" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.40" strokeLinecap="round"/>
              <path d="M 0.0 117.6 Q 17.3 119.5 25.9 120.3 Q 51.8 122.4 60.5 122.9 Q 86.4 123.8 95.0 123.8 Q 120.9 123.5 129.5 123.1 Q 155.5 121.4 164.1 120.5 Q 190.0 117.7 198.6 116.5 Q 224.5 112.5 233.2 111.0 Q 259.1 106.1 267.7 104.3 Q 293.6 98.5 302.3 96.3 Q 328.2 89.7 336.8 87.3 Q 362.7 79.9 371.4 77.4 Q 397.3 69.8 405.9 67.3 Q 431.8 59.9 440.5 57.5 Q 466.4 51.0 475.0 49.1 Q 500.9 43.9 509.5 42.6 Q 535.5 39.2 544.1 38.5 Q 570.0 37.1 578.6 37.1 Q 604.5 37.8 613.2 38.5 Q 639.1 41.3 647.7 42.7 Q 673.6 47.7 682.3 49.8 Q 708.2 56.9 716.8 59.8 Q 742.7 68.8 751.4 72.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.38" strokeLinecap="round"/>
              <path d="M 0.0 131.9 Q 17.3 133.3 25.9 133.7 Q 51.8 134.6 60.5 134.5 Q 86.4 133.6 95.0 133.0 Q 120.9 130.3 129.5 129.0 Q 155.5 124.7 164.1 123.0 Q 190.0 117.3 198.6 115.1 Q 224.5 108.2 233.2 105.7 Q 259.1 97.8 267.7 95.1 Q 293.6 86.5 302.3 83.5 Q 328.2 74.6 336.8 71.7 Q 362.7 63.0 371.4 60.2 Q 397.3 52.4 405.9 50.1 Q 431.8 44.0 440.5 42.4 Q 466.4 38.6 475.0 37.9 Q 500.9 36.9 509.5 37.2 Q 535.5 39.2 544.1 40.5 Q 570.0 45.5 578.6 47.8 Q 604.5 55.5 613.2 58.7 Q 639.1 69.0 647.7 72.9 Q 673.6 85.4 682.3 90.0 Q 708.2 104.1 716.8 109.1 Q 742.7 124.3 751.4 129.4" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.36" strokeLinecap="round"/>
              <path d="M 0.0 142.2 Q 17.3 143.6 25.9 144.1 Q 51.8 145.3 60.5 145.3 Q 86.4 145.1 95.0 144.7 Q 120.9 143.1 129.5 142.3 Q 155.5 139.4 164.1 138.1 Q 190.0 134.0 198.6 132.4 Q 224.5 127.0 233.2 124.9 Q 259.1 118.3 267.7 115.8 Q 293.6 108.0 302.3 105.2 Q 328.2 96.5 336.8 93.5 Q 362.7 84.4 371.4 81.4 Q 397.3 72.5 405.9 69.7 Q 431.8 61.7 440.5 59.4 Q 466.4 52.9 475.0 51.1 Q 500.9 46.4 509.5 45.3 Q 535.5 42.7 544.1 42.3 Q 570.0 42.0 578.6 42.4 Q 604.5 44.5 613.2 45.7 Q 639.1 50.3 647.7 52.4 Q 673.6 59.6 682.3 62.6 Q 708.2 72.3 716.8 76.0 Q 742.7 87.9 751.4 92.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.34" strokeLinecap="round"/>
              <path d="M 0.0 155.7 Q 17.3 156.6 25.9 156.8 Q 51.8 156.8 60.5 156.5 Q 86.4 154.9 95.0 154.1 Q 120.9 151.0 129.5 149.6 Q 155.5 145.1 164.1 143.2 Q 190.0 137.2 198.6 134.8 Q 224.5 127.3 233.2 124.5 Q 259.1 115.6 267.7 112.4 Q 293.6 102.4 302.3 99.0 Q 328.2 88.4 336.8 84.9 Q 362.7 74.5 371.4 71.2 Q 397.3 61.7 405.9 58.8 Q 431.8 50.8 440.5 48.6 Q 466.4 42.6 475.0 41.1 Q 500.9 37.5 509.5 36.9 Q 535.5 35.9 544.1 36.2 Q 570.0 38.0 578.6 39.3 Q 604.5 44.0 613.2 46.3 Q 639.1 54.1 647.7 57.3 Q 673.6 68.1 682.3 72.3 Q 708.2 85.8 716.8 90.8 Q 742.7 106.4 751.4 112.0" fill="none" stroke="#93c5fd" strokeWidth="1.30" strokeOpacity="0.32" strokeLinecap="round"/>
              <path d="M 0.0 156.4 Q 17.3 156.6 25.9 156.5 Q 51.8 155.6 60.5 155.0 Q 86.4 152.6 95.0 151.5 Q 120.9 147.6 129.5 146.0 Q 155.5 140.8 164.1 138.7 Q 190.0 132.0 198.6 129.5 Q 224.5 121.5 233.2 118.6 Q 259.1 109.6 267.7 106.4 Q 293.6 96.9 302.3 93.8 Q 328.2 84.5 336.8 81.5 Q 362.7 73.2 371.4 70.8 Q 397.3 64.2 405.9 62.5 Q 431.8 58.1 440.5 57.3 Q 466.4 55.5 475.0 55.5 Q 500.9 56.5 509.5 57.5 Q 535.5 61.3 544.1 63.2 Q 570.0 69.8 578.6 72.7 Q 604.5 82.1 613.2 85.8 Q 639.1 97.8 647.7 102.3 Q 673.6 116.4 682.3 121.5 Q 708.2 137.1 716.8 142.5 Q 742.7 158.7 751.4 164.1" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.30" strokeLinecap="round"/>
              <path d="M 0.0 155.0 Q 17.3 154.6 25.9 154.2 Q 51.8 152.5 60.5 151.7 Q 86.4 148.9 95.0 147.7 Q 120.9 143.7 129.5 142.1 Q 155.5 136.9 164.1 135.0 Q 190.0 128.7 198.6 126.4 Q 224.5 119.1 233.2 116.6 Q 259.1 108.7 267.7 106.1 Q 293.6 98.2 302.3 95.7 Q 328.2 88.5 336.8 86.4 Q 362.7 80.5 371.4 79.0 Q 397.3 74.9 405.9 74.0 Q 431.8 72.1 440.5 72.0 Q 466.4 72.3 475.0 72.9 Q 500.9 75.6 509.5 77.0 Q 535.5 81.9 544.1 84.1 Q 570.0 91.3 578.6 94.3 Q 604.5 103.7 613.2 107.3 Q 639.1 118.7 647.7 122.9 Q 673.6 135.7 682.3 140.2 Q 708.2 153.8 716.8 158.4 Q 742.7 171.9 751.4 176.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.28" strokeLinecap="round"/>
              <path d="M 0.0 163.5 Q 17.3 163.1 25.9 162.7 Q 51.8 161.2 60.5 160.4 Q 86.4 157.7 95.0 156.6 Q 120.9 152.7 129.5 151.1 Q 155.5 145.9 164.1 143.9 Q 190.0 137.6 198.6 135.2 Q 224.5 127.9 233.2 125.4 Q 259.1 117.7 267.7 115.1 Q 293.6 107.7 302.3 105.4 Q 328.2 98.8 336.8 96.9 Q 362.7 91.8 371.4 90.5 Q 397.3 87.3 405.9 86.7 Q 431.8 85.4 440.5 85.5 Q 466.4 86.4 475.0 87.3 Q 500.9 90.4 509.5 92.0 Q 535.5 97.4 544.1 99.8 Q 570.0 107.5 578.6 110.6 Q 604.5 120.4 613.2 124.2 Q 639.1 135.8 647.7 139.9 Q 673.6 152.7 682.3 157.1 Q 708.2 170.2 716.8 174.5 Q 742.7 187.3 751.4 191.3" fill="none" stroke="#93c5fd" strokeWidth="0.80" strokeOpacity="0.26" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 2, padding: '0 16mm 14mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8', letterSpacing: '.02em' }}>
              <div>Â©2026 Infopace Management Pvt. Ltd. All Rights Reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

