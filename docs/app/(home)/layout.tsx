import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Metadata } from "next";

export default function Layout({ children }: LayoutProps<"/">) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}

export const metadata: Metadata = {
  title: "committier",
  description: "Fix and format commit messages.",
};
