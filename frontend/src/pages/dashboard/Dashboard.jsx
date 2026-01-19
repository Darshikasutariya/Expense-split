import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import UserAvatar from '../../components/common/UserAvatar';
import Settings from './Settings';
import Overview from './Overview';
import Groups from './Groups';
import Friends from './Friends';
import Balances from './Balances';
import Activity from './Activity';
import { authAPI } from '../../api';
import { groupAPI } from '../../api/groupAPI';
import { friendAPI } from '../../api/friendAPI';
import AddGroupModal from "../../components/models/AddGroupModal";
import AddFriendModal from '../../components/models/AddFriendModal';
import AddExpenseModal from '../../components/models/AddExpenseModel';
import SettleUpModal from '../../components/models/SettleUpModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showFriendModal, setShowFriendModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);


    const [groups, setGroups] = useState([]);
    const [friends, setFriends] = useState([]);

    const fetchGroups = async () => {
        try {
            const response = await groupAPI.getGroups();
            if (response.data && response.data.data) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await friendAPI.getFriends();
            const friendList = response?.data?.data?.friendList || [];
            setFriends(friendList);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchFriends();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, setUser } = useUser();

    const sidebarItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        },
        {
            id: 'groups',
            label: 'Groups',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        },
        {
            id: 'friends',
            label: 'Friends',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        },
        {
            id: 'balances',
            label: 'Balances',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
        },
        {
            id: 'activity',
            label: 'Activity',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        }
    ];
    const getSectionDescription = () => {
        const descriptions = {
            'overview': 'Welcome back! Here\'s your financial overview',
            'groups': 'Manage your expense groups',
            'friends': 'Manage your friends and shared expenses',
            'balances': 'See who owes what',
            'activity': 'Recent activity feed',
            'settings': 'Manage your preferences'
        };
        return descriptions[activeSection] || '';
    };

    const handleLogout = async () => {
        const res = await authAPI.logout();
        if (res.status === 200) {
            navigate('/');

            console.log("Logged out successfully", res);
        }
    };


    //model handle
    const handleAddFriend = (data) => {
        alert('Friend request sent!');
        console.log("Add Friended:", data);
        fetchFriends();
    }
    const handleAddGroup = (data) => {
        alert('Group created successfully!');
        console.log("Add Grouped:", data);
        fetchGroups();
    }
    const handleAddExpense = (data) => {
        console.log('Add expense:', data);
        alert('Expense added successfully!');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <Overview />;
            case 'groups':
                return <Groups groups={groups} onCreateGroup={() => setShowGroupModal(true)} onGroupUpdate={fetchGroups} />;
            case 'friends':
                return <Friends friends={friends} onAddFriend={() => setShowFriendModal(true)} />;
            case 'balances':
                return <Balances />;
            case 'activity':
                return <Activity />;
            case 'settings':
                return <Settings />;
            default:
                return <Overview />;
        }
    };
    return (
        <div className="min-h-screen bg-custom-beige flex">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-custom-ash-grey/30 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
                {/* Logo Section with Collapse */}
                <div className="p-6 border-b border-custom-ash-grey/30">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <svg className={`w-5 h-5 text-custom-air-force-blue transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === item.id
                                ? 'bg-custom-dark-teal text-white shadow-md'
                                : 'text-custom-air-force-blue hover:bg-custom-beige'
                                }`}
                            title={sidebarCollapsed ? item.label : ''}
                        >
                            <span className={activeSection === item.id ? 'text-white' : ''}>{item.icon}</span>
                            {!sidebarCollapsed && (
                                <span className="font-semibold">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-b border-custom-ash-grey/30">
                    <div className="flex items-center gap-3">
                        <UserAvatar name={user?.name} profilePicture={user?.profilePicture} size="md" />
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-custom-ink-black text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-custom-air-force-blue truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-custom-ash-grey/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                        title={sidebarCollapsed ? 'Logout' : ''}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!sidebarCollapsed && <span className="font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-custom-ash-grey/30 sticky top-0 z-30 backdrop-blur-md bg-white/90">
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-custom-ink-black capitalize">{activeSection}</h2>
                                <p className="text-sm text-custom-air-force-blue mt-1">
                                    {getSectionDescription()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* add expence */}
                                {(activeSection === 'groups' || activeSection === 'friends') && (
                                    <button
                                        onClick={() => setShowExpenseModal(true)}
                                        className="bg-custom-dark-teal text-white px-4 py-2 rounded-xl font-semibold hover:bg-custom-ink-black transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Expense
                                    </button>
                                )}
                                <button className="p-3 hover:bg-custom-beige rounded-xl transition-colors relative">
                                    <svg className="w-6 h-6 text-custom-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8">
                    {renderContent()}
                </div>
            </main>

            {/* Modals */}
            <AddGroupModal
                isOpen={showGroupModal}
                onClose={() => setShowGroupModal(false)}
                onSubmit={handleAddGroup}
            />
            <AddFriendModal
                isOpen={showFriendModal}
                onClose={() => setShowFriendModal(false)}
                onSubmit={handleAddFriend}
            />
            <AddExpenseModal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                onSubmit={handleAddExpense}
            />
            {/* <SettleUpModal/> */}
        </div>
    );
}
export default Dashboard;