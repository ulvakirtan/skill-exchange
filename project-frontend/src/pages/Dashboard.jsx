import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Clock, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import api from '../api/api';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            // Fetch user profile
            const profRes = await api.get('/user/profile');
            setUser(profRes.data);

            // In a real app we'd fetch these distinct lists nicely. We'll try fetching what we can.
            // Often you have distinct endpoints. We'll pretend the lists come from these endpoints:
            const listingsRes = await api.get('/listings');
            // filter out ones created by user
            const userListings = listingsRes.data.filter(lst => lst.creator?._id === profRes.data._id);
            setMyListings(userListings);

            const requestsRes = await api.get('/requests');
            const allReqs = requestsRes.data;

            const incoming = allReqs.filter(r => r.listing?.creator === profRes.data._id || r.receiver === profRes.data._id);
            const outgoing = allReqs.filter(r => r.requester?._id === profRes.data._id || r.sender === profRes.data._id);

            setIncomingRequests(incoming);
            setOutgoingRequests(outgoing);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                <p className="text-slate-400">Here's what's happening with your skill exchanges today.</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{myListings.length}</p>
                            <p className="text-slate-400 text-sm">Active Skills Offered</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                            <Bell size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{incomingRequests.length}</p>
                            <p className="text-slate-400 text-sm">Requests Received</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{outgoingRequests.length}</p>
                            <p className="text-slate-400 text-sm">Requests Sent</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Listings */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col hidden-scrollbars">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center"><BookOpen className="mr-2 text-blue-400" size={20} /> My Listings</h2>
                        <Link to="/create-listing" className="text-sm text-blue-400 hover:text-blue-300">Create New</Link>
                    </div>
                    <div className="space-y-4 flex-1">
                        {myListings.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                You haven't listed any skills yet.
                            </div>
                        ) : (
                            myListings.map(listing => (
                                <div key={listing._id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                                    <h3 className="text-white font-semibold truncate">{listing.title}</h3>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">{listing.category}</span>
                                        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700">{listing.level}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Requests Preview */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center"><Bell className="mr-2 text-emerald-400" size={20} /> Action Needed</h2>
                        <Link to="/requests" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {incomingRequests.slice(0, 3).map(req => (
                            <div key={req._id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between items-center group hover:border-slate-500 transition cursor-pointer" onClick={() => window.location.href = '/requests'}>
                                <div>
                                    <p className="text-sm text-slate-400">Request for <span className="text-white font-medium">{req.listing?.title || 'a skill'}</span></p>
                                    <p className="text-xs text-slate-500 mt-1">From: {req.requester?.name || 'Someone'}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs border ${req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {req.status ? req.status.toUpperCase() : 'PENDING'}
                                </div>
                            </div>
                        ))}
                        {incomingRequests.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No incoming requests right now.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
