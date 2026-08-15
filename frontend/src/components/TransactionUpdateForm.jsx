import { useState } from "react";

const normalizeDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const TransactionUpdateForm = ({ existingTransaction = {}, updateCallback, transactionPlatform }) => {
    const [transactionDate, setTransactionDate] = useState(normalizeDate(existingTransaction.transactionDate) || "");
    const [transactionDescription, setTransactionDescription] = useState(existingTransaction.transactionDescription || "");
    const [transactionAmount, setTransactionAmount] = useState(existingTransaction.transactionAmount || "");
    const [transactionType, setTransactionType] = useState(existingTransaction.transactionType || "");
    const [transactionAmountbalance, setTransactionAmountBalance] = useState(existingTransaction.transactionAmountbalance || "");

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            transactionDate,
            transactionDescription,
            transactionAmount,
            transactionType,
            transactionAmountbalance
        }
        const transactionId =existingTransaction.transactionId;

    const endpoint =
        transactionPlatform === "bank"
            ? "update_bankTransaction"
            : "update_tngTransaction";

    const url =
        `http://127.0.0.1:5000/${endpoint}/${transactionId}`;

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);

        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="transactionDate">Date:</label>
                <input
                    type="date"
                    id="transactionDate"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="transactionDescription">Description:</label>
                <input
                    type="text"
                    id="transactionDescription"
                    value={transactionDescription}
                    onChange={(e) => setTransactionDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="transactionAmount">Amount:</label>
                <input
                    type="number"
                    id="transactionAmount"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                />
            </div>
            <div>
<label htmlFor="transactionType">Type:</label>
<select
    id="transactionType"
    value={transactionType}
    onChange={(e) => setTransactionType(e.target.value)}
>
    <option value="">-- Select Type --</option>
    <option value="DBT">DBT (Debit)</option>
    <option value="CDT">CDT (Credit)</option>
</select>
            </div>
            <div>
                <label htmlFor="transactionAmountbalance">Balance:</label>
                <input
                    type="number"
                    id="transactionAmountbalance"
                    value={transactionAmountbalance}
                    onChange={(e) => setTransactionAmountBalance(e.target.value)}
                />
            </div>
            <button type="submit">Update</button>
        </form>
        
    );
};
export default TransactionUpdateForm