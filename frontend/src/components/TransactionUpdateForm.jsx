import { useState } from "react";

const normalizeDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const TransactionUpdateForm = ({ existingTransaction = {}, updateCallback, transactionType }) => {
    const [banktransactionDate, setBankTransactionDate] = useState(normalizeDate(existingTransaction.banktransactionDate) || "");
    const [banktransactionDescription, setBankTransactionDescription] = useState(existingTransaction.banktransactionDescription || "");
    const [banktransactionAmount, setBankTransactionAmount] = useState(existingTransaction.banktransactionAmount || "");
    const [banktransactionType, setBankTransactionType] = useState(existingTransaction.banktransactionType || "");
    const [banktransactionAmountbalance, setBankTransactionAmountBalance] = useState(existingTransaction.banktransactionAmountbalance || "");

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            banktransactionDate,
            banktransactionDescription,
            banktransactionAmount,
            banktransactionType,
            banktransactionAmountbalance
        }
        const url = `http://127.0.0.1:5000/update_bankTransaction/${existingTransaction.banktransactionId}`
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    };

console.log("sampai ke:", transactionType)

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="banktransactionDate">Date:</label>
                <input
                    type="date"
                    id="banktransactionDate"
                    value={banktransactionDate}
                    onChange={(e) => setBankTransactionDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="banktransactionDescription">Description:</label>
                <input
                    type="text"
                    id="banktransactionDescription"
                    value={banktransactionDescription}
                    onChange={(e) => setBankTransactionDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="banktransactionAmount">Amount:</label>
                <input
                    type="number"
                    id="banktransactionAmount"
                    value={banktransactionAmount}
                    onChange={(e) => setBankTransactionAmount(e.target.value)}
                />
            </div>
            <div>
<label htmlFor="banktransactionType">Type:</label>
<select
    id="banktransactionType"
    value={banktransactionType}
    onChange={(e) => setBankTransactionType(e.target.value)}
>
    <option value="">-- Select Type --</option>
    <option value="DBT">DBT (Debit)</option>
    <option value="CDT">CDT (Credit)</option>
</select>
            </div>
            <div>
                <label htmlFor="banktransactionAmountbalance">Balance:</label>
                <input
                    type="number"
                    id="banktransactionAmountbalance"
                    value={banktransactionAmountbalance}
                    onChange={(e) => setBankTransactionAmountBalance(e.target.value)}
                />
            </div>
            <button type="submit">Update</button>
        </form>
        
    );
};
export default TransactionUpdateForm