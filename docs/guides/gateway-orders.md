# Gateway Orders

In this guide, we will create an off-ramp order to convert USDT to Nigerian naira(NGN).

## Setup

To create an off-ramp order, we have to first import certain values from `ethers` and define both the stablecoin's token contract and Paycrest's Gateway contract.

In this example, we're performing the transaction on the `arbitrum` network and we're using the appropriate contract addresses and `ABI` per contract. We then define variables for the transaction's exchange rate and the user's bank account.

### Import Values

```
import { ethers, Contract, formatUnits, parseUnits, BigNumber, ZeroAddress } from "ethers";

// define token contract and gateway contract
const usdtContract = {
  address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  abi:  [
  "function transfer(address _to, uint256 _value) public returns (bool)",
    ];
}

const gatewayContract = {
 address: '0xE8bc3B607CfE68F47000E3d200310D49041148Fc'
 abi: '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"splitOrderId","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"orderId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"liquidityProvider","type":"address"},{"indexed":false,"internalType":"uint96","name":"settlePercent","type":"uint96"}],"name":"OrderSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"orderId","type":"bytes32"}],"name":"OrderRefunded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"protocolFee","type":"uint64"}],"name":"ProtocolFeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolFee","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"orderId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"},{"indexed":false,"internalType":"string","name":"messageHash","type":"string"}],"name":"OrderCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SenderFeeTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"treasuryAddress","type":"address"}],"name":"SetFeeRecipient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":true,"internalType":"address","name":"treasuryAddress","type":"address"}],"name":"ProtocolAddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":true,"internalType":"address","name":"value","type":"address"},{"indexed":false,"internalType":"uint256","name":"status","type":"uint256"}],"name":"SettingManagerBool","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getFeeDetails","outputs":[{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint96","name":"_rate","type":"uint96"},{"internalType":"address","name":"_senderFeeRecipient","type":"address"},{"internalType":"uint256","name":"_senderFee","type":"uint256"},{"internalType":"address","name":"_refundAddress","type":"address"},{"internalType":"string","name":"messageHash","type":"string"}],"name":"createOrder","outputs":[{"internalType":"bytes32","name":"orderId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"isTokenSupported","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_orderId","type":"bytes32"}],"name":"getOrderInfo","outputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"senderFeeRecipient","type":"address"},{"internalType":"uint256","name":"senderFee","type":"uint256"},{"internalType":"uint256","name":"protocolFee","type":"uint256"},{"internalType":"bool","name":"isFulfilled","type":"bool"},{"internalType":"bool","name":"isRefunded","type":"bool"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint96","name":"currentBPS","type":"uint96"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct IGateway.Order","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_splitOrderId","type":"bytes32"},{"internalType":"bytes32","name":"_orderId","type":"bytes32"},{"internalType":"address","name":"_liquidityProvider","type":"address"},{"internalType":"uint64","name":"_settlePercent","type":"uint64"}],"name":"settle","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"value","type":"address"},{"internalType":"uint256","name":"status","type":"uint256"}],"name":"settingManagerBool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"value","type":"address"}],"name":"updateProtocolAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"bytes32","name":"_orderId","type":"bytes32"}],"name":"refund","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"_protocolFeePercent","type":"uint64"}],"name":"updateProtocolFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}]'
}

const { address: usdtAddress, abi: usdtAbi } = usdtContract;
const { address: gatewayAddress, abi: gatewayAbi } = gatewayContract;
let getRate, getAccount;
```

### Define Variables

Next, let's define our user's `signer` that'll be used to initiate the contracts. One thing to note is that you require the `provider` will to get the signer.

```
// Defining provider, signer, and the contracts

const provider = new ethers.BrowserProvider(window.ethereum);

// Initiating signers
const signer = await provider.getSigner();

// Initiating contracts
const gateway = new Contract(gatewayAddress, gatewayAbi, signer)
const usdtAsset = new Contract(
  usdtAddress,
  usdtAbi,
  signer,
);
```

Let's verify the user's account by taking their account number and bank to generate the account name. Secondly, let's get the current exchange rate for amount of naira(NGN) per USDT that would be exchanged for this transaction.

Both requests are performed in parallel so it can be completed faster.

