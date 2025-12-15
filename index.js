const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_KEY = "Cl339950";
const PRICE = 60;
const IMG = "https://i.ibb.co/3ymZ8zrq/IMG-0792.jpg";
const CHANNEL = "https://t.me/raktf";

const payments = {
  BTC: {addr: "1NtpN3aPZowqEzX16E5cMUHQ16P9KHQtiy", amount: "0.000674 BTC"},
  ETH: {addr: "0x8cBc2AD1dF8c0e42465a9E80c1B84FeB0dEE0D87", amount: "0.0193 ETH"},
  LTC: {addr: "LhWYtDeDPfUtEpbJC2Pho7xQTXfEEXj6UY", amount: "0.741 LTC"}
};

const paidUsers = new Set(); // only activate after payment + message
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
🎯 Join our channel: ${CHANNEL}
💬 Click below to begin`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔓 ENTER BOT", callback_data: "enter" }],
        [{ text: "💰 PAYMENT", callback_data: "pay" }],
        [{ text: "🔥 FEATURES", callback_data: "features" }],
        [{ text: "🗣️ VOUCHES", url: CHANNEL }],
        [{ text: "🆘 SUPPORT", url: CHANNEL }],
        [{ text: "📜 TERMS OF SERVICE", callback_data: "tos" }]
      ]
    }
  });
});

bot.action('features', (ctx) => {
  ctx.replyWithHTML(`<b>🔥 RAK OTP BOT FEATURES</b>
📞 Call Spoofing
🔴 Live Call Streaming
🎤 Custom Scripts
🗣️ 20+ Voices
⌨️ DTMF Detection
⚡ Real-time OTP Capture
🌍 International Numbers
🖥️ Panel Integration
CC CHECKER COMING SOON`);
});

bot.action('tos', (ctx) => ctx.reply(`RAK OTP BOT TOS
All sales FINAL. NO REFUNDS.
Wrong amount = loss.
No reselling.
Personal use only.
CC CHECKER COMING SOON`));

bot.action('enter', (ctx) => {
  if (paidUsers.has(ctx.from.id) || admins.has(ctx.from.id)) {
    ctx.reply("✅ Access active — forward OTP messages");
    return;
  }
  ctx.replyWithHTML(`🚫 <b>UH OH!</b>
No subscription detected.
Pay first to unlock.`, {
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
┗ ⏳ Pay below to activate:
┏ 💵 TRANSACTION INFO
┣ Crypto: ${coin}
┣ Amount: ${p.amount}
┗ Address: ${p.addr}
⚠️ Automated system — exact amount only
🚨 Wrong amount = lost funds
🚨 Expires in 30 minutes
💡 After payment, send any message
🗣️ Join: ${CHANNEL}`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📋 COPY ADDRESS", callback_data: `copy_${c}` }],
          [{ text: "⬅️ BACK", callback_data: "pay" }]
        ]
      }
    });
  });
});

bot.action(/copy_(btc|eth|ltc)/, (ctx) => {
  const coin = ctx.match[1].toUpperCase();
  const addr = payments[coin].addr;
  ctx.answerCbQuery("Address copied!");
  // Telegram auto copies on long press, but we notify
});

bot.command('id', (ctx) => {
  const text = ctx.message.text.trim();
  if (text === `/id ${ADMIN_KEY}`) {
    admins.add(ctx.from.id);
    sandboxState.set(ctx.from.id, { step: "start" });
    ctx.replyWithHTML(`
🔥 <b>ADMIN LIVE SANDBOX</b>
Ready for demo`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 ENTER LIVE SANDBOX", callback_data: "sandbox_start" }]
        ]
      }
    });
  }
});

