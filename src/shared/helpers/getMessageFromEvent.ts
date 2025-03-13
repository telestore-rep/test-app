export function getMessageFromEvent(message: unknown) {
  let jsonValue: unknown = null;
  console.log("Message received:", message);

  if (typeof message !== "string") {
    console.log(message);
    return;
  }

  try {
    jsonValue = JSON.parse(message);
  } catch (error) {
    console.error("Error parsing message:", error);
  }

  return jsonValue;
}
