import express from "express";
import { createService, getAllServices, getServiceById, approveService, getMyServices, getPendingServices, deleteService, updateService } from "../controllers/service.controller.js";
import { rejectService } from "../controllers/dashboard.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, multipleUpload, createService);
router.route("/get").get(getAllServices);
router.route("/get/:id").get(getServiceById);
router.route("/approve/:id").put(isAuthenticated, approveService);
router.route("/reject/:id").delete(isAuthenticated, rejectService);
router.route("/my-services").get(isAuthenticated, getMyServices);
router.route("/pending").get(isAuthenticated, getPendingServices);
router.route("/delete/:id").delete(isAuthenticated, deleteService);
router.route("/update/:id").put(isAuthenticated, multipleUpload, updateService);

export default router;