import express from "express"

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "Smart Stock Alarm Lab API is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});