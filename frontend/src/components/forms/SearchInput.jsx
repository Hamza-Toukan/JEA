import { Search } from "lucide-react";
import { Input } from "../ui/Input";

export function SearchInput({ placeholder = "بحث...", className, ...props }) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      icon={Search}
      aria-label="بحث"
      className={className}
      {...props}
    />
  );
}
