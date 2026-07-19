import { useState, useEffect } from "react";



const normalizeDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const BankTransactionSheet = ({ existingTransaction = {}, updateCallback }) => {
    const [rows, setRows] = useState([
    {
        banktransactionDate: "",
        banktransactionCategory: "",
        banktransactionDescription: "",
        banktransactionAmount: "",
        banktransactionType: "",
        banktransactionAmountbalance: ""
    }
]);

const handleChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    setRows(updatedRows);
};

const addRow = () => {
    setRows([
        ...rows,
        {
            banktransactionDate: "",
            banktransactionCategory: "",
            banktransactionDescription: "",
            banktransactionAmount: "",
            banktransactionType: "",
            banktransactionAmountbalance: ""
        }
    ]);
};

const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
};

const saveTransactions = async () => {

    const response = await fetch(
        "http://127.0.0.1:5000/create_bankTransactions",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(rows)
        }
    );


    if(response.status===201){
        updateCallback();
    }
};

const [categories, setCategories] = useState([]);
const [descriptions, setDescriptions] = useState([]);

useEffect(() => {

    fetch("http://127.0.0.1:5000/transactionCategories")
        .then(res => res.json())
        .then(data => setCategories(data));

    fetch("http://127.0.0.1:5000/transactionDescriptions")
        .then(res => res.json())
        .then(data => setDescriptions(data));

}, []);

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
<th></th>
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

<option value="">Select</option>
<option value="DBT">DBT</option>
<option value="CDT">CDT</option>

</select>

</td>


<td>
<input
type="number"
value={row.banktransactionAmountbalance}
onChange={(e)=>
handleChange(index,"banktransactionAmountbalance",e.target.value)}
/>
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


export default BankTransactionSheet