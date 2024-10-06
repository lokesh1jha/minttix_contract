```
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Buffer } from 'buffer';
import { Idl, Program as AnchorProgram } from '@project-serum/anchor';

// Replace with your program ID and IDL
const PROGRAM_ID = new PublicKey('3egzXoTuREpyAbqyw2zJBx6vUXnVGcVZEMVeqxFQBQZU');
const IDL: Idl = {/* Your IDL here */};

async function createEvent(
  program: AnchorProgram,
  provider: AnchorProvider,
  name: string,
  uri: string,
  ticketPrice: number,
  nftMintPrice: number,
  maxTickets: number
) {
  // Generate the collection address using PDA
  const [collectionAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('collection'), provider.wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Create the event (collection)
  const tx = await program.methods.createCollection(
    name,
    uri,
    new anchor.BN(ticketPrice),
    new anchor.BN(nftMintPrice),
    new anchor.BN(maxTickets)
  )
  .accounts({
    collection: collectionAccount,
    signer: provider.wallet.publicKey,
    payer: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

  console.log("Event created with transaction ID:", tx);
  
  // Return the collection address
  return collectionAccount;
}

async function buyTicket(
  program: AnchorProgram,
  provider: AnchorProvider,
  collectionAccount: PublicKey
) {
  const [assetAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('asset'), provider.wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  // Buy a ticket for the created event
  const tx = await program.methods.buyTicket()
  .accounts({
    buyer: provider.wallet.publicKey,
    collection: collectionAccount,
    asset: assetAccount,
    organizer: provider.wallet.publicKey, // Assuming the organizer is the same as the buyer
    platform: provider.wallet.publicKey, // Assuming the platform is the same as the buyer
    mplCoreProgram: new PublicKey('MPL_CORE_PROGRAM_ID'), // Replace with your MPL Core Program ID
    systemProgram: SystemProgram.programId,
  })
  .rpc();

  console.log("Ticket bought with transaction ID:", tx);
}

async function main() {
  // Initialize the provider and program
  const connection = new anchor.web3.Connection('https://api.mainnet-beta.solana.com'); // Replace with your cluster
  const wallet = /* Your wallet here */;
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  const program = new Program(IDL, PROGRAM_ID, provider);

  // Create an event
  const collectionAddress = await createEvent(program, provider, "My Event", "https://my-event-uri.com", 1000000, 500000, 100);

  // Buy a ticket for the created event
  await buyTicket(program, provider, collectionAddress);
}

// Run the main function
main().catch(err => {
  console.error(err);
});
