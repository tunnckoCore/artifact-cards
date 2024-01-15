import { useWeb3Modal } from "@web3modal/wagmi/react";

import { useAccount, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import * as config from "../config.mjs";
import { useEffect, useState } from "react";

const pricing = {
  discount: config.allowlistPrice,
  public: config.mintPrice,
};

async function isAllowlisted(origin, name, address) {
  let res = null;
  try {
    res = await fetch(`${origin}/allowlists/${name}.json`)
      .then((res) => res.json())
      .then((x) => x[address.toLowerCase()]);
  } catch (e) {
    return false;
  }

  return res;
}

export default function ConnectButton(props = {}) {
  const { open } = useWeb3Modal();
  let { address: minterAddress } = useAccount();
  const [price, setPrice] = useState(pricing.public);
  const [mintedCount, setMintedCount] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [mintId, setMintId] = useState(null);

  useEffect(() => {
    async function load() {
      const { origin } = new URL(window.location.href);
      const addr = minterAddress?.toLowerCase() || "";
      const isAlch = await isAllowlisted(origin, "alch", addr);

      setPrice(isAlch ? pricing.discount : pricing.public);
    }

    load();
  }, [minterAddress]);

  useEffect(() => {
    const { origin } = new URL(window.location.href);

    fetch(`${origin}/api/progress`)
      .then((x) => x.json())
      .then(({ data: progress }) => setMintedCount(progress.__total));
  }, []);

  const { data, error, isLoading, write } = useContractWrite({
    chainId: config.chainId,
    address: config.address,
    functionName: "ethscribe",
    abi: [
      {
        inputs: [{ internalType: "string", name: "dataURI", type: "string" }],
        stateMutability: "payable",
        name: "ethscribe",
        type: "function",
        outputs: [],
      },
    ],
  });

  const { isLoading: isLoadingTx, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess && mintId) {
      async function load() {
        const { origin } = new URL(window.location.href);
        const resp = await fetch(`${origin}/api/random?id=${mintId}`).then(
          (x) => x.json(),
        );

        console.log("mint result ->", resp);

        if (resp.error) {
          console.log("minting error", resp.error);
          alert(resp.error);
          return;
        }

        if (resp.done) {
          alert(resp.done);
          return;
        }

        setMintedCount(resp.minted);
        setIsMinting(false);
      }

      load();
    }
  }, [isSuccess, mintId]);

  const mintImage = async () => {
    setIsMinting(true);
    const { origin } = new URL(window.location.href);
    const addr = minterAddress?.toLowerCase() || "";
    const isAlch = await isAllowlisted(origin, "alch", addr);

    if (!isAlch && config.presale) {
      alert("not in allowlist");
      setIsMinting(false);
      return;
    }

    console.log("preparing mint...");

    const result = await fetch(`${origin}/api/random`).then((x) => x.json());

    console.log("resulting...", result);

    if (result.error) {
      console.log(result.error);
      alert(result.error);
      window.location.reload();
      return;
    }

    console.log("result ->", result.info);
    // console.log(result.dataURL);

    if (result.done) {
      alert(result.done);
      // window.location.reload();
      return;
    }

    setMintId(result.info.uuid);

    console.log("sending transaction...", minterAddress, config);

    await write?.({
      args: [result.dataURL],
      from: minterAddress,
      value: parseEther(config.presale ? price : pricing.public),
      // value: 0,
    });
  };

  return (
    <>
      <button
        className={
          minterAddress
            ? `rounded-md bg-purple-500 px-2 py-1.5 font-semibold`
            : `rounded-md bg-blue-500 px-2 py-1.5 font-semibold`
        }
        onClick={() => open()}
      >
        {minterAddress ? "See Account" : "Connect"}
      </button>
      <div className="flex w-full items-center justify-center">
        <img
          className={
            isMinting || isLoading || isLoadingTx
              ? "animate-pulse rounded-2xl"
              : "rounded-2xl"
          }
          width="350px"
          height="500px"
          src={`/ggs.jpg`}
          alt={`Ethscription ArtifactsOG69 - ggs`}
        />
      </div>
      <div className="flex items-center justify-center gap-2 text-center">
        <div className="italic">
          The image you see is not what you'll get, it'll be random!
        </div>
      </div>
      <button
        className={
          mintedCount >= config.supply
            ? `cursor-not-allowed rounded-md bg-red-500 px-2 py-1.5 font-semibold`
            : isMinting || isLoading || isLoadingTx
              ? `animate-pulse cursor-not-allowed rounded-md bg-green-500 px-2 py-1.5 font-semibold`
              : `rounded-md bg-green-500 px-2 py-1.5 font-semibold`
        }
        onClick={
          mintedCount >= config.supply || isMinting || isLoading || isLoadingTx
            ? () => {}
            : mintImage
        }
      >
        {mintedCount >= config.supply ? (
          <>SOLD OUT</>
        ) : isMinting || isLoading || isLoadingTx ? (
          <>Minting...</>
        ) : (
          <>Mint for {price} ETH</>
        )}
        {/* SOLD OUT */}
      </button>
      {/* <button
        className="rounded-md bg-orange-500 px-2 py-1.5 font-semibold"
        onClick={() => window.location.reload()}
      >
        Randomize
      </button> */}
      {(isLoading || isLoadingTx) && <div>Wait a few seconds, minting...</div>}
      {error && (
        <div class="text-red-500">
          An error occurred preparing the transaction:{" "}
          {error?.message.split("\n").slice(0, 1)}
        </div>
      )}
      {isSuccess && (
        <div className="text-green-500">
          Successfully minted! Check out on{" "}
          <a
            target="_blank"
            className="text-blue-400"
            href={`https://${
              config.chainId === 5 ? "goerli." : ""
            }ethscriptions.com/ethscriptions/${data?.hash}`}
          >
            ethscriptions.com
          </a>
          !
        </div>
      )}
    </>
  );
}
