import React, { useState } from 'react'
import './Address.css'

function Address({ setShowAddress, setShowPayment, setSelectedAddress }) {
    const [selectedAddressId, setSelectedAddressId] = useState(201)

    const address = [
        {
            Flatno_hno: 201,
            Apartment_name: "Ekadanta",
            Address: "Nehru Road Tilakwadi",
            City: "Belagavi",
            Pincode: 590006,
        },
        {
            Flatno_hno: 302,
            Apartment_name: "Ganesh Vandhan",
            Address: "Nehru Road Tilakwadi",
            City: "Belagavi",
            Pincode: 590006,
        }
    ]

    const handleAddressChange = (add) => {
        setSelectedAddressId(add.Flatno_hno)
        setSelectedAddress(`${add.Flatno_hno}, ${add.Apartment_name}, ${add.Address}, ${add.City} - ${add.Pincode}`)
    }

    const handleProceedToPay = () => {
        const selected = address.find(add => add.Flatno_hno === selectedAddressId)
        if (selected) {
            setSelectedAddress(`${selected.Flatno_hno}, ${selected.Apartment_name}, ${selected.Address}, ${selected.City} - ${selected.Pincode}`)
        }
        setShowAddress(false)
        setShowPayment(true)
    }

    return (
        <div>
            <h1>CHOOSE ADDRESS</h1>
            <div className="address-list">
                {address.map((add, index) => (
                    <label className="address-card" key={index}>
                        <input
                            type="radio"
                            name="address"
                            value={add.Flatno_hno}
                            checked={selectedAddressId === add.Flatno_hno}
                            onChange={() => handleAddressChange(add)}
                        />
                        <div className='address-details'>
                            <strong>
                                {add.Flatno_hno}-{add.Apartment_name}
                            </strong>
                            <p>
                                {add.Address}, {add.City}-{add.Pincode}
                            </p>
                        </div>
                    </label>
                ))}
            </div>

            <button
                type="button"
                onClick={handleProceedToPay}
                style={{
                    marginTop: '20px',
                    padding: '12px 20px',
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Proceed To Pay
            </button>
        </div>
    )
}

export default Address