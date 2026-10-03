# RizzBot Connect

One userscript that brings girls into [RizzBot](https://rizzbotproject.vercel.app) from the sites you use in your browser: **Instagram** and **Tinder**.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/). In Chrome, open Extensions, Tampermonkey, Details and turn on **Allow user scripts**.
2. Install the script: **[rizzbot-connect.user.js](https://github.com/rizzbotdev/rizzbot-connect/releases/latest/download/rizzbot-connect.user.js)**. Tampermonkey shows its install page; press Install.
3. Open Instagram or Tinder and press **Connect RizzBot** (or Tampermonkey's menu, Connect to RizzBot). Sign in to RizzBot if asked, press **Connect this browser**, and close the tab.

It updates itself: Tampermonkey checks this repo's latest release and installs a newer version on its own.

## Instagram

- **Her profile:** press **Add @her.name to RizzBot**, check her name, press Add. It sends her profile, posts and highlights, then finds your chat with her in your inbox and sends it too.
- **Already added:** the badge reads **"Annie is in RizzBot"**. Press it to open her in RizzBot or update her.
- **A chat page:** the badge next to the call button syncs that chat.

What it does on Instagram: it reads what Instagram's page loads when you open her profile, scrolls her grid so more posts load, and makes three kinds of read request itself (her highlights, your chat with her, your inbox list to find that chat). It never opens your chat in Instagram's page, never views her current story, never sends a "seen", never follows, likes, comments or messages.

## Tinder

- **Every chat and match** gets a badge: **Synced**, **Outdated** (open her chat to sync it), **Mismatch** (review it in RizzBot), **Import**, or the app her chat moved to.
- **Opening a chat** syncs it by itself when RizzBot can prove which messages are new. Nothing is drafted and nothing is spent.
- **Import:** open her chat, then press **Import** on the badge.

What it does on Tinder: nothing but read. It reads only what Tinder's own page already loaded; it never sends Tinder a request, never touches your Tinder login, and never presses Tinder's buttons.

## Where your data goes

Only to RizzBot, with the token it got when you connected this browser. Disconnect any time from RizzBot's Me page.
