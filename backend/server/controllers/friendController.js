import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";
import { notifyFriendRequestSent, notifyFriendRequestAccepted, notifyFriendRequestRejected } from "../helpers/notificationHelpers.js";
import { logActivity } from '../services/activityLogService.js';


//send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        console.log("sendFriendRequest called");
        const requesterId = req.user._id;
        const { reciverId } = req.params;

        if (!requesterId || !reciverId) {
            return res.status(400).json({ message: "Both IDs Required" });
        }

        // not send req to yourself
        if (requesterId.toString() === reciverId.toString()) {
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        // user exists
        const reciver = await User.findById(reciverId);
        if (!reciver) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // requester exists
        const requester = await User.findById(requesterId);
        if (!requester) {
            return res.status(404).json({
                message: "Requester not found"
            })
        }

        // already friends 
        const existingFriendship = await Friend.findOne({
            $or: [
                { requesterId: requesterId, reciverId: reciverId },
                { requesterId: reciverId, reciverId: requesterId }
            ]
        });

        if (existingFriendship) {
            if (existingFriendship.status === "accepted") {
                return res.status(400).json({
                    message: "You are already friends with this user"
                });
            }
            if (existingFriendship.status === "pending") {
                if (existingFriendship.requesterId.toString() === requesterId.toString()) {
                    return res.status(400).json({
                        message: "Friend request already sent to this user"
                    });
                } else {
                    return res.status(400).json({
                        message: "This user has already sent you a friend request. Please accept or reject it instead."
                    });
                }
            }
        }

        //send req
        const friendRequest = await Friend.create({
            requesterId,
            reciverId,
            status: "pending",
        })


        //log activity
        await logActivity({
            actor_id: requesterId,
            action: "FRIEND_REQUEST_SENT",
            entity_type: "friend",
            entity_id: friendRequest._id,
            target_user_id: reciverId,
            metadata: {
                requesterName: requester.name,
                reciverName: reciver.name
            }
        })


        //send notification
        notifyFriendRequestSent(friendRequest, requester, reciver).catch(err =>
            console.error('Friend request notification failed:', err)
        );


        return res.status(200).json({
            message: "Friend request sent successfully",
            success: true,
            data: friendRequest
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to sent request",
            error: error.message
        })
    }
}

//accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { friend_id } = req.params;

        if (!friend_id) {
            return res.status(400).json({
                message: "Friend ID is required"
            });
        }

        const friendRequest = await Friend.findOne({
            _id: friend_id,
            status: "pending"
        });

        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found"
            });
        }

        if (friendRequest.expiredAt) {
            return res.status(400).json({
                message: "Friend request expired"
            })
        }


        // Verify the receiver
        if (friendRequest.reciverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this friend request"
            });
        }


        // Check accepter and requester exists 
        const accepter = await User.findById(friendRequest.reciverId);
        const requester = await User.findById(friendRequest.requesterId);


        if (!accepter || !requester) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        //log activity
        await logActivity({
            actor_id: friendRequest.reciverId,
            action: "FRIEND_REQUEST_ACCEPTED",
            entity_type: "friend",
            entity_id: friendRequest._id,
            target_user_id: friendRequest.requesterId,
            metadata: {
                accepterName: accepter.name,
                requesterName: requester.name
            }
        });


        // Update the friend request status
        friendRequest.status = "accepted";
        await friendRequest.save();


        //send notification
        notifyFriendRequestAccepted(friendRequest, accepter, requester).catch(err =>
            console.error('Friend request accepted notification failed:', err)
        );


        return res.status(200).json({
            message: "Friend request accepted successfully",
            success: true,
            data: friendRequest
        });


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}


//reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { friend_id } = req.params;

        if (!friend_id) {
            return res.status(400).json({
                message: "Friend ID is required"
            })
        }

        const friendRequest = await Friend.findOne({
            _id: friend_id,
            status: "pending"
        })

        if (!friendRequest) {
            return res.status(400).json({
                message: "Friend request not found"
            })
        }

        // Verify the receiver
        if (friendRequest.reciverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to reject this friend request"
            });
        }

        //check rejecter and requester exists
        const rejector = await User.findById(friendRequest.reciverId);
        const requester = await User.findById(friendRequest.requesterId);


        //update the friend request status
        friendRequest.status = "rejected";
        friendRequest.expiredAt = null;
        await friendRequest.save();


        //send notification
        if (rejector && requester) {
            notifyFriendRequestRejected(friendRequest, rejector, requester).catch(err =>
                console.error('Friend rejection notification failed:', err)
            );
        }
        return res.status(200).json({
            message: "Friend request rejected successfully",
            success: true,
            data: friendRequest
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reject request",
            error: error.message
        })
    }
}


//delete friend
export const deleteFriendship = async (req, res) => {
    try {
        const { friend_id } = req.params;

        if (!friend_id) {
            return res.status(400).json({
                message: "Friend ID is required"
            })
        }

        //find and delete
        const deletedFriendship = await Friend.findOneAndDelete({
            _id: friend_id,
            status: "accepted"
        });


        if (!deletedFriendship) {
            return res.status(400).json({
                message: "Friend request not found"
            })
        }

        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "FRIEND_REMOVED",
            entity_type: "friend",
            entity_id: deletedFriendship._id,
            target_user_id: deletedFriendship.requesterId.toString() === req.user._id.toString()
                ? deletedFriendship.reciverId
                : deletedFriendship.requesterId,
            metadata: {
                removedBy: req.user._id
            }
        });

        return res.status(200).json({
            message: "Friend delete successfully",
            success: true,
            data: deletedFriendship
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to remove friend",
            error: error.message
        })
    }
}

//get friend list 
export const getFriendList = async (req, res) => {
    try {
        const user_id = req.user._id;

        // find friendship
        const friendships = await Friend.find({
            $or: [
                { requesterId: user_id },
                { reciverId: user_id }
            ],
            status: "accepted"
        })
            .populate('requesterId', 'name email profilePicture')
            .populate('reciverId', 'name email profilePicture')
            .sort({ acceptedAt: -1 });

        // Build friend list with friendshipId
        const friendList = friendships.map(friendship => {
            const isRequester = friendship.requesterId._id.toString() === user_id.toString();
            const friend = isRequester ? friendship.reciverId : friendship.requesterId;

            return {
                _id: friend._id,
                name: friend.name,
                email: friend.email,
                profilePicture: friend.profilePicture,
                friendshipId: friendship._id
            };
        });

        return res.status(200).json({
            success: true,
            message: "Friend list fetched successfully",
            data: { friendList }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get friend list",
            error: error.message
        });
    }
}
