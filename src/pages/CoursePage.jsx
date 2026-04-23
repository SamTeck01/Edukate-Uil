import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/shared/Button';
import { useApp } from '../context/AppContext';
import { getCourseById } from '../api/courseService';
import { getMaterialsByCourse } from '../api/materialService';
import './coursepage.css';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [courseData, matsData] = await Promise.all([
          getCourseById(courseId),
          getMaterialsByCourse(courseId),
        ]);
        setCourse(courseData);
        setMaterials(matsData);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = materials.filter(m => m.isCompleted).length;
  const progress = materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  if (loading) {
    return (
      <div className="course-page">
        <Navbar />
        <div className="course-loading">
          <div className="course-loading-spinner" />
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-page">
        <Navbar />
        <div className="course-loading">
          <p>Course not found.</p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-page">
      <Navbar />

      <main className="course-content container">
        {/* Back nav */}
        <button className="course-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>

        {/* Course header */}
        <div className="course-header">
          <div className="course-header-icon">{course.icon}</div>
          <div className="course-header-info">
            <h1 className="course-header-title">{course.title}</h1>
            <p className="course-header-code">{course.code} · {course.level}</p>
            <p className="course-header-desc">{course.description}</p>
          </div>
          <div className="course-header-stats">
            <div className="course-stat">
              <span className="course-stat-value">{materials.length}</span>
              <span className="course-stat-label">Materials</span>
            </div>
            <div className="course-stat">
              <span className="course-stat-value">{progress}%</span>
              <span className="course-stat-label">Complete</span>
            </div>
          </div>
        </div>

        {/* Search & Upload bar */}
        <div className="course-actions-bar">
          <div className="course-search-wrap">
            <Search size={16} className="course-search-icon" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="course-search-input"
            />
          </div>
          {user?.role === 'moderator' && (
            <Button variant="secondary" size="sm" icon={Upload}>Upload Material</Button>
          )}
        </div>

        {/* Materials list */}
        <div className="course-materials-list">
          {filteredMaterials.length === 0 ? (
            <div className="course-empty">
              <p>No materials found.</p>
            </div>
          ) : (
            filteredMaterials.map((mat, i) => (
              <button
                key={mat.id}
                className="course-material-item animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => navigate(`/reader/${mat.id}`)}
              >
                <div className="course-material-left">
                  <div className={`course-material-check ${mat.isCompleted ? 'course-material-check--done' : ''}`}>
                    {mat.isCompleted && '✓'}
                  </div>
                  <div className="course-material-info">
                    <h3 className="course-material-title">{mat.title}</h3>
                    <p className="course-material-meta">
                      {mat.pageCount} pages · {mat.readCount} readers · by {mat.uploadedByName}
                    </p>
                  </div>
                </div>
                <div className="course-material-right">
                  {mat.lastReadPage > 0 && !mat.isCompleted && (
                    <span className="course-material-bookmark">pg {mat.lastReadPage}/{mat.pageCount}</span>
                  )}
                  <span className="course-material-type">{mat.type.toUpperCase()}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
