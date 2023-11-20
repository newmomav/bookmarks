import { Bookmark } from "../models/Bookmark.js";
import { User } from "../models/User.js";
import { Group } from "../models/Groups.js";

// @desc Get all bookmarks
// @route GET /bookmarks
// @access Private
export const getAllBookmarks = async (req, res) => {
  try {
    // get all of a group
    const { title, url, group } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (url) {
      query.url = { $regex: url, $options: "i" };
    }
    if (group) {
      query.group = group;
    }

    // Get all bookmarks from MongoDB
    const bookmarks = await Bookmark.find(query)
      .populate("user", "email")
      .populate("group")
      .lean();

    // If no bookmarks
    if (!bookmarks?.length) {
      return res.status(200).json([]);
    }

    // Add username to each bookmark before sending the response
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop
    // const bookmarksWithUser = await Promise.all(
    //   bookmarks.map(async (bookmark) => {
    //     const user = await User.findById(bookmark.user).lean().exec();
    //     return { ...bookmark, username: user.email }; //or id?
    //   })
    // );

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).end();
  }
};

// @desc Get one bookmark
// @route GET /bookmarks/:id  -> get it from request parameters(URL)
// may be later JWT token => which means authMiddleware for authorization
// @access Private
export const getBookmark = async (req, res) => {
  try {
    const id = req.params.id;

    const bookmark = await Bookmark.findById(id)
      .populate("user", "email")
      .populate("group")
      .lean()
      .exec();

    if (!bookmark) {
      return res.status(404).json({ message: "No bookmark found" });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new bookmark
// @route POST /bookmarks
// @access Private
export const createBookmark = async (req, res) => {
  try {
    const { url, title, user, group: groupTitle } = req.body;
    // const userId = req.user._id; extract the user's ID from the request JWT

    // Confirm data
    if (!url || !title) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for dublicates
    const duplicate = await Bookmark.findOne({ title }).lean().exec(); //only need to read data and no specific Mongoosefeatures

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate bookmark title" });
    }

    let groupId = null;
    if (groupTitle) {
      // Check if group exists or create new one
      let group = await Group.findOne({
        title: groupTitle,
        user: user, //userId
      }).exec();

      if (!group) {
        group = await Group.create({ title: groupTitle, user: user }); //userId
      }
      groupId = group._id;
    }

    const bookmark = new Bookmark({ url, title, user, group: groupId });

    const savedBookmark = await bookmark.save();

    if (groupId) {
      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { bookmarks: savedBookmark._id },
      });
    }

    res.status(201).send({ message: `New bookmark created`, savedBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a bookmark
// @route PATCH /bookmarks/:id
// @access Private
export const updateBookmark = async (req, res) => {
  try {
    const { title, url, groupTitles } = req.body;
    const id = req.params.id;
    const userId = "6559e12ee0423cc1f8bf713f";
    // const userId = req.user._id;

    // Confirm data
    if (!title || !url) {
      return res.status(400).json({ message: "Title an URL are required" });
    }

    // Confirm bookmark exists to update
    const bookmark = await Bookmark.findById(id).exec();
    if (!bookmark) {
      return res.status(400).json({ message: "Bookmark not found" });
    }

    // Check for duplicate title
    const duplicate = await Bookmark.findOne({ title, _id: { $ne: id } })
      .lean()
      .exec();

    bookmark.url = url;
    bookmark.title = title;

    if (Array.isArray(groupTitles) && groupTitles.length) {
      let groupIds = [];
      for (const title of groupTitles) {
        let group = await Group.findOne({ title, user: userId }).exec();
        if (!group) {
          group = new Group({ title, user: userId });
          await group.save();
        }
        groupIds.push(group._id);
      }

      bookmark.group = groupIds;
    }

    const updatedBookmark = await bookmark.save();
    res.json(`'${updatedBookmark.title}' updated`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a bookmark
// @route DELETE /bookmarks/:id
// @access Private
export const deleteBookmark = async (req, res) => {
  try {
    const id = req.params.id;

    // Confirm bookmark exists to delete
    const bookmark = await Bookmark.findById(id).exec();

    if (!bookmark) {
      return res.status(400).json({ message: "Bookmark not found" });
    }
    const result = await bookmark.deleteOne();

    const reply = `Bookmark '${result.title}' with ID ${result._id} deleted`;
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete all bookmarks
// @route DELETE /bookmarks
// @access Private

export const deleteAllBookmarks = async (req, res) => {
  try {
    const userId = "hardCoded";
    // const userId = req.user._id;
    await Bookmark.deleteMany({ user: userId });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
