import * as React from "react";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface iButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, iButtonProps>(
  ({ className, children, href, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          target="_blank"
          className={twMerge("text-blue-500", className)}
        >
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} {...props} className={twMerge("", className)}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
