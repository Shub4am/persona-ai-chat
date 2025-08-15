import Image from "next/image";

export default function PersonaDetails({ persona, setPersona }) {
    const personas = [
        {
            id: "hitesh",
            name: "Hitesh",
            avatar: "/hitesh.png",
            gradient: "from-orange-500 to-amber-600",
            bio: "Full-stack developer and educator passionate about teaching modern web technologies.",
            expertise: "JavaScript, React, Node.js, MongoDB",
            status: "online",
        },
        {
            id: "piyush",
            name: "Piyush",
            avatar: "/piyush.png",
            gradient: "from-orange-500 to-amber-600",
            bio: "DevOps engineer and content creator focused on cloud technologies and automation.",
            expertise: "Docker, Kubernetes, AWS, CI/CD",
            status: "online",
        },
    ]

    const currentPersona = personas.find(p => p.id === persona);

    return (
        <div className="space-y-4 ">
            {/* Persona Selector */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-2 border border-slate-600/30 shadow-2xl">
                <div className="flex flex-col gap-2">
                    {personas.map((p) => {
                        const active = persona === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setPersona(p.id)}
                                className={[
                                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform",
                                    active
                                        ? `bg-gradient-to-r ${p.gradient} text-white shadow-2xl scale-[1.02] ring-2 ring-white/20`
                                        : "text-gray-300 hover:bg-slate-700/50 hover:text-white hover:scale-[1.01]",
                                ].join(" ")}
                                aria-pressed={active}
                            >
                                <div className="relative">
                                    <Image
                                        src={p.avatar}
                                        alt={`${p.name} avatar`}
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                                    />
                                    {/* Online indicator */}
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold">{p.name}</div>
                                    {active && (
                                        <div className="text-xs opacity-90 mt-0.5">
                                            {p.status === "online" ? "Available now" : "Away"}
                                        </div>
                                    )}
                                </div>
                                {active && (
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Persona Details */}
            {currentPersona && (
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${currentPersona.gradient} p-4`}>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src={currentPersona.avatar}
                                    alt={`${currentPersona.name} avatar`}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover ring-3 ring-white/30"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{currentPersona.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                    <span className="text-white/90 text-sm font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Bio */}
                        <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">About</span>
                            </div>
                            <p className="text-gray-100 text-sm leading-relaxed">{currentPersona.bio}</p>
                        </div>

                        {/* Expertise */}
                        <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">Expertise</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {currentPersona.expertise.split(', ').map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-gradient-to-r from-orange-400 to-amber-600 text-gray-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}