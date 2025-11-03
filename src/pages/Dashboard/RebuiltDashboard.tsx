import MetricCard from '../../components/common/MetricCard';
import {
  DocsIcon,
  CheckCircleIcon,
  TimeIcon,
  GroupIcon,
} from '../../icons';

const metrics = [
  {
    title: 'Solicitudes Activas',
    value: '24',
    Icon: DocsIcon,
  },
  {
    title: 'Aprobados Hoy',
    value: '8',
    Icon: CheckCircleIcon,
  },
  {
    title: 'Pendientes',
    value: '16',
    Icon: TimeIcon,
  },
  {
    title: 'Clientes Activos',
    value: '156',
    Icon: GroupIcon,
  },
];

export default function RebuiltDashboard() {
  return (
    <div className="space-y-6">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            Icon={metric.Icon}
          />
        ))}
      </div>

      {/* Información importante */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl text-white p-6">
        <h2 className="text-xl font-bold mb-2">Información Importante</h2>
        <p className="text-blue-100">
          Todos los documentos y datos personales son manejados bajo estricto
          cumplimiento de la Ley 1581 de 2012 (Habeas Data). La plataforma
          garantiza la seguridad y confidencialidad de la información sensible.
        </p>
      </div>
    </div>
  );
}
