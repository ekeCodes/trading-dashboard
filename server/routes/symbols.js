import express from "express";
import { getSymbols, addSymbol } from "../controllers/symbolsController.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getSymbols);
router.post("/add-symbol", isAdmin, addSymbol);

export default router;
