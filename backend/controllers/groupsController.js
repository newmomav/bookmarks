import { Group } from "../models/Groups.js";
import { User } from "../models/User.js";
import { Bookmark } from "../models/Bookmark.js";

// @desc Get all groups
// @route GET /groups
// @access Private
export const getAllGroups = async (req, res) => {
  try {
    // get all of a group
    const { user } = req.query;
    let query = {};

    if (user) {
      query.user = { $regex: user, $options: "i" };
    }

    // Get all groups from MongoDB
    const groups = await Group.find(query)
      .populate("user", "email")
      .populate("bookmarks")
      .lean();

    // If no groups
    if (!groups?.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).end();
  }
};

// @desc Get one group
// @route GET /groups/:id  -> get it from request parameters(URL)
// may be later JWT token => which means authMiddleware for authorization
// @access Private
export const getGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id)
      .populate("user", "email")
      .populate("bookmarks")
      .lean()
      .exec();

    if (!group) {
      return res.status(404).json({ message: "No group found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new group
// @route POST /groups
// @access Private
export const createGroup = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = "6559e12ee0423cc1f8bf713f";

    // const userId = req.user._id;
    // extract the user's ID from the request JWT

    // Confirm data
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check for duplicate title
    const duplicate = await Group.findOne({ title, user: userId })
      .lean()
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "Group title already exists" });
    }

    // Create new group
    const newGroup = new Group({ title, user: userId });
    await newGroup.save();

    res.status(201).send({ message: `New group '${newGroup.title}' created` });
  } catch (error) {
    console.log(errror);
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a group
// @route PATCH /groups/:id
// @access Private
export const updateGroup = async (req, res) => {
  try {
    const { title } = req.body;
    const id = req.params.id;
    const userId = "hardCoded";
    // const userId = req.user._id;

    // Confirm data
    if (!id || !title) {
      return res.status(400).json({ message: "Title and ID are required" });
    }

    // Confirm group exists to update
    const group = await Group.findById(id).exec();
    if (!group) {
      return res.status(400).json({ message: "Group not found" });
    }

    // Check for duplicate title
    const duplicate = await Group.findOne({
      title,
      user: userId,
      _id: { $ne: id },
    })
      .lean()
      .exec();

    group.title = title;

    const updatedGroup = await group.save();

    res.json(`'${updatedGroup.title}' updated`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a group
// @route DELETE /groups/:id
// @access Private
export const deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;

    // Confirm group exists to delete
    const group = await Group.findById(id).exec();

    if (!group) {
      return res.status(400).json({ message: "Group not found" });
    }
    const result = await group.deleteOne();

    const reply = `Group '${result.title}' with ID ${result._id} deleted`;
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete all groups
// @route DELETE /groups
// @access Private

export const deleteAllGroups = async (req, res) => {
  try {
    const userId = "hardCoded";
    // const userId = req.user._id;
    await Bookmark.deleteMany({ user: userId });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
