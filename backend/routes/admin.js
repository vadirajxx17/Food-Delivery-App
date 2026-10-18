import express from "express"
import myConnection from "../db/mydb.js"

const route = express.Router()

const isNonEmptyString = (value, maxLength) =>
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength

const isNonNegativeInteger = (value) =>
    Number.isSafeInteger(value) && value >= 0

route.post("/products", async (req, res) => {
    const { fid, fname, price, qty, imageUrl, Category } = req.body || {}

    if (
        !isNonNegativeInteger(fid) ||
        !isNonEmptyString(fname, 25) ||
        !isNonNegativeInteger(price) ||
        !isNonNegativeInteger(qty) ||
        !isNonEmptyString(imageUrl, 30) ||
        !isNonEmptyString(Category, 15)
    ) {
        return res.status(400).json({
            success: false,
            message: "All product fields are required and must match the database column limits"
        })
    }

    try {
        await myConnection.promise().execute(
            "INSERT INTO products (fid, fname, price, qty, imageUrl, Category) VALUES (?, ?, ?, ?, ?, ?)",
            [fid, fname.trim(), price, qty, imageUrl.trim(), Category.trim()]
        )

        return res.status(201).json({
            success: true,
            message: "Product added successfully"
        })
    } catch (error) {
        console.error("ADD PRODUCT DATABASE ERROR:", error)
        return res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
            success: false,
            message: error.code === "ER_DUP_ENTRY"
                ? "A product with this ID already exists"
                : "Failed to add product"
        })
    }
})

route.post("/users", async (req, res) => {
    const { cname, username, password, EmailID } = req.body || {}

    if (
        !isNonEmptyString(cname, 20) ||
        !isNonEmptyString(username, 20) ||
        !isNonEmptyString(password, 10) ||
        !isNonEmptyString(EmailID, 40) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailID.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "All user fields are required and must match the database column limits"
        })
    }

    try {
        await myConnection.promise().execute(
            "INSERT INTO users (cname, username, password, EmailID) VALUES (?, ?, ?, ?)",
            [cname.trim(), username.trim(), password, EmailID.trim()]
        )

        return res.status(201).json({
            success: true,
            message: "User added successfully"
        })
    } catch (error) {
        console.error("ADD USER DATABASE ERROR:", error)
        return res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
            success: false,
            message: error.code === "ER_DUP_ENTRY"
                ? "A user with this username or email already exists"
                : "Failed to add user"
        })
    }
})

export default route
