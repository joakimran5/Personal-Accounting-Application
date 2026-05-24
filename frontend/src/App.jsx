import { useState, useEffect } from "react";
import BankTransactionList from "./BankTransactionList";
import "./App.css";
import BankTransactionForm from "./BankTransactionForm";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState({})

  const fetchTransaction = async () => {
    const response = await fetch("http://127.0.0.1:5000/bankTransactions");
    const data = await response.json();
    setTransactions(data.bankTransactions);
  };

  useEffect(() => {
    fetchTransaction()
  }, []);

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTransaction({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentTransaction(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchTransaction()
  }

  return (
    <>
      <BankTransactionList transactions={transactions} updateTransaction={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Transaction</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <BankTransactionForm existingTransaction={currentTransaction} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}

export default App;