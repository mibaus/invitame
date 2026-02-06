import type { Metadata } from "next";
import { 
  Cormorant_Garamond, 
  Lato, 
  Great_Vibes,
  Playfair_Display,
  Source_Sans_3,
  EB_Garamond,
  Crimson_Pro,
  Montserrat,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-accent-editorial",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display-drama",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-body-drama",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-display-heritage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-body-heritage",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body-seraphic",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-display-seraphic",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "invitame.design | Invitaciones Digitales de Lujo",
  description: "Plataforma de invitaciones digitales premium para bodas y eventos exclusivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`
          ${cormorantGaramond.variable} 
          ${lato.variable} 
          ${greatVibes.variable}
          ${playfairDisplay.variable}
          ${sourceSans3.variable}
          ${ebGaramond.variable}
          ${crimsonPro.variable}
          ${montserrat.variable}
          ${pinyonScript.variable}
          font-body antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
