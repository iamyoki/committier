import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import demo from "../../public/demo.gif";

export default function HomePage() {
  return (
    <div className="flex flex-1">
      <div
        className="max-w-[85rem] flex max-lg:flex-col items-center justify-center
      gap-40 max-lg:gap-10 flex-1 mx-auto px-4 sm:px-6 lg:px-8 pb-32 max-lg:pb-8"
      >
        <div className="flex flex-col items-start max-lg:items-center">
          {/* Announcement Banner */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-fd-primary/10 
          text-fd-primary text-sm mb-4"
          >
            <Link
              href="https://github.com/iamyoki/committier/releases/latest"
              target="_blank"
            >
              🚀 New release
            </Link>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fd-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fd-primary"></span>
            </span>
          </div>
          {/* End Announcement Banner */}

          {/* Title */}
          <div className="max-w-xl">
            <h1
              className="block font-bold text-5xl md:text-6xl
        text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-[#26EE87]/60"
            >
              committier
            </h1>
          </div>
          {/* End Title */}

          <div className="mt-3 max-w-3xl ml-2">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Fix and Format commit messages.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col ml-[-10] sm:flex-row gap-4 mt-8">
            <Link
              href="/docs"
              className="w-full sm:w-auto px-5 py-3 hover:bg-fd-secondary hover:text-fd-primary text-white rounded-full transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="max-md:p-12">
          <Image width={600} height={300} alt="demo" src={demo} />
        </div>
      </div>
    </div>
  );
}
