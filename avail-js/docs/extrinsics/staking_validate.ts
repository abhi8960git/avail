import { Keyring } from "@polkadot/api"
import { SDK } from "avail-js-sdk"
import { WaitFor } from "avail-js-sdk/sdk/transactions"

const main = async () => {
  const providerEndpoint = "ws://127.0.0.1:9944"
  const sdk = await SDK.New(providerEndpoint)

  // Input
  const account = new Keyring({ type: "sr25519" }).addFromUri("//Alice")
  const commission = 5 // 5%
  const blocked = false

  const result = await sdk.tx.staking.validate(commission, blocked, WaitFor.BlockInclusion, account)
  if (result.isErr) {
    console.log(result.reason)
    process.exit(1)
  }

  console.log(
    "Stash=" + result.event.stash + ", Commission=" + result.event.commission + ", Blocked=" + result.event.blocked,
  )
  console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash)

  process.exit()
}
main()
