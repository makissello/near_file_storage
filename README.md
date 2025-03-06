# file_storage

A decentralized file storage application built on NEAR Protocol with client-side encryption.

## Features

- Secure file storage on NEAR Protocol
- Client-side encryption with wallet-specific passwords
- File upload and download functionality
- Multiple file selection and batch download
- Modern, responsive UI

## How to Build Locally?

### Smart Contract

Install [`cargo-near`](https://github.com/near/cargo-near) and run:

```bash
cargo near build
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd test_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## How to Test Locally?

### Smart Contract Tests
```bash
cargo test
```

### Frontend Tests
```bash
cd test_frontend
npm test
# or
yarn test
```

## How to Deploy?

### Smart Contract

Deployment is automated with GitHub Actions CI/CD pipeline.
To deploy manually, install [`cargo-near`](https://github.com/near/cargo-near) and run:

```bash
cargo near deploy build-reproducible-wasm <account-id>
```

### Frontend

1. Build the frontend:
```bash
cd test_frontend
npm run build
# or
yarn build
```

2. Deploy the contents of the `test_frontend/out` directory to your preferred hosting service.

## Environment Variables

The frontend requires Pinata API credentials for file storage. Create a `.env.local` file in the `test_frontend` directory with:

- `NEXT_PUBLIC_PINATA_API_KEY`: Your Pinata API Key
- `NEXT_PUBLIC_PINATA_API_SECRET`: Your Pinata API Secret

You can get these credentials by signing up at [Pinata](https://app.pinata.cloud/register).

## Useful Links

- [cargo-near](https://github.com/near/cargo-near) - NEAR smart contract development toolkit for Rust
- [near CLI](https://near.cli.rs) - Interact with NEAR blockchain from command line
- [NEAR Rust SDK Documentation](https://docs.near.org/sdk/rust/introduction)
- [NEAR Documentation](https://docs.near.org)
- [NEAR StackOverflow](https://stackoverflow.com/questions/tagged/nearprotocol)
- [NEAR Discord](https://near.chat)
- [NEAR Telegram Developers Community Group](https://t.me/neardev)
- NEAR DevHub: [Telegram](https://t.me/neardevhub), [Twitter](https://twitter.com/neardevhub)
