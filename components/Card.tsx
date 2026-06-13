import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = true,
}: CardProps) {
  return (
    <div
      className={`card ${hover ? "card-hover" : ""} ${padding ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
