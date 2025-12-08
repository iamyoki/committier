import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import icon from "../public/icon.png";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image width={24} height={24} src={icon} alt="icon" />
          committier
        </>
      ),
    },
    githubUrl: "https://github.com/iamyoki/committier",
    links: [
      {
        text: "Documentation",
        url: "/docs",
      },
    ],
  };
}
