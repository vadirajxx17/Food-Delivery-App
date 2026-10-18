import { useState } from 'react'
import './Cart.css'
import axios from 'axios'

function Cart({ cart, setCart, cname, username, setOrderId, setShowOrder, setShowAddress, setShowPayment }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const increment = (cartItem) => {
        setCart(previousCart =>
            previousCart.map(item =>
                item.fid === cartItem.fid
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        )
    }

    const decrement = (cartItem) => {
        setCart(previousCart =>
            previousCart
                .map(item =>
                    item.fid === cartItem.fid
                        ? { ...item, qty: item.qty - 1 }
                        : item
                )
                .filter(item => item.qty > 0)
        )
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    )

    const generateOrder = async () => {
        if (!username) {
            alert("Unable to identify the logged-in user")
            return
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        )

        let myOrder = {
            uname: cname,
            order_amount: total,
            status: "PLACED"
        }

        let orderDetail = {
            uname: cname,
            orderItems: cart,
        }

        try {
            setIsSubmitting(true)
            const result = await axios.post(
                "http://localhost:9000/api/orders/insertOrder",
                {
                    myOrder,
                    orderDetail
                }
            )

            if (result.data && result.data.order_id) {
                setOrderId(result.data.order_id)
            }

            try {
                await axios.post(
                    "http://localhost:9000/api/orders/sendemail",
                    {
                        username,
                        myOrder,
                        orderDetail
                    }
                )
                alert("Order placed and details emailed successfully")
            } catch (emailError) {
                console.error("Order email error:", emailError)
                alert("Order placed, but the confirmation email could not be sent")
            }

            // Move to the address selection screen as the next step
            setShowAddress(true)
            setShowPayment(false)
            setShowOrder(false)

        } catch (error) {

            console.error("Order submission error:", error)
            alert("Failed to place order")

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="cart-container">

            <h1 style={{ color: 'red' }}>
                Welcome - {cname}
            </h1>

            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span>{cart.length} Items</span>
            </div>

            {cart.length === 0 ? (

                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started.</p>
                </div>

            ) : (

                <>

                    <div className="cart-list">

                        {cart.map(cartItem => (

                            <div
                                className="cart-item"
                                key={cartItem.fid}
                            >

                                <div className="product-info">

                                    <div className="product-image">
                                        {cartItem.fname}
                                    </div>

                                    <div>
                                        <h3>{cartItem.fname}</h3>

                                        <p>
                                            Product ID: {cartItem.fid}
                                        </p>
                                    </div>

                                </div>

                                <div className="product-price">
                                    ₹{cartItem.price}
                                </div>

                                <div className="quantity-control">

                                    <button
                                        onClick={() => decrement(cartItem)}
                                        className="quantity-btn"
                                    >
                                        −
                                    </button>

                                    <span>{cartItem.qty}</span>

                                    <button
                                        onClick={() => increment(cartItem)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>

                                </div>

                                <div className="item-total">
                                    ₹{cartItem.price * cartItem.qty}
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <strong>₹{total}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <strong className="free">
                                FREE
                            </strong>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>₹{total}</strong>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={generateOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Placing Order..." : "Confirm Order"}
                        </button>

                    </div>

                </>

            )}

        </div>
    )
}

export default Cart
