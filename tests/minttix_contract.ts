// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { NftEventPlatform } from "../target/types/nft_event_platform";

// describe("minttix_contract", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.NftEventPlatform as Program<NftEventPlatform>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });


/*
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MinttixContract } from "../target/types/minttix_contract";
import { Keypair } from "@solana/web3.js";

describe("nft_event_platform", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MinttixContract as Program<MinttixContract>;

  // Set up variables for testing
  let collectionKeypair: Keypair;
  let collectionAccount: anchor.web3.PublicKey;
  const name = "Test Event";
  const uri = "https://example.com/collection";
  const ticketPrice = 1000000; // 1 SOL in lamports
  const maxTickets = 10;

  it("Creates a collection!", async () => {
    collectionKeypair = Keypair.generate();
    collectionAccount = collectionKeypair.publicKey;

    const tx = await program.methods
      .createCollection(name, uri, ticketPrice, maxTickets)
      .accounts({
        signer: anchor.getProvider().wallet.publicKey,
        payer: anchor.getProvider().wallet.publicKey,
        collection: collectionAccount,
        mplCoreProgram: anchor.web3.SYSVAR_RENT_PUBKEY, // Replace with actual Metaplex core program ID
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([collectionKeypair])
      .rpc();

    console.log("Create Collection Transaction Signature", tx);

    // Verify the collection account was created
    const collectionData = await program.account.myBaseCollectionV1.fetch(collectionAccount);
    expect(collectionData.name).toEqual(Buffer.from(name).slice(0, 32));
    expect(collectionData.uri).toEqual(Buffer.from(uri).slice(0, 256));
    expect(collectionData.ticketPrice.toString()).toEqual(ticketPrice.toString());
    expect(collectionData.maxTickets.toString()).toEqual(maxTickets.toString());
    expect(collectionData.organizer.toString()).toEqual(anchor.getProvider().wallet.publicKey.toString());
  });

  it("Mints an NFT for a ticket!", async () => {
    const ticketKeypair = Keypair.generate();
    const ticketAccount = ticketKeypair.publicKey;

    const tx = await program.methods
      .buyTicket()
      .accounts({
        buyer: anchor.getProvider().wallet.publicKey,
        collection: collectionAccount,
        asset: ticketAccount,
        organizer: anchor.getProvider().wallet.publicKey, // Assuming organizer is the same for this test
        platform: anchor.getProvider().wallet.publicKey, // Assuming platform is the same for this test
        mplCoreProgram: anchor.web3.SYSVAR_RENT_PUBKEY, // Replace with actual Metaplex core program ID
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([ticketKeypair])
      .rpc();

    console.log("Mint NFT Transaction Signature", tx);

    // Optionally, you can assert that the NFT was minted or the state has changed.
    // Here, you could fetch the newly created asset to ensure it exists.
    // For example:
    // const assetData = await program.account.myAssetAccount.fetch(ticketAccount);
    // expect(assetData).toBeDefined(); // Ensure the asset was created
  });
});

*/