import { Keyring } from "@polkadot/api"
import { SDK } from "avail-js-sdk"
import { WaitFor } from "avail-js-sdk/sdk/transactions"

const main = async () => {
  const providerEndpoint = "ws://127.0.0.1:9944"
  const sdk = await SDK.New(providerEndpoint)

  // Input
  const account = new Keyring({ type: "sr25519" }).addFromUri("//Alice")
  const dest = "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw" // Eve
  const keepAlive = true

  const result = await sdk.tx.balances.transferAll(dest, keepAlive, WaitFor.BlockInclusion, account)
  if (result.isErr) {
    console.log(result.reason)
    process.exit(1)
  }

  console.log("From=" + result.event.from + ", To=" + result.event.to + ", Amount=" + result.event.amount)
  console.log("MaybeKilled=" + result.event2?.account)
  console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash)

  process.exit()
}
main()
