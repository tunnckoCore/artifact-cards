export const title = "ArtifactsOG69 - 8,888 ethscriptions cards";
export const heading = "Artifact Cards";
export const description = `Artifacts are collectible trading cards
  collection on <a href="https://ethscriptions.com" target="_blank" class="text-blue-500">Ethscriptions</a> that bring
  the X timeline to life and provide a commentary of vibes built for the community by the community.
  <strong>Mint site by <a href="https://twitter.com/wgw_eth" class="text-blue-500" target="_blank">wgw.eth</a>.
  See all cards <a href="/collection" class="text-blue-500">here</a>.</strong>`;

export const chainId = 1;

export const address =
  chainId === 5
    ? `0x196773281df0BfFC386A5c0829ED45BED645fD29`
    : `0xaA58B60eeFDBdA3b6F29BD4bfC3D665f95988F81`;

export const mintPrice = "0.0055";
export const allowlistPrice = "0.0045";
export const supply = 8900;
export const presale = false;
export const openBlock = 18979715; // ~1am, Bravo timezone (UTC+2, 6pm EST)
export const closeBlock = 20980000; // or when 5500 supply is reached

export const presaleParams = `_col=artifactcards;_id=463117;esip6=true;`;
export const additionalParamsBugged = `_col=artifactcards;_id=553449;esip6=true;`;
export const additionalParams = `_col=artifactcards;_id=553449;rule=esip6;`;

// export const abi = [
//   { inputs: [], name: "MintClosed", type: "error" },
//   { inputs: [], name: "MintNotOpened", type: "error" },
//   { inputs: [], name: "NotDeployer", type: "error" },
//   { inputs: [], name: "NotEnoughEther", type: "error" },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "initialOwner",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "string",
//         name: "contentURI",
//         type: "string",
//       },
//     ],
//     name: "ethscriptions_protocol_CreateEthscription",
//     type: "event",
//   },
//   {
//     inputs: [],
//     name: "deployer",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "string", name: "dataURI", type: "string" }],
//     name: "ethscribe",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "mintCloseBlock",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "mintOpenBlock",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "mintPrice",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "_mintPrice", type: "uint256" },
//       { internalType: "uint256", name: "_mintOpenBlock", type: "uint256" },
//       { internalType: "uint256", name: "_mintCloseBlock", type: "uint256" },
//     ],
//     name: "settings",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       { internalType: "address", name: "to", type: "address" },
//     ],
//     name: "withdraw",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];
