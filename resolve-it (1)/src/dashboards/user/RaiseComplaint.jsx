import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { Notification } from '../../components/Notification';
import { useNavigate } from 'react-router-dom';

export const RaiseComplaint = () => {
  const { addComplaint } = useComplaints();
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [attachment, setAttachment] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('date', formData.date);
      if (attachment) {
        data.append('attachment', attachment);
      }
      const res = await addComplaint(data);
      if (res && res.notification) {
        setNotification(res.notification);
      } else {
        setNotification('Complaint submitted successfully!');
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setNotification(null);
        navigate('/user/complaints');
      }, 1500);
      setFormData({ category: '', subject: '', description: '', location: '', date: new Date().toISOString().slice(0, 10) });
      setAttachment(null);
    } catch (err) {
      setNotification('Failed to submit complaint. Please try again.');
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#22c55e' }}>Raise a New Complaint</h3>
        {notification && (
          <Notification message={notification} onClose={() => setNotification(null)} type={submitted ? 'success' : 'error'} />
        )}
        {submitted && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-xl text-sm font-medium">
            Complaint submitted successfully! Our team will review it shortly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Attachment (optional)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={e => setAttachment(e.target.files[0])}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Bus Service">Bus Service</option>
                <option value="Metro Service">Metro Service</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Staff Behavior">Staff Behavior</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Safety">Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
              >
                <option value="">Select Location</option>
                <option value="Miyapur">Miyapur</option>
                <option value="Ameerpet">Ameerpet</option>
                <option value="LB Nagar">LB Nagar</option>
                <option value="Kukatpally">Kukatpally</option>
                <option value="Hitech City">Hitech City</option>
                <option value="Secunderabad">Secunderabad</option>
                <option value="Uppal">Uppal</option>
                <option value="Dilsukhnagar">Dilsukhnagar</option>
                <option value="Jubilee Hills">Jubilee Hills</option>
                <option value="Begumpet">Begumpet</option>
                <option value="Charminar">Charminar</option>
                <option value="Mehdipatnam">Mehdipatnam</option>
                <option value="Gachibowli">Gachibowli</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of the issue"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about your grievance..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};
