import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.resolve("./data/reviews.json");

app.use(cors());
app.use(express.json());

// 初期化：ファイルがなければ作成
async function initDataFile() {
  const exists = await fs.pathExists(DATA_FILE);
  if (!exists) {
    await fs.ensureDir(path.dirname(DATA_FILE));
    await fs.writeJson(DATA_FILE, {});
  }
}
initDataFile();

// 1) レビュー取得用エンドポイント
app.get("/api/reviews/:club", async (req, res) => {
  const club = req.params.club;
  const data = await fs.readJson(DATA_FILE);
  res.json(data[club] || []);
});

// 2) レビュー追加用エンドポイント
app.post("/api/reviews/:club", async (req, res) => {
  const club = req.params.club;
  const { name, comment, rating } = req.body;
  if (!name || !comment || typeof rating !== "number") {
    return res.status(400).json({ error: "Invalid body" });
  }

  const data = await fs.readJson(DATA_FILE);
  if (!data[club]) data[club] = [];

  const review = {
    name,
    comment,
    rating,
    timestamp: Date.now()
  };
  data[club].push(review);

  await fs.writeJson(DATA_FILE, data, { spaces: 2 });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
