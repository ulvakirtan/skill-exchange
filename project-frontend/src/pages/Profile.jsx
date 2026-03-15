import { useState, useEffect } from 'react';
import { User, Save, Code, Sparkles, UserCircle } from 'lucide-react';
import api from '../api/api';

export default function Profile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        skillsOffered: [],
        skillsWanted: []
    });

    const [formData, setFormData] = useState({
        bio: '',
        skillsOffered: '',
        skillsWanted: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/user/profile');
            setProfile(res.data);
            setFormData({
                bio: res.data.bio || '',
                skillsOffered: res.data.skillsOffered?.join(', ') || '',
                skillsWanted: res.data.skillsWanted?.join(', ') || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            const payload = {
                bio: formData.bio,
                skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
                skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
            };

            await api.put('/user/profile', payload);
            setMessage('Profile updated successfully!');
            fetchProfile(); // refresh data
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
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
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm">
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-700">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                        <UserCircle size={48} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                        <p className="text-slate-400">{profile.email}</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} border`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">About Me (Bio)</label>
                        <textarea
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[120px]"
                            placeholder="Tell others about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                                <Code className="w-4 h-4 mr-2 text-blue-400" />
                                Skills Offered (comma separated)
                            </label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[100px]"
                                value={formData.skillsOffered}
                                onChange={(e) => setFormData({ ...formData, skillsOffered: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                                Skills Wanted (comma separated)
                            </label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[100px]"
                                value={formData.skillsWanted}
                                onChange={(e) => setFormData({ ...formData, skillsWanted: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
                            onClick={fetchProfile} // reset changes
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
