/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

export async function checkLicense() {
  try {
    const res = await fetch("http://localhost:8000/api/status", {
      credentials: "include", // only if you’re using cookies/sessions
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("🔑 License response:", data);

    return data; // { valid: true/false, message, client }
  } catch (err) {
    console.error("❌ License check failed:", err);
    return { valid: false, message: "License check failed" };
  }
}
