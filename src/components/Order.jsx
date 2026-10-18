function Order({ cart, cname, orderId, deliveryAddress, paymentMethod }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const invoiceNumber = `FD-${orderId ?? Math.floor(100000 + Math.random() * 900000)}`
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const myOrder = {
    uname: cname,
    order_amount: total,
    status: "PLACED"
  }

  const orderDetail = {
    uname: cname,
    orderItems: cart,
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <style>{`
        @media print {
          body {
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
          .invoice-print {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            background: #fff !important;
            color: #111 !important;
            max-width: 100% !important;
            padding: 20px !important;
          }
          .invoice-print * {
            color: #111 !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.container} className="invoice-print">
          <div style={styles.headerRow}>
            <div>
              <p style={styles.label}>Invoice</p>
              <h1 style={styles.heading}>FDelivery</h1>
            </div>

            <div style={styles.buttonGroup} className="no-print">
              <button
                type="button"
                onClick={handlePrint}
                style={styles.printButton}
              >
                Print / Save PDF
              </button>

            </div>
          </div>

          <div style={styles.invoiceMeta}>
            <div>
              <span style={styles.metaLabel}>Customer</span>
              <strong>{myOrder.uname}</strong>
            </div>
            <div>
              <span style={styles.metaLabel}>Invoice No.</span>
              <strong>{invoiceNumber}</strong>
            </div>
            <div>
              <span style={styles.metaLabel}>Date</span>
              <strong>{invoiceDate}</strong>
            </div>
            <div>
              <span style={styles.metaLabel}>Status</span>
              <strong>{myOrder.status}</strong>
            </div>
          </div>

          <div style={styles.addressPaymentBox}>
            <div style={styles.infoCard}>
              <span style={styles.metaLabel}>Delivery Address</span>
              <strong>{deliveryAddress || 'No address selected'}</strong>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.metaLabel}>Payment Method</span>
              <strong>{paymentMethod?.name || paymentMethod || 'Not selected'}</strong>
              {paymentMethod?.accountDetail && (
                <span>
                  {paymentMethod.accountLabel}: {paymentMethod.accountDetail}
                </span>
              )}
            </div>
          </div>

          <div style={styles.summary}>
            <div>
              <span style={styles.label}>Order Total</span>
              <span style={styles.amount}>₹{myOrder.order_amount}</span>
            </div>

            <span style={styles.status}>{myOrder.status}</span>
          </div>

          <h3 style={styles.subHeading}>Order Details</h3>

          <div style={styles.orderList}>
            {orderDetail.orderItems.map((item, index) => (
              <div style={styles.item} key={index}>
                <div>
                  <h4 style={styles.itemName}>{item.fname}</h4>
                  <p style={styles.itemInfo}>Food ID: {item.fid}</p>
                  <p style={styles.itemInfo}>₹{item.price} × {item.qty}</p>
                </div>

                <div style={styles.itemTotal}>₹{item.price * item.qty}</div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <span>Total Amount</span>
            <strong>₹{myOrder.order_amount}</strong>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f1115",
    color: "#ffffff",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#181b21",
    border: "1px solid #2b3038",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px"
  },
  heading: {
    margin: "0",
    fontSize: "30px",
    color: "#f5f5f5"
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  },
  printButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  invoiceMeta: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
    gap: "12px",
    backgroundColor: "#22262e",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "20px"
  },
  addressPaymentBox: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  },
  infoCard: {
    backgroundColor: "#22262e",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #303640",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  metaLabel: {
    display: "block",
    color: "#9ca3af",
    fontSize: "12px",
    marginBottom: "6px"
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#22262e",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px"
  },
  label: {
    display: "block",
    color: "#9ca3af",
    fontSize: "14px",
    marginBottom: "6px"
  },
  amount: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#ffffff"
  },
  status: {
    backgroundColor: "#14532d",
    color: "#4ade80",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold"
  },
  subHeading: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#e5e7eb"
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#22262e",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #303640"
  },
  itemName: {
    margin: "0 0 8px",
    fontSize: "17px",
    color: "#ffffff"
  },
  itemInfo: {
    margin: "4px 0",
    color: "#9ca3af",
    fontSize: "14px"
  },
  itemTotal: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#60a5fa"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #303640",
    fontSize: "18px",
    color: "#d1d5db"
  }
}

export default Order
