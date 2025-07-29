const User = require("../models/User");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require('../config/cloudinary');
const Room = require("../models/room");
const  mailTransporter  = require("../config/mailConfig");
require("dotenv").config();




// fetch post like count
exports.fetchpostlike = async (req, res) => {
    try {
      
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });

        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ likes: post.likes || [] });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    } 
};

// fetch all post
exports.fetchallpost = async (req, res) => {
    try {
        // 1️⃣ find all post
        const posts = await Post.find();
        // 2️⃣ return all post
        res.status(200).json({posts , success: true});
    } catch (err) {
        // 3️⃣ if any error occur return error
        res.status(500).json({ message: err.message  });
    }
};


// comment on post
exports.likepost = async (req, res) => {
    try {
        const { postId } = req.body;     
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postImage = await Post.findOne({ public_id: postId });
        

        if (!postImage) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userwhopost = await User.findOne({ email: postImage.email });
        
        if (!userwhopost) {
            return res.status(404).json({ message: 'Post owner not found' });
        }

        // Check if user has images array before accessing it
        if (userwhopost.images && Array.isArray(userwhopost.images)) {
            for (let i = 0; i < userwhopost.images.length; i++) {
                if (userwhopost.images[i].public_id === postId) {
                    if (userwhopost.images[i].likes.includes(currentUser._id)) {
                        return res.status(400).json({ message: 'Post already liked' });
                    }
                    userwhopost.images[i].likes.push(currentUser._id);
                    await userwhopost.save();
                }
            }
        }

        if (postImage.likes.includes(currentUser._id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }    
        
        postImage.likes.push(currentUser._id);
        await postImage.save();

        res.status(200).json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// unlike post
exports.unlikepost = async (req, res) => {
    try {
      const { postId } = req.body;
      const currentUser = await User.findById(req.user._id);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const postImage = await Post.findOne({ public_id: postId });
      if (!postImage) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const userwhopost = await User.findOne({ email: postImage.email });
      if (!userwhopost) {
        return res.status(404).json({ message: 'Post owner not found' });
      }
  
      // Remove from userwhopost.images.likes
      if (userwhopost.images && Array.isArray(userwhopost.images)) {
        for (let i = 0; i < userwhopost.images.length; i++) {
          if (userwhopost.images[i].public_id === postId) {
            const likeIndex = userwhopost.images[i].likes.indexOf(currentUser._id);
            if (likeIndex !== -1) {
              userwhopost.images[i].likes.splice(likeIndex, 1);
              await userwhopost.save();
            } else {
              return res.status(400).json({ message: 'Post not yet liked' });
            }
          }
        }
      }
  
      // Remove from postImage.likes
      const likeIndex = postImage.likes.indexOf(currentUser._id);
      if (likeIndex !== -1) {
        postImage.likes.splice(likeIndex, 1);
        await postImage.save();
      } else {
        return res.status(400).json({ message: 'Post not yet liked' });
      }
  
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  

// post image user
exports.postImage = async (req, res) => {
 
    const user = await User.findById(req.user._id);
 
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Push new image with proper structure
        user.images.push({
            url: req.file.path,
            caption: req.body.caption,
            location: req.body.location, 
            public_id: req.file.filename, // or generate your own ID
            user: user._id,
            likes: [] // Initialize empty likes array
        });

        Post.create({
            userid: user._id,
            email: user.email,
            caption: req.body.caption,
            location: req.body.location,            
            url: req.file.path,
            public_id: req.file.filename,
            likes: [],
            user: user._id
        });       
        await user.save(); 
        res.status(200).json({ 
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: req.file.path
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// User registration controller
exports.register = async(req,res)=>{
    // Destructure required fields from request body
    const { name, email, password, role } = req.body;
   
    
    // Validate required fields
    if(!name || !email || !password) {
        return res.status(400).json({message: "Name, email and password are required"});
    }
 
    try {
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        
        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);
        
        // Create new user in database
        const newUser = await User.create({
            name,
            email,
            password: hashpass,
            role: role || 'user',// Default role is 'user'
        });

    

        // store user in req.user to track which user is currently logged in
        req.user = newUser;

        if (req.user) {
            try {
                // Send welcome email
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: newUser.email,
                    subject: "Welcome to MyHub",
                    text: `Hello ${newUser.name},\n\nThank you for registering on MyHub! We're excited to have you on board.\n\nBest regards,\nMyHub Team`
                };

                await mailTransporter.sendMail(mailOptions);
                console.log("Welcome email sent successfully");
            }catch (error) {
                console.error("Error sending welcome email:", error);
            }
        }
        

        // Generate JWT token for authentication
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Return success response with user data and token
        res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, token });
    } catch (err) {
        // Handle any errors during registration
        res.status(500).json({ message: err.message });
    }
};

// User login controller
exports.login = async (req, res) => {
   
    try {

        // Destructure required fields from request body
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Verify password matches hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        // Store user in request object for middleware
        req.user = user;
        console.log("User logged in:", req.user);

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role, tokenversion:user.tokenversion },process.env.JWT_SECRET ,{ expiresIn: '7d' });

        // Return success response with user data and token
        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
        
    } catch (err) {
        // Handle any errors during login
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token & expiry in user doc (15 mins expiry)
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Hi ${user.name},\n\nClick the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\n– MyHub Team`;

      
    //send password on email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link",
      text: message,
    };
    await mailTransporter.sendMail(mailOptions);

      //redirect to login page
      
      
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }, // ✅ Token still valid?
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // 🔐 Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Update password, clear resetToken, and increment tokenVersion
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    user.tokenVersion += 1; // ✅ FIXED typo (was tokenversion)

    await user.save();

    // ✅ Generate fresh JWT token after password reset
    const jwttoken = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Password has been reset successfully.",
      token: jwttoken, // ✅ Return as "token" (consistent with frontend)
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Server error." });
  }
};



// Get user by name controller
exports.getUser = async (req, res) => {
    try {
        const {  id } = req.params;
        // Find user by either email or userid
        const user = await User.findOne({
            $or: [
                { _id: id }
            ]
        });
        console.log(user);
        if (!user) return res.status(404).json({ message: 'No user found' });
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get loggin user info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'No user found' });
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Follow user controller
exports.followUser = async (req, res) => {
  try {
    // Clean the ID by removing any whitespace or newline characters
    const cleanUserId = req.body.id.trim();

    // Log user IDs for debugging
    console.log("User to follow:", cleanUserId);
    console.log("Current user:", req.user._id);

    // Find both users in database
    const userToFollow = await User.findById(cleanUserId);
    const currentUser = await User.findById(req.user._id);

    // Validate both users exist
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent user from following themselves
    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Update current user's following list
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: userToFollow._id },
    });

    // Update target user's followers list
    await User.findByIdAndUpdate(userToFollow._id, {
      $push: { followers: currentUser._id },
    });

    // Return success response
    res.status(200).json({ message: "Successfully followed user" });
  } catch (err) {
    // Handle any errors during follow operation
    res.status(500).json({ message: err.message });
  }
};

//is following user controller
exports.isFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userToCheck = await User.findById(id);
        if (!userToCheck) {
            return res.status(404).json({ message: "User to check not found" });
        }
        // Check if user is following the target user
        const isFollowing = user.following.includes(userToCheck._id);

        res.json({ isFollowing,currentUser:user.name,userToCheck:userToCheck.name,success:true });
      
    } catch (err) {
        res.status(500).json({ message: err.message,success:false });
    }
};

// Unfollow user controller
exports.unfollowUser = async (req, res) => {
    try {
        // Find both users in database
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        // Validate both users exist
        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if actually following the user
        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        // Remove from current user's following list
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: { following: userToUnfollow._id }
        });

        // Remove from target user's followers list
        await User.findByIdAndUpdate(userToUnfollow._id, {
            $pull: { followers: currentUser._id }
        });

        // Return success response
        res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (err) {
        // Handle any errors during unfollow operation
        res.status(500).json({ message: err.message });
    }
};

// User logout controller
exports.logout = async (req, res) => {
    try {
        // Clear the user data from request object
        req.user = null;
       
        // Return success response
        res.status(200).json({ 
            success: true,
            message: "Logged out successfully" 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.setprofile= async(req,res)=>{
    console.log(req.file?.path);
    try{
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } 
        user.profilePicture = req.file?.path;
        await user.save();
        res.status(200).json({ message: "Profile picture updated successfully" });
    }   
    catch(err){
        res.status(500).json({ message: err.message }); 
    }
}

//update user details
exports.updateUser = async (req, res) => {
    try {
        console.log(req.body);
        console.log("user ki profile file photo", req.file?.path);
        // Find user by ID
        const user = await User.findById(req.user._id); 
        if(!user){
            alert("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        // Update user details
         // user.role = req.body.role || user.role;
        user.name = req.body.name || user.name;      
        user.profilePicture = req.file?.path || user.profilePicture;
        user.bio = req.body.bio || user.bio;
        // Save updated user details
        await user.save();
        res.status(200).json({ message: "User details updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    } 
}

// user ko input ke anusar fetch karna hai
// Controller function
exports.searchUser = async (req, res) => {
    console.log(req.query); // Now using query params instead of body
    try {
        const usertext = req.query.usertext;
        const users = await User.find({
            name: { $regex: usertext, $options: 'i' }
        });
        console.log(users);
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//delete post using public_id
exports.deletePost = async (req, res) => {
    try {
       console.log(req.body.public_id);
    const {public_id} = req.body;
    console.log(public_id);
  
    const post = await Post.findOne({public_id : public_id});
    if(!post){
        return res.status(404).json({ message: "Post not found" });
    }
    

    // delete post from user
    const user = await User.findOneAndUpdate(
        { 'images.public_id': public_id }, // find user having this image
        { $pull: { images: { public_id: public_id } } }, // remove it from images array
        { new: true } // return the updated user document
    );
    if (!user) {
        return res.status(404).json({ message: "User or image not found" });
      }

      //delet from cloudinary
      cloudinary.uploader.destroy(post.public_id, async function(error,result) {
        console.log(result, error);
      });

    // delete post from post collection
      await Post.findByIdAndDelete(post._id);


    res.status(200).json({ message: "Post deleted successfully" });
   }catch(err){
    res.status(500).json({ message: err.message });
   }


}

// Assign room id to both user 
exports.assignRoomId = async (req, res) => {
    try {
       
    
    let { user1, user2 } = req.body;

    // Sanitize
    user1 = user1.trim().toLowerCase();
    user2 = user2.trim().toLowerCase();

    // Generate consistent roomId
    const sortedUsers = [user1, user2].sort();
    const roomId = sortedUsers.join('');

    // Check if room exists
    let room = await Room.findById(roomId);
    if (!room) {
        room = new Room({
            _id: roomId,
            users: sortedUsers,
        });
        await room.save();
        console.log("Room created:", roomId);
    } else {
        console.log("Room already exists:", roomId);
    }

    res.status(200).json({ roomId: room._id, users: room.users });
} catch (err) {
    console.error("Room creation error:", err);
    res.status(500).json({ error: "Server error" });
}
};

//get suggestion of user
exports.getSuggestions = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Find users who are not the current user and not already followed
        const suggestions = await User.find({
            _id: { $ne: user._id, $nin: user.following },
        }).limit(10); // Limit to 10 suggestions
        
        // If no suggestions found, return a message
        if (suggestions.length === 0) {
            return res.status(404).json({ message: "No suggestions available" });
        }
        res.status(200).json({ suggestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


// logout form other devices
exports.logoutFromOtherDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tokenVersion += 1; // Invalidate old tokens
    await user.save();

    return res
      .status(200)
      .json({ message: "Logged out from all other devices successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};