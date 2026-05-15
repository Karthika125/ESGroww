"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col" style={{ animation: "template-enter 0.4s ease-in-out" }}>
      <style>{`
        @keyframes template-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}
