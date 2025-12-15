const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_KEY = "Cl339950";
const PRICE = 60;
const IMG = "https://i.ibb.co/3ymZ8zrq/IMG-0792.jpg";
const MAIN_CHANNEL = "https://t.me/raktf";
const VOUCHES_CHANNEL = "https://t.me/rakTFvouches";
const SUPPORT_USER = "rakrunnin";

const payments = {
  BTC: {addr: "1NtpN3aPZowqEzX16E5cMUHQ16P9KHQtiy", amount: "0.000674 BTC"},
  ETH: {addr: "0x8cBc2AD1dF8c0e42465a9E80c1B84FeB0dEE0D87", amount: "0.0193 ETH"},
  LTC: {addr: "LhWYtDeDPfUtEpbJC2Pho7xQTXfEEXj6UY", amount: "0.741 LTC"}
};

const paidUsers = new Set();
const admins = new Set();
const sandboxState = new Map();

bot.start((ctx) => {
  const firstName = ctx.from.first_name || "user";
  ctx.replyWithPhoto(IMG, {
    caption: `📲 Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏 v.1
🟢 Operational | 📈 Uptime: 100%
👋 Hello, ${firstName}
🧠 Professional Social Engineering Kit
💥 UNIQUE FEATURES
🎯 Join channel: ${MAIN_CHANNEL}
💬 Click below to begin`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔓 ENTER BOT", callback_data: "enter" }],
        [{ text: "💰 PAYMENT", callback_data: "pay" }],
        [{ text: "🔥 FEATURES", callback_data: "features" }],
        [{ text: "🗣️ VOUCHES", url: VOUCHES_CHANNEL }],
        [{ text: "🆘 SUPPORT", url: `https://t.me/${SUPPORT_USER}` }],
        [{ text: "📜 TOS", callback_data: "tos" }]
      ]
    }
  });
});

bot.action('features', (ctx) => {
  ctx.replyWithHTML(`<b>🔥 RAK FEATURES</b>
📞 Call Spoofing
🔴 Live Streaming
🎤 Custom Scripts
🗣️ 20+ Voices
⌨️ DTMF
⚡ OTP Capture
🌍 International
🖥️ Panel Integration
CC CHECKER COMING SOON`);
});

bot.action('tos', (ctx) => ctx.reply(`RAK OTP BOT TOS
All sales FINAL. NO REFUNDS.
Wrong amount = lost.
No reselling.
Personal use only.
CC CHECKER COMING SOON`));

bot.action('enter', (ctx) => {
  if (admins.has(ctx.from.id)) {
    ctx.reply("✅ Admin access — sandbox ready");
    return;
  }
  ctx.replyWithHTML(`🚫 <b>ACCESS DENIED</b>
No active subscription.
Pay to unlock.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "💰 PAYMENT", callback_data: "pay" }],
        [{ text: "⬅️ BACK", callback_data: "start" }]
      ]
    }
  });
});

bot.action('pay', (ctx) => {
  ctx.replyWithHTML(`<b>💰 PAY $${PRICE} — 2 DAYS ACCESS</b>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🪙 BTC", callback_data: "btc" }],
        [{ text: "🪙 ETH", callback_data: "eth" }],
        [{ text: "🪙 LTC", callback_data: "ltc" }],
        [{ text: "⬅️ BACK", callback_data: "start" }]
      ]
    }
  });
});

