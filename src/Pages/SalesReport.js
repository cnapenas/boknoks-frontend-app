import React, { useState, useEffect } from 'react';


const SalesReport = () => {
  const dateInGMT8 = new Date();
  dateInGMT8.setUTCHours(dateInGMT8.getUTCHours() + 8);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(dateInGMT8.getMonth());
  const [selectedYear, setSelectedYear] = useState(dateInGMT8.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [transactions, setTransactions] = useState(null);
  const [showTable, setShowTable] = useState(false);


  const months = [...Array(12)].map((_, i) => {
    const date = new Date(dateInGMT8);
    date.setMonth(i);
    return date.toLocaleString('default', { month: 'long' });
  });

  const lastTwoYears = [dateInGMT8.getFullYear() - 1, dateInGMT8.getFullYear()];

  useEffect(() => {
    const date = new Date(dateInGMT8);
    date.setMonth(selectedMonth);
    date.setDate(1);
    const days = [];
    while (date.getMonth() === selectedMonth) {
      days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
    setDaysInMonth(days);
  }, [selectedMonth]);

  

  const DisplayReport = () => {

    const tDate = new Date(selectedYear, selectedMonth, selectedDay);
    tDate.setUTCHours(tDate.getUTCHours() + 8);
    const tType = "buy";


    fetch(process.env.REACT_APP_BACKEND_URL+`/getSalesForDate/${tDate.toISOString()}/${tType}`, {
         method: "get",
         headers: {
            'Content-Type': 'application/json'
         }
         })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          return response.json();

        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              console.log("Data retrieved succesfully");
              setTransactions(data);
              setShowTable(true);
            } 
            else {
                console.log("No items in data");
                setTransactions([]);
                setShowTable(false);
                alert("No transactions found for the selected date.");
            }
          })
        .catch((error) => {
          console.error('There has been a problem with your fetch operation:', error);
        
        })
        

  
  }

  return (
    <div style={{ padding: '10px' }}>
      <h1>SalesReport</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '20px' }}>
        <select style={{ marginBottom: '10px' }} onChange={(e) => setSelectedDay(Number(e.target.value))}>
          {daysInMonth.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          style={{ marginBottom: '10px' }}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select 
          style={{ marginBottom: '10px' }}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {lastTwoYears.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={DisplayReport}>Show Transactions</button>
      </div>
        {showTable && (
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Cashier</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Item Name</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Item Qty</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Item Price</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Sub Total</th>
            </tr>
            </thead>
            <tbody>
            {transactions.slice(0, 5).map((transaction, index) => (
                <tr key={index}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transaction.transactUser}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transaction.product.productName}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transaction.product.productQty}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transaction.product.productPrice}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{transaction.product.productQty * transaction.product.productPrice}</td>
                </tr>
            ))}
            </tbody>
            <thead>
            <tr>
                <th style={{ borderLeft: '1px solid black', borderBottom: '1px solid black', padding: '10px' }}>Total</th>
                <th style={{ borderBottom: '1px solid black'}}></th>
                <th style={{ borderBottom: '1px solid black'}}></th>
                <th style={{ borderBottom: '1px solid black'}}></th>
                <th style={{ border: '1px solid black', padding: '10px' }}>
                {transactions.slice(0, 5).reduce((total, transaction) => total + (transaction.product.productQty * transaction.product.productPrice), 0)}
                </th>
            </tr>
            </thead>
        </table>
        )}
    </div>
  );
}

export default SalesReport;