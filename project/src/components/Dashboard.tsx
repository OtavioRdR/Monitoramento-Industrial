import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ChartType, Machine } from '../types';
import { useMachineStore } from '../store/machineStore';
import { MachineCard } from './MachineCard';
import { MachineModal } from './MachineModal';
import { PieChartIcon, BarChartIcon, LineChartIcon, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#10B981', '#F59E0B', '#6B7280', '#EF4444'];

export const Dashboard: React.FC = () => {
  const { machines, loading, fetchMachines, addMachine, updateMachine } = useMachineStore();
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>();

  useEffect(() => {
    fetchMachines('sample-company');
  }, [fetchMachines]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMachines('sample-company');
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddMachine = () => {
    setSelectedMachine(undefined);
    setIsModalOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  const handleSaveMachine = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedMachine) {
        await updateMachine({ ...machineData, id: selectedMachine.id });
        toast.success('Máquina atualizada com sucesso!');
      } else {
        await addMachine(machineData);
        toast.success('Máquina adicionada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao salvar máquina');
    }
  };

  const handleDeleteMachine = async (id: string) => {
    try {
      const updatedMachines = machines.filter(m => m.id !== id);
      useMachineStore.setState({ machines: updatedMachines });
      toast.success('Máquina removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover máquina');
    }
  };

  const getChartData = () => {
    const statusCount = machines.reduce((acc, machine) => {
      acc[machine.status] = (acc[machine.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusOrder = ['running', 'maintenance', 'idle', 'error'];
    return statusOrder.map(status => ({
      name: {
        running: 'Em Operação',
        maintenance: 'Manutenção',
        idle: 'Parada',
        error: 'Erro'
      }[status],
      value: statusCount[status] || 0,
      color: COLORS[statusOrder.indexOf(status)]
    }));
  };

  const renderChart = () => {
    const data = getChartData();

    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  const totalMachines = machines.length;
  const runningMachines = machines.filter(m => m.status === 'running').length;
  const maintenanceMachines = machines.filter(m => m.status === 'maintenance').length;
  const errorMachines = machines.filter(m => m.status === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel de Máquinas</h1>
            <p className="text-gray-600 mt-1">Monitoramento em tempo real</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button 
              onClick={handleAddMachine}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Adicionar Máquina
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total de Máquinas</div>
            <div className="text-2xl font-bold">{totalMachines}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Em Operação</div>
            <div className="text-2xl font-bold text-green-600">{runningMachines}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Em Manutenção</div>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceMachines}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Com Erro</div>
            <div className="text-2xl font-bold text-red-600">{errorMachines}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Visão Geral do Status</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PieChartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LineChartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {renderChart()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onEdit={() => handleEditMachine(machine)}
              onDelete={() => handleDeleteMachine(machine.id)}
            />
          ))}
        </div>
      </div>

      <MachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMachine}
        machine={selectedMachine}
      />
    </div>
  );
};