import { Keyring } from "@polkadot/api"
import { SDK } from "avail-js-sdk"
import { WaitFor } from "avail-js-sdk/sdk/transactions"

const main = async () => {
  const providerEndpoint = "ws://127.0.0.1:9944"
  const sdk = await SDK.New(providerEndpoint)

  // Input
  const account = new Keyring({ type: "sr25519" }).addFromUri("//Alice")
  const data = "My Awesome Data"

  const result = await sdk.tx.dataAvailability.submitData(data, WaitFor.BlockInclusion, account)
  if (result.isErr) {
    console.log(result.reason)
    process.exit(1)
  }

  console.log("Data=" + result.txData.data)
  console.log("Who=" + result.event.who + ", DataHash=" + result.event.dataHash)
  console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash)

  process.exit()
}
main()
