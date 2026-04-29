import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <Image src="/logo.png" alt="HireMate Logo" width={40} height={40} />
          <span className="text-xl font-bold text-blue-600">HireMate AI</span>
        </a>

        <div className="flex gap-6 text-sm text-gray-600"></div>
      </div>
    </nav>
  );
}
