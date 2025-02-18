import React from 'react';
import { Machine } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  onEdit,
  onDelete,
}) => {
  const statusColors = {
    idle: 'bg-gray-200 text-gray-800',
    running: 'bg-green-200 text-green-800',
    maintenance: 'bg-yellow-200 text-yellow-800',
    error: 'bg-red-200 text-red-800',
  };

  const statusTranslations = {
    idle: 'Parada',
    running: 'Em Operação',
    maintenance: 'Manutenção',
    error: 'Erro',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{machine.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(machine)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Editar máquina"
          >
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(machine.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Remover máquina"
          >
            <Trash2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[machine.status]}`}>
            {statusTranslations[machine.status]}
          </span>
        </div>

        <div>
          <span className="text-sm text-gray-600">Progresso:</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${machine.progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{machine.progress}%</span>
        </div>

        {machine.next_product && (
          <div>
            <span className="text-sm text-gray-600">Próximo Produto:</span>
            <p className="font-medium">{machine.next_product}</p>
          </div>
        )}
      </div>
    </div>
  );
};