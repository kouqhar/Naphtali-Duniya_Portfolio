const router = require("express").Router();
const multer = require("multer");

// Load Middleware
const { authSuperAdmin } = require("../middleware/auth");

// Load Controllers
const {
  getSuperAdminProfile,
  createSuperAdminProfile,
  addSuperAdminProject,
  updateSuperAdminProject,
  deleteSuperAdminProject,
  diskStorageDestination,
} = require("../controllers/super_admin_profile");

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
  url = url.split("/")[2];

  if (file.mimetype && imageMime.test(file.mimetype) && url === "add_project")
    cb(null, true);
  else cb(new Error("Invalid url path of file mimetype!"), false);
};

const fileUploadFunc = multer({
  storage: fileStorage,
  fileFilter,
});
const fileUpload = fileUploadFunc.single("uploadFile");

// @route   GET /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile
// @desc    Get Current super admin' s profile
// @access  Private
router.get("/", authSuperAdmin, getSuperAdminProfile);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile
// @desc    Create or edit super admin profile
// @access  Private
router.post("/", authSuperAdmin, createSuperAdminProfile);

// @route   POST /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile/project/add_project
// @desc    Add new project to the super admin profile
// @access  Private
router.post(
  "/project/add_project",
  [authSuperAdmin, fileUpload],
  addSuperAdminProject
);

// @route   PUT /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile/project/update_project/:project_id
// @desc    Update super admin project
// @access  Private
router.put(
  "/project/update_project/:project_id",
  authSuperAdmin,
  updateSuperAdminProject
);

// @route   DELETE /api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_profile/project/delete_project/:project_id
// @desc    Delete a super admin project
// @access  Private
router.delete(
  "/project/delete_project/:project_id",
  authSuperAdmin,
  deleteSuperAdminProject
);

module.exports = router;
