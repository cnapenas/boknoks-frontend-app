
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';



export default function AddNewProduct() {
        const [productCode, setProductCode] = useState("");
        const [productName, setProductName] = useState("");
        const [productQty, setProductQty] = useState("");
        const [productPrice, setProductPrice] = useState("");
    
  
        const addProd = async (e) => {
        e.preventDefault();
       
        let result = await fetch(
          'http://localhost:3000/addnewproduct', {
              method: "post",
              body: JSON.stringify({productCode, productName, productQty, productPrice }),
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          result = await result.json();
          console.warn(result);
          if (result) {
              alert("Data saved succesfully");
   
              setProductCode("");
              setProductName("");
              setProductPrice(0);
              setProductQty(0);
          }
        }

  return (
    <div className="App">
      <header className="App-header">
        <h1>AddProduct</h1>
        <Form onSubmit={addProd}> 
          
            <Form.Group controlId="productCode">
                <Form.Label>Product Code</Form.Label>
                <Form.Control type="text" placeholder="Product Code"
                value={productCode} onChange={(e) => setProductCode(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" placeholder="Product Name" 
                value={productName} onChange={(e) => setProductName(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productQty">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Quantity" 
                value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="Price"
                value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
             Submit
            </Button>
            
            
        </Form>
      </header>
    </div>
  );
  }