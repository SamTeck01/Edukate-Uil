import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Layers, HelpCircle, MessageCircle, 
  Download, ArrowLeft, Loader2, Moon, Sun 
} from 'lucide-react';
import { updateReadProgress } from '../../api/materialService';
import './pdfviewer.css';

export default function PdfViewer({
  material,
  isMaximized,
  onOpenSummary,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenChat,
  activeSheet,
  onScrollVisibilityChange,
  onTextExtracted, // New prop to pass text to parent
}) {
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(material?.last_read_page || 1);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(material?.is_completed || material?.isCompleted || false);
  const [isNightMode, setIsNightMode] = useState(false);
  
  const contentRef = useRef(null);
  const lastScrollY = useRef(0);
  const progressTimerRef = useRef(null);

  // Fetch the PDF blob and extract text
  useEffect(() => {
    async function fetchAndProcessPdf() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('physci_token');
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/materials/${material.id}/download`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to download PDF');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Load PDF.js from CDN and extract text for AI
        await extractTextFromBlob(blob);

      } catch (err) {
        console.error('PDF error:', err);
        setError('Could not load PDF file. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    async function extractTextFromBlob(blob) {
      try {
        // Load PDF.js dynamically
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise(r => script.onload = r);
        }

        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages for speed/tokens
        
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        onTextExtracted?.(fullText);
      } catch (e) {
        console.warn('Text extraction failed:', e);
        // Fallback to title if extraction fails
        onTextExtracted?.(`Document Title: ${material.title}`);
      }
    }

    if (material?.id) {
      fetchAndProcessPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [material.id]);

  // Periodically save progress
  useEffect(() => {
    if (!material?.id) return;

    progressTimerRef.current = setInterval(() => {
      updateReadProgress(material.id, currentPage);
    }, 30000);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      updateReadProgress(material.id, currentPage);
    };
  }, [material.id, currentPage]);

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const y = el.scrollTop;
    
    // Calculate progress
    const winScroll = el.scrollTop;
    const height = el.scrollHeight - el.clientHeight;
    if (height > 0) {
      const progressPercent = (winScroll / height) * 100;
      setScrollProgress(progressPercent);
      
      // Auto-complete if > 95% scrolled
      if (progressPercent > 95 && !isCompleted) {
        setIsCompleted(true);
        updateReadProgress(material.id, currentPage, true);
      }
    }

    const isScrollingDown = y > lastScrollY.current && y > 40;
    setToolbarVisible(!isScrollingDown);
    onScrollVisibilityChange?.(!isScrollingDown);
    lastScrollY.current = y;
  }, [onScrollVisibilityChange, isCompleted, material.id, currentPage]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${material.title || 'material'}.pdf`;
      link.click();
    }
  };

  return (
    <div className="pdf-viewer">
      {/* Top bar */}
      <div className="pdf-topbar">
        {/* Reading progress line */}
        <div className="pdf-progress-container">
          <div className="pdf-progress-bar" style={{ width: `${scrollProgress}%` }} />
        </div>

        <div className="pdf-topbar-left">
          <button className="pdf-topbar-back" onClick={() => navigate('/dashboard')} title="Back to dashboard">
            <ArrowLeft size={18} />
          </button>
          <span className="pdf-topbar-label">{material.title}</span>
        </div>

        <div className="pdf-topbar-right">
          <button 
            className={`pdf-topbar-btn ${isNightMode ? 'pdf-topbar-btn--active' : ''}`} 
            onClick={() => setIsNightMode(!isNightMode)} 
            title="Night Mode"
          >
            {isNightMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="pdf-topbar-btn" onClick={handleDownload} title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* PDF content */}
      <div className={`pdf-content-area ${isNightMode ? 'pdf-content-area--night' : ''}`} ref={contentRef}>
        {loading ? (
          <div className="pdf-status-message">
            <Loader2 className="animate-spin" size={24} />
            <p>Processing document...</p>
          </div>
        ) : error ? (
          <div className="pdf-status-message pdf-status-error">
            <p>{error}</p>
          </div>
        ) : (
          <iframe 
            src={`${pdfUrl}#toolbar=0&navpanes=0`} 
            className="pdf-iframe" 
            title={material.title}
            width="100%"
            height="100%"
          />
        )}
      </div>

      {/* Bottom toolbar */}
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
