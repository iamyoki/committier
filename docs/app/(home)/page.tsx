import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-1">
      <div className="max-w-[85rem] flex flex-col justify-center flex-1 mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Announcement Banner */}
        <div className="inline-flex items-center self-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          🚀 New release
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        </div>
        {/* End Announcement Banner */}

        {/* Title */}
        <div className="mt-5 max-w-xl text-center mx-auto">
          <h1
            className="block font-bold text-4xl md:text-5xl lg:text-6xl
          text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
          >
            Polyrepo Template
          </h1>
        </div>
        {/* End Title */}

        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            A best-practice polyrepo template for managing single package and
            application in a repository. This template is designed to streamline
            development workflows, enforce consistent coding standards.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/docs"
            className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* <div className="w-full sm:w-auto flex items-center bg-slate-900 border border-slate-800 rounded-full px-5 py-3 hover:border-slate-700 transition-colors">
            <span className="text-slate-500 mr-3">$</span>
            <span className="text-slate-300 font-mono text-sm">
              git clone --depth=1 ...
            </span>
            <i
              data-lucide="copy"
              className="w-4 h-4 text-slate-500 ml-4 group-hover:text-white transition-colors"
            ></i>
          </div> */}
        </div>
      </div>
    </div>
  );
}
