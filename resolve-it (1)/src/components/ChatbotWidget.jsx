import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockComplaints } from '../data/mockData';

const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; // Example avatar
const BOT_NAME = 'ChatBot';

const quickReplies = [
  '💡 Suggest complaint category',
  '🔄 Show project flow'
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello there! 👋 It's nice to meet you!\n\nWhat brings you here today? Please use the navigation below or ask me anything about Resolve-It product.", quick: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [awaitingCategoryConfirmation, setAwaitingCategoryConfirmation] = useState(false);
  // Navigation dropdown removed
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const [awaitingComplaintId, setAwaitingComplaintId] = useState(false);


  // Track if the last bot message was asking for a complaint description
  const [awaitingCategoryDesc, setAwaitingCategoryDesc] = useState(false);

  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;
    const userMsg = { from: 'user', text: msgText };
    setMessages((msgs) => msgs.map((m, i) => i === msgs.length - 1 ? { ...m, quick: false } : m).concat(userMsg));
    setInput('');

    // Show typing effect
    setLoading(true);
    await new Promise(res => setTimeout(res, 700));

    // Custom hardcoded response for project flow
    if (msgText.toLowerCase().includes('flow')) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: '1. Submit your complaint.\n2. Admin reviews and assigns it.\n3. Team investigates and resolves.\n4. You get notified of the outcome.\n5. Give feedback!' },
        { from: 'bot', text: 'What would you like to do next? You can raise a complaint, track a complaint, or ask me anything!', quick: true }
      ]);
      setLoading(false);
      return;
    }

    // Track my complaint flow
    // ...existing code for removed 'track my complaint'...

    // ...existing code for removed 'track my complaint'...

    // Suggest complaint category
    if (msgText.toLowerCase().includes('suggest complaint category')) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'Please briefly describe your issue, and I will suggest a complaint category.' }
      ]);
      setAwaitingCategoryDesc(true);
      setLoading(false);
      return;
    }

    // If awaiting a description for category suggestion, or if the message matches known complaint keywords, suggest a category
    const text = msgText.toLowerCase();
    let category = null;
    // Location/context keywords
    const isBus = /\bbus\b/.test(text);
    const isBusStand = /bus stand/.test(text);
    const isMetro = /\bmetro\b/.test(text);
    const isMetroStation = /metro station/.test(text);
    // Issue keywords
    const isDirty = /dirty|unclean|filthy|garbage|sanitation/.test(text);
    const isBroken = /broken|repair|damaged/.test(text);
    const isSeat = /seat/.test(text);
    const isRude = /rude|behavior|staff|conductor|misbehave/.test(text);
    const isDelay = /delay|late|schedule|timing|not on time/.test(text);
    const isService = /bus service|bus not coming|no bus|service/.test(text);

    if (
      awaitingCategoryDesc ||
      isDirty || isBroken || isSeat || isRude || isDelay || isService || isBusStand || isMetro || isMetroStation
    ) {
      setAwaitingCategoryDesc(false);
      category = 'General';
      // Metro-specific logic
      if (isBroken && isSeat && isMetroStation) {
        category = 'Infrastructure';
      } else if (isBroken && isSeat && isMetro) {
        category = 'Metro Services';
      } else if (isDirty && (isBusStand || isMetroStation)) {
        category = 'Infrastructure';
      } else if (isDirty && isBus) {
        category = 'Cleanliness';
      } else if (isBroken && (isBusStand || isMetroStation)) {
        category = 'Infrastructure';
      } else if (isBroken && isBus) {
        category = 'Infrastructure';
      } else if (isSeat && isDirty && isBus) {
        category = 'Cleanliness';
      } else if (isSeat && isBroken && isBus) {
        category = 'Infrastructure';
      } else if (isRude) {
        category = 'Staff Behavior';
      } else if (isDelay) {
        category = 'Bus Service';
      } else if (isService) {
        category = 'Bus Service';
      } else if (isDirty) {
        category = 'Cleanliness';
      } else if (isBroken && isSeat && isMetro) {
        category = 'Metro Services';
      } else if (isBroken) {
        category = 'Infrastructure';
      }
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: `Suggested category: ${category}\nWould you like to raise a complaint? (yes/no)` }
      ]);
      setAwaitingCategoryConfirmation(true);
      setShowNextButton(false);
      setLoading(false);
      return;
    }

    // Handle yes/no after category suggestion
    if (awaitingCategoryConfirmation) {
      setAwaitingCategoryConfirmation(false);
      if (msgText.trim().toLowerCase() === 'yes' || msgText.trim().toLowerCase() === 'y') {
        setShowNextButton(true);
        setLoading(false);
      } else if (msgText.trim().toLowerCase() === 'no' || msgText.trim().toLowerCase() === 'n') {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: 'Okay.' }
        ]);
        setLoading(false);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: 'Please reply with yes or no.' }
        ]);
        setAwaitingCategoryConfirmation(true);
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText })
      });
      const data = await res.json();
      let botText = data.response;
      if (botText && botText.choices) {
        botText = botText.choices[0]?.message?.content || botText;
      }
      setMessages((msgs) => [...msgs, { from: 'bot', text: botText }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  // Handler for navigation button click
  const handleNextButtonClick = () => {
    setShowNextButton(false);
    setMessages((msgs) => [
      ...msgs,
      { from: 'bot', text: 'Navigating to complaint form...', quick: true }
    ]);
    setTimeout(() => {
      navigate('/user/raise');
    }, 700);
  };

  // Navigation dropdown handler
  const handleNavDropdown = (route) => {
    setShowNavDropdown(false);
    setMessages((msgs) => [
      ...msgs,
      { from: 'bot', text: `Navigating to ${route.label}...` }
    ]);
    setTimeout(() => {
      navigate(route.path);
      setShowNavDropdown(true);
    }, 700);
  };

  // Navigation options for dropdown
  const navOptions = [
    { label: 'Overview', path: '/user/overview' },
    { label: 'My Complaints', path: '/user/complaints' },
    { label: 'Raise Complaint', path: '/user/raise' },
    { label: 'Feedback', path: '/user/feedback' },
    { label: 'Notifications', path: '/user/notifications' },
  ];

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 64,
            height: 64,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
          aria-label="Open chatbot"
        >
          <img src={BOT_AVATAR} alt="Chatbot" style={{ width: 40, height: 40 }} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          width: 350,
          maxWidth: '90vw',
          height: 520,
          background: '#18181b',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #23232a'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#376B7E',
            color: '#fff',
            padding: '16px 16px 12px 16px',
            borderBottom: '1px solid #eee',
            position: 'relative'
          }}>
            <img src={BOT_AVATAR} alt="Bot" style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12, border: '2px solid #fff' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{BOT_NAME}</div>
              <div style={{ fontSize: 13, color: '#b2f5ea' }}>Online <span style={{ color: '#00e676', fontSize: 18 }}>●</span></div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', right: 12, top: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}
              aria-label="Close chatbot"
            >×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#23232a', minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', marginBottom: 12 }}>
                {msg.from === 'bot' && <img src={BOT_AVATAR} alt="Bot" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8, marginLeft: 0 }} />}
                <div style={{
                  background: msg.from === 'user' ? '#27272a' : '#18181b',
                  color: '#f1f1f1',
                  padding: '10px 16px',
                  borderRadius: 18,
                  maxWidth: 220,
                  fontSize: 15,
                  boxShadow: msg.from === 'bot' ? '0 1px 4px rgba(55,107,126,0.07)' : 'none',
                  marginLeft: msg.from === 'user' ? 0 : 8,
                  marginRight: msg.from === 'user' ? 8 : 0
                }}>
                  {msg.text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: '#888', fontStyle: 'italic', margin: '8px 0' }}>Bot is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies & Navigation Button */}
          <div style={{ padding: 0, background: '#23232a' }}>
            {showNextButton && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <button
                  onClick={handleNextButtonClick}
                  style={{
                    background: '#376B7E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    padding: '10px 24px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 16
                  }}
                >Go to Complaint Form</button>
              </div>
            )}
            {messages.some(msg => msg.quick) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  padding: '12px 16px 0 16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    style={{
                      flex: '1 1 120px',
                      minWidth: 120,
                      maxWidth: 180,
                      height: 44,
                      background: 'linear-gradient(90deg, #2A2A3D 60%, #22334d 100%)',
                      color: '#EAEAEA',
                      border: 'none',
                      borderRadius: 18,
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: 'pointer',
                      marginBottom: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      transition: 'box-shadow 0.25s, background 0.25s, color 0.25s',
                      outline: 'none',
                      textAlign: 'center',
                      letterSpacing: 0.2,
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #00C9A7 0%, #00F5D4 100%)';
                      e.currentTarget.style.color = '#1E1E2F';
                      e.currentTarget.style.boxShadow = '0 0 12px 2px #00F5D4, 0 2px 16px 0 #00C9A7';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #2A2A3D 60%, #22334d 100%)';
                      e.currentTarget.style.color = '#EAEAEA';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            {/* Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage(input);
              }}
              style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #23232a', padding: 12, background: '#18181b' }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message here"
                style={{ flex: 1, border: 'none', outline: 'none', padding: 10, borderRadius: 16, background: '#23232a', color: '#f1f1f1', fontSize: 15 }}
                tabIndex={0}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{ marginLeft: 8, background: '#376B7E', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: 15 }}
              >Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
