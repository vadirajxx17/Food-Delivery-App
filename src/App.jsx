import { useState } from 'react'
import './App.css'

import Products from './components/Products'
import Cart from './components/Cart'
import Login from './components/Login'
import Admin from './components/Admin'
import Order from './components/Order'
import Invoice from './components/Invoice'
import Address from './components/Address'
import Payment from './components/Payment'

function App() {
  const [cart, setCart] = useState([])
  const [loginStatus, setLoginStatus] = useState(false)
  const [cname, setCname] = useState("")
  const [username, setUsername] = useState("")
  const [orderId, setOrderId] = useState(null)
  const [showOrder, setShowOrder] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

  return (
    <div className="app-container">

      {loginStatus === false ? (
        <Login
          setLoginStatus={setLoginStatus}
          setCname={setCname}
          setUsername={setUsername}
        />
      ) : (
        cname.trim().toLowerCase() === 'admin' ? (
          <Admin />
        ) : (
          <div>

            {!showAddress && !showOrder && !showPayment && (
              <div className="products-section">
                <Products
                  cart={cart}
                  setCart={setCart}
                />
              </div>
            )}

            <div className="cart-section">

              {!showOrder && !showAddress && !showPayment ? (
                <Cart
                  cart={cart}
                  setCart={setCart}
                  cname={cname}
                  username={username}
                  setOrderId={setOrderId}
                  setShowOrder={setShowOrder}
                  setShowAddress={setShowAddress}
                  setShowPayment={setShowPayment}
                />
              ) : showAddress ? (
                <Address
                  setShowAddress={setShowAddress}
                  setShowPayment={setShowPayment}
                  setSelectedAddress={setSelectedAddress}
                />
              ) : showPayment ? (
                <Payment
                  setShowPayment={setShowPayment}
                  setShowOrder={setShowOrder}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                />
              ) : (
                <Invoice
                  cart={cart}
                  cname={cname}
                  orderId={orderId}
                  deliveryAddress={selectedAddress}
                  paymentMethod={selectedPaymentMethod}
                />
              )}

            </div>

          </div>
        )
      )}

    </div>
  )
}

export default App
