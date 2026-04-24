import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Camera } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import FilterBar from '../components/layout/FilterBar';
import CourseCard, { CreateNotebookCard } from '../components/cards/CourseCard';
import { useApp } from '../context/AppContext';
import { getCourses, searchCourses } from '../api/courseService';
import { getRecentMaterials } from '../api/materialService';
import EmptyState from '../components/shared/EmptyState';
import usePageMeta from '../hooks/usePageMeta';
import './dashboardpage.css';

const dashboardTabs = [
  { id: 'all', label: 'All' },
  { id: 'dept', label: 'My Department' },
  { id: 'bookmarked', label: 'Bookmarked' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isOnboarded } = useApp();

  usePageMeta({
    title: 'Dashboard — Edukate UIL',
    description: 'View your courses, track study progress, and access lecture materials on Edukate UIL.',
  });

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [recentMats, setRecentMats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (!isOnboarded) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, isOnboarded, navigate]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const userDept = user?.department_id || user?.departmentId;
      try {
        const [coursesData, recentData] = await Promise.all([
          searchQuery
            ? searchCourses(searchQuery, userDept)
            : getCourses(userDept, user?.level),
          getRecentMaterials(),
        ]);
        setCourses(coursesData);
        setRecentMats(recentData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    const userDept = user?.department_id || user?.departmentId;
    if (userDept) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, searchQuery]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    let sorted = [...courses];

    if (activeTab === 'dept') {
      const userDept = user?.department_id || user?.departmentId;
      sorted = sorted.filter(c => (c.department_id || c.departmentId) === userDept);
    } else if (activeTab === 'bookmarked') {
      sorted = sorted.filter(c => c.completedCount > 0);
    }

    if (sortBy === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'progress') {
      sorted.sort((a, b) => {
        const pa = a.materialCount > 0 ? a.completedCount / a.materialCount : 0;
        const pb = b.materialCount > 0 ? b.completedCount / b.materialCount : 0;
        return pb - pa;
      });
    }

    return sorted;
  }, [courses, activeTab, sortBy, user]);

  // Convert recent materials to course-like objects for the same card style
  const recentAsCourses = useMemo(() => {
    return recentMats.map(mat => ({
      id: mat.id,
      code: mat.course_code || mat.courseCode,
      title: mat.title,
      icon: '📄',
      materialCount: 1,
      completedCount: (mat.is_completed || mat.isCompleted) ? 1 : 0,
      _isMaterial: true, // flag for click handling
    }));
  }, [recentMats]);

  const handleCreateNotebook = () => {
    console.log('Create reading notebook');
  };

  const handleContinueClick = (item) => {
    if (item._isMaterial) {
      navigate(`/reader/${item.id}`);
    } else {
      navigate(`/course/${item.id}`);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content container">
        {/* Filter Bar */}
        <FilterBar
          tabs={dashboardTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onCreateNew={handleCreateNotebook}
        />

        {/* Continue Studying — SAME card style as courses, shown in a row */}
        {recentMats.length > 0 && (
          <section className="dashboard-section animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <h2 className="dashboard-section-title">Continue studying</h2>
            <div className="dashboard-continue-row">
              {recentAsCourses.map(item => (
                <div key={item.id} className="dashboard-continue-item">
                  <CourseCard course={item} onClick={() => handleContinueClick(item)} />
                </div>
              ))}
            </div>
            <div className="dashboard-see-all-wrap">
              <button className="dashboard-see-all" onClick={() => {}}>
                <span>See all</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* Your Courses — card grid */}
        <section className="dashboard-section animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="dashboard-section-title">Your Courses</h2>

          {loading ? (
            <div className="dashboard-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="course-card-skeleton skeleton" />
              ))}
            </div>
          ) : (
            <div className="dashboard-grid">
              <CreateNotebookCard onClick={handleCreateNotebook} />
              {sortedCourses.length > 0 ? (
                sortedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState 
                    title="No courses found" 
                    description="We couldn't find any courses matching your filters. Try adjusting your search or department."
                    imageUrl="/assets/empty-courses.png"
                    actionLabel="View All Departments"
                    onAction={() => setActiveTab('all')}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer branding */}
        <footer className="dashboard-footer">
          <p>Built for the Faculty of Physical Sciences. An initiative by <strong>Buhari</strong>.</p>
        </footer>
      </main>

      {/* Floating Action Button — mobile only, like NotebookLM */}
      <button className="dashboard-fab" onClick={handleCreateNotebook}>
        <Camera size={16} />
        <Plus size={16} />
        <span>Create New</span>
      </button>
    </div>
  );
}
