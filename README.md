# Minttix Smart Contract

## Overview

Minttix is a decentralized ticketing platform built on the Solana blockchain. This project utilizes NFTs (Non-Fungible Tokens) for ticketing, allowing event organizers to issue unique digital tickets that can be securely bought, sold, and transferred. The smart contract is developed using Anchor, a framework for building Solana programs.

## Features

- **NFT-based Ticketing:** Each ticket is represented as a unique NFT, ensuring authenticity and uniqueness.
- **Event Creation:** Event organizers can create events with specific metadata, including ticket prices and maximum ticket supply.
- **Secure Transactions:** All transactions are handled on the Solana blockchain, ensuring security and transparency.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lokesh1jha/minttix_contract
   cd minttix_contract
   ```

2. Install the necessary dependencies:

   ```bash
   anchor build
   ```

### Commands

- **Build the Program:**

   Compile the smart contract:

   ```bash
   anchor build
   ```

- **Deploy the Program:**

   Deploy the compiled smart contract to the Solana blockchain:

   ```bash
   anchor deploy
   ```

- **Run Tests:**

   Run the test suite to ensure that the smart contract functions as expected:

   ```bash
   anchor test
   ```

## Usage

### Creating an Event

To create an event, use the `create_collection` function in the smart contract, providing the necessary parameters like event name, URI, ticket price, NFT mint price, and maximum tickets.

### Buying a Ticket

To buy a ticket, call the `buy_ticket` function in the smart contract. This function will handle the payment process and mint an NFT representing the ticket.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## Issues

Link: [Solana deploy "account data too small for instruction"](https://stackoverflow.com/questions/71267943/solana-deploy-account-data-too-small-for-instruction)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries, please reach out to [lokesh9jha@example.com].
