import { Telegraf } from "telegraf";
import fs from "fs/promises";
import path from "path";

// TOKENni ENV variable dan olamiz
const bot = new Telegraf(process.env.TOKEN);

// Kino bazasi
const kinoDatabase = {
    1: { title: "Video 1", file: path.join(process.cwd(), 'movies/document_5273830234414684650.mp4') },
    2: { title: "Video 2", file: path.join(process.cwd(), 'movies/document_5276237318770954428.mp4') },
    3: { title: "Video 3", file: path.join(process.cwd(), 'movies/document_5276237318770954433.mp4') }
};

// 50MB limit
const MAX_SIZE = 50 * 1024 * 1024;

// /start
bot.start((ctx) => {
    ctx.reply(`Salom, ${ctx.from.first_name}! Kino kodini yuboring.`);
});

// Kino kodi ishlovchi qism
bot.on('text', async (ctx) => {
    const userInput = ctx.message.text.trim();

    if (!/^\d+$/.test(userInput)) {
        return ctx.reply("Iltimos, kino kodini raqamda yuboring.");
    }

    const kino = kinoDatabase[userInput];
    if (!kino) {
        return ctx.reply("Bu kod bo‘yicha kino topilmadi.");
    }

    try {
        const stats = await fs.stat(kino.file);

        if (stats.size > MAX_SIZE) {
            return ctx.reply("Uzr, video hajmi 50MB dan katta.");
        }

        await ctx.replyWithVideo(
            { source: kino.file },
            { caption: `🎬 Kino: ${kino.title}` }
        );

    } catch (err) {
        console.error(err);
        ctx.reply("Xatolik yuz berdi. Fayl topilmadi yoki o‘qib bo‘lmadi.");
    }
});

// Botni ishga tushirish
bot.launch()
    .then(() => console.log("Bot ishga tushdi (tez rejim)!"));
