import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../api/authService';
import * as courseService from '../api/courseService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  // Fetch departments and check session on mount
  useEffect(() => {
    const init = async () => {
      // 1. Fetch departments
      try {
        const depts = await courseService.getDepartments();
        setDepartments(depts || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }

      // 2. Restore user session
      const stored = localStorage.getItem('physci_user');
      const token = localStorage.getItem('physci_token');
      
      if (stored && token) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
          // Support both old and new casing for safety, but token guarantees it's a real session
          setIsOnboarded(!!(parsed.department_id || parsed.departmentId) && !!parsed.level);
        } catch {
          localStorage.removeItem('physci_user');
          localStorage.removeItem('physci_token');
        }
      } else {
        // Clear any partial/stale mock state
        localStorage.removeItem('physci_user');
        localStorage.removeItem('physci_token');
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (userData) => {
    if (!userData || !userData.email) return;
    if (!userData.password) {
      setIsLoading(false);
      throw new Error("Password is required");
    }
    setIsLoading(true);
    // Call the real authService which hits the API
    const res = await authService.login(userData.email, userData.password);
    if (!res.error && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      setIsOnboarded(!!res.user.department_id && !!res.user.level);
    } else {
      console.error(res.error);
      throw new Error(res.error);
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (userData) => {
    if (!userData || !userData.email) return;
    if (!userData.password) {
      setIsLoading(false);
      throw new Error("Password is required");
    }
    setIsLoading(true);
    const res = await authService.signup(userData.email, userData.password, userData.name);
    if (!res.error && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      setIsOnboarded(false);
    } else {
      console.error(res.error);
      throw new Error(res.error);
    }
    setIsLoading(false);
  }, []);

  const completeOnboarding = useCallback(async (department_id, level) => {
    setIsLoading(true);
    try {
      const res = await authService.updateProfile({ department_id, level });
      if (!res.error && res.user) {
        setUser(res.user);
        setIsOnboarded(true);
      }
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
  }, []);

  const updateUser = useCallback(async (updates) => {
    const res = await authService.updateProfile(updates);
    if (!res.error && res.user) {
      setUser(res.user);
    }
  }, []);

  const getUserDepartment = useCallback(() => {
    if (!user?.department_id || departments.length === 0) return null;
    return departments.find(d => d.id === user.department_id) || null;
  }, [user, departments]);

  const value = {
    user,
    isAuthenticated,
    isOnboarded,
    isLoading,
    login,
    signup,
    logout,
    completeOnboarding,
    updateUser,
    getUserDepartment,
    departments,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
