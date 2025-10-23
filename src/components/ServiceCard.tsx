import { useEffect, useRef } from "react";
import Link from "next/link";
import { Service } from "~/types/service";

interface ServiceCardProps {
  service: Service;
  distance?: number | null;
  onClick?: (serviceId: string) => void;
  isSelected?: boolean;
}

export function ServiceCard({
  service,
  distance,
  onClick,
  isSelected,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll to card when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      // Small delay to let the grid resize first
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // Use "nearest" instead of "start" to avoid unnecessary scrolling
          });
        }
      }, 350); // Wait for grid transition (300ms) + small buffer
    }
  }, [isSelected]);

  const cardContent = (
    <div
      className={`border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer w-full min-w-0 ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500 ring-opacity-50"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-2 gap-2">
        <span className="text-sm text-gray-500 truncate">
          ID : {service.id}
        </span>
        <span className="text-gray-500 text-sm whitespace-nowrap">
          📍 {service.commune}
        </span>
      </div>
      <h2 className="text-2xl font-semibold mb-3 break-words">{service.nom}</h2>
      {service.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
          {service.description}
        </p>
      )}
      {service.score_qualite !== undefined && (
        <div className="flex items-center ">
          <span className="text-xs text-gray-500">Score de qualité &nbsp;</span>
          <span className="text-sm font-medium">
            {service.score_qualite.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );

  // If onClick is provided, use it instead of Link
  if (onClick) {
    return (
      <div
        ref={cardRef}
        data-card
        onClick={() => onClick(service.id)}
        className="scroll-mt-4"
      >
        {cardContent}
      </div>
    );
  }

  // Otherwise, use Link (existing behavior)
  return (
    <Link
      href={`/services/${service.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {cardContent}
    </Link>
  );
}
