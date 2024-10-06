use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use mpl_core::{
    instructions::{CreateCollectionV2CpiBuilder, CreateV2CpiBuilder},
    ID as MPL_CORE_PROGRAM_ID,
};

declare_id!("CexKDgzDQD6FUhyPreDnfADrZkheWA48y3gkeyZsPtE9");



#[program]
pub mod nft_event_platform {
    use super::*;

    // Create event (collection) with name, uri, ticket price, NFT mint price, and max tickets
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        uri: String,
        ticket_price: u64,
        // nft_mint_price: u64,
        max_tickets: u64, // Will be used as the max supply for the collection
    ) -> Result<()> {
        let event = &mut ctx.accounts.collection;
    
        // Ensure that the name and uri fit into fixed-size arrays
        let name_bytes = name.as_bytes();
        let uri_bytes = uri.as_bytes();
    
        if name_bytes.len() > 32 || uri_bytes.len() > 256 {
            return Err(ErrorCode::StringTooLong.into());
        }
    
        event.name.copy_from_slice(&name_bytes);
        event.uri.copy_from_slice(&uri_bytes);
    
        event.ticket_price = ticket_price;
        event.max_tickets = max_tickets;
        event.organizer = *ctx.accounts.signer.key;
    
        // Create collection with Metaplex Core, passing max_tickets as max_supply
        CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .collection(&ctx.accounts.collection.to_account_info())
            .payer(&ctx.accounts.payer.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name(name.clone())
            .uri(uri.clone())
            // .max_supply(Some(max_tickets)) // Set the max supply of the collection to max_tickets
            .invoke()?;
    
        Ok(())
    }
    
    // Buy a ticket for an event (mint an NFT)
    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        let event = &ctx.accounts.collection; // Make the event mutable
    
      
        // Calculate the total cost: ticket price + platform fee (1%)
        let platform_fee = event.ticket_price/ 100; // 1% of ticket price
        
        // Transfer funds from buyer to organizer and platform
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.buyer.key(), // Buyer's public key
                &ctx.accounts.organizer.key(), // Organizer's public key
                event.ticket_price, // Amount to transfer as 1 ticket price
            ),
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.organizer.to_account_info(),
                ctx.accounts.system_program.to_account_info(), 
            ],
        )?;
    
        // Transfer platform fee
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.buyer.key(),
                &ctx.accounts.platform.key(),
                platform_fee,
            ),
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.platform.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
    
        // Transfer mint price (if necessary)
        // invoke(
        //     &system_instruction::transfer(
        //         &ctx.accounts.buyer.key(),
        //         &ctx.accounts.mpl_core_program.key(),
        //         nft_cost,
        //     ),
        //     &[
        //         ctx.accounts.buyer.to_account_info(),
        //         ctx.accounts.mpl_core_program.to_account_info(),
        //         ctx.accounts.system_program.to_account_info(),
        //     ],
        // )?;
    
    
        // Mint the NFT for the buyer
        let collection_info = ctx.accounts.collection.to_account_info();
        let asset_info = ctx.accounts.asset.to_account_info();
    
        CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&asset_info)
            .collection(Some(&collection_info))
            .payer(&ctx.accounts.buyer.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name(String::from_utf8_lossy(&event.name).to_string()) // Convert byte array to String
            .uri(String::from_utf8_lossy(&event.uri).to_string()) // Convert byte array to String
            .invoke()?;
    
        Ok(())
    }

}

// Struct for creating collections (events)
#[derive(Accounts)]
pub struct CreateCollection<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub collection: Account<'info, MyBaseCollectionV1>, // Use unique struct here
    #[account(address = MPL_CORE_PROGRAM_ID)]
    /// CHECK: This doesn't need to be checked because of the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// Struct for buying tickets (minting NFTs)
#[derive(Accounts)]
pub struct BuyTicket<'info> {
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub collection: Account<'info, MyBaseCollectionV1>, // Use unique struct here
    #[account(mut)]
    pub asset: Signer<'info>,
    #[account(mut)]
    pub organizer: UncheckedAccount<'info>,
    #[account(mut)]
    pub platform: UncheckedAccount<'info>,
    #[account(address = MPL_CORE_PROGRAM_ID)]
    /// CHECK: This doesn't need to be checked because of the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// Data structure for storing event info
#[account]
pub struct MyBaseCollectionV1 {
    pub name: [u8; 32],
    pub uri: [u8; 256],
    pub ticket_price: u64,
    pub max_tickets: u64,
    pub organizer: Pubkey,
}

// Custom errors
#[error_code]
pub enum ErrorCode {
    #[msg("Tickets are sold out")]
    SoldOut,

    #[msg("Provided string is too long")]
    StringTooLong,
}


