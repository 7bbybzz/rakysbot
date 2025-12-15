const { Telegraf } = require('telegraf');
const QRCode = require('qrcode');
const express = require('express');

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_KEY = "Cl339950";
const PRICE = 60;
const IMG = "https://i.ibb.co/3ymZ8zrq/IMG-0792.jpg";
const CHANNEL = "https://t.me/addlist/WIPPhibFLBI4MTZh";

const payments = {
  BTC: {addr: "1NtpN3aPZowqEzX16E5cMUHQ16P9KHQtiy", amount: "0.000674 BTC"},
  ETH: {addr: "0x8cBc2AD1dF8c0e42465a9E80c1B84FeB0dEE0D87", amount: "0.0193 ETH"},
  LTC: {addr: "LhWYtDeDPfUtEpbJC2Pho7xQTXfEEXj6UY", amount: "0.741 LTC"}
};

const subscribed = new Set();
const admins = new Set();
const sandboxState = new Map();

const tos = `RAK OTP BOT - TERMS OF SERVICE
Last Updated: December 2025
1. SERVICE DESCRIPTION
RAK OTP Bot is a professional social engineering tool designed for OTP interception and call spoofing. Access is granted for 48 hours upon successful payment.
2. PAYMENT & REFUNDS
- All payments are FINAL and NON-REFUNDABLE.
- Incorrect amount or wrong cryptocurrency sent = no access, no refund.
- Chargebacks or disputes will result in permanent ban.
- We do not store payment information.
3. PROHIBITED ACTIVITIES
- No reselling of access, keys, or bot features.
- No sharing subscription with multiple users.
- No use for illegal activities that violate local laws (user assumes full responsibility).
- No reverse engineering or copying the bot.
4. SERVICE AVAILABILITY
- 99.99% uptime guaranteed.
- Downtime for maintenance will be announced in channel.
- We reserve the right to terminate access without refund for TOS violation.
5. LIABILITY
- We are not responsible for account bans, legal issues, or any consequences from use.
- User agrees to use at own risk.
6. SUPPORT
- Support only through official channel.
- No DM support.
7. CHANGES TO TOS
We reserve the right to update these terms at any time.
By purchasing access, you agree to all terms above.
ALL SALES ARE FINAL — NO EXCEPTIONS
CC CHECKER COMING SOON 🔥`;

bot.start((ctx) => {
  const firstName = ctx.from.first_name || "user";
  ctx.replyWithPhoto(IMG, {
    caption: `📲 Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏 v.1
🟢 Operational | 📈 Uptime: 100%
👋 Hello, ${firstName} Welcome to the Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏. This bot is used to register to our website and recieve notifications.
🧠 Our bot is an Hybrid between OTP Bot and 3CX. its a professional Social Engineering kit for professional OTP users.
💥 Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏 have UNIQUE features that you can't find in any other bot.
🎯 Features included:
🔸 24/7 Support
🔸 Automated Payment System
🔸 Live Panel Feeling
🔸 12+ Pre-made Modes
🔸 Customizable Caller ID / Spoofing
🔸 99.99% Up-time
🔸 Customizable Scripts
🔸 Customizable Panel Actions
🔸 International Support
🔸 Multilingual Support (20+ Voices)
🔸 Live DTMF
🔸 Call Streaming - Listen to call in Real-Time!
💬 To get started, please click the buttons below.`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "ENTER BOT", callback_data: "enter" }],
        [{ text: "PAYMENT", callback_data: "pay" }],
        [{ text: "FEATURES", callback_data: "features" }],
        [{ text: "VOUCHES", url: CHANNEL }],
        [{ text: "SUPPORT", url: CHANNEL }],
        [{ text: "TERMS OF SERVICE", callback_data: "tos" }]
      ]
    }
  });
});

bot.action('features', (ctx) => {
  ctx.replyWithHTML(`<b>RAK OTP BOT FEATURES</b>
🔥 Call Spoofing
🔥 Live Call Streaming
🔥 Custom Scripts
🔥 20+ Voices
🔥 DTMF Detection
🔥 Real-time OTP Capture
🔥 International Numbers
🔥 Panel Integration
CC CHECKER COMING SOON`);
});

