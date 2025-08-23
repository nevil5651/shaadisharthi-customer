import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <>

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Shaadi Sharthi</h1>
      <Image
        src="/images/shaadi-logo.png"
        alt="Shaadi Sharthi Logo"
        width={200}
        height={200}
        className="mb-6"
      />
      <p className="text-lg text-gray-700 mb-4">Your journey to finding the perfect match starts here.</p>
      <a href="/register" className="text-blue-500 hover:underline">Get Started</a>
    </div>

    </>


  );
}
