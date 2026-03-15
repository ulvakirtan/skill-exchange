import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, UserCircle2 } from 'lucide-react';
import api from '../api/api';

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await api.get('/listings');
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredListings = listings.filter(
        (lst) =>
            lst.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lst.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lst.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Explore Skills</h1>
                    <p className="text-slate-400">Discover skills offered by others in your campus</p>
                </div>

                <div className="w-full md:w-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-5" />
                    <input
                        type="text"
                        placeholder="Search skills, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredListings.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">
                        No listings found matching your search.
                    </div>
                ) : (
                    filteredListings.map((listing) => (
                        <Link
                            key={listing._id}
                            to={`/listings/${listing._id}`}
                            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition group flex flex-col"
                        >
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                                        {listing.category}
                                    </span>
                                    <span className="flex items-center text-amber-400 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                                        <Star size={12} className="mr-1" />
                                        {listing.level}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">{listing.title}</h3>

                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                                    {listing.description}
                                </p>

                                <div className="pt-4 border-t border-slate-700 flex items-center text-sm text-slate-300">
                                    <UserCircle2 size={16} className="mr-2 text-slate-500" />
                                    <span className="truncate">{listing.creator?.name || 'Unknown User'}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
