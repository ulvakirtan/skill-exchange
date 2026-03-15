import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCircle2, Clock, MapPin, Send, ArrowLeft, Layers, Bookmark } from 'lucide-react';
import api from '../api/api';

export default function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestMsg, setRequestMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [listingRes, userRes] = await Promise.all([
                api.get(`/listings/${id}`),
                api.get('/user/profile')
            ]);
            setListing(listingRes.data);
            setCurrentUser(userRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequest = async () => {
        setIsRequesting(true);
        setRequestMsg('');
        try {
            await api.post('/requests', {
                listingId: id,
                receiverId: listing.creator._id
            });
            setRequestMsg({ text: 'Request sent successfully!', type: 'success' });
        } catch (err) {
            setRequestMsg({
                text: err.response?.data?.message || 'Failed to send request.',
                type: 'error'
            });
        } finally {
            setIsRequesting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="text-center py-12 text-slate-400">
                Listing not found.
            </div>
        );
    }

    const isOwner = currentUser?._id === listing.creator?._id;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition"
            >
                <ArrowLeft size={16} className="mr-2" /> Back to listings
            </button>

            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
                {/* Header section */}
                <div className="p-8 md:p-12 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="inline-flex items-center px-4 py-1.5 bg-blue-500/10 text-blue-400 font-semibold rounded-full border border-blue-500/20">
                            <Bookmark size={14} className="mr-2" />
                            {listing.category}
                        </span>
                        <span className="inline-flex items-center text-amber-400 font-medium bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                            <Layers size={14} className="mr-2" />
                            {listing.level}
                        </span>
                        <span className="inline-flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                            <Clock size={14} className="mr-2" />
                            {listing.sessionCount} Session{listing.sessionCount > 1 ? 's' : ''}
                        </span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                        {listing.title}
                    </h1>

                    <div className="flex items-center space-x-4 mt-8">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                            <UserCircle2 size={32} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">{listing.creator?.name || 'Unknown User'}</p>
                            <p className="text-slate-400 text-sm">Listing Creator</p>
                        </div>
                    </div>
                </div>

                {/* Content section */}
                <div className="p-8 md:p-12">
                    <h2 className="text-xl font-bold text-white mb-4">About this skill</h2>
                    <div className="prose prose-invert max-w-none text-slate-300">
                        <p className="whitespace-pre-line leading-relaxed text-lg">
                            {listing.description}
                        </p>
                    </div>

                    {requestMsg.text && (
                        <div className={`mt-8 p-4 rounded-xl border ${requestMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {requestMsg.text}
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-700">
                        {!isOwner ? (
                            <button
                                onClick={handleRequest}
                                disabled={isRequesting}
                                className="w-full md:w-auto flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 text-lg"
                            >
                                <Send className="mr-3" size={20} />
                                {isRequesting ? 'Sending Request...' : 'Request to Exchange Skill'}
                            </button>
                        ) : (
                            <div className="text-center p-6 bg-slate-900 rounded-xl border border-slate-700 text-slate-400">
                                You are the creator of this listing.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
