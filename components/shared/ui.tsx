"use client";
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useState,
  useRef,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import { type TokenSymbol } from "@/lib/demo";
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return <button className={`button ${variant} ${className}`} {...props} />;
}
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props} />;
}
export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
export function TokenLogo({ token }: { token: TokenSymbol }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="token-fallback">{token}</span>
  ) : (
    <span className={`token-logo ${token === "CKB" ? "ckb-token-logo" : ""}`}>
      <img
        src={token === "CKB" ? "/tokens/ckb-logo.png" : "/tokens/usdc.png"}
        width="36"
        height="36"
        alt={`${token} logo`}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
export function TokenRow({
  token,
  children,
}: {
  token: TokenSymbol;
  children?: ReactNode;
}) {
  return (
    <span className="token-row">
      <TokenLogo token={token} />
      <strong>{children || token}</strong>
    </span>
  );
}
export function Tabs({
  value,
  onChange,
  options,
  label,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: ReactNode }[];
  label: string;
  className?: string;
}) {
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={onChange}
      className={className}
    >
      <TabsPrimitive.List className="tabs" aria-label={label}>
        {options.map((o) => (
          <TabsPrimitive.Trigger className="tab" key={o.value} value={o.value}>
            {o.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay" />
        <DialogPrimitive.Content
          className="dialog-content"
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement as HTMLElement;
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            returnFocus.current?.focus();
          }}
        >
          <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="muted">
            Demo only · no signing or funds movement.
          </DialogPrimitive.Description>
          <DialogPrimitive.Close
            className="dialog-close"
            aria-label="Close dialog"
          >
            <X size={20} />
          </DialogPrimitive.Close>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
