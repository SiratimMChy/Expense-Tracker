
import { signOut } from 'firebase/auth';
import { Home, FileText, ShoppingCart, LogOut, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import auth from '../../firebase/firebase.config';
import { NavLink } from 'react-router';
import { MdDashboard } from 'react-icons/md';
import logo from '../../assets/logo.png'

const Aside = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  }

  return (

    <aside className={`h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-48 md:w-56'} bg-linear-to-b from-base-100 to-base-200 border-r border-base-content/10 flex flex-col shadow-lg transition-all duration-300 z-50`}>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-4 ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'} bg-base-100 border border-base-content/10 rounded-full p-1.5 shadow-md hover:border-base-200 transition-all duration-200 z-20`}
      >
        {isCollapsed ? <ChevronRight size={16} className="text-base-content/60" /> : <ChevronLeft size={16} className="text-base-content/60" />}
      </button>

      {/* Header */}
      <div className="px-5 pt-10 pb-6 border-b border-base-content/10 bg-base-100 shrink-0">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="Expense Tracker Logo" className="w-10 h-10 md:w-12 md:h-12" />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Cashnivo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
              ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
              : 'text-base-content hover:bg-blue-50 hover:text-blue-600'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <Home className='w-5 h-5' />
          {!isCollapsed && <span className="font-medium text-[13px]">Home</span>}
        </NavLink>

        <NavLink
          to="/dashboard/dashboardhome"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
              ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
              : 'text-base-content hover:bg-blue-50 hover:text-blue-600'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <MdDashboard className='w-5 h-5' />
          {!isCollapsed && <span className="font-medium text-[13px]">Dashboard</span>}
        </NavLink>

        <NavLink
          to="/dashboard/add-transaction"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
              ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
              : 'text-base-content hover:bg-blue-50 hover:text-blue-600'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <Plus className='w-5 h-5' />
          {!isCollapsed && <span className="font-medium text-[13px]">Add Transaction</span>}
        </NavLink>

        <NavLink
          to="/dashboard/Profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
              ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
              : 'text-base-content hover:bg-blue-50 hover:text-blue-600'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <FileText className='w-5 h-5' />
          {!isCollapsed && <span className="font-medium text-[13px]">Profile</span>}
        </NavLink>

        <NavLink
          to="/dashboard/MyOrders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
              ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
              : 'text-base-content hover:bg-blue-50 hover:text-blue-600'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <ShoppingCart className='w-5 h-5' />
          {!isCollapsed && <span className="font-medium text-[13px]">My Orders</span>}
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto p-3 border-t border-base-content/10 bg-base-100 shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-base-content hover:bg-red-50 hover:text-red-600 border border-base-content/10 hover:border-red-200 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Aside;