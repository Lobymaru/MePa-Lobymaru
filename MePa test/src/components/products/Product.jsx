import { useState } from 'react';
import './Product.css';
import {initMercadoPago, Wallet} from '@mercadopago/sdk-react';
import axios from 'axios';


const Product = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  initMercadoPago("APP_USR-b7379475-71c0-4b94-ab88-3cd8ddfb34dd", {
    locale:"es-AR",
  });

  const createPreference = async () => {
    try{
      const response = await axios.post("http://localhost:3000/create_preference", {
        id: "0001",
        title: "001 -スパルタス - Spartan",
        picture_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1H0K83zLm1arP_X-okJQIxpaJJgn6MGSshg&s",
        description:"Card from the Nintendo DS game 'Card Hero'",
        quantity:1,
        price:30
      });

      const {id} = response.data;
      return id;
    }catch(error){
      console.log(error)
    }
  };

  const handlebuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    } 
  };

  return (
    <div className="card-product-container">
        <div className="card-product">
            <div className="card">
                <img src={window.location.origin + '/001 -スパルタス - Spartan.png'} 
                alt="card" />
                <h3>001 Spartan</h3>
                <p className="price">30$</p>
                <button onClick={handlebuy}>Comprar</button>
                {preferenceId && <Wallet initialization={{preferenceId: preferenceId, redirectMode: 'modal'}} />}

            </div>

        </div>
    </div>
  )
}

export default Product