import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { mockComplaints } from '../data/mockData.js';

const ComplaintContext = createContext(undefined);

const API_BASE_URL = 'http://localhost:8080/api/complaints';

export const ComplaintProvider = ({ children }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Always fetch complaints from backend for both admin and users
  const fetchComplaints = async () => {
    if (!user?.id && user?.role !== 'admin') {
      setComplaints([]);
      return;
    }
    try {
      setLoading(true);
      let endpoint = API_BASE_URL;
      if (user?.role !== 'admin') {
        endpoint = `${API_BASE_URL}/user/${user.id}`;
      }
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Priority suggestion logic
  const suggestPriority = (category, subject, description) => {
    const text = `${subject} ${description}`.toLowerCase();
    const highKeywords = ['accident', 'safety', 'dangerous', 'fire', 'harassment'];
    const mediumKeywords = ['delay', 'broken seat', 'staff issue', 'late', 'crowded', 'not working', 'rude'];
    const lowKeywords = ['cleanliness', 'suggestion', 'minor', 'inconvenience', 'dirty', 'repair'];
    if (highKeywords.some(k => text.includes(k)) || (category && category.toLowerCase().includes('safety'))) return 'High';
    if (mediumKeywords.some(k => text.includes(k))) return 'Medium';
    if (lowKeywords.some(k => text.includes(k))) return 'Low';
    return 'Low'; // Default to Low
  };

  // Create a new complaint (supports both JSON and FormData)
  const createComplaint = async (data) => {
    if (!user) return;
    try {
      let response;
      // Try to get token from user object or localStorage
      const token = user?.token || (typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('resolve_it_user') || '{}').token : undefined);
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};
      let priority = 'Low';
      if (data instanceof FormData) {
        // For FormData, extract fields for priority suggestion
        const category = data.get('category') || '';
        const subject = data.get('subject') || '';
        const description = data.get('description') || '';
        priority = suggestPriority(category, subject, description);
        data.append('userId', user.id);
        data.append('priority', priority);
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: authHeader,
          body: data,
        });
      } else {
        priority = suggestPriority(data.category, data.subject, data.description);
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader,
          },
          body: JSON.stringify({ ...data, userId: user.id, location: data.location, date: data.date, priority }),
        });
      }
      if (!response.ok) {
        throw new Error('Failed to create complaint');
      }
      const res = await response.json();
      const newComplaint = res.complaint || res;
      setComplaints(prev => [newComplaint, ...prev]);
      localStorage.setItem('resolve_it_complaint_updated_at', Date.now().toString());
      return res;
    } catch (err) {
      setError(err.message);
      console.error('Error creating complaint:', err);
      throw err;
    }
  };

  // Fetch notifications for user, admin, or department
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    let url = '';
    if (user.role === 'ADMIN') {
      url = `http://localhost:8080/api/notifications?role=ADMIN`;
    } else if (user.role === 'DEPARTMENT') {
      url = `http://localhost:8080/api/notifications?departmentName=${encodeURIComponent(user.departmentName || '')}`;
    } else if (user.id) {
      url = `http://localhost:8080/api/notifications?userId=${user.id}`;
    } else {
      setNotifications([]);
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchNotifications();

    const onStorage = (event) => {
      if (event.key === 'resolve_it_complaint_updated_at') {
        fetchComplaints();
        fetchNotifications();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  // Accepts either (category, subject, description) or (FormData)
  const addComplaint = async (...args) => {
    if (args.length === 1 && (args[0] instanceof FormData)) {
      return await createComplaint(args[0]);
    } else {
      const [category, subject, description, location, date] = args;
      return await createComplaint({ category, subject, description, location, date });
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to update complaint status');
      }

      const updatedComplaint = await response.json();
      setComplaints(prev => prev.map(c => c.id === id ? updatedComplaint : c));

      // Automatically add a notification if resolved
      if (status === 'Resolved' && updatedComplaint.user && updatedComplaint.user.id) {
        setNotifications(prev => [
          {
            id: Date.now() + Math.random(),
            userId: updatedComplaint.user.id,
            targetRole: 'user',
            message: `Your complaint (ID #${updatedComplaint.id}) has been Resolved.`,
            isRead: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }

      return updatedComplaint;
    } catch (err) {
      setError(err.message);
      console.error('Error updating complaint status:', err);
      throw err;
    }
  };

  const assignDepartment = async (id, department) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/assign-department?department=${encodeURIComponent(department)}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to assign department');
      }

      const updatedComplaint = await response.json();
      setComplaints(prev => prev.map(c => c.id === id ? updatedComplaint : c));
      return updatedComplaint;
    } catch (err) {
      setError(err.message);
      console.error('Error assigning department:', err);
      throw err;
    }
  };

  const sendDepartmentMessage = async (id, message, resolutionStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/department-response?response=${encodeURIComponent(message)}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to send department message');
      }
      const updatedComplaint = await response.json();
      setComplaints(prev => prev.map(c => c.id === id ? updatedComplaint : c));
      return updatedComplaint;
    } catch (err) {
      setError(err.message);
      console.error('Error sending department message:', err);
      throw err;
    }
  };

  const getComplaintsByUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user complaints');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching user complaints:', err);
      return [];
    }
  };

  const getNotificationsByUser = (userId) => {
    // Support both user_id (snake_case) and user.id (object) from backend
    return notifications.filter(n =>
      (n.user_id === userId) ||
      (n.user && n.user.id === userId)
    );
  };

  const getNotificationsByRole = (role) => {
    return notifications.filter(n => n.targetRole === role);
  };

  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/notifications/${id}/read`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      const updated = await response.json();
      setNotifications(prev => prev.map(n => n.id === id ? updated : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      notifications,
      loading,
      error,
      addComplaint,
      updateComplaintStatus,
      assignDepartment,
      sendDepartmentMessage,
      getComplaintsByUser,
      getNotificationsByUser,
      getNotificationsByRole,
      markNotificationAsRead,
      fetchComplaints
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
