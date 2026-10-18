import { useState } from 'react'

function Payment({ setShowPayment, setShowOrder, setSelectedPaymentMethod }) {
  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      accounts: [
        { id: 'credit-card-1', label: 'Credit Card 1', detail: 'Card ending in 4242' },
        { id: 'credit-card-2', label: 'Credit Card 2', detail: 'Card ending in 1881' }
      ]
    },
    {
      id: 'debit-card',
      name: 'Debit Card',
      accounts: [
        { id: 'debit-card-1', label: 'Debit Card 1', detail: 'Card ending in 1117' },
        { id: 'debit-card-2', label: 'Debit Card 2', detail: 'Card ending in 9005' }
      ]
    },
    {
      id: 'upi',
      name: 'UPI',
      accounts: [
        { id: 'upi-1', label: 'UPI Account 1', detail: 'fdelivery.one@upi (demo)' },
        { id: 'upi-2', label: 'UPI Account 2', detail: 'fdelivery.two@upi (demo)' }
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      accounts: [
        { id: 'paypal-1', label: 'PayPal Account 1', detail: 'account-one@example.com (demo)' },
        { id: 'paypal-2', label: 'PayPal Account 2', detail: 'account-two@example.com (demo)' }
      ]
    },
    {
      id: 'paytm',
      name: 'Paytm',
      accounts: [
        { id: 'paytm-1', label: 'Paytm Account 1', detail: 'PAYTM-DEMO-01' },
        { id: 'paytm-2', label: 'Paytm Account 2', detail: 'PAYTM-DEMO-02' }
      ]
    }
  ]

  const [selectedMethod, setSelectedMethod] = useState('credit-card')
  const [selectedAccountId, setSelectedAccountId] = useState('credit-card-1')

  const handlePayment = () => {
    const method = paymentMethods.find(item => item.id === selectedMethod)
    const account = method?.accounts.find(item => item.id === selectedAccountId)

    if (!method || !account) {
      return
    }

    setSelectedPaymentMethod({
      name: method.name,
      accountLabel: account.label,
      accountDetail: account.detail
    })
    setShowPayment(false)
    setShowOrder(true)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Select Payment Method</h2>

        <div style={styles.list}>
          {paymentMethods.map((method) => (
            <div key={method.id} style={styles.option}>
              <label htmlFor={`payment-method-${method.id}`} style={styles.methodLabel}>
                <input
                  id={`payment-method-${method.id}`}
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => {
                    setSelectedMethod(method.id)
                    setSelectedAccountId(method.accounts[0].id)
                  }}
                />
                <span>{method.name}</span>
              </label>
              {selectedMethod === method.id && (
                <div style={styles.accounts}>
                  {method.accounts.map((account) => (
                    <label key={account.id} style={styles.accountOption}>
                      <input
                        type="radio"
                        name="paymentAccount"
                        value={account.id}
                        checked={selectedAccountId === account.id}
                        onChange={() => setSelectedAccountId(account.id)}
                      />
                      <span>
                        {account.label} <small>({account.detail})</small>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={handlePayment}
            style={styles.payButton}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f1115',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#181b21',
    border: '1px solid #2b3038',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
  },
  heading: {
    margin: '0 0 25px',
    fontSize: '28px',
    color: '#f5f5f5'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  option: {
    padding: '16px 18px',
    backgroundColor: '#22262e',
    border: '1px solid #303640',
    borderRadius: '10px',
    fontSize: '18px'
  },
  methodLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  },
  accounts: {
    flexBasis: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingLeft: '30px',
    fontSize: '15px'
  },
  accountOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  footer: {
    marginTop: '25px'
  },
  payButton: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }
}

export default Payment
