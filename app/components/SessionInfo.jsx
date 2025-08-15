import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';

export default function SessionInfo({ onClearChat }) {

    const modelInfo = {
        name: "Google Gemini",
        version: "2.5 Flash",
        capabilities: ["Text", "Code", "Analysis"],
    };

    const handleClearChat = () => {
        if (onClearChat) {
            onClearChat();
            toast("Chat cleared")
        }
    };

    const handleExportLog = () => {
        console.log("Export log functionality to be implemented");
        toast("Feature implementation in the works")
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
                    <h3 className="text-white font-bold text-lg">Session Active</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Model Info */}
                <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                        </div>
                        <div>
                            <div className="text-white font-semibold text-sm">{modelInfo.name}</div>
                            <div className="text-gray-400 text-xs">v{modelInfo.version}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-gray-400 text-xs block mb-1">Capabilities:</span>
                            <div className="flex flex-wrap gap-1">
                                {modelInfo.capabilities.map((cap, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-medium border border-blue-500/30"
                                    >
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">Quick Actions</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleClearChat}
                            className="bg-slate-600/50 hover:bg-slate-600/70 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-slate-500/30 hover:border-slate-400/50"
                        >
                            Clear Chat
                        </button>
                        <button
                            onClick={handleExportLog}
                            className="bg-slate-600/50 hover:bg-slate-600/70 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-slate-500/30 hover:border-slate-400/50"
                        >
                            Export Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}