import { useState, useEffect } from "react";
import { friendAPI } from "../../api/friendAPI";
import { groupAPI } from "../../api/groupAPI";
import { expenseAPI } from "../../api/expenseAPI";
import { useUser } from "../../context/UserContext";

const AddExpenseModal = ({ isOpen, onClose, onSuccess, defaultFriendId, defaultGroupId, expenseToEdit }) => {
    const { user } = useUser();
    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        expense_type: 'group',
        group_id: '',
        friend_id: '',
        title: '',
        description: '',
        amount: '',
        category: 'food',
        split_type: 'equal',
        split_all: true,
        currency: 'INR'
    });
    const [paidBy, setPaidBy] = useState([{ user_id: '', amount: '' }]);
    const [splitAmong, setSplitAmong] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchFriends();
            fetchGroups();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        } else if (expenseToEdit) {
            setFormData({
                expense_type: expenseToEdit.expense_type,
                group_id: expenseToEdit.group_id || '',
                friend_id: expenseToEdit.friend_id || '',
                title: expenseToEdit.title,
                description: expenseToEdit.description || '',
                amount: expenseToEdit.amount,
                category: expenseToEdit.category,
                split_type: expenseToEdit.split_type,
                split_all: expenseToEdit.split_all,
                currency: expenseToEdit.currency
            });
            if (expenseToEdit.paid_by && expenseToEdit.paid_by.length > 0) {
                const formattedPaidBy = expenseToEdit.paid_by.map(p => ({
                    user_id: p.user_id._id || p.user_id,
                    amount: p.amount
                }));
                setPaidBy(formattedPaidBy);
            }
            if (expenseToEdit.split_among && expenseToEdit.split_among.length > 0) {
                const formattedSplit = expenseToEdit.split_among.map(s => ({
                    user_id: s.user_id._id || s.user_id,
                    amount: s.amount,
                    percentage: s.percentage,
                    shares: s.shares
                }));
                setSplitAmong(formattedSplit);
            } else {
                setSplitAmong([]);
            }
        }
    }, [isOpen, expenseToEdit]);

    // select friend 
    useEffect(() => {
        if (isOpen && !expenseToEdit && (defaultFriendId || defaultGroupId)) {
            setFormData(prev => ({
                ...prev,
                expense_type: defaultGroupId ? 'group' : 'friend',
                friend_id: defaultFriendId || '',
                group_id: defaultGroupId || ''
            }));
        }

    }, [isOpen, defaultFriendId, defaultGroupId, friends, expenseToEdit]);

    useEffect(() => {
        if (formData.expense_type === 'group' && formData.group_id) {
            const selectedGroup = groups.find(g => g._id === formData.group_id);
            if (selectedGroup && selectedGroup.members) {
                setMembers(selectedGroup.members || []);
            }
        } else if (formData.expense_type === 'friend' && (formData.friend_id || defaultFriendId)) {

            const friendId = defaultFriendId || formData.friend_id;
            const selectedFriend = friends.find(f => f.friendshipId === friendId);
            if (selectedFriend && user) {
                setMembers([
                    { _id: user._id, name: user.name, email: user.email },
                    { _id: selectedFriend._id, name: selectedFriend.name, email: selectedFriend.email }
                ]);
            }
        }
        else {
            setMembers([]);
        }
    }, [formData.expense_type, formData.group_id, formData.friend_id, groups, friends, user, defaultFriendId, defaultGroupId]);

    useEffect(() => {
        if (!expenseToEdit && user && paidBy[0].user_id === '') {
            setPaidBy([{ user_id: user._id, amount: formData.amount || '' }]);
        }
    }, [user, formData.amount, expenseToEdit]);

    const fetchFriends = async () => {
        try {
            const response = await friendAPI.getFriends();
            const friendList = response?.data?.data?.friendList || [];
            setFriends(friendList);
        } catch (err) {
            console.error("Fetch friends failed", err);
            setFriends([]);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await groupAPI.getGroups();
            const groupList = response?.data?.data || [];
            setGroups(groupList);
        } catch (err) {
            console.error("Fetch groups failed", err);
            setGroups([]);
        }
    };

    const resetForm = () => {
        setFormData({
            expense_type: 'group',
            group_id: '',
            friend_id: '',
            title: '',
            description: '',
            amount: '',
            category: 'food',
            split_type: 'equal',
            split_all: true,
            currency: 'INR'
        });
        setPaidBy([{ user_id: user?._id || '', amount: '' }]);
        setSplitAmong([]);
        setMembers([]);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'expense_type') {
            setFormData(prev => ({
                ...prev,
                group_id: '',
                friend_id: ''
            }));
            setMembers([]);
            setSplitAmong([]);
        }
    };
    const addPayer = () => {
        setPaidBy([...paidBy, { user_id: '', amount: '' }]);
    };
    const removePayer = (index) => {
        if (paidBy.length > 1) {
            setPaidBy(paidBy.filter((_, i) => i !== index));
        }
    };
    const updatePayer = (index, field, value) => {
        const updated = [...paidBy];
        updated[index][field] = value;
        setPaidBy(updated);
    };
    const toggleSplitMember = (userId) => {
        const exists = splitAmong.find(s => s.user_id === userId);
        if (exists) {
            setSplitAmong(splitAmong.filter(s => s.user_id !== userId));
        } else {
            setSplitAmong([...splitAmong, { user_id: userId }]);
        }
    };

    const updateSplitValue = (userId, field, value) => {
        setSplitAmong(splitAmong.map(s =>
            s.user_id === userId ? { ...s, [field]: parseFloat(value) || 0 } : s
        ));
    };
    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            return false;
        }
        // defaultGroupId  provided
        if (formData.expense_type === 'group' && !formData.group_id && !defaultGroupId) {
            setError('Please select a group');
            return false;
        }
        // defaultFriendId  provided
        if (formData.expense_type === 'friend' && !formData.friend_id && !defaultFriendId) {
            setError('Please select a friend');
            return false;
        }

        const validPayers = paidBy.filter(p => p.user_id && p.amount);
        if (validPayers.length === 0) {
            setError('At least one payer is required');
            return false;
        }

        const totalPaid = validPayers.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        if (Math.abs(totalPaid - parseFloat(formData.amount)) > 0.01) {
            setError(`Total paid (₹${totalPaid}) must equal expense amount (₹${formData.amount})`);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const validPayers = paidBy.filter(p => p.user_id && p.amount).map(p => ({
                user_id: p.user_id,
                amount: parseFloat(p.amount)
            }));

            const payload = {
                title: formData.title,
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category,
                paid_by: validPayers,
                split_type: formData.split_type,
                currency: formData.currency
            };

            // Only add expense_type for new expenses
            if (!expenseToEdit) {
                payload.expense_type = formData.expense_type;
            }

            // Add split_among if not splitting with all
            if (!formData.split_all && splitAmong.length > 0) {
                payload.split_among = splitAmong;
            }

            let response;
            if (expenseToEdit) {
                response = await expenseAPI.editExpense(expenseToEdit._id, payload);
            } else {
                if (formData.expense_type === 'group') {
                    const groupId = defaultGroupId || formData.group_id;
                    response = await expenseAPI.addGroupExpense(groupId, payload);
                } else {
                    const friendId = defaultFriendId || formData.friend_id;
                    response = await expenseAPI.addFriendExpense(friendId, payload);
                }
            }

            if (response?.data?.success) {
                // alert(expenseToEdit ? 'Expense updated successfully!' : 'Expense added successfully!');
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error('Add/Edit expense failed:', err);
            setError(err.response?.data?.message || 'Failed to process expense');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-custom-ink-black">
                        {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Expense Type - Hide if editing */}
                    {!expenseToEdit && !defaultFriendId && !defaultGroupId && (
                        <div>
                            <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                Expense Type *
                            </label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.expense_type === 'group' ? 'border-custom-dark-teal bg-custom-dark-teal/10' : 'border-custom-ash-grey/30 hover:border-custom-dark-teal'}`}>
                                    <input
                                        type="radio"
                                        name="expense_type"
                                        value="group"
                                        checked={formData.expense_type === 'group'}
                                        onChange={handleChange}
                                        className="text-custom-dark-teal focus:ring-custom-dark-teal"
                                    />
                                    <span className="font-semibold">Group</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.expense_type === 'friend' ? 'border-custom-dark-teal bg-custom-dark-teal/10' : 'border-custom-ash-grey/30 hover:border-custom-dark-teal'}`}>
                                    <input
                                        type="radio"
                                        name="expense_type"
                                        value="friend"
                                        checked={formData.expense_type === 'friend'}
                                        onChange={handleChange}
                                        className="text-custom-dark-teal focus:ring-custom-dark-teal"
                                    />
                                    <span className="font-semibold">Friend</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Select Group or Friend - only show selectors if not coming from friend page AND not editing */}
                    {!expenseToEdit && !defaultFriendId && formData.expense_type === 'group' && (
                        <div>
                            <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                Select Group *
                            </label>
                            {defaultGroupId ? (
                                <div className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl bg-gray-50 text-gray-500">
                                    {groups.find(g => g._id === defaultGroupId)?.groupName || 'Selected Group'}
                                </div>
                            ) : (
                                <select
                                    name="group_id"
                                    value={formData.group_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                                >
                                    <option value="">Choose a group</option>
                                    {groups.map((group) => (
                                        <option key={group._id} value={group._id}>{group.groupName}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                    {!expenseToEdit && !defaultFriendId && formData.expense_type === 'friend' && (
                        <div>
                            <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                Select Friend *
                            </label>
                            <select
                                name="friend_id"
                                value={formData.friend_id}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                            >
                                <option value="">Choose a friend</option>
                                {friends.map((friend) => (
                                    <option key={friend._id} value={friend._id}>
                                        {friend.name || 'Unknown'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Dinner at Restaurant"
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add details about this expense"
                            rows={2}
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                            Amount (₹) *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="any"
                            placeholder="0.00"
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                        >
                            <option value="food">Food & Dining</option>
                            <option value="travel">Travel</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="utilities">Utilities</option>
                            <option value="health">Health</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Paid By Section */}
                    <div className="border border-custom-ash-grey/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-custom-air-force-blue">
                                Paid By *
                            </label>
                            <button
                                type="button"
                                onClick={addPayer}
                                className="text-custom-dark-teal text-sm font-semibold hover:underline"
                            >
                                + Add Payer
                            </button>
                        </div>
                        <div className="space-y-3">
                            {paidBy.map((payer, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <select
                                        value={payer.user_id}
                                        onChange={(e) => updatePayer(index, 'user_id', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-custom-ash-grey/30 rounded-lg focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="">Select payer</option>
                                        {user && <option value={user._id}>You ({user.name})</option>}
                                        {members.filter(m => m._id !== user?._id).map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.name || member.email || 'Unknown'}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={payer.amount}
                                        onChange={(e) => updatePayer(index, 'amount', e.target.value)}
                                        placeholder="Amount"
                                        min="0"
                                        step="0.01"
                                        className="w-28 px-3 py-2 border border-custom-ash-grey/30 rounded-lg focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none text-sm"
                                    />
                                    {paidBy.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePayer(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {formData.amount && (
                            <p className="text-xs text-custom-air-force-blue mt-2">
                                Total paid: ₹{paidBy.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)} / ₹{parseFloat(formData.amount || 0).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Split Type */}
                    <div>
                        <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                            Split Type
                        </label>
                        <select
                            name="split_type"
                            value={formData.split_type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                        >
                            <option value="equal">Equal Split</option>
                            <option value="exact">Exact Amounts</option>
                            <option value="percentage">Percentage</option>
                            <option value="shares">Shares</option>
                        </select>
                    </div>

                    {/* Split All Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="split_all"
                            id="split_all"
                            checked={formData.split_all}
                            onChange={handleChange}
                            className="w-4 h-4 text-custom-dark-teal focus:ring-custom-dark-teal rounded"
                        />
                        <label htmlFor="split_all" className="text-sm text-custom-ink-black">
                            Split equally among all members
                        </label>
                    </div>

                    {/* Not Split All */}
                    {!formData.split_all && members.length > 0 && (
                        <div className="border border-custom-ash-grey/30 rounded-xl p-4">
                            <label className="block text-sm font-medium text-custom-air-force-blue mb-3">
                                Split Among
                            </label>
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div key={member._id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={splitAmong.some(s => s.user_id === member._id)}
                                            onChange={() => toggleSplitMember(member._id)}
                                            className="w-4 h-4 text-custom-dark-teal focus:ring-custom-dark-teal rounded"
                                        />
                                        <span className="flex-1 text-sm">{member.name || member.email || 'Unknown'}</span>
                                        {formData.split_type !== 'equal' && splitAmong.some(s => s.user_id === member._id) && (
                                            <input
                                                type="number"
                                                placeholder={formData.split_type === 'percentage' ? '%' : formData.split_type === 'shares' ? 'Shares' : '₹'}
                                                value={(() => {
                                                    const split = splitAmong.find(s => s.user_id === member._id);
                                                    if (!split) return '';
                                                    if (formData.split_type === 'percentage') return split.percentage || '';
                                                    if (formData.split_type === 'shares') return split.shares || '';
                                                    return split.amount || '';
                                                })()}
                                                onChange={(e) => updateSplitValue(member._id, formData.split_type === 'percentage' ? 'percentage' : formData.split_type === 'shares' ? 'shares' : 'amount', e.target.value)}
                                                className="w-24 px-2 py-1 border border-custom-ash-grey/30 rounded-lg text-sm"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-custom-ash-grey/30 rounded-xl font-semibold text-custom-ink-black hover:bg-custom-beige transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-custom-dark-teal text-white rounded-xl font-semibold hover:bg-custom-ink-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {expenseToEdit ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (expenseToEdit ? 'Update Expense' : 'Add Expense')}
                        </button>
                    </div>
                </form>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddExpenseModal;