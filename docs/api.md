---
sidebar_position: 3
---

# APIs

Here are some of the endpoints you'd require to get neccessary information to perform transactions

```
baseUrl = https://api.paycrest.io/v1
```

---

## Fetch Token Rate

Endpoint: `{baseUrl}/rates/:token/:amount/:fiat`
Method: `GET`

### Path Parameters

- **`token`**: The cryptocurrency token for which you wish to fetch the rate.
- **`amount`**: The amount of the cryptocurrency token. Larger amounts could have better rates.
- **`fiat`**: The local currency to which you want to convert the cryptocurrency token amount.

### Query Parameters

- **`provider_id`**: The ID of a provider. Use this to get the rate of a specific liquidity provider

### Response Format

A successful response from the `GET {baseUrl}/rates/:token/:amount/:fiat` endpoint will contain a JSON object with the following structure:

```json
{
  "message": "OK",
  "status": "success",
  "data": "1500"
}
```

```jsx live
function App() {
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTokenRate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.paycrest.io/v1/rates/usdt/1/ngn"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let res = await response.json();
      setRate(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching NGN rates:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchTokenRate}>
        {!loading ? `Fetch token` : `Loading rates...`}
      </button>
      <div>{rate}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>

---

## Fetch Supported Institutions

Endpoint: `{baseUrl}/institutions/:currency_code`
Method: `GET`

### Response Format

A successful response from the `GET {baseUrl}/institutions/:currency_code` endpoint will contain a JSON object with the following structure:

```json
{
  "message": "OK",
  "status": "success",
  "data": [
    {
      "name": "GT Bank Plc",
      "code": "GTBINGLA",
      "type": "bank" // bank or mobile_money
    },
    {
      "name": "First Bank of Nigeria",
      "code": "FBNINGLA",
      "type": "bank" // bank or mobile_money
    }
  ]
}
```

```jsx live
function App() {
  const [institutions, setInstitutions] = useState("");
  const [loading, setLoading] = useState(false);

  const getInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.paycrest.io/v1/institutions/ngn"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let res = await response.json();
      setInstitutions(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching NGN institutions:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getInstitutions}>
        {!loading ? `Fetch NGN institutions` : `Loading NGN institutions...`}
      </button>
      <div>{institutions}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>

---

## Verify Account

Endpoint: `{baseUrl}/verify-account`
Method: `POST`

### Payload

A JSON object containing the recipient account details.

| Field name          | Type     | Required | Comment                                                                                                                                                                                     |
| ------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `institution`       | `string` | Yes      | The `code` of the financial institution receving the local currency. [Fetch supported institutions](https://www.notion.so/Sender-API-Documentation-10d2482d45a2802da265f53e212f3eae?pvs=21) |
| `accountIdentifier` | `string` | Yes      | The recipient's bank or mobile money account number                                                                                                                                         |

```json
{
  "institution": "FBNINGLA",
  "accountIdentifier": "123456789"
}
```

### Response Format

A JSON object containing the receive address to accept the cryptocurrency token.

```json
{
  "message": "Account name was fetched successfully",
  "status": "success",
  "data": "John Doe" // will return "OK" if PSP doesn't support name resolution
}
```

```jsx live
function App() {
  const [bankDeets, setBankDeets] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyBank = async () => {
    const bankData = {
      institution: "KUDANGPC",
      accountIdentifier: "12345678953", // sample account identifier
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.paycrest.io/v1/verify-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bankData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let res = await response.json();
      setBankDeets(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching NGN rates:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={verifyBank}>
        {!loading ? `Fetch bank details` : `Loading bank details...`}
      </button>
      <div>{bankDeets}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>

---

## Fetch Supported Currencies

Endpoint: `{baseUrl}/currencies`
Method: `GET`

### Response Format

A successful response from the `GET {baseUrl}/currencies` endpoint will contain a JSON object with the following structure:

```json
{
  "message": "OK",
  "status": "success",
  "data": [
    {
      "code": "XOF-BEN",
      "name": "West African CFA franc",
      "shortName": "Céfa Benin",
      "decimals": 2,
      "symbol": "CFA",
      "marketRate": "599.5"
    },
    {
      "code": "NGN",
      "name": "Nigerian Naira",
      "shortName": "Naira",
      "decimals": 2,
      "symbol": "₦",
      "marketRate": "1629.59"
    },
    {
      "code": "KES",
      "name": "Kenyan Shilling",
      "shortName": "KES",
      "decimals": 2,
      "symbol": "KSh",
      "marketRate": "129.3"
    }
  ]
}
```

```jsx live
function App() {
  const [currencies, setCurrencies] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrencies = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.paycrest.io/v1/currencies");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let res = await response.json();
      console.log(res);
      setCurrencies(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getCurrencies}>
        {!loading ? `Fetch currencies` : `Loading currencies...`}
      </button>
      <div>{currencies}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>

---

## Fetch Payment Order by ID

Endpoint: `{baseUrl}/sender/orders/:id`
Method: `GET`

### Path Parameters

- `id`: The unique identifier for the order

### Headers
It requires an `API-Key` header, which is the sender's `Clent ID` from the dashboard.

### Response Format

A JSON object containing detailed information about the fetched payment order.

```json
{
  "message": "The order has been successfully retrieved",
  "status": "success",
  "data": {
    "id": "uuid-string",
    "amount": "100.00",
    "amountPaid": "80.00",
    "amountReturned": "0.00",
    "token": "USDT",
    "senderFee": "0.50",
    "transactionFee": "0.10",
    "rate": "1500",
    "network": "polygon",
    "gatewayId": "gw-123",
    "reference": "unique-reference",
    "recipient": {
      "institution": "GTBINGLA",
      "accountIdentifier": "123456789",
      "accountName": "John Doe",
      "memo": "Payment from John Doe"
    },
    "fromAddress": "0x123...",
    "returnAddress": "0x123...",
    "receiveAddress": "0x123...",
    "feeAddress": "0x123...",
    "createdAt": "2024-06-26T12:34:56Z",
    "updatedAt": "2024-06-27T12:34:56Z",
    "txHash": "abc123",
    "status": "initiated",
    "transactions": [
      {
        "id": "uuid-string",
        "gatewayId": "gw-123",
        "status": "crypto_deposited",
        "txHash": "abc123",
        "createdAt": "2024-06-26T12:34:56Z"
      }
    ]
  }
}
```

```jsx live
function App() {
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  const getOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.paycrest.io/v1/sender/orders/:id",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "208a4aef-1320-4222-82b4-e3bca8781b4b",
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let res = await response.json();
      console.log(res);
      setOrder(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getOrder}>
        {!loading ? `Fetch order` : `Loading the order...`}
      </button>
      <div>{order}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>

---

## Fetch All Payment Orders

Endpoint: `{baseUrl}/sender/orders`
Method: `GET`

### Query Parameters

- `ordering`: Sorts the results based on the specified field.
- `status`: Filters orders by their status.
- `token`: Filters orders by their token.
- `network`: Filters orders by their network.
- `page`: Specifies the page number for pagination.
- `pageSize`: Specifies the number of items per page for pagination.

### Headers
It requires an `API-Key` header, which is the sender's `Clent ID` from the dashboard.

### Response Format

A JSON array containing detailed information about each fetched payment order.

```json
{
    "message":"Payment orders retrieved successfully",
    "status":"success",
    "data":
        {
          "total": 100,
          "page": 1,
          "pageSize": 20,
          "orders":
                [
                    {
                      "id": "uuid-string",
                      "amount": "100.00",
                      "amountPaid": "80.00",
                      "amountReturned": "0.00",
                      "token": "unique-token-id",
                      "senderFee": "0.50",
                      "transactionFee": "0.10",
                      "rate": "1500",
                      "network": "polygon",
                      "gatewayId": "0x123...",
                      "reference": "unique-reference",
                      "recipient": {
                        "institution": "GTBINGLA",
                        "accountIdentifier": "123456789",
                        "accountName": "John Doe",
                        "memo": "Payment from John Doe"
                      },
                      "fromAddress": "0x123...",
                      "returnAddress": "0x123...",
                      "receiveAddress": "0x123...",
                      "feeAddress": "0x123...",
                      "createdAt": "2024-06-26T12:34:56Z",
                      "updatedAt": "2024-06-27T12:34:56Z",
                      "txHash": "abc123...",
                      "status": "settled",
                    }
                    ...
                ]
        }
}
```

```jsx live
function App() {
  const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.paycrest.io/v1/sender/orders", {
        headers: {
          "Content-Type": "application/json",
          "API-Key": "208a4aef-1320-4222-82b4-e3bca8781b4b",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let res = await response.json();
      console.log(res);
      setOrders(JSON.stringify(res));
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getOrders}>
        {!loading ? `Fetch orders` : `Loading the orders...`}
      </button>
      <div>{orders}</div>
    </div>
  );
}
```

<BonadocsWidget
  widgetConfigUri="ipfs://QmNYcvyRbqTfTidr98gwJfhmh4mRZF4iWAvZSTNLsuu1M4"
  contract="Gateway"
  functionKey="0xf2507.function.0x809804f7"
/>
