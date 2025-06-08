import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import WhatsappIcon from "@/components/icons/whatsapp.png";
import TelegramIcon from "@/components/icons/telegram.png";
import LinkedinIcon from "@/components/icons/linkedin.png";
import GmailIcon from "@/components/icons/gmail.png";

export default function MohammedCard() {
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
        <div className="flex justify-center my-2">
          <Avatar className="w-24 h-24 rounded-full">
            <AvatarImage src="https://avatars.githubusercontent.com/u/176960856?s=96&v=4" />
            <AvatarFallback className="text-3xl">MS</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Mohammed Sadik</h2>
        <p className="text-gray-700 mb-2">
          Full-Stack Developer, UI/UX Designer, and Open Source Enthusiast
        </p>
        <ul className="flex justify-between my-2 p-2">
          <li>
            <a href="mailto:mohammedsadiknuri@gmail.com" target="_blank">
              <Image
                src={GmailIcon}
                alt="Gmail Icon"
                className="w-10 h-10 hover:opacity-80"
              />
            </a>
          </li>

          <li>
            <a href="https://wa.me/251972014889" target="_blank">
              <Image
                src={WhatsappIcon}
                alt="Whatsapp Icon"
                className="w-10 h-10 hover:opacity-80"
              />
            </a>
          </li>

          <li>
            <a href="https://t.me/ma_me_2" target="_blank">
              <Image
                src={TelegramIcon}
                alt="Telegram Icon"
                className="w-10 h-10 hover:opacity-80"
              />
            </a>
          </li>

          <li>
            <a href="https://linkedin.com/in/moh-sadik" target="_blank">
              <Image
                src={LinkedinIcon}
                alt="LinkedIn Icon"
                className="w-10 h-10 hover:opacity-80"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