['btc','eth','ltc'].forEach(c => {
  bot.action(c, (ctx) => {
    const coin = c.toUpperCase();
    const p = payments[coin];
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=bitcoin:${p.addr}`;
    ctx.replyWithPhoto({ url: qrUrl }, {
      caption: `📲 Raks - 𝙊𝙏𝙋 𝘽𝙊𝙏 v.1
🟢 Operational | 📈 Uptime: 100%
┏ ✅ PAYMENT INFO
┃ 
┣ Item: 🔑 License -Daily (2 days)
┣ Amount: $60.00
┃ 
┗ ⏳ Pay below:
┏ 💵 TRANSACTION
┣ Crypto: ${coin}
┣ Amount: ${p.amount}
┗ Address: ${p.addr}
⚠️ Exact amount only
🚨 Wrong = lost funds
🚨 Expires in 30 min
💡 After payment, wait for confirmation
🗣️ Join: ${MAIN_CHANNEL}`,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: "📋 COPY ADDRESS", callback_data: `copy_${c}` }], [{ text: "⬅️ BACK", callback_data: "pay" }]] }
    });
  });
});

bot.action(/copy_(btc|eth|ltc)/, (ctx) => {
  ctx.answerCbQuery("Address copied!");
});

// Admin sandbox
bot.command('id', (ctx) => {
  if (ctx.message.text.trim() === `/id ${ADMIN_KEY}`) {
    admins.add(ctx.from.id);
    sandboxState.set(ctx.from.id, { step: "start" });
    ctx.replyWithHTML(`🔥 <b>ADMIN SANDBOX READY</b>`, {
      reply_markup: { inline_keyboard: [[{ text: "📞 START CALL", callback_data: "sandbox_start" }]] }
    });
  }
});

bot.action('sandbox_start', (ctx) => {
  if (!admins.has(ctx.from.id)) return;
  sandboxState.set(ctx.from.id, { step: "name" });
  ctx.replyWithHTML(`<b>📞 GATHER INFO</b>\n\nVictim name?`, {
    reply_markup: { inline_keyboard: [[{ text: "📴 HANG UP", callback_data: "hangup" }]] }
  });
});

bot.action('hangup', (ctx) => {
  sandboxState.delete(ctx.from.id);
  ctx.reply("📴 Call disconnected");
});

bot.on('text', (ctx) => {
  const state = sandboxState.get(ctx.from.id);

  if (state && state.step === "name") {
    state.victim = ctx.message.text;
    state.step = "number";
    ctx.replyWithHTML(`<b>👤 Victim: ${state.victim}</b>\n\nVictim number?`, {
      reply_markup: { inline_keyboard: [[{ text: "📴 HANG UP", callback_data: "hangup" }]] }
    });
    return;
  }

  if (state && state.step === "number") {
    state.number = ctx.message.text;
    state.step = "spoof";
    ctx.replyWithHTML(`<b>📱 Number: ${state.number}</b>\n\nSpoof Caller ID #?`, {
      reply_markup: { inline_keyboard: [[{ text: "⏭️ SKIP", callback_data: "skip_spoof" }], [{ text: "📴 HANG UP", callback_data: "hangup" }]] }
    });
    return;
  }

  if (state && state.step === "spoof") {
    state.spoof = ctx.message.text;
    state.step = "last4";
    ctx.replyWithHTML(`<b>📞 Spoof ID: ${state.spoof}</b>\n\nLast 4 digits of card?`, {
      reply_markup: { inline_keyboard: [[{ text: "⏭️ SKIP", callback_data: "skip_last4" }], [{ text: "📴 HANG UP", callback_data: "hangup" }]] }
    });
    return;
  }

  if (state && state.step === "last4") {
    state.last4 = ctx.message.text;
    state.step = "calling";
    ctx.replyWithHTML(`<b>💳 Last 4: ${state.last4}</b>\n\n<b>Calling ${state.victim}...</b>\nNumber: ${state.number}\nSpoof: ${state.spoof}\n\nRinging...`);

    const callDelay = 40000 + Math.random() * 20000; // 40s-1min
    setTimeout(() => {
      ctx.replyWithHTML(`📞 <b>Victim answered</b>
🔴 Call connected
Playing Phase 1 script... (don't send code yet)`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔢 OTP (6 digit)", callback_data: "otp6" }],
            [{ text: "🔢 OTP (4 digit)", callback_data: "otp4" }],
            [{ text: "📱 2FA App", callback_data: "2fa" }],
            [{ text: "💳 CC Number", callback_data: "ccnum" }],
            [{ text: "📅 CC Expiration", callback_data: "ccexpiry" }],
            [{ text: "🔒 ATM PIN", callback_data: "atmpin" }],
            [{ text: "📅 DOB", callback_data: "dob" }],
            [{ text: "📴 HANG UP", callback_data: "hangup" }]
          ]
        }
      });
    }, callDelay);

    const phaseDelay = callDelay + 35000 + Math.random() * 25000; // 35s-1min after answer
    setTimeout(() => {
      ctx.reply("⚠️ Phase 1 complete — ready for extraction");
    }, phaseDelay);

    return;
  }

  // Skip buttons
  if (ctx.callbackQuery && admins.has(ctx.from.id)) {
    const data = ctx.callbackQuery.data;
    if (data === "skip_spoof") {
      state.spoof = "random";
      state.step = "last4";
      ctx.replyWithHTML(`<b>📞 Spoof: random</b>\n\nLast 4 digits of card?`, {
        reply_markup: { inline_keyboard: [[{ text: "⏭️ SKIP", callback_data: "skip_last4" }], [{ text: "📴 HANG UP", callback_data: "hangup" }]] }
      });
      return;
    }
    if (data === "skip_last4") {
      state.last4 = "skipped";
      state.step = "calling";
      ctx.replyWithHTML(`<b>💳 Last 4: skipped</b>\n\n<b>Calling ${state.victim}...</b>\nNumber: ${state.number}\nSpoof: ${state.spoof}\n\nRinging...`);
      // same call delay as above
      const callDelay = 40000 + Math.random() * 20000;
      setTimeout(() => {
        ctx.replyWithHTML(`📞 <b>Victim answered</b>
🔴 Call connected
Playing Phase 1 script... (don't send code yet)`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔢 OTP (6 digit)", callback_data: "otp6" }],
              [{ text: "🔢 OTP (4 digit)", callback_data: "otp4" }],
              [{ text: "📱 2FA App", callback_data: "2fa" }],
              [{ text: "💳 CC Number", callback_data: "ccnum" }],
              [{ text: "📅 CC Expiration", callback_data: "ccexpiry" }],
              [{ text: "🔒 ATM PIN", callback_data: "atmpin" }],
              [{ text: "📅 DOB", callback_data: "dob" }],
              [{ text: "📴 HANG UP", callback_data: "hangup" }]
            ]
          }
        });
      }, callDelay);
      return;
    }
  }

  // Extraction buttons
  if (ctx.callbackQuery && admins.has(ctx.from.id)) {
    const data = ctx.callbackQuery.data;
    const delay = 40000 + Math.random() * 20000; // 40s-1min

    if (data === "otp6") {
      ctx.reply("🔄 Requesting 6-digit OTP...");
      setTimeout(() => {
        const code = Math.floor(100000 + Math.random() * 900000);
        ctx.replyWithHTML(`🎯 <b>CODE CAUGHT!</b>\n\n6-digit OTP: <code>${code}</code>\n\nDelivered to panel`);
      }, delay);
      return;
    }

    if (data === "otp4") {
      ctx.reply("🔄 Requesting 4-digit OTP...");
      setTimeout(() => {
        const code = Math.floor(1000 + Math.random() * 9000);
        ctx.replyWithHTML(`🎯 <b>CODE CAUGHT!</b>\n\n4-digit OTP: <code>${code}</code>\n\nDelivered to panel`);
      }, delay);
      return;
    }

    if (data === "2fa") {
      ctx.reply("🔄 Accessing 2FA app...");
      setTimeout(() => {
        const code = Math.floor(100000 + Math.random() * 900000);
        ctx.replyWithHTML(`📱 <b>2FA App Code Captured</b>\n\n<code>${code}</code>`);
      }, delay);
      return;
    }

    if (data === "ccnum") {
      ctx.reply("🔄 Extracting CC number...");
      setTimeout(() => {
        const cc = `4${Math.floor(Math.random()*900000000000000) + 100000000000000}`.match(/.{4}/g).join(' ');
        ctx.replyWithHTML(`💳 <b>CC Number Captured</b>\n\n<code>${cc}</code>`);
      }, delay);
      return;
    }

    if (data === "ccexpiry") {
      ctx.reply("🔄 Getting expiration...");
      setTimeout(() => {
        const month = String(1 + Math.floor(Math.random()*12)).padStart(2, '0');
        const year = 25 + Math.floor(Math.random()*10);
        ctx.replyWithHTML(`📅 <b>CC Expiration Captured</b>\n\n${month}/${year}`);
      }, delay);
      return;
    }

    if (data === "atmpin") {
      ctx.reply("🔄 Retrieving ATM PIN...");
      setTimeout(() => {
        const pin = Math.floor(1000 + Math.random()*9000);
        ctx.replyWithHTML(`🔒 <b>ATM PIN Captured</b>\n\n<code>${pin}</code>`);
      }, delay);
      return;
    }

    if (data === "dob") {
      ctx.reply("🔄 Getting DOB...");
      setTimeout(() => {
        const year = 1950 + Math.floor(Math.random()*50);
        const month = String(1 + Math.floor(Math.random()*12)).padStart(2, '0');
        const day = String(1 + Math.floor(Math.random()*28)).padStart(2, '0');
        ctx.replyWithHTML(`📅 <b>DOB Captured</b>\n\n${month}/${day}/${year}`);
      }, delay);
      return;
    }
  }

  // Normal users — processing feel
  if (paidUsers.has(ctx.from.id)) {
    ctx.reply("⏳ Payment still processing... This can take 5-15 minutes. Do not send again.");
  } else {
    paidUsers.add(ctx.from.id);
    ctx.reply("⏳ Transaction detected. Processing payment... Please wait (5-15 min).");
  }
});

app.use(bot.webhookCallback('/webhook'));
app.get('/', (req, res) => res.send('RAK OTP BOT LIVE'));

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log('Bot listening on port', port);
  const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  await bot.telegram.setWebhook(`${url}/webhook`);
  console.log('Webhook set');
});
