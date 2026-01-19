import redis from '../config/redis.js';

const DEFAULT_TTL = parseInt(process.env.REDIS_TTL_DEFAULT) || 172800; // 2 day

const isRedisAvailable = () => {
    return redis.status === 'ready' || redis.status === 'connect';
};
export const getCache = async (key) => {
    if (!isRedisAvailable()) {
        return null;
    }
    try {
        const data = await redis.get(key);
        if (data) {
            console.log(`Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`Cache MISS: ${key}`);
        return null;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null;
    }
};

//set data in cache

export const setCache = async (key, data, ttl = DEFAULT_TTL) => {
    if (!isRedisAvailable()) {
        return false;
    }
    try {
        await redis.setex(key, ttl, JSON.stringify(data));
        console.log(`Cache SET: ${key} (TTL: ${ttl}s)`);
        return true;
    } catch (error) {
        console.error('Error setting cache:', error);
        return false;
    }
};

//delete specific data from cache
export const deleteCache = async (key) => {
    if (!isRedisAvailable()) {
        return false;
    }
    try {
        await redis.del(key);
        console.log(`Cache DELETED: ${key}`);
        return true;
    } catch (error) {
        console.error('Error deleting cache:', error);
        return false;
    }
};


// Cache key 
export const cacheKeys = {
    // User-related keys
    userProfile: (userId) => `user:profile:${userId}`,
    userDashboard: (userId) => `user:dashboard:${userId}`,
    userBalance: (userId) => `user:balance:${userId}`,
    userGroups: (userId) => `user:groups:${userId}`,
    userFriends: (userId) => `user:friends:${userId}`,

    // Group-related keys
    groupSummary: (groupId) => `group:summary:${groupId}`,
    groupMembers: (groupId) => `group:members:${groupId}`,
    groupExpenses: (groupId) => `group:expenses:${groupId}`,

    // Auth-related keys
    otp: (email) => `otp:${email}`,
};
