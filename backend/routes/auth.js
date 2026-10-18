import express from "express";
import myConnection from "../db/mydb.js";

console.log("🔥 AUTH ROUTER LOADED");

const route = express.Router();

route.post("/authenticate", (req, res) => {
    console.log("Received authentication request body:", req.body);
    const { user, password } = req.body || {};

    console.log("Received authentication request:", {
        user
    });

    if (
        typeof user !== "string" ||
        typeof password !== "string" ||
        !user ||
        !password
    ) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    myConnection.query(
        "SELECT cname, username FROM users WHERE username = ? AND password = ?",
        [user, password],
        (error, rows) => {
            if (error) {
                console.error(
                    "AUTHENTICATION DATABASE ERROR:",
                    error
                );

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            return res.status(200).json(rows);
        }
    );
});

export default route;