import { useState, useEffect } from "react";

const TransactionSheet = ({ currentMonth, updateCallback, transactionType }) => {

    const [rows, setRows] = useState([]);

const handleChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    setRows(calculateBalances(updatedRows));
};

const addRow = () => {

    const lastRow = rows[rows.length - 1];

    if (transactionType === "bank") {

    const updatedRows = [
        ...rows,
        {
            banktransactionDate: lastRow.banktransactionDate,
            banktransactionCategory: "",
            banktransactionDescription: "",
            banktransactionAmount: "",
            banktransactionType:  "DBT",
            banktransactionAmountbalance: ""
        }
    ];

    setRows(calculateBalances(updatedRows));

      } else if (transactionType === "tng") {
     const updatedRows = [
            ...rows,
            {
                tngtransactionDate: lastRow
                    ? lastRow.tngtransactionDate
                    : "",
                tngtransactionCategory: "",
                tngtransactionDescription: "",
                tngtransactionAmount: "",
                tngtransactionType: "DBT",
                tngtransactionAmountbalance: ""
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

        const response = await fetch(
            "http://127.0.0.1:5000/create_bankTransactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rows)
            }
        );

        if (response.ok) {
            updateCallback();
        } else {
            alert("Failed to save transactions.");
        }

    } catch (error) {
        console.error(error);
    }

};

const [categories, setCategories] = useState([]);
const [descriptions, setDescriptions] = useState([]);
const calculateBalances = (updatedRows) => {

    if(updatedRows.length === 0){
        return [];
    }


    let balance =
        Number(updatedRows[0].banktransactionAmountbalance) || 0;


    return updatedRows.map((row,index)=>{


        // first row is manually entered
        if(index === 0){

            return row;

        }


        const amount =
            Number(row.banktransactionAmount) || 0;


        if(row.banktransactionType === "DBT"){
            balance -= amount;
        }


        if(row.banktransactionType === "CDT"){
            balance += amount;
        }


        return {
            ...row,
            banktransactionAmountbalance:
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
            banktransactionDate: firstDay,
            banktransactionCategory: "",
            banktransactionDescription: "",
            banktransactionAmount: "",
            banktransactionType: "DBT",
            banktransactionAmountbalance: ""
        }
    ]);

}, [currentMonth]);


    return (
<div>
<table>
<thead>
<tr>
<th>Date</th>
<th>Category</th>
<th>Description</th>
<th>Amount</th>
<th>Type</th>
<th>Balance</th>
<th>Erase</th>
</tr>
</thead>


<tbody>

{rows.map((row,index)=>(

<tr key={index}>

<td>
<input
type="date"
value={row.banktransactionDate}
onChange={(e)=>
handleChange(index,"banktransactionDate",e.target.value)}
/>
</td>


<td>
    <input
        list="categoryOptions"
        value={row.banktransactionCategory}
        onChange={(e) =>
            handleChange(
                index,
                "banktransactionCategory",
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
value={row.banktransactionDescription}
onChange={(e)=>
handleChange(index,"banktransactionDescription",e.target.value)}
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
value={row.banktransactionAmount}
onChange={(e)=>
handleChange(index,"banktransactionAmount",e.target.value)}
/>
</td>


<td>

<select
value={row.banktransactionType}
onChange={(e)=>
handleChange(index,"banktransactionType",e.target.value)
}
>

<option value="DBT">DBT</option>
<option value="CDT">CDT</option>

</select>

</td>


<td>

{
index === 0 ?

<input
type="number"
value={row.banktransactionAmountbalance}
onChange={(e)=>
handleChange(
index,
"banktransactionAmountbalance",
e.target.value
)}
/>

:

<input
type="number"
value={row.banktransactionAmountbalance}
readOnly
/>

}

</td>


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