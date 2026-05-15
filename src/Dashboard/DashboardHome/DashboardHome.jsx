import { useContext, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { useState } from "react";
import axios from "axios";
import { ArrowDownRight, ArrowUpRight, PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalIncome: 0, totalExpense: 0, balance: 0,
        transactionCount: 0, incomeCount: 0, expenseCount: 0
    });

    useEffect(() => {
        if (!user?.email) return;
        const controller = new AbortController();

        const fetch = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/transactions?email=${encodeURIComponent(user.email)}`,
                    { signal: controller.signal }
                );
                const data = Array.isArray(res.data) ? res.data : [];

                const s = data.reduce((acc, t) => {
                    const amt = parseFloat(t.amount) || 0;
                    if (t.type === 'income') { acc.totalIncome += amt; acc.incomeCount++; }
                    else if (t.type === 'expense') { acc.totalExpense += amt; acc.expenseCount++; }
                    acc.transactionCount++;
                    return acc;
                }, { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, incomeCount: 0, expenseCount: 0 });

                s.balance = s.totalIncome - s.totalExpense;
                setStats(s);
                setTransactions(data.slice(0, 6));
            } catch (err) {
                if (!axios.isCancel(err)) setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [user?.email]);

    const fmt = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
    const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const savingsRate = stats.totalIncome > 0 ? Math.round((stats.balance / stats.totalIncome) * 100) : 0;
    const incomeWidth = stats.totalIncome + stats.totalExpense > 0
        ? Math.min((stats.totalIncome / (stats.totalIncome + stats.totalExpense)) * 100, 100) : 0;

    const statCards = [
        { label: 'Current Balance', value: fmt(stats.balance), sub: `${stats.transactionCount} total transactions`, icon: <Wallet size={22} className="text-white" />, iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', valueClass: stats.balance >= 0 ? 'text-green-600' : 'text-red-500' },
        { label: 'Total Income', value: fmt(stats.totalIncome), sub: `${stats.incomeCount} income entries`, icon: <TrendingUp size={22} className="text-white" />, iconBg: 'bg-green-500', valueClass: 'text-base-content' },
        { label: 'Total Expense', value: fmt(stats.totalExpense), sub: `${stats.expenseCount} expense entries`, icon: <TrendingDown size={22} className="text-white" />, iconBg: 'bg-red-500', valueClass: 'text-base-content' },
        { label: 'Savings Rate', value: `${savingsRate}%`, sub: 'Of total income saved', icon: <PieChart size={22} className="text-white" />, iconBg: 'bg-purple-500', valueClass: 'text-base-content' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 px-4 py-8 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Cashnivo</p>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-base-content/60">Welcome back, <span className="font-semibold text-base-content">{user?.displayName || 'User'}</span>!</p>
                </div>

                {error && <div className="alert alert-error"><span>{error}</span></div>}

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => (
                        <div key={i} className="card bg-base-200 border border-base-content/10 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}>
                                {card.icon}
                            </div>
                            <p className="text-xs uppercase tracking-widest text-base-content/50 font-semibold mb-1">{card.label}</p>
                            <p className={`text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
                            <p className="text-xs text-base-content/40 mt-1">{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Income vs Expense + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Income vs Expense */}
                    <div className="lg:col-span-2 card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h3 className="font-bold text-base-content mb-5">Income vs Expense</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Income', value: stats.totalIncome, color: 'bg-green-500', width: incomeWidth },
                                { label: 'Expense', value: stats.totalExpense, color: 'bg-red-500', width: 100 - incomeWidth },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm font-medium mb-2">
                                        <span className="text-base-content/70">{item.label}</span>
                                        <span className="text-base-content font-bold">{fmt(item.value)}</span>
                                    </div>
                                    <div className="w-full bg-base-300 rounded-full h-2.5">
                                        <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${item.width}%` }}></div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-base-content/10 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">Net Balance</p>
                                    <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(stats.balance)}</p>
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full ${stats.balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {stats.balance >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {savingsRate}% saved
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h3 className="font-bold text-base-content mb-5">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                to="/dashboard/add-transaction"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                <TrendingUp size={18} />
                                Add Income
                            </Link>
                            <Link
                                to="/dashboard/add-transaction"
                                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 text-base-content font-semibold hover:border-blue-400 transition-colors"
                            >
                                <TrendingDown size={18} />
                                Add Expense
                            </Link>
                            <Link
                                to="/dashboard/categories"
                                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 text-base-content font-semibold hover:border-blue-400 transition-colors"
                            >
                                <PieChart size={18} />
                                Manage Categories
                            </Link>

                            <div className="pt-3 border-t border-base-content/10 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-base-content/60">Avg. Income</span>
                                    <span className="font-semibold">{stats.incomeCount > 0 ? fmt(stats.totalIncome / stats.incomeCount) : fmt(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-base-content/60">Avg. Expense</span>
                                    <span className="font-semibold">{stats.expenseCount > 0 ? fmt(stats.totalExpense / stats.expenseCount) : fmt(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-base-content">Recent Transactions</h3>
                        <Link to="/dashboard/transactions" className="text-sm text-blue-600 hover:underline font-medium">View all</Link>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <Wallet size={48} className="text-base-content/20 mx-auto mb-3" />
                            <p className="text-base-content/50 font-medium">No transactions yet</p>
                            <p className="text-base-content/30 text-sm mt-1">Add your first transaction to get started</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="bg-base-300 text-base-content/70 text-xs uppercase tracking-wide">
                                            <th className="px-4 py-3 rounded-tl-lg">#</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((t, i) => (
                                            <tr key={t._id || i} className="border-t border-base-content/5 hover:bg-base-300/30 transition-colors">
                                                <td className="px-4 py-3 text-base-content/40 text-sm">{i + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium">{fmtDate(t.date)}</td>
                                                <td className="px-4 py-3 text-sm font-semibold">{t.category}</td>
                                                <td className="px-4 py-3 text-sm text-base-content/60">{t.description || '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge badge-sm ${t.type === 'income' ? 'badge-success' : 'badge-error'}`}>
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {transactions.map((t, i) => (
                                    <div key={t._id || i} className="bg-base-100 border border-base-content/10 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-sm">{t.category}</p>
                                                <p className="text-xs text-base-content/50">{fmtDate(t.date)}</p>
                                            </div>
                                            <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </p>
                                        </div>
                                        {t.description && <p className="text-xs text-base-content/50">{t.description}</p>}
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

export default DashboardHome;