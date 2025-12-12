import express from "express";
import { ensureAuthenticatedAdmin } from "../middleware/checkAuth";

const router = express.Router();

router.get("/", ensureAuthenticatedAdmin, (req, res) => {
    res.render("admin");
});

export default router;