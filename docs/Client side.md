# Client Side

On the client side of the application, you can obtain user information from parameters provided by the TeleStore application (simplified schema), or you can make a request to retrieve the user's session (client session).

## Table of Contents
1. [Obtaining User Information without app authorization (simplified schema)](#obtaining-user-information-without-app-authorization-simplified-schema)
   - [Data Validation](#data-validation)
     + [Server-Side Validation](#server-side-validation)
     + [Client-Side Validation](#client-side-validation)
2. [User Authorization via TeleStore (Client Session)](#user-authorization-via-telestore-client-session)
   - Authorization
     + [via Redirect](#authorization-via-redirect)
     + [via Popup](#authorization-via-popup)
   - [Retrieving User Information](#retrieving-user-information)
   - [Retrieving User Balance](#retrieving-user-balance)
   - [Making a Transfer to the Developer Account](#making-a-transfer-to-the-developer-account)
   - [Saving Application Data](#saving-application-data)
   - [Retrieving Application Data](#retrieving-application-data)

## Obtaining User Information without app authorization (simplified schema)

To retrieve user information, redirect the user to the following TeleStore URL:

```
https://web.tele.store/appauth.html?get_user_info=${APP_URL_ID}
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).

[User Redirection Example](../src/app/client/page.tsx#L152)

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

## Data Validation

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

### Server-Side Validation

You can validate the received data on your server by sending it from your client application and then performing the necessary validation steps.

[Server-Side Validation Example](../src/app/api/validate_usr_info/route.ts#L21)

### Client-Side Validation

We do not recommend this validation method, as it requires storing your application's public key on the client side, which may reduce the security of your application.

[Client-Side Validation Example](../src/app/client/page.tsx#L159)

## User Authorization via TeleStore (Client Session)

If your application does not have a server-side, you can authorize your user via TeleStore. This will allow you to perform several authorized actions, such as retrieving user information, checking their balance, making a transfer to your application account, saving, or loading application data.

### Authorization via Redirect

You can authorize the user by redirecting to the following URL:

```
https://web.tele.store/appauth.html?auth_app=${APP_URL_ID}
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).

After successful authorization, the user is redirected to the following URL:

```
{YOUR_APP_URL}/?auth_code={AUTH_CODE}
```

Subsequently, the `auth_code` can be used to create a new session.

[Redirect Authentication Example](../src/app/client/page.tsx#L200)

### Authorization via Popup (doesn't work in Telegram mini-app browser)

You can authorize the user by opening a URL inside a Popup window:

```
https://web.tele.store/appauth.html?auth_app=${APP_URL_ID}&popup=true
```

Where:
- `APP_URL_ID` is the URL identifier of your application registered in TeleStore (Profile -> Security -> App URL's).
- `popup=true` is a required parameter for successful authentication.

[Popup Authentication Example](../src/app/client/page.tsx#L207)

## Retrieving User Information

To retrieve user information, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/get_teleuser_details
```

[User Data Retrieval Example](../src/app/client/page.tsx#L125)

## Retrieving User Balance

To retrieve the user's balance, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/get_balance
```

[User Balance Retrieval Example](../src/app/client/page.tsx#L180)

## Making a Transfer to the Developer Account

To transfer funds from a user's account to your account, send an authorized request to:

```
POST https://web.tele.store/appauth/v1/make_payment
BODY {
    "amount": 10, // Transaction amount
    "currency": "TeleUSD",
    "tag": "Any description" // Tx description
}
```

[Transfer to Developer Account Example](../src/app/client/page.tsx#L232)

## Saving Application Data

You can save any necessary application information using an authorized request to:

```
POST https://web.tele.store/appauth/v1/save_app_user_data
BODY {
    <Any_JSON_data>
}
```

[Save Application Data Example](../src/app/client/page.tsx#L261)

## Retrieving Application Data

To retrieve application data, send an authorized request to:

```
GET https://web.tele.store/appauth/v1/list_app_user_data
```

[Retrieve Application Data Example](../src/app/client/page.tsx#L281)
