import "./telegram-web-apps";
import type { Telegram, WebApp as WebAppTypes } from "@twa-dev/types";

const telegramWindow = window as unknown as Window & { Telegram: Telegram };

export const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;
