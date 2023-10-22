import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import Forme from "./components/ExpenseForm";
import List from "./components/ExpenseList";
import { v4 as uuidv4 } from "uuid";
import "./App.css"

// const initialExpense = [
//   {id: uuidv4(), charge:"car-1", amount:100},
//   {id: uuidv4(), charge:"car-2", amount:10},
//   {id: uuidv4(), charge:"car-3", amount:10}
// ]

let initialExpense = localStorage.getItem("expenses") ? JSON.parse(localStorage.getItem("expenses")) : [];

export default function App() {

  const [expenses, setExpenses] = useState(initialExpense)
  const [charge, setCharge] = useState('')
  const [amount, setAmount] = useState('')
  const [alert, setAlert] = useState({show:false})
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(0)

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  function handelCharge(e) {
      setCharge(e.target.value)
  }
  function handelAmount(e) {
      setAmount(e.target.value)
  }

  function handelAlert({type,text}) {
    setAlert({show:true,type,text})
    setTimeout(() => {
      setAlert({show:false})
    }, 1000);
  }
  function handelSubmit(e) {
    e.preventDefault()
    if(charge !== '' && amount > 0) {

      if (edit) {
        let tempExpenses = expenses.map(item =>  {
          return item.id === id ? {...item, charge, amount} : item;
        })
        setExpenses(tempExpenses)
        setEdit(false)
        handelAlert({type:"success",text:"Item Edited"})
      } else {
        const singleExpense = {id:uuidv4(), charge:charge, amount:amount}
        setExpenses([...expenses, singleExpense])
        handelAlert({type:"success",text:"Item Added"})
      }
      setCharge('')
      setAmount('')
    } else {
      handelAlert({type:"danger",text:"Item Not Added"})
    }
  }

  const clearItem = () => {
    setExpenses([])
  }
  
  const handelDelete = id => {
    console.log(`Item Deleted : ${id}`)
    let tempExpenses = expenses.filter(item => item.id !== id)
    setExpenses(tempExpenses)
    handelAlert({type:"danger", text:"Item Deleted"})
  }
  const handelEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge,amount} = expense;
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }


  return( <>
    {alert.show && <Alert type={alert.type} text={alert.text}/>}
      <h1>budget Calculator</h1>
      <main className="App">
      <Forme charge={charge} amount={amount} handelAmount={handelAmount} handelCharge={handelCharge} handelSubmit={handelSubmit} edit={edit}/>
    <List expenses={expenses} handelDelete={handelDelete} handelEdit={handelEdit} clearItem={clearItem}/> 

      </main>
      <h1>Total Spending : $<span className="total">
        {expenses.reduce((acc,curr) => {
          return (acc += parseInt( curr.amount))
        },0)}
        </span></h1>
  </>
  )
}
