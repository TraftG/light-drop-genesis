import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      text: '"Из малых усилий рождается Вселенная." Каждая капля — вклад в свет и порядок. Создавай, исследуй, открывай.',
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
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center p-4 text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl w-full"
          >
            <h1 className="text-5xl font-semibold mb-6 tracking-wide">
              {pages[page].title}
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-gray-300">
              {pages[page].text}
            </p>

            <Button
              variant="ghost"
              size="lg"
              onClick={nextPage}
              className="text-white hover:bg-transparent hover:text-white/80 transition-all border border-white/30"
            >
              {page < pages.length - 1 ? "Далее" : "Начать"}
            </Button>

            <div className="flex justify-center mt-8 space-x-3">
              {pages.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === page ? "bg-white" : "bg-white/20"
                  }`}
                  animate={{ scale: i === page ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default GameIntro;
