export async function GET({ request }) {
  let res = await fetch("https://food-stick-94.deno.dev/progress").then((x) =>
    x.json(),
  );

  return new Response(JSON.stringify({ data: res }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
