
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameIntroProps {
  onStart: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStart }) => {
  const [page, setPage] = useState(0);
  const pages = [
    {
      title: "Капли Света",
      text: "Ты — хранитель последнего Океана Света. В твоих руках сила создавать капли света в бесконечной тьме.",
    },
    {
      title: "Игровой процесс",
      text: "Каждый клик — новая капля света. Близкие капли соединяются линиями. Из них рождаются узоры и созвездия.",
    },
    {
      title: "Философия",
      text: "\"Из малых усилий рождается Вселенная.\" Каждая капля — вклад в свет и порядок. Создавай, исследуй, открывай.",
    },
  ];

  const nextPage = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      onStart();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md p-8 rounded-lg border border-white border-opacity-20 text-white backdrop-blur-sm bg-black bg-opacity-70">
        <motion.div
          key={`intro-page-${page}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-6">{pages[page].title}</h1>
          <p className="mb-8 text-lg">{pages[page].text}</p>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={nextPage}
              className="border-white border-opacity-30 hover:bg-white hover:bg-opacity-10"
            >
              {page < pages.length - 1 ? "Далее" : "Начать"}
            </Button>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {pages.map((_, i) => (
              <div 
                key={i}
                className={`h-2 w-2 rounded-full ${i === page ? 'bg-white' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameIntro;
