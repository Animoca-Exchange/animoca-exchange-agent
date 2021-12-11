# Animoca Exchange Agent

### Requirements

 - Node.js v16

### Setup

0. Clone this repository and build
```
git clone https://github.com/Animoca-Exchange/animoca-exchange-agent
npm install
npm run build
```

1. Configure your agent
```shell
cp example.agent.config.json agent.config.json
nano agent.config.json
```

2. Replace HOT_WALLET_PRIVATE_KEY with the wallet key that will sign the withdrawals
3. Update the webhook listener port if required
4. Take note of your public IP

5. Run the agent
```shell
npm run start:agent
```

5. Or with [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) (recommended for production)
```shell
pm2 start dist/index.js --name AnimocaXAgent
```

6. Check if the webhook deposit_handler endpoint is working
```shell
curl -XPOST "https://<PUBLIC_IP>:PORT/deposit_handler" --data '{}'
```

Organization Registration

Step 1: Register the Org (Game Developer/Studio)
```shell
curl --request POST \
  --url https://polygon.gamingnablock.com.br/animoca_exchange/register_org \
  --header 'Content-Type: application/json' \
  --data '{
	"orgName": "Example Studio",
	"webhookUrl": "https://<PUBLIC_IP>:PORT"
}'
```
The response should look like:
```shell
{
  "status": true,
  "data": {
    "orgName": "Example Studio",
    "webhookUrl": "https://<PUBLIC_IP>:PORT",
    "accessKey": "523ca37f03e10bf47c6c4551bce4c04d9788099af9e9b19539fea4b98161b3fd",
    "jwtSecret": "1d2d7737773051f69f4cff257148d0df607c9388ba1b30bb74ac9972baa3f868",
    "_id": "61b41e113f8a3457e3027a85",
    "__v": 0
  }
}
```

Save your **_id**, **accessKey** and **jwtSecret**

Step 2: Add a wallet to monitor
```shell
curl --request POST \
  --url https://polygon.gamingnablock.com.br/animoca_exchange/add_wallet \
  --header 'Content-Type: application/json' \
  --data '{
	"orgId": "<ORG_ID>",
	"name": "Example Wallet 1",
	"accessKey": "accessKey",
	"address": "<WALLET_ADDRESS>"
}'
```

Step 3: Request signed token, to be used on withdrawal validation
```shell
curl --request POST \
  --url hthttps://polygon.gamingnablock.com.br/animoca_exchange/create_signed_token \
  --header 'Content-Type: application/json' \
  --data '{
	"orgId": "<ORG_ID>",
	"accessKey": "accessKey",
	"address": "<TOKEN_ADDRESS>",
	"userId": "<IN_GAME_USER_ID>",
	"maxTransfer": "5000"
}'
```

The response will be a Json Web Token that must be passed to the user via the withdrawal button URL.

Step 4: After setting the destination address and the amount, the process is completed by the user calling **validate_withdrawal**, 
authorized by the aforementioned JWT (**<JWT_STRING>**)
```shell
curl --request POST \
  --url https://polygon.gamingnablock.com.br/animoca_exchange/validate_withdrawal \
  --header 'Authorization: Bearer <JWT_STRING>' \
  --header 'Content-Type: application/json' \
  --data '{
	"destinationAddress": "<DESTINATION_WALLET>",
	"tokenAmount": "<AMOUNT_TO_TRANSFER>"
}'
```
