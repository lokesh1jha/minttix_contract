import * as anchor from '@project-serum/anchor';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
// import { NftEventPlatform } from '../target/types/nft_event_platform'; // Adjust path to the generated IDL file

describe('nft_event_platform', () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the IDL
  const idl = require('../target/idl/nft_event_platform.json');

  // Create a Program object
  const program = new Program(idl, new PublicKey("55fbYsCqEjoiUDBKjDMqkKn3SkmVErexhTmfkpPz8ySV"), provider);

  let collectionPDA: PublicKey;
  let collectionBump: number;
  let assetPDA: PublicKey;
  let assetBump: number;
  const eventOrganizer = provider.wallet.publicKey;
  const ticketPrice = new anchor.BN(1000000); // 1 SOL in lamports
  const maxTickets = new anchor.BN(100); // Max 100 tickets

  interface MyBaseCollectionV1 {
    name: Uint8Array;
    uri: Uint8Array;
    ticketPrice: anchor.BN;
    maxTickets: anchor.BN;
    organizer: PublicKey;
    bump: number;
  }

  // Payer is the event organizer
  const payer = provider.wallet;
  const buyer = anchor.web3.Keypair.generate(); // A Keypair has a secretKey

  const collectionName = 'Event Name';
  const collectionUri = 'https://example.com/metadata';

  before(async () => {
    [collectionPDA, collectionBump] = await PublicKey.findProgramAddress(
      [Buffer.from("collection"), eventOrganizer.toBuffer()],
      program.programId
    );

    [assetPDA, assetBump] = await PublicKey.findProgramAddress(
      [Buffer.from("asset"), collectionPDA.toBuffer()],
      program.programId
    );
  });

  it('Creates a collection (event)', async () => {
    await program.methods
      .createCollection(collectionName, collectionUri, ticketPrice, maxTickets)
      .accounts({
        signer: eventOrganizer,
        payer: payer.publicKey,
        collection: collectionPDA,
        mplCoreProgram: new PublicKey('MetaPlex Core Program ID'),
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    const collectionAccount = await program.account.myBaseCollectionV1.fetch(collectionPDA) as MyBaseCollectionV1;

    assert.strictEqual(collectionAccount.ticketPrice.toString(), ticketPrice.toString());
    assert.strictEqual(collectionAccount.maxTickets.toString(), maxTickets.toString());
    assert.strictEqual(collectionAccount.organizer.toString(), eventOrganizer.toString());

    assert.strictEqual(Buffer.from(collectionAccount.name).toString('utf-8').trim(), collectionName);
    assert.strictEqual(Buffer.from(collectionAccount.uri).toString('utf-8').trim(), collectionUri);
  });

  it('Buys a ticket (mints an NFT)', async () => {
    const buyer = anchor.web3.Keypair.generate();

    const airdropSig = await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(airdropSig);

    await program.methods
      .buyTicket()
      .accounts({
        buyer: buyer.publicKey,
        collection: collectionPDA,
        asset: assetPDA,
        organizer: eventOrganizer,
        platform: provider.wallet.publicKey,
        mplCoreProgram: new PublicKey('MetaPlex Core Program ID'),
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    const collectionAccountAfter = await program.account.myBaseCollectionV1.fetch(collectionPDA);

    // Optionally, you can add other assertions here, like checking the funds transferred or NFT minted
    console.log("Ticket purchased successfully, NFT minted.");
  });
});