bot.action('tos', (ctx) => ctx.reply(tos));

bot.action('enter', (ctx) => {
  if (subscribed.has(ctx.from.id) || admins.has(ctx.from.id)) {
    ctx.reply("✅ Access active — use the bot");
    return;
  }
  ctx.replyWithHTML(`🚫 <b>UH OH!</b>
We detected you don't have a subscription.
You must pay first to use the bot.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "PAYMENT", callback_data: "pay" }],
        [{ text: "BACK", callback_data: "start" }]
      ]
    }
  });
});

bot.action('pay', (ctx) => {
  ctx.replyWithHTML(`<b>PAY $${PRICE} — 2 DAYS ACCESS</b>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "BTC", callback_data: "btc" }],
        [{ text: "ETH", callback_data: "eth" }],
        [{ text: "LTC", callback_data: "ltc" }],
        [{ text: "BACK", callback_data: "start" }]
      ]
    }
  });
});

['btc','eth','ltc'].forEach(c => {
  bot.action(c, async (ctx) => {
    const coin = c.toUpperCase();
    const p = payments[coin];
    const qr = await QRCode.toDataURL(`bitcoin:${p.addr}`);
    ctx.replyWithPhoto({ url: qr }, {
      caption: `📲 Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏 v.1 
🟢 Operational | 📈 Uptime: 100%
┏ ✅ PAYMENT INFO
┃ 
┣ Item: 🔑 License -Daily (2 days)
┣ Amount: $60.00
┃ 
┗ ⏳ Please pay the transaction below to activate your subscription:
┏ 💵 TRANSACTION INFO
┣ Choosen Crypto: ${coin}
┣ AMOUNT: ${p.amount}
┗ TO: ${p.addr}
⚠️ Please keep in mind that all payments are automated, once your transaction has been confirmed, your subscription will be starting automatically.
🚨 Please send the exact amount to the address above, if you send more or less than the amount above, your transaction will be rejected and your funds will be lost.
Our system will only detect 1 transaction per address, if you send more than 1 transaction, only the first one will be detected and the rest will be lost.
🚨 This transaction would be expired after 30 minutes! Don't send funds after 30 minutes or your funds would be lost.
💡 If you need to return to the main menu run the command /start`,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: "BACK", callback_data: "pay" }]] }
    });
  });
});

// Admin sandbox and OTP capture display (fancy)

bot.command('id', (ctx) => {
  const text = ctx.message.text.trim();
  if (text === `/id ${ADMIN_KEY}`) {
    admins.add(ctx.from.id);
    sandboxState.set(ctx.from.id, { step: "start" });
    ctx.replyWithHTML(`
🔥 <b>ADMIN LIVE SANDBOX</b>
Click to start fake call demo`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "ENTER LIVE SANDBOX", callback_data: "sandbox_start" }],
          [{ text: "BACK", callback_data: "start" }]
        ]
      }
    });
  }
});

// Sandbox flow with extra buttons (DOB, CVV, Hold)

