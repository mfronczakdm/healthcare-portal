import Image from "next/image";
import Link from "next/link";
import { brandConfig } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  showTagline = false,
}: {
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex min-w-0 items-center gap-3", className)}
    >
      <Image
        src={brandConfig.logoImagePath}
        alt={brandConfig.organizationName}
        width={220}
        height={52}
        className={cn("h-9 w-auto object-contain sm:h-10", imageClassName)}
        priority
      />
      {showTagline ? (
        <span className="hidden text-xs text-muted-foreground lg:inline">
          {brandConfig.tagline}
        </span>
      ) : null}
    </Link>
  );
}
