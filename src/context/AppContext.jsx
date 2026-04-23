import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { currentUser as mockUser, departments } from '../api/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('physci_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
        setIsOnboarded(!!parsed.departmentId && !!parsed.level);
      } catch {
        localStorage.removeItem('physci_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData) => {
    const u = userData || mockUser;
    setUser(u);
    setIsAuthenticated(true);
    setIsOnboarded(!!u.departmentId && !!u.level);
    localStorage.setItem('physci_user', JSON.stringify(u));
  }, []);

  const signup = useCallback((userData) => {
    const u = { ...mockUser, ...userData, totalMaterialsRead: 0, studyStreak: 0, departmentId: null, level: null };
    setUser(u);
    setIsAuthenticated(true);
    setIsOnboarded(false);
    localStorage.setItem('physci_user', JSON.stringify(u));
  }, []);

  const completeOnboarding = useCallback((departmentId, level) => {
    const updated = { ...user, departmentId, level };
    setUser(updated);
    setIsOnboarded(true);
    localStorage.setItem('physci_user', JSON.stringify(updated));
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
    localStorage.removeItem('physci_user');
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('physci_user', JSON.stringify(updated));
  }, [user]);

  const getUserDepartment = useCallback(() => {
    if (!user?.departmentId) return null;
    return departments.find(d => d.id === user.departmentId) || null;
  }, [user]);

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
