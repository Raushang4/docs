# Sender API

In this guide, we demonstrate how to enable off-ramps for users with the Sender API. The main difference between the Sender API and the Gateway contract is that users get a receiving address to pay for rather than connecting their non-custodial wallets. This means users can off-ramp directly from any wallet.

## Getting Started

Firstly, we have to get the `Client ID` from [your sender dashboard](https://app.paycrest.io/sender/overview).

Visit [your sender dashboard](https://app.paycrest.io/sender/overview) to retrieve your `Client ID` and `Client Secret`. If you're a new user, [signup here](https://app.paycrest.io/signup) as a "sender" and complete our Know-Your-Business (KYB) process. Your `Client Secret` should always be kept secret - we'll get to this later in the article.

### Configure tokens

Head over to the [settings page](https://app.paycrest.io/sender/settings) of your Sender Dashboard to configure the `feePercent`, `feeAddress`, and `refundAddress` across the tokens and blockchain networks you intend to use.

### Interacting with an endpoint

Include your `Client ID` in the "API-Key" header of every request you make to Paycrest Offramp API.

```tsx
const headers = {
  "API-Key": "208a4aef-1320-4222-82b4-e3bca8781b4b",
};
```

This is because requests without a valid API key will fail with status code `401: Unauthorized`.

---

### Initiating Orders for Users

Now, we've gotten all the neccessary details to allow us create the logic for initiating orders, we need to get our order params.

```
const orderParams = {
  amount: 100.00,
  token: "USDC",
  rate: 1500,
  network: "polygon",
  recipient: {
    institution: "GTBINGLA",
    accountIdentifier: "123456789",
    accountName: "John Doe",
    memo: "Payment from John Doe",
    providerId: ""
  },
  returnAddress: "0x123...",
  reference: "unique-reference",
}
```

**P.S**: We support USDT and USDC, but USDC is not supported on Tron and USDT is not supported on Base.

Here, we have the `orderParams` that contains all the necessary information about the order. One thing to note is that you'll need to get the `rate` and `accountName` in real time by calling their respective API endpoints. Also the `returnAddress` is just the user's address in the case of refunds.

```
// get the  nairaRate and verify account number
const nairaRate = "https://api.paycrest.io/v1/rates/usdt/1/ngn";
const accountName = "https://api.paycrest.io/v1/verify-account";


  const bankData = {
    institution: "KUDANGPC",
    accountIdentifier: "12323435"
  };

  try {
    const [nairaRate, accountName] = await Promise.all([
      fetch(nairaRate), // GET request
      fetch(accountName, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData)
      }) // POST request
    ]);

    const getRate = await nairaRate.json();
    const getAccount = await accountName.json();

    console.log("naira rate response:", getRate.data);
    console.log("get account response:", getAccount.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
```

```
const createOrder = "https://api.paycrest.io/v1/sender/orders";

  try {
    const response = await fetch(accountName, {
      method: "POST",
      headers: { "Content-Type": "application/json", "API-Key": "208a4aef-1320-4222-82b4-e3bca8781b4b" },
      body: JSON.stringify(orderParams)
    })

    const initiatedOrder = await response.json();

    console.log("Here's the initiated order details:", initiatedOrder);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
```

A sample response would look exactly like this:

```
{
  "message": "Payment order initiated successfully",
  "status": "success",
  "data":
  {
    "id": "uuid-string",
    "amount": "100.00",
    "token": "USDT",
    "network": "polygon",
    "receiveAddress": "0x1234...",
    "validUntil": "2024-07-01T12:34:56Z",
    "senderFee": "0.50",
    "transactionFee": "0.10",
    "reference": "unique-reference"
  }
}
```

## Listening to User Deposit

For an order to be complete, the user will have to fund the `receiveAddress` in the response. We do this using a webhook. 

### Webhook implementation on the Server

First, you'd need to set up your node server - including your `Postgres DB` and `prisma` as your ORM. If you're confused about how to get started with that, check out this [article](https://hackernoon.com/building-a-crud-app-with-nodejs-postgresql-and-prisma).

Next, create a `Transaction` schema on Prisma. This is what we'll use to update our DB with a user's new transaction. You can add more properties from the payload depending on your custom use case.

```
// schema.prisma
model Transaction {
  id        String  
  createdAt DateTime  @default(now())
  status  String
}
```

Here, we have a webhook endpoint that first verifies the endpoint using the `payload` from paycrest that's sent to our webhook, `"X-Paycrest-Signature"` that's part of the expected payload header, and the `Client Secret` from the dashboard that we talked about earlier. If it passes verification, we save it to `Transaction`.

```
app.post("/webhook", async (req: any, res: any, next) => {
  const signature = req.get("X-Paycrest-Signature");
  if (!signature) return false;

  if (
    !verifyPaycrestSignature(req.body, signature, process.env.CLIENT_SECRET!)
  ) {
    return res.status(401).send("Invalid signature");
  }
  console.log("Webhook received:", req.body);
  try {
    const transaction = await prisma.transaction.create({
      data: {
        id: req.body.data.id,
        status: req.body.event,
      },
    });

    res.json({ data: transaction });
  } catch (err) {
    next(err);
  }
  res.status(200).send("Webhook received");
});

function verifyPaycrestSignature(
  requestBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  const calculatedSignature = calculateHmacSignature(requestBody, secretKey);
  return signatureHeader === calculatedSignature;
}

function calculateHmacSignature(data: string, secretKey: string): string {
  const key = Buffer.from(secretKey);
  const hash = crypto.createHmac("sha256", key);
  hash.update(data);
  return hash.digest("hex");
}
```
Next, we create a new endpoint that our frontend will start polling immediately after transaction initiation. It checks the DB if any transaction with the corresponding `id` exists in our DB. If it does, it returns the status.

```
app.get("/transactions/:id", async (req: any, res: any, next) => {
  const { id } = req.params;
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
  });

  res.json({ data: transaction ? transaction : 'Non-existent transaction' });
});
```

Your status can either be any of the following:

- `payment_order.pending`
- `payment_order.expired`
- `payment_order.settled`
- `payment_order.refunded`

Once you deploy your server and get the endpoint, you can listen to payment order events by configuring the Webhook URL in your [dashboard settings](https://app.paycrest.io/sender/settings). We trigger various events based on the status of the payment order. Our webhook events are sent exponentially until 24 hours from when the first one is sent.

![img](https://res.cloudinary.com/dfkuxnesz/image/upload/v1741202872/Screenshot_2025-03-05_at_20.26.46_d88w04.png)


If pending, your frontend would have to continue pollling till it gets back a conclusive response - either `expired`, `settled`, or `refunded`. 

**P.S**: This backend structure can be done in any custom way depending on your app as long as the webhook validates and stores the correct payload sent to it.

## Step-by-Step Tutorial: Building a Payment App with Sender API

In this tutorial, we will build a simple payment app that integrates the Sender API to enable off-ramp for users. The app will have a UI to interact with the API and handle the webhook logic.

### Prerequisites

Before we start, make sure you have the following installed:

- Node.js
- npm or yarn
- A code editor (e.g., Visual Studio Code)

### Step 1: Set Up the Project

1. Create a new directory for your project and navigate into it:

   ```bash
   mkdir payment-app
   cd payment-app
   ```

2. Initialize a new Node.js project:

   ```bash
   npm init -y
   ```

3. Install the required dependencies:

   ```bash
   npm install express body-parser axios
   ```

### Step 2: Create the Server

1. Create a new file named `server.js` in the root of your project directory.

2. Add the following code to `server.js` to set up a basic Express server:

   ```javascript
   const express = require('express');
   const bodyParser = require('body-parser');
   const axios = require('axios');

   const app = express();
   const port = 3000;

   app.use(bodyParser.json());

   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });
   ```

### Step 3: Create the Webhook Endpoint

1. Add the following code to `server.js` to create the webhook endpoint:

   ```javascript
   app.post('/webhook', async (req, res) => {
     const signature = req.get('X-Paycrest-Signature');
     if (!signature) return res.status(401).send('Invalid signature');

     if (!verifyPaycrestSignature(req.body, signature, process.env.CLIENT_SECRET)) {
       return res.status(401).send('Invalid signature');
     }

     console.log('Webhook received:', req.body);

     // Save the transaction to the database (you can use any database of your choice)
     // For simplicity, we'll just log the transaction to the console

     res.status(200).send('Webhook received');
   });

   function verifyPaycrestSignature(requestBody, signatureHeader, secretKey) {
     const calculatedSignature = calculateHmacSignature(requestBody, secretKey);
     return signatureHeader === calculatedSignature;
   }

   function calculateHmacSignature(data, secretKey) {
     const key = Buffer.from(secretKey);
     const hash = crypto.createHmac('sha256', key);
     hash.update(data);
     return hash.digest('hex');
   }
   ```

### Step 4: Create the Frontend

1. Create a new directory named `public` in the root of your project directory.

2. Create a new file named `index.html` inside the `public` directory.

3. Add the following code to `index.html` to create a simple UI for the payment app:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Payment App</title>
   </head>
   <body>
     <h1>Payment App</h1>
     <form id="payment-form">
       <label for="amount">Amount:</label>
       <input type="number" id="amount" name="amount" required>
       <br>
       <label for="token">Token:</label>
       <input type="text" id="token" name="token" required>
       <br>
       <label for="network">Network:</label>
       <input type="text" id="network" name="network" required>
       <br>
       <label for="institution">Institution:</label>
       <input type="text" id="institution" name="institution" required>
       <br>
       <label for="accountIdentifier">Account Identifier:</label>
       <input type="text" id="accountIdentifier" name="accountIdentifier" required>
       <br>
       <label for="accountName">Account Name:</label>
       <input type="text" id="accountName" name="accountName" required>
       <br>
       <label for="memo">Memo:</label>
       <input type="text" id="memo" name="memo">
       <br>
       <label for="returnAddress">Return Address:</label>
       <input type="text" id="returnAddress" name="returnAddress" required>
       <br>
       <label for="reference">Reference:</label>
       <input type="text" id="reference" name="reference" required>
       <br>
       <button type="submit">Create Order</button>
     </form>
     <div id="order-details"></div>
     <script>
       document.getElementById('payment-form').addEventListener('submit', async (event) => {
         event.preventDefault();

         const formData = new FormData(event.target);
         const orderParams = {
           amount: formData.get('amount'),
           token: formData.get('token'),
           network: formData.get('network'),
           recipient: {
             institution: formData.get('institution'),
             accountIdentifier: formData.get('accountIdentifier'),
             accountName: formData.get('accountName'),
             memo: formData.get('memo'),
           },
           returnAddress: formData.get('returnAddress'),
           reference: formData.get('reference'),
         };

         try {
           const response = await fetch('/create-order', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(orderParams),
           });

           const orderDetails = await response.json();
           document.getElementById('order-details').innerText = JSON.stringify(orderDetails, null, 2);
         } catch (error) {
           console.error('Error creating order:', error);
         }
       });
     </script>
   </body>
   </html>
   ```

### Step 5: Create the Order Endpoint

1. Add the following code to `server.js` to create the order endpoint:

   ```javascript
   app.post('/create-order', async (req, res) => {
     const orderParams = req.body;

     try {
       const response = await axios.post('https://api.paycrest.io/v1/sender/orders', orderParams, {
         headers: { 'API-Key': '208a4aef-1320-4222-82b4-e3bca8781b4b' },
       });

       res.json(response.data);
     } catch (error) {
       console.error('Error creating order:', error);
       res.status(500).send('Error creating order');
     }
   });
   ```

### Step 6: Run the App

1. Start the server:

   ```bash
   node server.js
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Fill in the form with the required details and click "Create Order".

4. The order details will be displayed on the page.

### Step 7: Handle Webhook Events

1. Add the following code to `server.js` to handle webhook events:

   ```javascript
   app.post('/webhook', async (req, res) => {
     const signature = req.get('X-Paycrest-Signature');
     if (!signature) return res.status(401).send('Invalid signature');

     if (!verifyPaycrestSignature(req.body, signature, process.env.CLIENT_SECRET)) {
       return res.status(401).send('Invalid signature');
     }

     console.log('Webhook received:', req.body);

     // Save the transaction to the database (you can use any database of your choice)
     // For simplicity, we'll just log the transaction to the console

     res.status(200).send('Webhook received');
   });

   function verifyPaycrestSignature(requestBody, signatureHeader, secretKey) {
     const calculatedSignature = calculateHmacSignature(requestBody, secretKey);
     return signatureHeader === calculatedSignature;
   }

   function calculateHmacSignature(data, secretKey) {
     const key = Buffer.from(secretKey);
     const hash = crypto.createHmac('sha256', key);
     hash.update(data);
     return hash.digest('hex');
   }
   ```

### Step 8: Test the App

1. Create a new order using the form on the frontend.

2. Check the server logs to see if the webhook event is received and logged.

3. Verify that the order details are displayed correctly on the frontend.

### Step 9: Deploy the App

1. Deploy the app to a hosting service of your choice (e.g., Heroku, Vercel, AWS).

2. Update the webhook URL in your [dashboard settings](https://app.paycrest.io/sender/settings) to point to your deployed app.

3. Test the app in the production environment to ensure everything works as expected.

### Step 10: Submit for Review

1. Create a Dropbox link to your project repository.

2. Submit the Dropbox link for review.

Congratulations! You have successfully built a payment app using the Sender API. You can now enable off-ramp for users in your community.

For more information and detailed documentation, visit the [Paycrest Documentation](https://docs.paycrest.io/).

## Demo App Repository

You can find the complete code for the demo app in the following repository:

[Demo App Repository](https://github.com/paycrest/demo-payment-app)
