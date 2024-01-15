const table = {
  "1-cheif-steal-ya-crypto.webp": 50,
  "2-mansion.webp": 60,
  "3-lambo.webp": 70,
  "4-ggs.webp": 80,
  "5-miami-condo.webp": 90,
  "6-viperz.webp": 100,
  "7-spaces-host.webp": 115,
  "8-ruggie.webp": 130,
  "9-sol-bro.webp": 145,
  "10-influencooor.webp": 160,
  "11-bitcoin-maxi.webp": 175,
  "12-eth-maxi.webp": 190,
  "13-ethscription-bro.webp": 205,
  "14-gold-bros.webp": 220,
  "15-rollie.webp": 235,
  "16-reply-bro.webp": 250,
  "17-studio-apartment.webp": 270,
  "18-battlestation-bros.webp": 290,
  "19-cabal-bros.webp": 310,
  "20-ev-bro.webp": 330,
  "21-gatekeeper-bros.webp": 350,
  "22-web3-baddie.webp": 370,
  "23-pepe-maxi.webp": 390,
  "24-beemer.webp": 430,
  "25-ai-artist-bro.webp": 460,
  "26-brokie-battlestation.webp": 485,
  "27-pleb-watch.webp": 505,
  "28-moms-basement.webp": 540,
  "29-al-tima.webp": 580,
  "30-shitcoin-dev.webp": 640,
  "31-satoshi-nakamoto.webp": 663,
};

const items = Object.keys(table);
const weights = Object.values(table).sort((a, b) => a - b);

function pickIndexWithBinarySearchAndCumulativeWeighted(weights) {
  const cumulative = weights.reduce(
    (acc, x) => acc.concat((acc[acc.length - 1] || 0) + x),
    [],
  );

  const totalWeight = cumulative[cumulative.length - 1];
  const random = Math.floor(Math.random() * totalWeight);

  let left = 0;
  let right = weights.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (cumulative[mid] < random) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

const maxSupply = weights.reduce((a, b) => a + b, 0);
const db = await Deno.openKv();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let minted = await db.get(["minted"], { consistency: "strong" });
  minted = Number(minted.value || 0);

  if (url.pathname === "/tweaks") {
    return new Response("okkk" + Date.now());
  }

  if (url.pathname === "/progress") {
    const iter = db.list({ prefix: ["traits"] });
    let result = { __total: minted, __maxSupply: maxSupply };

    for await (const item of iter) {
      const key = item.key[item.key.length - 1]
        .split("-")
        .slice(1)
        .join("-")
        .replace(".webp", "");
      result[key] = item.value || 0;
    }

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (url.pathname === "/__reset") {
    const iter = db.list({ prefix: ["traits"] });

    for await (const item of iter) {
      await db.delete(item.key);
      await db.delete(["minted"]);
    }

    return new Response(JSON.stringify({ reset: true, minted }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (url.pathname === "/mint") {
    const res = await db.get(["queue", url.searchParams.get("id") || "szze"], {
      consistency: "strong",
    });

    if (!res.value) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const item = res.value || "sszzz";
    const cnt = await db.get(["traits", item], { consistency: "strong" });
    const count = (cnt.value || 0) + 1;

    await db
      .atomic()
      .set(["traits", item], count)
      .set(["minted"], minted + 1)
      .commit();

    return new Response(JSON.stringify({ item, count, minted: minted + 1 }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (url.pathname === "/random") {
    if (minted >= maxSupply) {
      return new Response(JSON.stringify({ done: "Sold out, good job!" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    let index = pickIndexWithBinarySearchAndCumulativeWeighted(weights);
    let item = items[index];

    const res = await db.get(["traits", item], { consistency: "strong" });
    let curr = res.value || 0;

    while (curr + 1 > table[item]) {
      if (minted >= maxSupply) {
        break;
      }
      index = pickIndexWithBinarySearchAndCumulativeWeighted(weights);
      item = items[index];
      const resp = await db.get(["traits", item], { consistency: "strong" });
      curr = resp.value || 0;
    }

    const uuid = crypto.randomUUID();
    await db.set(["queue", uuid], item);

    const cardName = item.split("-").slice(1).join("-").replace(".webp", "");

    return new Response(
      JSON.stringify({
        item: cardName,
        uuid,
        count: curr + 1,
        minted: minted + 1,
        done: minted >= maxSupply,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  }

  return new Response("ok");
});
