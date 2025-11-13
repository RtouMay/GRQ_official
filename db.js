// ⚠️ این فایل هرگز نباید در دسترس عموم باشد
// اگر روی GitHub Pages هستی باید آن را private نگه داری یا از backend کار کنی

const GITHUB_TOKEN = "<<< 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 >>>";  // ← فقط اینجا توکن رو قرار بده

const REPO_OWNER = "RtouMay";       // اسم یوزر گیت‌هاب تو
const REPO_NAME = "GRQ_official"; // اسم ریپو آزمون
const FILE_PATH = "database.json";  // فایل دیتابیس
const GITHUB_API_URL = `https://api.github.com/repos/${RtouMay}/${GRQ_official}/contents/${database.json}`;


// خواندن دیتابیس
async function getDatabase() {
    const response = await fetch(GITHUB_API_URL, {
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });

    const data = await response.json();
    const content = atob(data.content); 
    return { json: JSON.parse(content), sha: data.sha };
}


// ذخیره دیتابیس
async function updateDatabase(newData, sha) {
    const encoded = btoa(JSON.stringify(newData, null, 2));

    const response = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
            message: "Update quiz database",
            content: encoded,
            sha: sha
        })
    });

    return await response.json();
}

export { getDatabase, updateDatabase };
