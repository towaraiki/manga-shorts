import os
import sys
import json
import aiohttp
import discord
from discord import app_commands
from discord.ext import commands

DISCORD_BOT_TOKEN = os.environ.get("DISCORD_BOT_TOKEN", "").strip()
GITHUB_PAT = os.environ.get("GITHUB_PAT", "").strip()  # GitHub Personal Access Token
GITHUB_REPO = os.environ.get("GITHUB_REPO", "towaraiki/manga-shorts").strip()

if not DISCORD_BOT_TOKEN:
    print("[Error] DISCORD_BOT_TOKEN is not set.")

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user.name} ({bot.user.id})")
    try:
        for guild in bot.guilds:
            await bot.tree.sync(guild=guild)
        await bot.tree.sync()
        print("Slash commands synced successfully to all guilds.")
    except Exception as e:
        print(f"Sync error: {e}")
    print("=== Cloud Manga Shorts Bot is RUNNING 24/7 ===")

@bot.tree.command(name="short", description="【クラウド生成】漫画紹介ショート動画を自動生成します")
@app_commands.describe(
    image="漫画のコマ画像（写真）",
    title="動画のメインタイトル（例: このあと、分からせるw）",
    quote="引用元（例: かまあげ館）"
)
async def slash_short(
    interaction: discord.Interaction,
    image: discord.Attachment,
    title: str,
    quote: str = None
):
    if not image.content_type or not image.content_type.startswith("image/"):
        await interaction.response.send_message("❌ 画像ファイルを添付してください。", ephemeral=True)
        return

    await interaction.response.defer(thinking=True)

    if not quote:
        quote = f"引用:{image.filename}"
    elif not quote.startswith("引用"):
        quote = f"引用:{quote}"

    # 画像のDiscord CDN URL
    image_url = image.url

    # GitHub Actions の repository_dispatch を呼び出す
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {GITHUB_PAT}"
    }
    payload = {
        "event_type": "render_short",
        "client_payload": {
            "title": title,
            "quote": quote,
            "image_url": image_url
        }
    }

    api_url = f"https://api.github.com/repos/{GITHUB_REPO}/dispatches"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(api_url, headers=headers, json=payload) as resp:
                if resp.status == 204:
                    await interaction.followup.send(
                        f"🚀 **GitHub Actions クラウド生成を開始しました！**\n"
                        f"• **タイトル**: `{title}`\n"
                        f"• **引用**: `{quote}`\n\n"
                        f"⏱ *約1〜2分でこのチャンネルに完成動画（MP4）が自動投稿されます。そのままお待ちください！*"
                    )
                else:
                    err_text = await resp.text()
                    await interaction.followup.send(f"❌ GitHub連携エラー ({resp.status}): `{err_text}`")
    except Exception as e:
        await interaction.followup.send(f"❌ 通信エラー: `{e}`")

if __name__ == "__main__":
    if DISCORD_BOT_TOKEN:
        bot.run(DISCORD_BOT_TOKEN)
    else:
        print("Please set DISCORD_BOT_TOKEN environment variable.")
