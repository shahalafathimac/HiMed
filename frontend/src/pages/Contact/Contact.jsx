import { useState, useEffect } from "react";
import { 
  createContactMessage, 
  fetchContactMessages, 
  replyContactMessage, 
  resolveContactMessage, 
  fetchDashboardData 
} from "../../services/apiServices";
import Navbar from "../../components/Navbar/Navbar";

function Contact() {
  const [role, setRole] = useState("guest");
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRoleAndLoadData();
  }, []);

  const checkRoleAndLoadData = async () => {
    try {
      const token = localStorage.getItem("access");
      if (token) {
        const dashRes = await fetchDashboardData();
        setRole(dashRes.data.role);
        
        if (dashRes.data.role === "admin") {
          loadMessages();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await fetchContactMessages();
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContactMessage(formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const handleReply = async (id) => {
    const reply = replyData[id];
    if (!reply) return;
    try {
      await replyContactMessage(id, { reply });
      alert("Reply sent");
      setReplyData({...replyData, [id]: ""});
      loadMessages();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveContactMessage(id);
      loadMessages();
    } catch (err) {
      alert("Failed to resolve message");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Contact Us</h1>

        {role === "admin" ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Manage Messages</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-lg shadow">No messages found.</p>
            ) : (
              <div className="grid gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{msg.subject}</h3>
                        <p className="text-sm text-gray-500">From: {msg.name} ({msg.email})</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${msg.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap">{msg.message}</p>
                    
                    {msg.admin_reply && (
                      <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-100">
                        <p className="text-sm font-semibold text-indigo-800 mb-1">Your Reply:</p>
                        <p className="text-indigo-900 whitespace-pre-wrap">{msg.admin_reply}</p>
                      </div>
                    )}

                    {msg.status !== 'resolved' && (
                      <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-end">
                        <div className="flex-1 w-full">
                          <textarea 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                            rows="2" 
                            placeholder="Write a reply..."
                            value={replyData[msg.id] || ""}
                            onChange={(e) => setReplyData({...replyData, [msg.id]: e.target.value})}
                          ></textarea>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleReply(msg.id)} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Send Reply
                          </button>
                          <button 
                            onClick={() => handleResolve(msg.id)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;