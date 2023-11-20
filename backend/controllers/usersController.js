import { User } from "../models/User.js";
import { Bookmark } from "../models/Bookmark.js";

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = async (req, res) => {
  try {
    // Get all users from MongoDB
    const users = await User.find().select("-password").lean();

    // If no users
    if (!users?.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).end();
  }
};

// @desc Get one user
// @route GET /users/:id get it from request parameters(URL)
// may be later JWT token => which means authMiddleware for authorization
// @access Private
export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Does the user exists?
    const user = await User.findById(id).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new user
// @route POST /users
// @access Private
export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Confirm data
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for dublicates
    const duplicate = await User.findOne({ email }).lean().exec(); //only need to read data and no specific Mongoosefeatures

    if (duplicate) {
      return res.status(409).json({ message: "email is already taken" });
    }

    // Hash password

    // create and store
    // const userObject = { username, password, email };
    // const user = await User.create(userObject);

    // new and safe
    const user = new User({ username, password, email });
    const savedUser = await user.save();

    res
      .status(201)
      .send({ message: `New user ${username} created`, savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a user
// @route PATCH /users/:id (?)
// @access Private
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password, email } = req.body;

    // Confirm data
    if (!id || !username || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Does the user exist to update?
    // const user = await User.findById(id).exec();
    // Does the user exists?
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate email" });
    }

    user.username = username;
    user.email = email;

    if (password) {
      // Hash password
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Does the user have assigned bookmarks/other related data?
    const bookmark = await Bookmark.find({ user: id }).lean().exec();
    if (bookmark) {
      await Bookmark.deleteMany({ user: id });
      //   await Groups.deleteMany({ user: id });
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
