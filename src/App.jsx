import { motion } from "framer-motion";

function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
            <motion.h1
                className="text-5xl font-bold text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Prognos-AI
            </motion.h1>
        </div>
    );
}

export default App;
