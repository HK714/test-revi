import express from "express";
import Review from "../models/reviewModel.js";

const router = express.Router();

// GET: 部活ごとのレビュー取得
router.get("/:club", async (req, res) => {
  try {
    const club = req.params.club;
    const reviews = await Review.find({ club }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST: レビュー投稿
router.post("/:club", async (req, res) => {
  try {
    const club = req.params.club;
    const { name, comment, rating } = req.body;
    const review = new Review({ club, name, comment, rating });
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ error: "Failed to post review" });
  }
});

// PUT: レビュー更新（例：編集機能）
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, comment, rating } = req.body;
    const review = await Review.findByIdAndUpdate(id, { name, comment, rating }, { new: true });
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ error: "Failed to update review" });
  }
});

// DELETE: レビュー削除
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete review" });
  }
});

export default router;
