import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SourcesPanel from '../components/reader/SourcesPanel';
import PdfViewer from '../components/reader/PdfViewer';
import ChatPanel from '../components/reader/ChatPanel';
import ReaderNavbar from '../components/reader/ReaderNavbar';
import BottomBar from '../components/reader/BottomBar';
import BottomSheet from '../components/reader/BottomSheet';
import SummaryView from '../components/reader/SummaryView';
import FlashcardViewer from '../components/reader/FlashcardViewer';
import QuizViewer from '../components/reader/QuizViewer';
import { useApp } from '../context/AppContext';
import { getMaterialById, getMaterialsByCourse } from '../api/materialService';
import { getCourseById } from '../api/courseService';
import './readerpage.css';

/**
 * ReaderPage — THE core page of PhySci Hub.
 *
 * DESKTOP (>1024px):
 *   [ Sources (left) ] [ PDF VIEWER (center) ] [ Chat (right) ]
 *   PDF bottom toolbar has: Summary | Flashcards | Quiz | Buhari AI
 *   → clicking these opens BottomSheet (slides in as right panel)
 *
 * MOBILE (<=768px):
 *   - PDF is fullscreen
 *   - Bottom tab bar: Sources | Chat | Studio
 *   - Tabs switch the mobile view (Sources as sheet, Chat as sheet)
 *   - PDF toolbar tools open as fullscreen bottom sheets
 *   - All tool state persists via refs (close & reopen = same content)
 */
export default function ReaderPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();

  const [material, setMaterial] = useState(null);
  const [course, setCourse] = useState(null);
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Desktop panel visibility
  const [showSources, setShowSources] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isPdfMaximized, setIsPdfMaximized] = useState(false);

  // Mobile: active bottom tab
  const [mobileTab, setMobileTab] = useState('viewer'); // 'sources' | 'viewer' | 'chat'

  // Bottom sheet: 'summary' | 'flashcards' | 'quiz' | 'mobileChat' | 'mobileSources' | 'mobileStudio' | null
  const [activeSheet, setActiveSheet] = useState(null);

  // Bottom bar visibility (auto-hide on scroll)
  const [bottomBarVisible, setBottomBarVisible] = useState(true);

  // Persistent refs — content survives sheet close/open
  const chatHistoryRef = useRef([]);
  const summaryDataRef = useRef(null);
  const flashcardsDataRef = useRef(null);
  const quizDataRef = useRef(null);
  
  // Document context for AI
  const [extractedText, setExtractedText] = useState('');

  // Fetch material + course data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const mat = await getMaterialById(materialId);
        if (!mat) {
          navigate('/dashboard');
          return;
        }
        setMaterial(mat);

        const [courseData, mats] = await Promise.all([
          getCourseById(mat.courseId),
          getMaterialsByCourse(mat.courseId),
        ]);
        setCourse(courseData);
        setCourseMaterials(mats);
      } catch (err) {
        console.error('Failed to load reader:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [materialId, navigate]);

  // Maximize PDF — hides both sidebars
  const toggleMaximize = useCallback(() => {
    setIsPdfMaximized(prev => {
      if (!prev) {
        setShowSources(false);
        setShowChat(false);
      } else {
        setShowSources(true);
        setShowChat(true);
      }
      return !prev;
    });
  }, []);

  // Open/close bottom sheets (persistent content)
  const openSheet = useCallback((type) => setActiveSheet(type), []);
  const closeSheet = useCallback(() => setActiveSheet(null), []);

  // Switch to another material
  const switchMaterial = useCallback((newMatId) => {
    navigate(`/reader/${newMatId}`, { replace: true });
  }, [navigate]);

  // Mobile bottom tab handler
  const handleMobileTab = useCallback((tabId) => {
    setMobileTab(tabId);
    if (tabId === 'sources') {
      setActiveSheet('mobileSources');
    } else if (tabId === 'chat') {
      setActiveSheet('mobileChat');
    } else if (tabId === 'viewer') {
      setActiveSheet(null);
    }
  }, []);

  // Sheet titles
  const sheetTitles = {
    summary: 'Summary',
    flashcards: 'Flashcards',
    quiz: 'Quiz',
    mobileChat: 'Ask Buhari',
    mobileSources: 'Sources',
  };

  if (loading) {
    return (
      <div className="reader-page">
        <div className="reader-loading">
          <h2 className="reader-loading-text">Opening material...</h2>
          <div className="reader-loading-bar">
            <div className="reader-loading-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (!material) return null;

  return (
    <div className={`reader-page ${isPdfMaximized ? 'reader-page--maximized' : ''}`}>
      {/* Top navbar */}
      <ReaderNavbar
        material={material}
        course={course}
        onToggleSources={() => setShowSources(s => !s)}
        onToggleChat={() => setShowChat(s => !s)}
        onToggleMaximize={toggleMaximize}
        isPdfMaximized={isPdfMaximized}
        showSources={showSources}
        showChat={showChat}
      />

      {/* 3-column layout: Sources | PDF | Chat */}
      <div className="reader-layout">
        {/* LEFT: Sources panel — desktop */}
        {showSources && (
          <aside className="reader-sources">
            <SourcesPanel
              materials={courseMaterials}
              activeMaterialId={materialId}
              onSelectMaterial={switchMaterial}
              course={course}
            />
          </aside>
        )}

        {/* CENTER: PDF Viewer (THE MAIN THING) */}
        <main className="reader-center">
          <PdfViewer
            material={material}
            isMaximized={isPdfMaximized}
            onOpenSummary={() => openSheet('summary')}
            onOpenFlashcards={() => openSheet('flashcards')}
            onOpenQuiz={() => openSheet('quiz')}
            onOpenChat={() => openSheet('mobileChat')}
            activeSheet={activeSheet}
            onScrollVisibilityChange={setBottomBarVisible}
            onTextExtracted={setExtractedText}
          />
        </main>

        {/* RIGHT: Chat panel — desktop */}
        {showChat && (
          <aside className="reader-chat">
            <div className="reader-chat-header">
              <h2 className="reader-chat-title">Chat</h2>
            </div>
            <ChatPanel
              materialId={materialId}
              historyRef={chatHistoryRef}
              contextText={extractedText}
            />
          </aside>
        )}
      </div>

      {/* Mobile bottom tab bar: Sources | Viewer | Chat */}
      <BottomBar
        activeTab={mobileTab}
        onTabChange={handleMobileTab}
        visible={bottomBarVisible || activeSheet !== null}
      />

      {/* Bottom Sheet — all tools + mobile panels */}
      {activeSheet && (
        <BottomSheet onClose={closeSheet} title={sheetTitles[activeSheet] || ''}>
          {activeSheet === 'mobileChat' && (
            <ChatPanel materialId={materialId} historyRef={chatHistoryRef} contextText={extractedText} />
          )}
          {activeSheet === 'mobileSources' && (
            <SourcesPanel
              materials={courseMaterials}
              activeMaterialId={materialId}
              onSelectMaterial={(id) => { switchMaterial(id); closeSheet(); }}
              course={course}
            />
          )}
          {activeSheet === 'summary' && (
            <SummaryView materialId={materialId} dataRef={summaryDataRef} contextText={extractedText} />
          )}
          {activeSheet === 'flashcards' && (
            <FlashcardViewer materialId={materialId} dataRef={flashcardsDataRef} contextText={extractedText} />
          )}
          {activeSheet === 'quiz' && (
            <QuizViewer materialId={materialId} dataRef={quizDataRef} contextText={extractedText} />
          )}
        </BottomSheet>
      )}
    </div>
  );
}
