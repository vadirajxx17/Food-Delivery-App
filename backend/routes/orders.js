import myConnection from "../db/mydb.js"
import express from "express"
import nodemailer from "nodemailer"
import process from "node:process"

const route = express.Router()

const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character])

route.post("/sendemail", async (req, res) => {
    const { username, myOrder, orderDetail } = req.body || {}

    if (
        typeof username !== "string" ||
        !username.trim() ||
        !myOrder ||
        typeof myOrder !== "object" ||
        !orderDetail ||
        typeof orderDetail !== "object" ||
        !Array.isArray(orderDetail.orderItems) ||
        orderDetail.orderItems.length === 0 ||
        !Number.isFinite(Number(myOrder.order_amount)) ||
        myOrder.order_amount < 0 ||
        orderDetail.orderItems.some((item) =>
            !item ||
            typeof item !== "object" ||
            !Number.isFinite(Number(item.price)) ||
            Number(item.price) < 0 ||
            !Number.isFinite(Number(item.qty)) ||
            Number(item.qty) <= 0
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "A valid username, order, and order items are required"
        })
    }

    let emailId
    try {
        const [users] = await myConnection.promise().execute(
            "SELECT emailid FROM users WHERE username = ? LIMIT 1",
            [username.trim()]
        )
        emailId = users[0]?.emailid
    } catch (error) {
        console.error("ORDER EMAIL USER LOOKUP ERROR:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to find the user email address"
        })
    }

    if (typeof emailId !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId.trim())) {
        return res.status(404).json({
            success: false,
            message: "No valid email address is registered for this user"
        })
    }

    const emailUser = process.env.EMAIL_USER
    const emailPassword = process.env.EMAIL_PASS
    if (!emailUser || !emailPassword) {
        console.error("EMAIL CONFIGURATION ERROR: EMAIL_USER and EMAIL_PASS must be set")
        return res.status(503).json({
            success: false,
            message: "Email service is not configured"
        })
    }

    const items = orderDetail.orderItems
    const itemRows = items.map((item) => {
        const name = escapeHtml(item.fname || item.fid || "Item")
        const quantity = Number(item.qty)
        const price = Number(item.price)
        return `<tr><td>${name}</td><td>${quantity}</td><td>₹${price.toFixed(2)}</td><td>₹${(price * quantity).toFixed(2)}</td></tr>`
    }).join("")

    const customerName = escapeHtml(myOrder.uname || orderDetail.uname || "Customer")
    const orderAmount = Number(myOrder.order_amount).toFixed(2)
    const status = escapeHtml(myOrder.status || "PLACED")
    const textItems = items.map((item) =>
        `${item.fname || item.fid || "Item"} - ${item.qty} x ₹${Number(item.price).toFixed(2)} = ₹${(Number(item.qty) * Number(item.price)).toFixed(2)}`
    ).join("\n")

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPassword
            }
        })

        await transporter.sendMail({
            from: emailUser,
            to: emailId.trim(),
            subject: "Your FDelivery order details",
            text: `Hello ${myOrder.uname || orderDetail.uname || "Customer"},\n\nYour order (${status}) has been placed.\n\n${textItems}\n\nTotal: ₹${orderAmount}`,
            html: `
                <h2>FDelivery order confirmation</h2>
                <p>Hello ${customerName},</p>
                <p>Your order status is <strong>${status}</strong>.</p>
                <table border="1" cellpadding="8" cellspacing="0">
                    <thead><tr><th>Item</th><th>Quantity</th><th>Price</th><th>Amount</th></tr></thead>
                    <tbody>${itemRows}</tbody>
                    <tfoot><tr><th colspan="3">Total</th><th>₹${orderAmount}</th></tr></tfoot>
                </table>
            `
        })

        return res.status(200).json({
            success: true,
            message: "Order details emailed successfully"
        })
    } catch (error) {
        console.error("ORDER EMAIL ERROR:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to send order email"
        })
    }
})

route.post("/insertOrder", (req, res) => {
    const { myOrder, orderDetail } = req.body
    
    try {
        myConnection.execute(
            "INSERT INTO orders (uname, order_amount, status) VALUES (?, ?, ?)",
            [myOrder.uname, myOrder.order_amount, myOrder.status],
            async (err, result) => {
                if (err) {
                    console.error("ORDER INSERT ERROR:", err)
                    return res.status(500).json({
                        success: false,
                        message: "Failed to place order"
                    })
                }

                const orderId = result.insertId

                if (Array.isArray(orderDetail?.orderItems) && orderDetail.orderItems.length > 0) {
                    for (const order of orderDetail.orderItems) {
                        await myConnection.promise().execute(
                            "INSERT INTO order_items (pid, order_id, qty, price, amount) VALUES (?, ?, ?, ?, ?)",
                            [order.fid, orderId, order.qty, order.price, order.price * order.qty]
                        )
                    }
                }

                return res.json({
                    message: "Inserted Successfully",
                    order_id: orderId,
                    success: true
                })
            }
        )
    } catch (error) {
        console.error("ORDER SUBMISSION ERROR:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to place order"
        })
    }
})

export default route