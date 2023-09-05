import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="h-72 w-4/12 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
        <div className=" h-full w-full bg-gray-800 flex items-center justify-center">
          <h1 className="text-white">POLSKA GUROM</h1>
        </div>
      </div>
    </main>
  );
}
