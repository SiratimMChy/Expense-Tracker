import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Filter, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Link } from 'react-router';

const Transactions = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        axios.get(`http://localhost:5000/transactions?email=${encodeURIComponent(user.email)}`)
            .then(res => {
                setTransactions(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load transactions.');
                setLoading(false);
            });
    }, [user?.email]);

    const filtered = transactions.filter(t => filter === 'all' || t.type === filter);

    const fmt = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
    const fmtDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const handleDelete = (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        setDeletingId(id);

        axios.delete(`http://localhost:5000/transactions/${id}`)
            .then(() => {
                setTransactions(prev => prev.filter(t => t._id !== id));
                toast.success('Transaction deleted.');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to delete transaction.');
            })
            .finally(() => setDeletingId(null));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 px-3 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Cashnivo
                        </p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Transactions</h1>
                        <p className="mt-1 text-sm text-base-content/60">{transactions.length} total records</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto bg-base-200 border border-base-content/10 rounded-xl px-3 py-2">
                        <Filter size={15} className="text-base-content/40 shrink-0" />
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium focus:outline-none text-base-content"
                        >
                            <option value="all">All Records</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="card bg-base-200 border border-base-content/10 shadow-sm p-4 sm:p-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-14">
                            <div className="w-14 h-14 bg-base-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Activity size={26} className="text-base-content/30" />
                            </div>
                            <p className="text-base-content/50 font-semibold">No records found</p>
                            <p className="text-base-content/30 text-sm mt-1">
                                {filter === 'all'
                                    ? "You haven't added any transactions yet."
                                    : `No ${filter} records to show.`}
                            </p>
                            <Link
                                to="/dashboard/add-transaction"
                                className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                + Add Transaction
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <div className="grid grid-cols-[2rem_2fr_1fr_1fr_7rem_3rem] gap-x-4 px-4 pb-2 text-[10px] uppercase tracking-widest text-base-content/30 font-bold">
                                    <span>#</span>
                                    <span>Details</span>
                                    <span>Category</span>
                                    <span>Date</span>
                                    <span className="text-right">Amount</span>
                                    <span></span>
                                </div>

                                <div className="space-y-1.5">
                                    {filtered.map((t, i) => (
                                        <div
                                            key={t._id}
                                            className="grid grid-cols-[2rem_2fr_1fr_1fr_7rem_3rem] gap-x-4 items-center bg-base-100 hover:bg-base-300/40 border border-base-content/5 hover:border-base-content/10 rounded-xl px-4 py-3 transition-all duration-150"
                                        >
                                            <span className="text-xs text-base-content/30 font-semibold">{i + 1}</span>

                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {t.type === 'income'
                                                        ? <TrendingUp size={14} className="text-green-600" />
                                                        : <TrendingDown size={14} className="text-red-500" />
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-base-content truncate">{t.description || 'No description'}</p>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {t.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="text-sm text-base-content/60 font-medium truncate">{t.category}</span>
                                            <span className="text-sm text-base-content/50">{fmtDate(t.date)}</span>

                                            <span className={`text-right text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </span>

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    disabled={deletingId === t._id}
                                                    className="p-1.5 text-base-content/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    {deletingId === t._id
                                                        ? <span className="loading loading-spinner loading-xs"></span>
                                                        : <Trash2 size={15} />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden space-y-2">
                                {filtered.map((t) => (
                                    <div
                                        key={t._id}
                                        className="flex items-center gap-2.5 bg-base-100 border border-base-content/5 rounded-xl px-3 py-3"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {t.type === 'income'
                                                ? <TrendingUp size={14} className="text-green-600" />
                                                : <TrendingDown size={14} className="text-red-500" />
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-base-content truncate">{t.description || t.category}</p>
                                            <p className="text-[11px] text-base-content/40 truncate">{fmtDate(t.date)} · {t.category}</p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className={`text-[13px] font-bold tabular-nums ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </p>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                disabled={deletingId === t._id}
                                                className="mt-0.5 p-1 text-base-content/30 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                                            >
                                                {deletingId === t._id
                                                    ? <span className="loading loading-spinner loading-xs"></span>
                                                    : <Trash2 size={13} />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;