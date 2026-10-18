import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import bodyParser from "body-parser";
import process from "node:process";
import myConnection from "./db/mydb.js";
import authenticator from "./routes/auth.js"
import processOrder from "./routes/orders.js"
import admin from "./routes/admin.js"

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const PORT = 9000;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authenticator)
app.use("/api/orders",processOrder)
app.use("/api/admin", admin)


// Get all products
app.get("/api/GetAllProducts", (req, res) => {
    const category=req.query.cat
    console.log(category)
    console.log("i am here")
    myConnection.query(
        "SELECT * FROM products where Category=?",[category],
        (err, response) => {
            if (err) {
                console.error("DATABASE ERROR:", err);

                return res.status(500).json({
                    message: "Failed to fetch products",
                    error: err.message
                });
            }

            res.status(200).json(response);
        }
    );
});

app.listen(PORT, () => {
    console.log(`SERVER RUNNING AT http://localhost:${PORT}`);
});
