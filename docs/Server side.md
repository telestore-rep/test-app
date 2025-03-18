# Server Side

## Table of Contents
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

## TeleStore SDK

For easier development, we recommend using the [official TeleStore SDK](https://github.com/telestore-rep/SDK). It allows you to obtain new sessions, create invoices, retrieve transaction history and SSE updates, etc.

## Creating a New Session (SDK)

To create a new session, you need to generate a new User Key in your TeleStore developer account (Profile -> Security -> User keys).

[Example of session creation via SDK](../src/app/api/sdk_connect/route.ts#L7)

## Retrieving Account Information

To retrieve developer account information, send an authorized request to:

```
GET https://web.tele.store/api/v1/teleuser_details
```

[Example of retrieving account information](../src/app/api/teleuser_detailts/route.ts#L8)

## Subscribing to SSE

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

[Example of SSE connection](../src/app/api/connect_sse/route.ts#L17)

## Receiving Webhooks

To receive webhooks, add a new App URL (Profile -> Security -> Apps URLs), specifying the "Use for Webhooks" flag and the API method URL that will serve as a webhook. Example webhook URL:

```
POST https://test.tele.store/webhook
```

[Webhook example](../src/app/webhook/route.ts#L10)

## Retrieving Developer App List

To retrieve the developer's app list, send an authorized request to:

```
GET https://web.tele.store/api/v1/dev_list_my_apps
```

[Example of retrieving developer app list](../src/app/api/dev_list_apps/route.ts#L8)

## Retrieving Developer Balance Information

To retrieve developer balance information, send an authorized request to:

```
GET https://web.tele.store/trex/v1/wallet/get_balance
PARAMS {
    currency=TeleUSD
}
```

[Example of retrieving developer balance information](../src/app/api/balance_info/route.ts#L8)

## Creating a Transfer to a TeleStore User

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

[Example of creating a transfer to a TeleStore user](../src/app/server/page.tsx#L204)

## Retrieving TeleStore Transaction History

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

[Example of retrieving transaction history](../src/app/api/get_transactions/route.ts#L9)

## Creating an Invoice

[Example of invoice creation via SDK](../src/app/server/page.tsx#L175)

## Retrieving Invoice List

To retrieve the invoice list, send an authorized request to:

```
GET https://web.tele.store/trex/v1/list_tx_codes
PARAMS {
    currency=TeleUSD
}
```

[Example of retrieving invoice list](../src/app/api/get_invoices/route.ts#L8)
