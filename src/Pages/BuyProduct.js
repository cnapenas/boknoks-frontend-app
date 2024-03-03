
import React, { useEffect, useState } from 'react';
import { Button ,Table} from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const BuyProduct = () => {

    const [prodList, setProdList] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [totalQty, setTotalQty] = useState(0);

    const [pCode, setPCode] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
        productQty: 0
    });
    const [qtyArray, setQtyArray] = useState([]);
    const [pCodeArray, setPCodeArray] = useState([]);
    const { usr } = useContext(UserContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || usr);

    // const [modal, setModal] = useState(false);
    // const [scanSuccess, setScanSuccess] = useState(false);
    // const [scanCode, setScanCode] = useState('');
    // const [results, setResults] = useState(null);
     // Store usrnme in localStorage whenever it changes
     useEffect(() => {
        if (usr) {
            console.log('Storing user in localStorage: ' + usr.username);
            localStorage.setItem('user', JSON.stringify(usr));
            setUser(usr);
        }

    }, [usr]);

    const handleSelectChange = (event) => {
        const newSelectedIndex = event.target.selectedIndex;
        setSelectedIndex(newSelectedIndex);
        const qtyArray = prodList.map((item, index) => item.productQty);
        const pCodeArray = prodList.map((item, index) => item.productCode);
        setPCodeArray(pCodeArray);
        setQtyArray(qtyArray);
        setPCode(pCodeArray[newSelectedIndex]);
        setUpdatedData({ productQty: qtyArray[newSelectedIndex] + Number(totalQty) });
        
       
    }

    const addQtyChange = (event) => {
        setTotalQty (qtyArray.length > selectedIndex ? ( Number(qtyArray[selectedIndex]) + Number(event.target.value)) : (prodList.length > 0 ? (prodList[0].productQty + Number(event.target.value)) : 0))
        //setTotalQty(event.target.value);
    };


    const addToCart = () => {
        const prodCode = prodList[selectedIndex].productCode;

        const index = cartList.findIndex(item => item.productCode === prodCode);

        if (index < 0) {
            const selectedItem = prodList[selectedIndex];
            const newItem = {...selectedItem,
                    productQty: 1,
                    subTotal: selectedItem.productPrice * 1
                };
            setCartList([...cartList, newItem]);
        }
        else {
            alert("Product already in cart");
        }

        
        

    };


    const CheckOut = (products) => {
    
    console.log(cartList);

    const promiseUpdateQuantities = cartList.map((product) => 
    {
        const updatedQty = prodList.find(item => item.productCode === product.productCode).productQty - product.productQty;
        return fetch(process.env.REACT_APP_BACKEND_URL+`/updateDataQty/${product.productCode}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                productQty: updatedQty,}),
            headers: {
                'Content-Type': 'application/json'
            }
            
        })
        .then(response => response.json())
        .then(data => 
            {   console.log(data)
                console.log("Data for product " + product.productCode + " saved successfully");
            }
        )
        .catch((error) => {
            console.log("pcode" + product.productCode);
            console.error('Error:', error);
        });
    });

    // Wait for all promises for the first API to resolve
    Promise.all(promiseUpdateQuantities)
    .then(() => {
        console.log('All products updated successfully in updateQty API');

        // Create an array of promises for the second API
        const promiseTransaction = cartList.map((product) => {
            const transactionDate = new Date();
            const transactionType = "buy";
        return fetch(process.env.REACT_APP_BACKEND_URL+'/addtransaction', {
            method: 'post',
            body: JSON.stringify({ productCode: product.productCode,
                productName: product.productName,
                productQty: product.productQty,
                productPrice: product.productPrice,
                transactionDate: product.transactionDate,
                transactionType: product.transactionType,
                transactDate:transactionDate,
                transactType:transactionType,
                transactUser: user.username}),
            headers: {
            'Content-Type': 'application/json'
            },
            
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log("Data for product " + product.productCode + " added transaction successfully in addtransaction API");
        })
        .catch((error) => {
            console.log("pcode" + product.productCode);
            console.error('Error:', error);
        });
        });

        // Wait for all promises for the second API to resolve
        return Promise.all(promiseTransaction);
    })
    .then(() => {
        console.log('All products updated successfully in the second API');
        alert("Checkout successful");
        setCartList([]);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

        
    };

    const handleQuantityChange = (e, productCode) => {
        
        
        // Find the index of the item in the cartList
        const index = cartList.findIndex(item => item.productCode === productCode);

        // Parse the new quantity as a number
        const newQuantity = Number(e.target.value);
       
      
        // Create a new item with the updated quantity and subtotal
        const newItem = {
          ...cartList[index],
          productQty: newQuantity,
          subTotal: cartList[index].productPrice * newQuantity
        };
      
        // Create a new cartList array with the updated item
        const newCartList = [
          ...cartList.slice(0, index),
          newItem,
          ...cartList.slice(index + 1)
        ];
      
        // Update the state
        setCartList(newCartList);
     
        
    };

    useEffect(() => {

        setCartList([]);

        const fetchData = async () => 
        {
           
           fetch(process.env.REACT_APP_BACKEND_URL+'/getProducts', {
           method: "get",
           headers: {
              'Content-Type': 'application/json'
           }
           })
           .then(response => {
           if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
           }
              return response.json();
           })
           .then(data => {
           // Your code here
         
              if (data) {
                 console.log("Data retrieved succesfully");
                 
                 setProdList( data);
                
                 
              }
       
           })
           .catch(error => {
           console.error('There was a problem with the fetch operation: ', error);
           });
  
           // result = await result.json();
           // console.warn(result);
           // if (result) {
           //    alert("Data saved succesfully");
           //    setProdList(result);
           // }
  
           
        };
  
        
  
        fetchData();
     }, []);

  return (
    <>
    <h1>Buy Product</h1>
    <hr /> 
        <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <tbody>
            <tr style={{ border: '1px solid black' }}> 
                <th style={{ border: '1px solid black' }}>Product Name</th>
 
            </tr>
            <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>
                <select onChange={handleSelectChange} value={prodList[selectedIndex]?.productName}>
               
                {prodList.map((item, index) => (
                    <option key={index} value={item.productName}>
                        {item.productName}
                        
                    </option>
                    ))}
                  
                </select>
                </td>
                
                
            </tr>
            </tbody>
        </Table>

        <Button variant="primary" style={{ marginTop: '20px' }} onClick={addToCart}>
        Add To Cart
        </Button>

        <Table striped bordered hover style={{ marginTop: '20px' }}>
        <thead>
            <tr style={{ border: '1px solid black' }}>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Sub Total</th>
            </tr>
        </thead>
        <tbody>
            {cartList.map(item => { 
                return (
                <tr style={{ border: '1px solid black' }} key={item.productCode}>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productCode}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productName}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }} >
                        <input value= {item.productQty} type="text" onChange={(e) => handleQuantityChange(e, item.productCode)} />
                    </td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productPrice}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.subTotal}</td>           
                </tr>
               
                );
            })}
            <tr>
            <th style={{ borderLeft: '1px solid black', borderBottom: '1px solid black', borderRight: 'none', padding: '10px' }}>Total</th>
            <th style={{ borderBottom: '1px solid black'}}></th>
            <th style={{ borderBottom: '1px solid black'}}></th>
            <th style={{ borderBottom: '1px solid black',  borderRight: '1px solid black'}}></th>
            
            <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>
                {cartList.reduce((total, item) => total + item.subTotal, 0)}    
            </td>
            </tr>
        </tbody>
        </Table>
        <Button variant="primary" style={{ marginTop: '20px' }} onClick={() => CheckOut(cartList)}>
        CheckOut
        </Button>

  </>
  );
}
export default BuyProduct;