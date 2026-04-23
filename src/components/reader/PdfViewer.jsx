import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Layers, HelpCircle, MessageCircle, ChevronUp, ChevronDown, ZoomIn, ZoomOut, Maximize2, Minimize2, Download, ArrowLeft } from 'lucide-react';
import './pdfviewer.css';

/**
 * PDF Viewer — THE main component of PhySci Hub.
 *
 * This is what students came here for: reading their PDFs.
 * In production, integrate react-pdf / pdf.js here.
 *
 * Features:
 * - Simulated multi-page PDF content
 * - Page navigation (up/down arrows, page input)
 * - Zoom controls
 * - Maximize toggle
 * - Bottom toolbar with AI tools (hides on scroll up, shows on scroll down)
 *   → Summary | Flashcards | Quiz | Ask Buhari
 * - On mobile, these tools open as bottom sheets (handled by parent)
 */
export default function PdfViewer({
  material,
  isMaximized,
  onOpenSummary,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenChat,
  activeSheet,
  onScrollVisibilityChange,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(material?.lastReadPage || 1);
  const [zoom, setZoom] = useState(100);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const totalPages = material?.pageCount || 1;
  const contentRef = useRef(null);
  const lastScrollY = useRef(0);

  // Auto-hide toolbar on scroll + notify parent for bottom bar
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const y = contentRef.current.scrollTop;
    const isScrollingDown = y > lastScrollY.current && y > 40;
    setToolbarVisible(!isScrollingDown);
    onScrollVisibilityChange?.(!isScrollingDown);
    lastScrollY.current = y;
  }, [onScrollVisibilityChange]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
  };

  const zoomIn = () => setZoom(z => Math.min(200, z + 25));
  const zoomOut = () => setZoom(z => Math.max(50, z - 25));

  // Simulate PDF pages with actual content
  const renderMockPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div
          key={i}
          className="pdf-page"
          id={`pdf-page-${i}`}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <div className="pdf-page-inner">
            {/* Page header */}
            <div className="pdf-page-header">
              <span className="pdf-page-course">{material.courseCode}</span>
              <span className="pdf-page-num">Page {i}</span>
            </div>

            {/* Page content — simulated text blocks */}
            {i === 1 ? (
              <>
                <h1 className="pdf-content-title">{material.title}</h1>
                <p className="pdf-content-author">Uploaded by {material.uploadedByName}</p>
                <div className="pdf-content-divider" />
                <p className="pdf-content-text">
                  This document provides comprehensive coverage of the key concepts, theories, and problem-solving techniques essential for mastering this subject. Students are advised to read through each section carefully and attempt the practice questions at the end of each chapter.
                </p>
                <p className="pdf-content-text">
                  The material has been organized in a logical sequence, building from fundamental principles to more advanced applications. Cross-references to related topics are provided to help establish connections between different areas of study.
                </p>
                <h2 className="pdf-content-h2">1. Introduction</h2>
                <p className="pdf-content-text">
                  The study of physical sciences requires a strong foundation in both theoretical concepts and practical applications. This section introduces the core framework that will be developed throughout the remainder of the document.
                </p>
              </>
            ) : (
              <>
                <h2 className="pdf-content-h2">{i}. Section {i} — Core Concepts</h2>
                <p className="pdf-content-text">
                  Building on the principles established in previous sections, this chapter explores the deeper implications and applications of the theoretical framework. Particular attention should be paid to the mathematical derivations, as they form the basis for problem-solving in examinations.
                </p>
                <div className="pdf-content-formula">
                  ΔG = ΔH − TΔS
                </div>
                <p className="pdf-content-text">
                  The relationship above demonstrates the interplay between enthalpy, entropy, and temperature in determining the spontaneity of a process. Students should be able to apply this equation to predict reaction feasibility under various conditions.
                </p>
                <h3 className="pdf-content-h3">{i}.1 Key Definitions</h3>
                <ul className="pdf-content-list">
                  <li>• Thermodynamic equilibrium — state of maximum entropy</li>
                  <li>• Activation energy — minimum energy for reaction</li>
                  <li>• Rate constant — proportionality factor in rate law</li>
                  <li>• Standard conditions — 298K, 1 atm, 1M concentration</li>
                </ul>
                <h3 className="pdf-content-h3">{i}.2 Worked Examples</h3>
                <p className="pdf-content-text">
                  Example {i}.1: Calculate the crystal field splitting energy for a d⁶ octahedral complex given that the complex absorbs light at 520 nm. Determine whether the complex is high-spin or low-spin.
                </p>
              </>
            )}

            {/* Page footer */}
            <div className="pdf-page-footer">
              <span>{material.title}</span>
              <span>{i} / {totalPages}</span>
            </div>
          </div>
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="pdf-viewer">
      {/* Top bar — page number + zoom + maximize */}
      <div className="pdf-topbar">
        <div className="pdf-topbar-left">
          <button className="pdf-topbar-back" onClick={() => navigate('/dashboard')} title="Back to dashboard">
            <ArrowLeft size={18} />
          </button>
          <span className="pdf-topbar-label">{material.title}</span>
        </div>

        <div className="pdf-topbar-center">
          <button className="pdf-topbar-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
            <ChevronUp size={16} />
          </button>
          <div className="pdf-page-indicator">
            <input
              type="number"
              className="pdf-page-input"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            />
            <span className="pdf-page-total">/ {totalPages}</span>
          </div>
          <button className="pdf-topbar-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="pdf-topbar-right">
          <button className="pdf-topbar-btn" onClick={zoomOut} disabled={zoom <= 50}>
            <ZoomOut size={16} />
          </button>
          <span className="pdf-zoom-label">{zoom}%</span>
          <button className="pdf-topbar-btn" onClick={zoomIn} disabled={zoom >= 200}>
            <ZoomIn size={16} />
          </button>
          <button className="pdf-topbar-btn" aria-label="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* PDF content — scrollable pages */}
      <div className="pdf-content-area" ref={contentRef}>
        {renderMockPages()}
      </div>

      {/* Bottom toolbar — AI tools (hides on scroll up) */}
      <div className={`pdf-toolbar ${toolbarVisible ? '' : 'pdf-toolbar--hidden'}`}>
        <div className="pdf-toolbar-inner">
          <button
            className={`pdf-tool-btn ${activeSheet === 'summary' ? 'pdf-tool-btn--active' : ''}`}
            onClick={onOpenSummary}
          >
            <FileText size={18} />
            <span>Summary</span>
          </button>
          <button
            className={`pdf-tool-btn ${activeSheet === 'flashcards' ? 'pdf-tool-btn--active' : ''}`}
            onClick={onOpenFlashcards}
          >
            <Layers size={18} />
            <span>Flashcards</span>
          </button>
          <button
            className={`pdf-tool-btn ${activeSheet === 'quiz' ? 'pdf-tool-btn--active' : ''}`}
            onClick={onOpenQuiz}
          >
            <HelpCircle size={18} />
            <span>Quiz</span>
          </button>
          <button
            className={`pdf-tool-btn pdf-tool-btn--buhari ${activeSheet === 'chat' ? 'pdf-tool-btn--active' : ''}`}
            onClick={onOpenChat}
          >
            <MessageCircle size={18} />
            <span>Buhari AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
