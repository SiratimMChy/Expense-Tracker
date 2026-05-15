import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Aside from '../Aside/Aside';

const DashboardLayout = () => {

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);


    return (
        <div className="min-h-screen bg-base-200">
            <div className='flex'>

                <Aside />
                <div className='flex-1 p-2 overflow-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;