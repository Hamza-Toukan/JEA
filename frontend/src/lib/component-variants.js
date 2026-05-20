/**
 * Centralized Tailwind class maps for UI primitives.
 * Single source of truth — components consume these maps only.
 */

export const focusRing = "ui-focus-ring";

export const buttonVariants = {
  base: `inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-[var(--duration-fast)] ${focusRing} disabled:pointer-events-none disabled:opacity-50`,
  variant: {
    primary:
      "bg-primary text-white border border-primary hover:bg-primary-hover shadow-jea-sm",
    secondary:
      "bg-surface text-primary border border-border hover:bg-background hover:border-accent/40",
    ghost:
      "bg-transparent text-muted border border-transparent hover:bg-accent-muted hover:text-primary",
    danger:
      "bg-error text-white border border-error hover:bg-red-700",
    accent:
      "bg-accent text-white border border-accent hover:bg-primary-hover",
  },
  size: {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-10 px-5 text-sm gap-2",
  },
};

export const badgeVariants = {
  base: "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
  variant: {
    default: "bg-accent-muted text-primary border-accent-subtle",
    success: "bg-success-subtle text-success border-success-border",
    warning: "bg-warning-subtle text-warning border-warning-border",
    danger: "bg-error-subtle text-error border-error-border",
    info: "bg-info-subtle text-info border-info-border",
    neutral: "bg-background text-muted border-border",
  },
};

export const cardVariants = {
  base: "rounded-xl border border-border-subtle bg-surface shadow-jea-sm",
  header: "border-b border-border-subtle px-5 py-4",
  body: "p-5",
  footer: "border-t border-border-subtle px-5 py-4",
};

export const inputVariants = {
  field:
    "h-9 w-full rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
  textarea:
    "min-h-[100px] w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50",
  iconOffset: "ps-9 pe-3",
  plainPadding: "px-3",
};

export const iconButtonVariants = {
  base: `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-background hover:text-primary ${focusRing}`,
};

export const tableVariants = {
  head: "border-b border-border-subtle bg-background/80 text-xs text-muted",
  headCell: "px-4 py-3 text-start font-medium",
  row: "border-b border-border-subtle transition-colors",
  rowInteractive: "cursor-pointer hover:bg-background",
  rowSelected: "bg-accent-muted/40",
  cell: "px-4 py-3 text-foreground",
};

export const alertVariants = {
  base: "flex gap-3 rounded-lg border px-4 py-3 text-sm",
  variant: {
    info: "border-info-border bg-info-subtle text-info",
    warning: "border-warning-border bg-warning-subtle text-amber-900",
    danger: "border-error-border bg-error-subtle text-red-900",
    success: "border-success-border bg-success-subtle text-emerald-900",
  },
  icon: {
    info: "text-accent",
    warning: "text-warning",
    danger: "text-error",
    success: "text-success",
  },
};

export const tabsVariants = {
  list: "inline-flex gap-1 rounded-lg border border-border-subtle bg-background p-1",
  trigger:
    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors ui-focus-ring",
  triggerActive: "bg-surface text-primary shadow-jea-sm",
  triggerInactive: "text-muted hover:text-primary",
};
