export async function sendWhatsapp({ phone, apikey, text }) {
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);

  const res = await fetch(url);
  const body = await res.text();

  if (!res.ok) {
    throw new Error(`CallMeBot respondeu ${res.status}: ${body}`);
  }

  return body;
}
