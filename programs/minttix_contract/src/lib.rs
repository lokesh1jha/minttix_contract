use anchor_lang::prelude::*;

declare_id!("CexKDgzDQD6FUhyPreDnfADrZkheWA48y3gkeyZsPtE9");

#[program]
pub mod minttix_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
