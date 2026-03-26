/**
 * Lightweight Discord webhook logger for Spore Agent.
 * Posts structured embeds to a Discord channel via webhook URL.
 * Silently no-ops if DISCORD_WEBHOOK_URL is not configured.
 */

const COLORS = {
  info: 0x57f287,  // green
  warn: 0xfee75c,  // yellow
  error: 0xed4245, // red
} as const;

type LogLevel = keyof typeof COLORS;

export async function logToDiscord(
  level: LogLevel,
  message: string,
  details?: unknown
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed: Record<string, unknown> = {
    title: `[${level.toUpperCase()}] Spore Agent`,
    description: message,
    color: COLORS[level],
    timestamp: new Date().toISOString(),
  };

  if (details !== undefined) {
    const detailStr =
      typeof details === "string" ? details : JSON.stringify(details, null, 2);
    // Discord embed field value max is 1024 chars
    embed.fields = [
      {
        name: "Details",
        value: detailStr.length > 1024 ? detailStr.slice(0, 1021) + "..." : detailStr,
      },
    ];
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Spore Agent",
        embeds: [embed],
      }),
    });
  } catch {
    // Silently fail — logging should never crash the server
  }
}
