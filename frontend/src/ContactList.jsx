import React from "react"

const ContactList = ({ contacts, updateContact, updateCallback }) => {
    const onDelete = async (tsc_id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_bankTransaction/${tsc_id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <h2>Contacts</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {console.log(contacts)}
                {contacts.map((contact) => (
                    <tr key={contact.banktransactionId}>
                        <td>{new Date(contact.banktransactionDate).toLocaleDateString("en-GB")}</td>
                        <td>{contact.banktransactionDescription}</td>
                        <td>{contact.banktransactionAmount}</td>
                        <td>{contact.banktransactionType}</td>
                        <td>{contact.banktransactionAmountbalance}</td>
                        <td>
                            <button onClick={() => updateContact(contact)}>Update</button>
                            <button onClick={() => onDelete(contact.banktransactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default ContactList