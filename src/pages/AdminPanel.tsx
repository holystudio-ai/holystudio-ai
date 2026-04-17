import React, { useState, useEffect, useCallback } from 'react';
const API_URL = (import.meta as any).env?.VITE_API_URL
    ? (import.meta as any).env.VITE_API_URL.replace(/\/+$/, '')
    : '';
interface User {
    _id: string; email: string; status: string; accessType?: string; emailCheckType?: string;
    ip?: string; createdAt?: string; updatedAt?: string; paidAt?: string;
    emailVerifiedAt?: string; accessEmailSentAt?: string; orderReference?: string;
}
interface Stats { totalUsers: number; paidUsers: number; pendingUsers: number; freeUsers: number; totalOrders: number; paidOrders: number; }
function AdminPanel() {
    const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('admin_token'));
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [tab, setTab] = useState<'users' | 'broadcast'>('users');
    const [broadcastType, setBroadcastType] = useState<'reminder' | 'access'>('reminder');
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [broadcastResult, setBroadcastResult] = useState('');
    const [search, setSearch] = useState('');
    const getHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
    }), [token]);
    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [uRes, sRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/users`, { headers: getHeaders() }),
                fetch(`${API_URL}/api/admin/stats`, { headers: getHeaders() }),
            ]);
            if (uRes.status === 401) { setToken(null); sessionStorage.removeItem('admin_token'); return; }
            setUsers((await uRes.json()).users || []);
            setStats(await sRes.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [token, getHeaders]);
    useEffect(() => { fetchData(); }, [fetchData]);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await res.json();
            if (data.ok) { setToken(data.token); sessionStorage.setItem('admin_token', data.token); }
            else setLoginError('Невірні дані');
        } catch { setLoginError("Помилка з'єднання"); }
    };
    const createUser = async () => {
        if (!newUserEmail.trim()) return;
        await fetch(`${API_URL}/api/admin/users`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ email: newUserEmail }) });
        setNewUserEmail(''); fetchData();
    };
    const deleteUser = async (id: string) => {
        if (!confirm('Видалити?')) return;
        await fetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE', headers: getHeaders() });
        fetchData();
    };
    const updateUser = async () => {
        if (!editingUser) return;
        await fetch(`${API_URL}/api/admin/users/${editingUser._id}`, {
            method: 'PUT', headers: getHeaders(),
            body: JSON.stringify({
                email: editingUser.email,
                emailCheckType: editingUser.emailCheckType || 'single',
                accessType: editingUser.accessType || 'paid',
                resetEmailVerification: !editingUser.emailVerifiedAt,
            }),
        });
        setEditingUser(null); fetchData();
    };
    const broadcast = async () => {
        if (!selectedEmails.size) return;
        setBroadcastResult('Надсилаю...');
        const res = await fetch(`${API_URL}/api/admin/broadcast`, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({ emails: [...selectedEmails], type: broadcastType }),
        });
        const d = await res.json();
        setBroadcastResult(`Готово: ${d.results?.filter((r: any) => r.ok).length}/${d.results?.length}`);
    };
    const filtered = users.filter(u => !search || u.email.includes(search.toLowerCase()) || u.status.includes(search));
    const fmt = (s?: string) => s ? new Date(s).toLocaleDateString('uk') : '—';
    if (!token) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <form onSubmit={handleLogin} className="w-full max-w-sm border-2 border-white p-8">
                <h1 className="text-white text-2xl font-black uppercase mb-6">HOLYSTUDIO Admin</h1>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email"
                    className="w-full bg-black border-2 border-white text-white p-3 mb-4 outline-none focus:border-purple-500" />
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Пароль"
                    className="w-full bg-black border-2 border-white text-white p-3 mb-4 outline-none focus:border-purple-500" />
                {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
                <button type="submit" className="w-full bg-purple-600 text-white p-3 font-black uppercase border-2 border-white hover:bg-purple-700">Увійти</button>
            </form>
        </div>
    );
    return (
        <div className="min-h-screen bg-black text-white p-4 pt-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl font-black uppercase">Admin Panel</h1>
                    <button onClick={() => { setToken(null); sessionStorage.removeItem('admin_token'); }}
                        className="text-sm border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">Вийти</button>
                </div>
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                        {([['Всього', stats.totalUsers], ['Оплачено', stats.paidUsers], ['Очікують', stats.pendingUsers],
                          ['Безкоштовні', stats.freeUsers], ['Замовлень', stats.totalOrders], ['Оплачених зам.', stats.paidOrders]] as [string,number][]).map(([l, v]) => (
                            <div key={l} className="border border-white/30 p-3">
                                <div className="text-2xl font-black text-purple-400">{v}</div>
                                <div className="text-xs text-gray-400 uppercase">{l}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setTab('users')} className={`px-4 py-2 font-bold uppercase text-sm border-2 ${tab === 'users' ? 'bg-purple-600 border-purple-600' : 'border-white/30'}`}>Користувачі</button>
                    <button onClick={() => setTab('broadcast')} className={`px-4 py-2 font-bold uppercase text-sm border-2 ${tab === 'broadcast' ? 'bg-purple-600 border-purple-600' : 'border-white/30'}`}>Розсилка</button>
                </div>
                {tab === 'users' && <>
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="Email (безкоштовний доступ)"
                            className="bg-black border-2 border-white/50 text-white p-2 flex-1 min-w-[250px] outline-none focus:border-purple-500" />
                        <button onClick={createUser} className="bg-purple-600 px-6 py-2 font-bold uppercase border-2 border-white hover:bg-purple-700">Додати</button>
                    </div>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук..."
                        className="bg-black border-2 border-white/30 text-white p-2 w-full mb-4 outline-none focus:border-purple-500" />
                    {loading ? <div className="text-gray-400 py-8 text-center">Завантаження...</div> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead><tr className="border-b-2 border-white/30 text-left">
                                    <th className="p-2">Email</th><th className="p-2">Статус</th><th className="p-2">Доступ</th>
                                    <th className="p-2">Перевірка</th><th className="p-2">Верифікація</th><th className="p-2">Створено</th>
                                    <th className="p-2">Оплачено</th><th className="p-2">IP</th><th className="p-2">Дії</th>
                                </tr></thead>
                                <tbody>{filtered.map(u => (
                                    <tr key={u._id} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="p-2 font-mono text-xs">{u.email}</td>
                                        <td className="p-2"><span className={`text-xs font-bold uppercase px-2 py-0.5 ${u.status === 'paid' ? 'bg-green-600/30 text-green-400' : u.status === 'pending' ? 'bg-yellow-600/30 text-yellow-400' : 'bg-red-600/30 text-red-400'}`}>{u.status}</span></td>
                                        <td className="p-2 text-xs">{u.accessType === 'free' ? <span className="text-blue-400">безкошт.</span> : <span className="text-gray-400">платний</span>}</td>
                                        <td className="p-2 text-xs">{u.emailCheckType === 'multi' ? <span className="text-purple-400">багатор.</span> : <span className="text-gray-400">одноразово</span>}</td>
                                        <td className="p-2 text-xs">{u.emailVerifiedAt ? <span className="text-green-400">{fmt(u.emailVerifiedAt)}</span> : <span className="text-gray-500">—</span>}</td>
                                        <td className="p-2 text-xs text-gray-400">{fmt(u.createdAt)}</td>
                                        <td className="p-2 text-xs text-gray-400">{fmt(u.paidAt)}</td>
                                        <td className="p-2 text-xs text-gray-500 font-mono">{u.ip || '—'}</td>
                                        <td className="p-2"><div className="flex gap-1">
                                            <button onClick={() => setEditingUser({...u})} className="text-xs border border-purple-500 text-purple-400 px-2 py-1 hover:bg-purple-600 hover:text-white">✏️</button>
                                            <button onClick={() => deleteUser(u._id)} className="text-xs border border-red-500 text-red-400 px-2 py-1 hover:bg-red-600 hover:text-white">🗑️</button>
                                        </div></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                </>}
                {tab === 'broadcast' && <div>
                    <div className="mb-4 flex gap-3 items-center flex-wrap">
                        <select value={broadcastType} onChange={e => setBroadcastType(e.target.value as any)} className="bg-black border-2 border-white text-white p-2">
                            <option value="reminder">Нагадування</option><option value="access">Доступ</option>
                        </select>
                        <button onClick={broadcast} disabled={!selectedEmails.size} className="bg-purple-600 px-6 py-2 font-bold uppercase border-2 border-white hover:bg-purple-700 disabled:opacity-50">Надіслати ({selectedEmails.size})</button>
                        {broadcastResult && <span className="text-sm text-gray-400">{broadcastResult}</span>}
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setSelectedEmails(new Set(users.filter(u => u.status === 'pending').map(u => u.email)))} className="text-xs border border-yellow-500 text-yellow-400 px-3 py-1">Pending</button>
                        <button onClick={() => setSelectedEmails(new Set(users.map(u => u.email)))} className="text-xs border border-white/50 text-gray-400 px-3 py-1">Всі</button>
                        <button onClick={() => setSelectedEmails(new Set())} className="text-xs border border-white/50 text-gray-400 px-3 py-1">Скинути</button>
                    </div>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                        {users.map(u => (
                            <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-white/5 cursor-pointer">
                                <input type="checkbox" checked={selectedEmails.has(u.email)} onChange={() => {
                                    setSelectedEmails(p => { const n = new Set(p); n.has(u.email) ? n.delete(u.email) : n.add(u.email); return n; });
                                }} className="accent-purple-600" />
                                <span className="font-mono text-sm">{u.email}</span>
                                <span className={`text-xs ${u.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{u.status}</span>
                            </label>
                        ))}
                    </div>
                </div>}
                {editingUser && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-black border-2 border-white p-6 w-full max-w-md">
                        <h2 className="text-xl font-black uppercase mb-4">Редагувати</h2>
                        <div className="space-y-3">
                            <div><label className="text-xs text-gray-400 uppercase block mb-1">Email</label>
                                <input value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                    className="w-full bg-black border-2 border-white/50 text-white p-2 outline-none focus:border-purple-500" /></div>
                            <div><label className="text-xs text-gray-400 uppercase block mb-1">Перевірка email</label>
                                <select value={editingUser.emailCheckType || 'single'} onChange={e => setEditingUser({...editingUser, emailCheckType: e.target.value})}
                                    className="w-full bg-black border-2 border-white/50 text-white p-2">
                                    <option value="single">Одноразова</option><option value="multi">Багаторазова</option>
                                </select></div>
                            <div><label className="text-xs text-gray-400 uppercase block mb-1">Тип доступу</label>
                                <select value={editingUser.accessType || 'paid'} onChange={e => setEditingUser({...editingUser, accessType: e.target.value})}
                                    className="w-full bg-black border-2 border-white/50 text-white p-2">
                                    <option value="paid">Платний</option><option value="free">Безкоштовний</option>
                                </select></div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={!editingUser.emailVerifiedAt}
                                    onChange={e => setEditingUser({...editingUser, emailVerifiedAt: e.target.checked ? undefined : new Date().toISOString()})}
                                    className="accent-purple-600" />
                                <span className="text-sm">Скинути верифікацію email</span>
                            </label>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button onClick={updateUser} className="flex-1 bg-purple-600 p-2 font-bold uppercase border-2 border-white hover:bg-purple-700">Зберегти</button>
                            <button onClick={() => setEditingUser(null)} className="flex-1 p-2 font-bold uppercase border-2 border-white hover:bg-white hover:text-black">Скасувати</button>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}
export default AdminPanel;
