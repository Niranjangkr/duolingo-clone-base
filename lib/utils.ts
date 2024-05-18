import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("copied!");
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("copied!")
    } catch (error) {
      toast.success("copied!")
    }
    document.body.removeChild(textArea);
  }
}