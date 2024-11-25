import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.TOKEN_TELEGRAM_BOT) {
    console.error("Erro: TOKEN_TELEGRAM_BOT não definido no .env!");
    process.exit(1);
}
// Inicializa o bot com polling
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM_BOT, { polling: true });
// Evento de mensagem padrão
bot.on("message", (msg) => {
    console.log("Mensagem recebida:", msg.text);
    if (msg.text === "Oi" || msg.text === "Olá") {
        bot.sendMessage(msg.chat.id, `Olá, ${msg.chat.first_name}! Como posso ajudar?`);
    }
});
// Comando /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Bem-vindo ao bot! Aqui estão algumas opções:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Ver imagem", callback_data: "show_image" }],
                [{ text: "Diga Olá", callback_data: "say_hello" }],
            ],
        },
    });
});
// Tratando cliques nos botões
bot.on("callback_query", (query) => {
    if (query.message) {
        const chatId = query.message.chat.id;
        if (query.data === "show_image") {
            bot.sendPhoto(chatId, "https://via.placeholder.com/300", {
                caption: "Aqui está sua imagem!",
            });
        }
        if (query.data === "say_hello") {
            bot.sendMessage(chatId, "Olá! Espero que você esteja bem!");
        }
        // Notificar o Telegram que o callback foi processado
        bot.answerCallbackQuery(query.id);
    }
    else {
        console.warn("Callback sem mensagem associada:", query);
    }
});
// Envio de fotos diretamente
bot.onText(/\/foto/, (msg) => {
    bot.sendPhoto(msg.chat.id, "https://via.placeholder.com/300", {
        caption: "Aqui está sua foto personalizada!",
    });
});
// Lidar com erros no polling
bot.on("polling_error", (error) => {
    console.warn("Erro de polling capturado:", error.message);
});
// Tratamento genérico de erros
bot.on("error", (error) => {
    console.error("Erro inesperado:", error);
});
console.log("Bot está rodando. Envie mensagens para testá-lo!");