P.S: Keep in mind that for the `bankData` you can know the correct `institution` code from [here](/api#fetch-supported-institutions)

## Fetch naira rate and bank verification

```
// get the  nairaRate and verify account number
const nairaRate = "https://api.paycrest.io/v1/rates/usdt/1/ngn";
const accountName = "https://api.paycrest.io/v1/verify-account";

  const bankData = {
    institution: "KUDANGPC",
    accountIdentifier: "12345678953"
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

    getRate = await nairaRate.json();
    getAccount = await accountName.json();

    console.log("naira rate response:", getRate.data);
    console.log("get account response:", getAccount.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
```

## Bank Data Encryption

Next, encrypt the user's bank data in a message hash. Here, we fetch the aggregator's public key using `fetchAggregatorPublicKey()`. Then, we generate the hash by passing the bank data and key into the `publicKeyEncrypt()` function.

```
// Encrypt arbitrary data with a public key
async function publicKeyEncrypt(data, publicKeyPEM) {
  // First, we need to convert PEM to a format Web Crypto API can use
  function pemToArrayBuffer(pem) {
    const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');
    const binary = atob(b64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      arr[i] = binary.charCodeAt(i);
    }
    return arr.buffer;
  }

  // Convert PEM to ArrayBuffer
  const publicKeyBuffer = pemToArrayBuffer(publicKeyPEM);

  // Import the public key
  const publicKey = await self.crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );

  // Encrypt the data
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const encrypted = await self.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    dataBuffer
  );

  // Convert the encrypted data to base64 for easy transmission
  return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
}

// Fetch public key of aggregator
const fetchAggregatorPublicKey = async () => {
  try {
    const response = await fetch("https://api.paycrest.io/v1/pubkey");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching aggregator public key:", error);
    throw error;
  }
};

// Encrypt recipient details
const recipient = {
  accountIdentifier: "12345678953",
  accountName: getAccount.data,
  institution: "KUDANGPC",
  providerId: "PROVIDER_ID", // You'll need to contact us to receive an ID
  memo: "N/A",
};

const publicKey = await fetchAggregatorPublicKey();
const messageHash = await publicKeyEncrypt(recipient, publicKey.data);

console.log(publicKey, messageHash);
```

## Approve USDT token

Before we can debit USDT from the user's wallet, we need them to confirm the `approve` method on the `usdtAsset` contract by passing in the amount(`usdtAmount`) and the `gatewayAddress`.

We define the amount by using `parseUnits` from ethers. It takes in the amount in string and the token's decimal. In this case, USDT's decimal is `6`.

```
// approve on USDT
const usdtAmount = parseUnits('100', 6);

const approveTx =
  await usdtAsset.approve(gatewayAddress, usdtAmount);

const approveRct = await approveTx.wait();

console.log(approveRct.logs)
```

## Create Order

Finally, we can now make the order. We make use of the [createOrder](#createOrder) method on the gateway.

```
// create order through the gateway contract

const refundAddress = "0x344de...." // this is the user's address to pay into for refunds

try {
  const createOrderTx = await gateway.createOrder(
    usdtAddress,
    parseUnits('10', 6),
    Number(getRate.data),
    ZeroAddress,
    0,
    refundAddress,
    messageHash
  )

  const createOrderRct = await createOrderTx.wait();

  const orderLog = createOrderRct.logs.find((l) => l.fragment?.name === "OrderCreated")

  console.log("emittedCreatedOrder", {
    refundAddress: orderLog.args[0],
    token: orderLog.args[1],
    amount: orderLog.args[2],
    fee: orderLog.args[3],
    orderId: orderLog.args[4],
    rate: orderLog.args[5],
    messageHash: orderLog.args[6]
  })
} catch (error) {
  parseEthersError(error, sablier)
  console.error(error)
}
```

We pass in the `token`, `amount`, `rate`, `senderFeeRecipient`, `senderFee`, `refundAddress`, `messageHash` respectively. Then we get back the `emittedCreatedOrder` event that's logged.

## Building a Demo App with UI

To help you understand how to integrate the Gateway contract into an external app, we have created a demo app with a user interface. This demo app demonstrates how to interact with the Gateway contract to create off-ramp orders.

### Step-by-Step Guide

1. **Clone the Demo App Repository**: Start by cloning the demo app repository from GitHub. You can find the repository [here](https://github.com/paycrest/demo-app).

   ```bash
   git clone https://github.com/paycrest/demo-app.git
   cd demo-app
   ```

2. **Install Dependencies**: Install the required dependencies for the demo app.

   ```bash
   npm install
   ```

3. **Configure Environment Variables**: Create a `.env` file in the root directory of the project and add the necessary environment variables. You can find the required variables in the `.env.example` file.

4. **Run the App**: Start the development server to run the demo app.

   ```bash
   npm start
   ```

5. **Explore the Code**: Open the project in your favorite code editor and explore the code to understand how the integration with the Gateway contract is implemented.

6. **Test the App**: Use the demo app to create off-ramp orders and see how it interacts with the Gateway contract.

## Submissions for Review

If you have built your own app or made modifications to the demo app, you can submit your work for review. Please use the following [Dropbox link](https://dropbox.com/) to submit your app for review.

We look forward to seeing your submissions and providing feedback!

