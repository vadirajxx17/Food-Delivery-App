import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Products.css";

function Products({ cart, setCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("");

    const myCategory = useRef(null);

    const fetchProducts = (selectedCategory = "") => {
        setLoading(true);
        setError("");

        axios
            .get("http://localhost:9000/api/GetAllProducts", {
                params: {
                    cat: selectedCategory
                }
            })
            .then((response) => {
                console.log("Products from database:", response.data);
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError("Failed to load products");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCategoryChange = () => {
        const selectedCategory = myCategory.current.value;

        setCategory(selectedCategory);
        fetchProducts(selectedCategory);
    };

    const addToCart = (product) => {
        const exists = cart.some(
            (cartItem) => cartItem.fid === product.fid
        );

        if (exists) {
            alert("Product already exists");
            return;
        }

        setCart((previousCart) => [
            ...previousCart,
            {
                ...product,
                qty: 1
            }
        ]);
    };

    useEffect(() => {
        fetchProducts(category);
    }, []);

    if (loading) {
        return (
            <div className="products-status">
                <h2>Loading products...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-status error">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="products-container">

            <div className="products-top">

                <div>
                    <p className="products-label">FRESH & QUALITY</p>

                    <h1 className="products-heading">
                        Our Products
                    </h1>

                    <p className="products-subheading">
                        Explore our collection and add your favourite
                        products to your cart.
                    </p>
                </div>

                <div className="category-container">
                    <label htmlFor="category">
                        Category
                    </label>

                    <select
                        id="category"
                        ref={myCategory}
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">
                            All Products
                        </option>

                        <option value="fruit">
                            Fruit
                        </option>

                        <option value="food">
                            Food
                        </option>
                        <option value="appliances">
                            appliances
                        </option>
                    </select>
                </div>

            </div>

            {products.length === 0 ? (
                <div className="no-products">
                    <h2>No products found</h2>
                    <p>
                        Try selecting a different category.
                    </p>
                </div>
            ) : (
                <div className="product-grid">

                    {products.map((product) => (

                        <div
                            className="product-card"
                            key={product.fid}
                        >

                            <div className="product-image-container">

                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                />

                            </div>

                            <div className="product-details">

                                <h2 className="product-name">
                                    {product.name}
                                </h2>

                                <p className="product-id">
                                    Product ID: {product.fid}
                                </p>

                                <div className="product-bottom">

                                    <p className="product-price">
                                        ₹{product.price}
                                    </p>

                                    <button
                                        className="add-cart-btn"
                                        onClick={() =>
                                            addToCart(product)
                                        }
                                    >
                                        Add to Cart
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Products;