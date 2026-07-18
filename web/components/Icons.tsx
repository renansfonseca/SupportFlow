import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const shared = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LogoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M7 5h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-9l-6.5 5v-5H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" />
      <path d="M10 12h12M10 17h7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="M12 5v14M5 12h14" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function ChevronIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="m8 10 4 4 4-4" /></svg>;
}

export function EditIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
}

export function TrashIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="M4 7h16M9 7V4h6v3M18 7l-1 13H7L6 7M10 11v5M14 11v5" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function InboxIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="M4 5h16l2 9v5H2v-5Z" /><path d="M2 14h5l2 3h6l2-3h5" /></svg>;
}

export function ClockIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
}

export function AlertIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="M12 4 3 20h18ZM12 9v4M12 17h.01" /></svg>;
}
