use crate::api_dev::api::data_availability::calls::types::submit_data::Data;
use crate::utils_raw::fetch_transaction;
use crate::BlockHash;
use crate::{avail, AccountId, AvailBlocksClient};

use subxt_core::utils::MultiAddress;

use avail::data_availability::calls::types as DataAvailabilityCalls;
use avail::staking::calls::types as StakingCalls;

pub mod data_availability {
	use super::*;

	#[derive(Debug, Clone, Eq, PartialEq)]
	pub struct SubmitData {
		pub data: Data,
	}

	impl SubmitData {
		pub async fn new(
			block_hash: BlockHash,
			tx_hash: BlockHash,
			blocks: &AvailBlocksClient,
		) -> Result<Self, String> {
			let transaction =
				fetch_transaction::<DataAvailabilityCalls::SubmitData>(block_hash, tx_hash, blocks)
					.await;
			let transaction = transaction.map_err(|err| err.to_string())?;

			Ok(Self {
				data: transaction.value.data,
			})
		}
	}
}
pub mod staking {
	use super::*;

	pub struct Nominate {
		pub targets: Vec<String>,
	}

	impl Nominate {
		pub async fn new(
			block_hash: BlockHash,
			tx_hash: BlockHash,
			blocks: &AvailBlocksClient,
		) -> Result<Self, String> {
			let transaction =
				fetch_transaction::<StakingCalls::Nominate>(block_hash, tx_hash, blocks).await;
			let transaction = transaction.map_err(|err| err.to_string())?;

			let targets = transaction.value.targets;
			let targets: Vec<AccountId> = targets
				.into_iter()
				.map(|a| match a {
					MultiAddress::Id(account) => account,
					_ => panic!("Should never happen"),
				})
				.collect();
			let targets = targets.into_iter().map(|a| std::format!("{}", a)).collect();

			Ok(Self { targets })
		}
	}
}
