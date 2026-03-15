import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, User, BookOpen, UserPlus, FilePlus, Bell } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import ListingDetails from './pages/ListingDetails';
import Requests from './pages/Requests';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      {token && (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-xl font-bold text-white flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SE</span>
                  </div>
                  <span>SkillExchange</span>
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <Home size={16} /> <span>Dashboard</span>
                  </Link>
                  <Link to="/listings" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <BookOpen size={16} /> <span>Explore Skills</span>
                  </Link>
                  <Link to="/requests" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <Bell size={16} /> <span>Requests</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/create-listing" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition">
                  <FilePlus size={16} /> <span>Offer Skill</span>
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-700 transition">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="text-slate-300 hover:text-rose-400 p-2 rounded-full hover:bg-slate-700 transition">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={token ? <Dashboard /> : <Login />} />
          <Route path="/profile" element={token ? <Profile /> : <Login />} />
          <Route path="/listings" element={token ? <Listings /> : <Login />} />
          <Route path="/create-listing" element={token ? <CreateListing /> : <Login />} />
          <Route path="/listings/:id" element={token ? <ListingDetails /> : <Login />} />
          <Route path="/requests" element={token ? <Requests /> : <Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
