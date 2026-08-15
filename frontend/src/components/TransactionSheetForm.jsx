import { useState, useEffect } from "react";

const TransactionSheet = ({ currentMonth, updateCallback, transactionPlatform }) => {

    const [rows, setRows] = useState([]);

const handleChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    setRows(calculateBalances(updatedRows));
};

const addRow = () => {
    

    const lastRow = rows[rows.length - 1];
    const updatedRows = [
        ...rows,
        {
            transactionDate: lastRow.transactionDate,
            transactionTime: "",
            transactionCategory: "",
            transactionDescription: "",
            transactionAmount: "",
            transactionType:  "DBT",
            transactionAmountbalance: "" 
        }
    ];

    setRows(calculateBalances(updatedRows));
};

const deleteRow = (index) => {
    if (rows.length === 1) {
        alert("At least one row is required.");
        return;
    }

    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(calculateBalances(updatedRows));
};

const saveTransactions = async () => {
    try {

        const endpoint =
            transactionPlatform === "bank"
                ? "http://127.0.0.1:5000/create_bankTransactions"
                : "http://127.0.0.1:5000/create_tngTransactions";

        const response = await fetch(
            endpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rows)
            }
        );

        const data = await response.json();

        if (response.ok) {
            updateCallback();
        } else {
            alert(data.message || "Failed to save transactions.");
        }

    } catch (error) {
        console.error(error);
        alert("Error connecting to server.");
    }
};

const [categories, setCategories] = useState([]);
const [descriptions, setDescriptions] = useState([]);
const calculateBalances = (updatedRows) => {

    if(updatedRows.length === 0){
        return [];
    }


    let balance =
        Number(updatedRows[0].transactionAmountbalance) || 0;


    return updatedRows.map((row,index)=>{


        // first row is manually entered
        if(index === 0){

            return row;

        }


        const amount =
            Number(row.transactionAmount) || 0;


        if(row.transactionType === "DBT"){
            balance -= amount;
        }


        if(row.transactionType === "CDT"){
            balance += amount;
        }


        return {
            ...row,
            transactionAmountbalance:
                balance.toFixed(2)
        };


    });

};

useEffect(() => {

    fetch("http://127.0.0.1:5000/transactionCategories")
        .then(res => res.json())
        .then(data => setCategories(data));

    fetch("http://127.0.0.1:5000/transactionDescriptions")
        .then(res => res.json())
        .then(data => setDescriptions(data));

  

}, []);

useEffect(() => {

    const firstDay =
        `${currentMonth.getFullYear()}-${
            String(currentMonth.getMonth() + 1).padStart(2, "0")
        }-01`;

    setRows([
        {
            transactionDate: firstDay,
            transactionCategory: "",
            transactionDescription: "",
            transactionAmount: "",
            transactionType: "DBT",
            transactionAmountbalance: ""
        }
    ]);

}, [currentMonth]);

    return (
<div>
<table>
<thead>
<tr>
<th>Date</th>
 {transactionPlatform === "tng" && (
            <th>Time</th>
        )}
<th>Category</th>
<th>Description</th>
<th>Amount</th>
<th>Type</th>
{transactionPlatform !== "tng" && (
            <th>Balance</th>
        )}
<th>Erase</th>
</tr>
</thead>


<tbody>

{rows.map((row,index)=>(

<tr key={index}>

<td>
<input
type="date"
value={row.transactionDate}
onChange={(e)=>
handleChange(index,"transactionDate",e.target.value)}
/>
</td>
  {transactionPlatform === "tng" && (
        <td>
            <input
                type="time"
                value={row.transactionTime}
                onChange={(e) =>
                    handleChange(
                        index,
                        "transactionTime",
                        e.target.value
                    )
                }
            />
        </td>
    )}

<td>
    <input
        list="categoryOptions"
        value={row.transactionCategory}
        onChange={(e) =>
            handleChange(
                index,
                "transactionCategory",
                e.target.value
            )
        }
    />

    <datalist id="categoryOptions">

{
    categories.map((category,index)=>(
        <option 
            key={index}
            value={category}
        />
    ))
}

</datalist>
</td>


<td>
<input
list="descriptionOptions"
value={row.transactionDescription}
onChange={(e)=>
handleChange(index,"transactionDescription",e.target.value)}
/>
    <datalist id="descriptionOptions">

{
    descriptions.map((description,index)=>(
        <option 
            key={index}
            value={description}
        />
    ))
}

</datalist>
</td>


<td>
<input
type="number"
value={row.transactionAmount}
onChange={(e)=>
handleChange(index,"transactionAmount",e.target.value)}
/>
</td>


<td>

<select
value={row.transactionType}
onChange={(e)=>
handleChange(index,"transactionType",e.target.value)
}
>

<option value="DBT">DBT</option>
<option value="CDT">CDT</option>

</select>

</td>

 {transactionPlatform !== "tng" && (
            
<td>

{
index === 0 ?

<input
type="number"
value={row.transactionAmountbalance}
onChange={(e)=>
handleChange(
index,
"transactionAmountbalance",
e.target.value
)}
/>

:

<input
type="number"
value={row.transactionAmountbalance}
readOnly
/>

}

</td>
        )}


<td>
<button onClick={()=>deleteRow(index)}>
❌
</button>
</td>


</tr>

))}

</tbody>

</table>


<button onClick={addRow}>
+ Add Row
</button>
<button onClick={saveTransactions}>
Save All
</button>
</div>

);
};


export default TransactionSheet