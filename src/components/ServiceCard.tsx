import { Service } from "~/types/service";

interface ServiceCardProps {
  service: Service;
  distance?: number | null;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className=" text-sm text-gray-500   inline-block">
          ID : {service.id}
        </span>
        <span className="text-gray-500  text-sm ">📍 {service.commune}</span>
      </div>
      <h2 className="text-2xl font-semibold mb-3">{service.nom}</h2>
      {service.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          {service.description}
        </p>
      )}
    </div>
  );
}
