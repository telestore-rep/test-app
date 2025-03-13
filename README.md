# TeleStore Test App

The application consists of two parts: client-side and server-side. Your application may not have a server-side, but some processes may differ depending on your implementation.

## Table of Contents
1. [**Client Side**](#client-side)
   1. [Obtaining User Information without app authorization](#obtaining-user-information-without-app-authorization)
      - [Data Validation](#data-validation)
        + [Server-Side Validation](#server-side-validation)
        + [Client-Side Validation](#client-side-validation)
   2. [User Authorization via TeleStore (Client Session)](#user-authorization-via-telestore-client-session)
      - [Authorization via Redirect](#authorization-via-redirect)
      - [Authorization via Popup](#authorization-via-popup)
   3. [Retrieving User Information](#retrieving-user-information)
   4. [Retrieving User Balance](#retrieving-user-balance)
   5. [Making a Transfer to the Developer Account](#making-a-transfer-to-the-developer-account)
   6. [Saving Application Data](#saving-application-data)
   7. [Retrieving Application Data](#retrieving-application-data)
2. [**Server Side**](#server-side)
    1. [TeleStore SDK](#telestore-sdk)
    2. [Creating a New Session (SDK)](#creating-a-new-session-sdk)
    3. [Retrieving Account Information](#retrieving-account-information)
    4. [Subscribing to SSE](#subscribing-to-sse)
    5. [Receiving Webhooks](#receiving-webhooks)
    6. [Retrieving Developer App List](#retrieving-developer-app-list)
    7. [Retrieving Developer Balance Information](#retrieving-developer-balance-information)
    8. [Creating a Transfer to a TeleStore User](#creating-a-transfer-to-a-telestore-user)
    9. [Retrieving TeleStore Transaction History](#retrieving-telestore-transaction-history)
    10. [Creating an Invoice](#creating-an-invoice)
    11. [Retrieving Invoice List](#retrieving-invoice-list)

## Client Side

### Obtaining User Information without app authorization

To retrieve user information, redirect the user to the following TeleStore URL:

```
https://web.tele.store/redirect_ext_auth.html?get_user_info=${APP_URL_ID}
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).

[User Redirection Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L152)

After retrieving the data, TeleStore redirects the user back to your application at the following URL:

```
{YOUR_APP_URL}/?usr={USER_INFO}&check={CHECK_HASH}
```

Where:
- `YOUR_APP_URL` is the URL of your application.
- `USER_INFO` is a base64-encoded string containing an object with user data.
- `CHECK_HASH` is a hash used for data validation.

The param `usr` contains a Base64 encoded string with a serialized JSON object:

```
usr=eyJpZCI6MTczMDIzMDQwMTgwOTIyOSwiZmlyc3RfbiI6IkZpcnN0bmFtZSIsInNlY29uZF9uIjoiTGFzdG5hbWUiLCJ1dGMiOiIyMDI1LTAyLTA0VDEzOjUyOjQ1LjYzNDk3WiJ9
```

```json
{
    "id": 1730230401809229, // TeleStore ID of the client
    "first_n": "Firstname", // first name
    "second_n": "Lastname", // last name
    "utc": "2025-02-04T13:52:45.63497Z" // timestamp
}
```

The param `check` contains the hashed HMACSHA256 with a developer's public key and user data in the form of a JSON string (UTF-8 encoded):

```
check=ehcX3ApkjpyV42SaeFRALNQ17S7Q0ksitgcXSWRTd3A
```

#### Data Validation

It is recommended to check the signature to ensure undisturbed communication. Validation can be performed either on the server-side or on the client-side (not recommended, because you need to store the public key on the client side).

For reference, here is the code snippet from the JavaScript implementation of a process on TeleStore's side:

```js
/** Get user info */
let userData = JSON.parse(atob(userEncoded));

/** Validate user info on server side */
const publicKeyBytes = Buffer.from(PUBLIC_USER_KEY, "hex");
const userDataUtf8Bytes = Buffer.from(JSON.stringify(userData), "utf-8");
const sha256Hash = crypto.createHash("sha256").update(publicKeyBytes).digest();
const hmacHash = crypto.createHmac("sha256", sha256Hash).update(userDataUtf8Bytes).digest();
const checkStrBase64 = toBase64Url(hmacHash);
```

Where:
- `PUBLIC_USER_KEY` is public key of your developer account.

If the signature is correct and the timestamp is not too old, then the developer has obtained valid TeleStore user data.

##### Server-Side Validation

You can validate the received data on your server by sending it from your client application and then performing the necessary validation steps.

[Server-Side Validation Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/validate_usr_info/route.ts#L21)

##### Client-Side Validation

We do not recommend this validation method, as it requires storing your application's public key on the client side, which may reduce the security of your application.

[Client-Side Validation Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L159)

### User Authorization via TeleStore (Client Session)

If your application does not have a server-side, you can authorize your user via TeleStore. This will allow you to perform several authorized actions, such as retrieving user information, checking their balance, making a transfer to your application account, saving, or loading application data.

#### Authorization via Redirect

You can authorize the user by redirecting to the following URL:

```
https://web.tele.store/redirect_ext_auth.html?auth_app=${APP_URL_ID}
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).

After successful authorization, the user is redirected to the following URL:

```
{YOUR_APP_URL}/?auth_code={AUTH_CODE}
```

Subsequently, the `auth_code` can be used to create a new session.

[Redirect Authentication Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L200)

#### Authorization via Popup

You can authorize the user by opening a URL inside a Popup window:

```
https://web.tele.store/redirect_ext_auth.html?auth_app=${APP_URL_ID}&popup=true
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).
- `popup=true` is a required parameter for successful authentication.

[Popup Authentication Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L207)

### Retrieving User Information

To retrieve user information, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/get_teleuser_details
```

[User Data Retrieval Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L125)

### Retrieving User Balance

To retrieve the user's balance, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/get_balance
```

[User Balance Retrieval Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L180)

### Making a Transfer to the Developer Account

To transfer funds from a user's account to your account, send an authorized request to:

```
POST https://web.tele.store/appauth/v1/make_payment
BODY {
    "amount": 10, // Transaction amount
    "currency": "TeleUSD",
    "tag": "Any description" // Tx description
}
```

[Transfer to Developer Account Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L232)

### Saving Application Data

You can save any necessary application information using an authorized request to:

```
POST https://web.tele.store/appauth/v1/save_app_user_data
BODY {
    <Any_JSON_data>
}
```

[Save Application Data Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L261)

### Retrieving Application Data

To retrieve application data, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/list_app_user_data
```

[Retrieve Application Data Example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/client/page.tsx#L281)

## Server Side

### TeleStore SDK

For easier development, we recommend using the [official TeleStore SDK](https://github.com/telestore-rep/SDK). It allows you to obtain new sessions, create invoices, retrieve transaction history and SSE updates, etc.

### Creating a New Session (SDK)

To create a new session, you need to generate a new User Key in your TeleStore developer account (Profile -> Security -> User keys).

[Example of session creation via SDK](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/sdk_connect/route.ts#L7)

### Retrieving Account Information

To retrieve developer account information, send an authorized request to:

```
GET https://web.tele.store/api/v1/teleuser_details
```

[Example of retrieving account information](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/teleuser_detailts/route.ts#L8)

### Subscribing to SSE

To subscribe to SSE events, create an object of the EventSource class ([recommended library](https://www.npmjs.com/package/eventsource)):

```ts
let esLink = new EventSource("https://web.tele.store/auth/v1/subscribe", {
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Cookie: `sid=${sid}`
      }
    })
});

esLink.onmessage = async (event: MessageEvent) => {
  console.log(event.data);
}

esLink.onerror = (error: unknown) => {
  console.error("EventSource error:", error);
}
```

[Example of SSE connection](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/connect_sse/route.ts#L17)

### Receiving Webhooks

To receive webhooks, add a new App URL (Profile -> Security -> Apps URLs), specifying the "Use for Webhooks" flag and the API method URL that will serve as a webhook. Example webhook URL:

```
POST https://test.tele.store/webhook
```

[Webhook example](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/webhook/route.ts#L10)

### Retrieving Developer App List

To retrieve the developer's app list, send an authorized request to:

```
GET https://web.tele.store/api/v1/dev_list_my_apps
```

[Example of retrieving developer app list](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/dev_list_apps/route.ts#L8)

### Retrieving Developer Balance Information

To retrieve developer balance information, send an authorized request to:

```
GET https://web.tele.store/trex/v1/wallet/get_balance
PARAMS {
    currency=TeleUSD
}
```

[Example of retrieving developer balance information](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/balance_info/route.ts#L8)

### Creating a Transfer to a TeleStore User

To create a transfer to a TeleStore user, send an authorized request to:

```
POST https://web.tele.store/trex/v1/wallet/internal_transfer
BODY {
    recipient: 123, // recipient ID
    currency: "TeleUSD",
    amount: 10, // transaction amount
    tag: "", // transaction description
}
```

You will receive a server response:

```
BODY {
    txId: 123, // transaction ID
    confirmCode: 123 // transaction confirmation code
}
```

The second request confirms the transaction:

```
POST https://web.tele.store/trex/v1/wallet/internal_transfer
PARAMS {
    confirmationTimetick=123, // transaction ID
    confirmationCode=123 // transaction confirmation code
}
BODY {
    recipient: 123, // recipient ID
    currency: "TeleUSD",
    amount: 10, // transaction amount
    tag: "", // transaction description
}
```

[Example of creating a transfer to a TeleStore user](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/server/page.tsx#L204)

### Retrieving TeleStore Transaction History

To retrieve transaction history, send an authorized request to:

```
GET https://web.tele.store/trex/v1/wallet/get_history_transactions
PARAMS {
    currencies=[TeleUSD],
    start="2022-05-10" // Start date (without time) UTC, defaults to 90 days before end if not set
    end="2022-05-10" // End date (without time) UTC, defaults to current date if not set
    next_key=123 // Last identifier for lazy loading
    tx_types=[] // Operation type filter
    limit=10 // Number of transactions in the sample, min - 10, max - 100
}
```

[Example of retrieving transaction history](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/get_transactions/route.ts#L9)

### Creating an Invoice

[Example of invoice creation via SDK](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/server/page.tsx#L175)

### Retrieving Invoice List

To retrieve the invoice list, send an authorized request to:

```
GET https://web.tele.store/trex/v1/list_tx_codes
PARAMS {
    currency=TeleUSD
}
```

[Example of retrieving invoice list](https://github.com/telestore-rep/test-app/blob/ff743c7db872b19f9ac69f32fabdf2c59dd6f737/src/app/api/get_invoices/route.ts#L8)
