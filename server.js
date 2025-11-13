import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// مسیر فایل نتایج
const RESULTS_FILE = path.join(process.cwd(), "results.txt");

// اگر فایل وجود نداشت، بساز
if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, "", "utf8");
}


// ذخیره امتیاز
app.post("/save", (req, res) => {
    const { telegramId, score, ip } = req.body;

    if (!telegramId || !score) {
        return res.status(400).json({ success: false, message: "Data missing" });
    }

    // فرمت ذخیره در فایل
    const line = `id:${telegramId} | score:${score} | ip:${ip} | time:${new Date().toISOString()}\n`;

    fs.appendFile(RESULTS_FILE, line, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to save" });
        }
        res.json({ success: true });
    });
});


// دریافت نتایج (فقط برای مدیر)
app.get("/results", (req, res) => {
    const content = fs.readFileSync(RESULTS_FILE, "utf8");
    const lines = content.trim().split("\n").filter(l => l.length > 0);

    const parsed = lines.map(line => {
        const obj = {};
        line.split("|").forEach(part => {
            const [k, v] = part.split(":");
            obj[k.trim()] = v.trim();
        });
        return obj;
    });

    res.json(parsed);
});


// پورت رندر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
