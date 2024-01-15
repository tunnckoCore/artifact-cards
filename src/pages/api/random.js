import "node-polyfill-blob-file-reader";
import * as config from "../../config.mjs";

const toBase64Url = (url) =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(blob);
        }),
    );

export async function GET({ request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";

  if (id) {
    return fetch(`https://quick-sand-47.deno.dev/mint?id=${id}`);
  }

  let res = null;

  try {
    res = await fetch("https://quick-sand-47.deno.dev/random").then((x) =>
      x.json(),
    );
  } catch (er) {
    console.error(er);

    return new Response(
      JSON.stringify({
        error: `Something went wrong! Page will refresh, try again.`,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  }

  if (!res) {
    console.error("something failed");

    return new Response(JSON.stringify({ error: "Something failed!" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (res.done || res.error) {
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const name = `${res.item}.webp`;
  const { origin } = new URL(request.url);

  console.log({ origin, name, res, config });

  const addtlParams = config.additionalParams || "";
  const additionalParams = addtlParams.replace(/(;)*$/, "");

  let dataURL = await toBase64Url(`${origin}/images-4x/${name}`);
  dataURL = addtlParams
    ? dataURL.replace(";base64,", `;${additionalParams};base64,`)
    : dataURL;

  return new Response(JSON.stringify({ dataURL, info: res }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
