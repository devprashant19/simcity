import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import StartScreen from "./pages/StartScreen";
import PathSelection from "./pages/PathSelection";
import MCQRound from "./pages/MCQRound";
import RiddleRound from "./pages/RiddleRound";
import ResultsScreen from "./pages/ResultsScreen";
import GameEndScreen from "./pages/GameEndScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/path-selection" element={<PathSelection />} />
            <Route path="/round-1" element={<MCQRound key="round-1" />} />
            <Route path="/round-2" element={<MCQRound key="round-2" />} />
            <Route path="/riddles" element={<RiddleRound />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/game-end" element={<GameEndScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
