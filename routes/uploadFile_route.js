const router = require("express").Router();
const multer = require("multer");

// Load middleware
const { auth } = require("../middleware/auth");
const { isUserProfile } = require("../middleware/isUserMiddleware");

// Load Controllers
const {
  diskStorageDestination,
  getFile,
  getFileById,
  uploadFile,
  uploadFiles,
  updateFile,
  deleteFile,
  getStory,
  getStoryById,
  uploadStory,
  deleteStory,
  getStoryHistory,
} = require("../controllers/uploadFile");

/*      ***********************
// Initialize multer storage for single files
**********************       */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    const folderName = fileType.charAt(0).toUpperCase() + fileType.substr(1);

    diskStorageDestination(req, file, cb, folderName);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, new Date().toISOString() + originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let { url } = req;
  const imageMime = /image[/](?=[a-z]){3,30}/g;
  const audioMime = /audio[/][\w+]{2,30}/g;
  const videoMime = /video[/][\w+]{2,30}/g;
  url = url.split("/")[2];

  if (file.mimetype && imageMime.test(file.mimetype) && url === "image")
    cb(null, true);
  else if (file.mimetype && audioMime.test(file.mimetype) && url === "audio")
    cb(null, true);
  else if (file.mimetype && videoMime.test(file.mimetype) && url === "video")
    cb(null, true);
  else cb(new Error("Invalid url path of file mimetype!"), false);
};

const fileUploadFunc = multer({
  storage: fileStorage,
  fileFilter,
});
const fileUpload = fileUploadFunc.single("uploadFile");

/*      ***********************
// Initialize multer storage for multiple files
**********************       */
const filesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    const folderName =
      fileType.charAt(0).toUpperCase() + fileType.substr(1) + "s";

    diskStorageDestination(req, file, cb, folderName);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, new Date().toISOString() + originalname);
  },
});

const filesFilter = (req, file, cb) => {
  let { url } = req;
  const imageMime = /image[/](?=[a-z]){3,30}/g;
  const audioMime = /audio[/][\w+]{2,30}/g;
  const videoMime = /video[/][\w+]{2,30}/g;
  url = url.split("/")[2];

  if (file.mimetype && imageMime.test(file.mimetype) && url === "images")
    cb(null, true);
  else if (file.mimetype && audioMime.test(file.mimetype) && url === "audios")
    cb(null, true);
  else if (file.mimetype && videoMime.test(file.mimetype) && url === "videos")
    cb(null, true);
  else cb(new Error("Invalid url path of file mimetype!"), false);
};

const filesUploadFunc = multer({
  storage: filesStorage,
  fileFilter: filesFilter,
});
const filesUpload = filesUploadFunc.array("uploadFiles");

/*      ***********************
// Initialize multer storage for story files
**********************       */
const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = "Story";
    diskStorageDestination(req, file, cb, folderName);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, new Date().toISOString() + originalname);
  },
});

const storyFilter = (req, file, cb) => {
  const storyMime = /[image|video][/][\w+]{2,30}/g;
  if (!storyMime.test(file.mimetype))
    cb(new Error("Please upload a file with a valid mimetype!"), false);
  else cb(null, true);
};

const uploadStoryFile = multer({
  storage: storyStorage,
  fileFilter: storyFilter,
});
const storyUpload = uploadStoryFile.single("uploadStory");

/**************************** General Route ***************************/

// @route   GET /api/upload/:collection_name
// @desc    Get File
// @access  Private
router.get("/:collection_name", [auth, isUserProfile], getFile);

// @route   GET /api/upload/:collection_name/:userId/:file_id
// @desc    Get File by id
// @access  Private
router.get(
  "/:collection_name/:userId/:file_id",
  [auth, isUserProfile],
  getFileById
);

// @route   POST /api/upload/file_upload/:upload_type
// @desc    Upload a Single file
// @access  Private
router.post(
  "/file_upload/:upload_type",
  [auth, isUserProfile, fileUpload],
  uploadFile
);

// @route   POST /api/upload/files_upload/:upload_type
// @desc    Upload Multiple files
// @access  Private
router.post(
  "/files_upload/:upload_type",
  [auth, isUserProfile, filesUpload],
  uploadFiles
);

// @route   PUT /api/upload/:collection_name/:file_id
// @desc    Update File
// @access  Private
router.put("/:collection_name/:file_id", [auth, isUserProfile], updateFile);

// @route   DELETE /api/upload/:collection_name/:id
// @desc    Delete File
// @access  Private
router.delete("/:collection_name/:id", [auth, isUserProfile], deleteFile);

/************************* Story Route ***********************/

// @route   GET /api/upload/story
// @desc    Get Story
// @access  Private
router.get("/story", [auth, isUserProfile], getStory);

// @route   GET /api/upload/story/:id
// @desc    Get Story by id
// @access  Private
router.get("/story/:id", [auth, isUserProfile], getStoryById);

// @route   GET /api/upload/story/history
// @desc    Get Story History
// @access  Private
router.get("/story/history", [auth, isUserProfile], getStoryHistory);

// @route   POST /api/upload/story
// @desc    Upload Story
// @access  Private
router.post("/story", [auth, isUserProfile, storyUpload], uploadStory);

// @route   DELETE /api/upload/story/;id
// @desc    Delete story by id
// @access  Private
router.delete("/story/:id", [auth, isUserProfile], deleteStory);

module.exports = router;