bot.action('sandbox_start', (ctx) => {
  if (!admins.has(ctx.from.id)) return;
  sandboxState.set(ctx.from.id, { step: "bank" });
  ctx.replyWithHTML(`<b>LIVE SANDBOX — SELECT BANK</b>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🏦 Chase", callback_data: "bank_chase" }],
        [{ text: "🏦 Wells Fargo", callback_data: "bank_wells" }],
        [{ text: "🏦 Bank of America", callback_data: "bank_boa" }],
        [{ text: "🏦 Capital One", callback_data: "bank_capone" }],
        [{ text: "🏦 Citi", callback_data: "bank_citi" }],
        [{ text: "📞 HANG UP", callback_data: "hangup" }]
      ]
    }
  });
});

['chase','wells','boa','capone','citi'].forEach(b => {
  bot.action(`bank_${b}`, (ctx) => {
    if (!admins.has(ctx.from.id)) return;
    sandboxState.get(ctx.from.id).bank = b.replace('bank_', '').toUpperCase();
    sandboxState.get(ctx.from.id).step = "name";
    ctx.replyWithHTML(`<b>Bank selected: ${sandboxState.get(ctx.from.id).bank}</b>\n\nEnter victim name:`, {
      reply_markup: { inline_keyboard: [[{ text: "📞 HANG UP", callback_data: "hangup" }]] }
    });
  });
});

bot.action('hangup', (ctx) => {
  sandboxState.delete(ctx.from.id);
  ctx.reply("📞 Call terminated");
});

bot.on('text', (ctx) => {
  const state = sandboxState.get(ctx.from.id);

  if (state && state.step === "name") {
    state.victim = ctx.message.text;
    state.step = "id";
    ctx.replyWithHTML(`<b>Victim: ${state.victim}</b>\n\nEnter Caller ID to spoof:`, {
      reply_markup: { inline_keyboard: [[{ text: "📞 HANG UP", callback_data: "hangup" }]] }
    });
    return;
  }

  if (state && state.step === "id") {
    state.spoof = ctx.message.text;
    state.step = "calling";
    ctx.replyWithHTML(`<b>Calling ${state.victim}...</b>\nSpoofing: ${state.spoof}\nBank: ${state.bank}\n\nConnecting...`);

    setTimeout(() => {
      ctx.replyWithHTML(`📞 <b>Victim answered</b>\n\nPlaying Phase 1 script...`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📅 Get DOB", callback_data: "get_dob" }],
            [{ text: "💳 Get CVV", callback_data: "get_cvv" }],
            [{ text: "⏸️ Hold Call", callback_data: "hold" }],
            [{ text: "📞 HANG UP", callback_data: "hangup" }]
          ]
        }
      });
    }, 18000);

    setTimeout(() => {
      ctx.reply("⚠️ Victim pressed 1 — SEND CODE NOW!");
    }, 30000);

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000);
      ctx.replyWithHTML(`🎯 <b>CODE CAUGHT!</b>\n\nCode: <code>${code}</code>\n\nDelivered to panel`);
      sandboxState.delete(ctx.from.id);
    }, 50000);

    return;
  }

  // Extra sandbox buttons
  if (ctx.callbackQuery && admins.has(ctx.from.id)) {
    const data = ctx.callbackQuery.data;
    if (data === "get_dob") {
      const year = 1950 + Math.floor(Math.random()*50);
      const month = String(1 + Math.floor(Math.random()*12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random()*28)).padStart(2, '0');
      ctx.replyWithHTML(`📅 <b>DOB Captured</b>\n\n${month}/${day}/${year}`);
      return;
    }
    if (data === "get_cvv") {
      const cvv = Math.floor(100 + Math.random()*900);
      ctx.replyWithHTML(`💳 <b>CVV Captured</b>\n\nCVV: ${cvv}`);
      return;
    }
    if (data === "hold") {
      ctx.reply("⏸️ Call on hold — playing hold music...");
      return;
    }
  }

  // OTP Capture Display for normal users
  const codes = ctx.message.text.match(/\d{4,8}/g);
  if (codes && subscribed.has(ctx.from.id)) {
    const fakeIP = `185.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    const fakeDevice = ["iPhone 15 Pro", "Samsung S24", "Pixel 8"][Math.floor(Math.random()*3)];
    ctx.replyWithHTML(`
📲 <b>OTP CAPTURE DISPLAY</b>
┏ ✅ OTP INTERCEPTED
┃ 
┣ Code: <code>${codes.join(' ')}</code>
┣ IP: ${fakeIP}
┣ Device: ${fakeDevice}
┃ 
┗ ✅ Delivered to panel
🔥 RAK OTP BOT — Active
    `);
    return;
  }

  // Normal subscription
  if (!subscribed.has(ctx.from.id)) {
    subscribed.add(ctx.from.id);
    ctx.replyWithHTML(`✅ <b>SUBSCRIPTION ACTIVE</b>\n\n2 Days access granted\n\nForward OTP messages`);
  } else {
    ctx.reply("✅ Code captured");
  }
});

app.use(bot.webhookCallback('/webhook'));
app.get('/', (req, res) => res.send('RAK OTP BOT LIVE'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Bot listening'));
