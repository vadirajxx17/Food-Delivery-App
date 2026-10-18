import { useState } from "react"
import axios from "axios"
import "./Admin.css"

const initialProduct = {
    fid: "",
    fname: "",
    price: "",
    qty: "",
    imageUrl: "",
    Category: ""
}

const initialUser = {
    cname: "",
    username: "",
    password: "",
    EmailID: ""
}

function Admin() {
    const [activeForm, setActiveForm] = useState("product")
    const [product, setProduct] = useState(initialProduct)
    const [user, setUser] = useState(initialUser)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState(null)

    const updateProduct = (event) => {
        const { name, value } = event.target
        setProduct((currentProduct) => ({ ...currentProduct, [name]: value }))
    }

    const updateUser = (event) => {
        const { name, value } = event.target
        setUser((currentUser) => ({ ...currentUser, [name]: value }))
    }

    const addProduct = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setFeedback(null)

        try {
            await axios.post("http://localhost:9000/api/admin/products", {
                ...product,
                fid: Number(product.fid),
                price: Number(product.price),
                qty: Number(product.qty),
                fname: product.fname.trim(),
                imageUrl: product.imageUrl.trim(),
                Category: product.Category.trim()
            })
            setProduct(initialProduct)
            setFeedback({ type: "success", message: "Product added successfully." })
        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error)
            setFeedback({
                type: "error",
                message: error.response?.data?.message || "Failed to add product."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const addUser = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setFeedback(null)

        try {
            await axios.post("http://localhost:9000/api/admin/users", {
                cname: user.cname.trim(),
                username: user.username.trim(),
                password: user.password,
                EmailID: user.EmailID.trim()
            })
            setUser(initialUser)
            setFeedback({ type: "success", message: "User added successfully." })
        } catch (error) {
            console.error("ADD USER ERROR:", error)
            setFeedback({
                type: "error",
                message: error.response?.data?.message || "Failed to add user."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <p className="admin-eyebrow">FDelivery management</p>
                    <h1>Admin</h1>
                </div>
            </header>

            <nav className="admin-navbar" aria-label="Admin forms">
                <button
                    type="button"
                    className={activeForm === "product" ? "active" : ""}
                    aria-current={activeForm === "product" ? "page" : undefined}
                    onClick={() => {
                        setActiveForm("product")
                        setFeedback(null)
                    }}
                >
                    Add Product
                </button>
                <button
                    type="button"
                    className={activeForm === "user" ? "active" : ""}
                    aria-current={activeForm === "user" ? "page" : undefined}
                    onClick={() => {
                        setActiveForm("user")
                        setFeedback(null)
                    }}
                >
                    Add User
                </button>
            </nav>

            <section className="admin-card">
                <h2>{activeForm === "product" ? "New product" : "New user"}</h2>

                {feedback && (
                    <p className={`admin-feedback ${feedback.type}`} role="status">
                        {feedback.message}
                    </p>
                )}

                {activeForm === "product" ? (
                    <form className="admin-form" onSubmit={addProduct}>
                        <label>
                            Product ID
                            <input
                                name="fid"
                                type="number"
                                min="0"
                                step="1"
                                value={product.fid}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <label>
                            Product name
                            <input
                                name="fname"
                                type="text"
                                maxLength="25"
                                value={product.fname}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <label>
                            Price
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="1"
                                value={product.price}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <label>
                            Quantity
                            <input
                                name="qty"
                                type="number"
                                min="0"
                                step="1"
                                value={product.qty}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <label>
                            Image URL
                            <input
                                name="imageUrl"
                                type="text"
                                maxLength="30"
                                value={product.imageUrl}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <label>
                            Category
                            <input
                                name="Category"
                                type="text"
                                maxLength="15"
                                value={product.Category}
                                onChange={updateProduct}
                                required
                            />
                        </label>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Product"}
                        </button>
                    </form>
                ) : (
                    <form className="admin-form" onSubmit={addUser}>
                        <label>
                            Customer name
                            <input
                                name="cname"
                                type="text"
                                maxLength="20"
                                value={user.cname}
                                onChange={updateUser}
                                required
                            />
                        </label>
                        <label>
                            Username
                            <input
                                name="username"
                                type="text"
                                maxLength="20"
                                autoComplete="username"
                                value={user.username}
                                onChange={updateUser}
                                required
                            />
                        </label>
                        <label>
                            Password
                            <input
                                name="password"
                                type="password"
                                maxLength="10"
                                autoComplete="new-password"
                                value={user.password}
                                onChange={updateUser}
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                name="EmailID"
                                type="email"
                                maxLength="40"
                                autoComplete="email"
                                value={user.EmailID}
                                onChange={updateUser}
                                required
                            />
                        </label>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add User"}
                        </button>
                    </form>
                )}
            </section>
        </main>
    )
}

export default Admin
