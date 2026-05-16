import "../styles.css";

export const metadata = {
  title: "Shisen",
  description: "A shared linguistic bridge for comparing Korean and Japanese news narratives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
