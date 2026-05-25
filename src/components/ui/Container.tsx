import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`
        relative
        mx-auto
        w-full
        max-w-7xl
        px-6
        sm:px-8
        lg:px-12
        xl:px-16
        2xl:px-20
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
