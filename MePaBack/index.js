import { MercadoPagoConfig, PaymentMethod, Preference } from 'mercadopago';
import express from 'express';
import cors from 'cors';

const client = new MercadoPagoConfig(
  { accessToken: 'APP_USR-8085007915674339-072509-059e5ffe32aa4335273f00dc9c742900-2578557161',
    options: {
      integratorId:"dev_24c65fb163bf11ea96500242ac130004"
    }
  }
);

const app = express();
const port= 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
  res.send("Soy el server");
})

app.get("/paymentMethods", async function(req, res) {
  try {
    const response = await fetch("https://api.mercadopago.com/v1/payment_methods", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`
      }
    });

    if (response.ok){
      const data = await response.json();
      console.log(data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
  }
})

app.post("/create_preference", async (req, res) =>{
  try{
    const body = {
      items: [
      {
        id:req.body.id,
        title: req.body.title,
        picture_url:req.body.picture_url,
        description:req.body.description,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "ARS",
      }
      ],
      back_urls: {
        success: "https://youtube.com",
        failure: "https://youtube.com",
        pending: "https://yotube.com"
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id:"visa"
          }
        ],
        installments: 6,
      },
      auto_return: "approved",
      external_reference:"lobymaru-gmail_com",
      notification_url: "https://8e1663553130.ngrok-free.app/webhook" ,
    };

    const preference = new Preference(client);
    const result = await preference.create({body});
    res.json({
      id:result.id,
    });
  }catch (error){
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :/",
    })
  }
});

app.post("/webhook", async function (req,res){
  const paymentId = req.query.id

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`
      }
    });

    if (response.ok){
      const data = await response.json();
      console.log(data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log('Error: ', error)
    res.sendStatus(500);
  }
})


app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto: ${port}`);
})