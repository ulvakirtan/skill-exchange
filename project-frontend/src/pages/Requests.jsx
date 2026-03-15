import { useState, useEffect } from 'react';
import { Bell, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import api from '../api/api';

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('incoming');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [reqRes, userRes] = await Promise.all([
                api.get('/requests'),
                api.get('/user/profile')
            ]);
            setRequests(reqRes.data);
            setCurrentUser(userRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/requests/${id}`, { status });
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Failed to update request', err);
        }
    };

    const incomingReqs = requests.filter(
        r => r.listing?.creator === currentUser?._id || r.receiver === currentUser?._id
    );

    const outgoingReqs = requests.filter(
        r => r.requester?._id === currentUser?._id || r.sender === currentUser?._id
    );

    const displayedReqs = activeTab === 'incoming' ? incomingReqs : outgoingReqs;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Bell className="text-blue-400" size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Requests</h1>
                    <p className="text-slate-400">Manage your skill exchange requests</p>
                </div>
            </div>

            <div className="flex border-b border-slate-700">
                <button
                    className={`flex-1 py-4 text-center font-medium border-b-2 transition ${activeTab === 'incoming' ? 'text-blue-400 border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                    onClick={() => setActiveTab('incoming')}
                >
                    Incoming ({incomingReqs.length})
                </button>
                <button
                    className={`flex-1 py-4 text-center font-medium border-b-2 transition ${activeTab === 'outgoing' ? 'text-blue-400 border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                    onClick={() => setActiveTab('outgoing')}
                >
                    Sent ({outgoingReqs.length})
                </button>
            </div>

            <div className="space-y-4 pt-4">
                {displayedReqs.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                        <p className="text-slate-400">No {activeTab} requests to show.</p>
                    </div>
                ) : (
                    displayedReqs.map(req => (
                        <div key={req._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-slate-600 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                    <span className="text-lg font-bold text-slate-300">
                                        {(activeTab === 'incoming' ? req.requester?.name : req.receiver?.name)?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        {activeTab === 'incoming' ? (
                                            <><ArrowRight className="text-emerald-400" size={16} /> From: {req.requester?.name || 'Someone'}</>
                                        ) : (
                                            <><ArrowLeft className="text-blue-400" size={16} /> To: {req.receiver?.name || 'Someone'}</>
                                        )}
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Requested for: <span className="font-medium text-slate-300">{req.listing?.title || 'Unknown Listing'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`px-3 py-1 rounded-md text-sm font-medium border ${req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {req.status ? req.status.toUpperCase() : 'PENDING'}
                                </div>

                                {activeTab === 'incoming' && req.status === 'pending' && (
                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            onClick={() => handleUpdateStatus(req._id, 'accepted')}
                                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg border border-emerald-500/20 hover:border-emerald-600 transition"
                                            title="Accept Request"
                                        >
                                            <Check size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(req._id, 'rejected')}
                                            className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 hover:border-rose-600 transition"
                                            title="Reject Request"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