bot.action('sandbox_start', (ctx) => {
  if (!admins.has(ctx.from.id)) return;
  sandboxState.set(ctx.from.id, { step: "bank" });
  ctx.replyWithHTML(`<b>📞 LIVE SANDBOX — SELECT BANK</b>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🏦 Chase", callback_data: "bank_chase" }],
        [{ text: "🏦 Wells Fargo", callback_data: "bank_wells" }],
        [{ text: "🏦 Bank of America", callback_data: "bank_boa" }],
        [{ text: "🏦 Capital One", callback_data: "bank_capone" }],
        [{ text: "🏦 Citi", callback_data: "bank_citi" }],
        [{ text: "📴 HANG UP", callback_data: "hangup" }]
      ]
    }
  });
});

['chase','wells','boa','capone','citi'].forEach(b => {
  bot.action(`bank_${b}`, (ctx) => {
    if (!admins.has(ctx.from.id)) return;
    sandboxState.get(ctx.from.id).bank = b.toUpperCase();
    sandboxState.get(ctx.from.id).step = "name";
    ctx.replyWithHTML(`<b>🏦 Bank: ${b.toUpperCase()}</b>\n\nVictim name?`, {
      reply_markup: { inline_keyboard: [[{ text: "📴 HANG UP", callback_data: "hangup" }]] }
    });
  });
});

bot.action('hangup', (ctx) => {
  sandboxState.delete(ctx.from.id);
  ctx.reply("📴 Call terminated");
});

bot.on('text', (ctx) => {
  const state = sandboxState.get(ctx.from.id);

  if (state && state.step === "name") {
    state.victim = ctx.message.text;
    state.step = "id";
    ctx.replyWithHTML(`<b>👤 Victim: ${state.victim}</b>\n\nSpoof Caller ID?`, {
      reply_markup: { inline_keyboard: [[{ text: "📴 HANG UP", callback_data: "hangup" }]] }
    });
    return;
  }

  if (state && state.step === "id") {
    state.spoof = ctx.message.text;
    state.step = "calling";
    ctx.replyWithHTML(`<b>📞 Calling ${state.victim}...</b>\nSpoofing: ${state.spoof}\nBank: ${state.bank}\n\nRinging...`);

    const answerDelay = 15000 + Math.random() * 15000; // 15-30s
    setTimeout(() => {
      ctx.replyWithHTML(`📞 <b>Victim answered</b>\n\n🔴 Live streaming active\nPlaying Phase 1 script...`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📅 Get DOB", callback_data: "get_dob" }],
            [{ text: "💳 Get CVV", callback_data: "get_cvv" }],
            [{ text: "🔢 Get Code", callback_data: "get_code" }],
            [{ text: "⏸️ Hold Call", callback_data: "hold" }],
            [{ text: "📴 HANG UP", callback_data: "hangup" }]
          ]
        }
      });
    }, answerDelay);

    const pressDelay = answerDelay + 40000 + Math.random() * 30000; // 40-70s after answer
    setTimeout(() => {
      ctx.reply("⚠️ Victim pressed 1 — ready for code");
    }, pressDelay);

    return;
  }

  // Extra buttons
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
    if (data === "get_code") {
      const codeDelay = 90000 + Math.random() * 60000; // 1.5-2.5 min
      ctx.reply("🔄 Requesting code from victim...");
      setTimeout(() => {
        const code = Math.floor(100000 + Math.random() * 900000);
        ctx.replyWithHTML(`🎯 <b>CODE CAUGHT!</b>\n\n<code>${code}</code>\n\nDelivered to panel`);
      }, codeDelay);
      return;
    }
    if (data === "hold") {
      ctx.reply("⏸️ Call on hold — playing music...");
      return;
    }
  }

  // Normal user — activate only after payment (any message)
  if (!paidUsers.has(ctx.from.id)) {
    paidUsers.add(ctx.from.id);
    ctx.replyWithHTML(`✅ <b>SUBSCRIPTION ACTIVE</b>\n\n2 Days access\nForward OTP messages\n\nJoin: ${CHANNEL}`);
  } else {
    const codes = ctx.message.text.match(/\d{4,8}/g);
    if (codes) {
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
    } else {
      ctx.reply("✅ Processing...");
    }
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
