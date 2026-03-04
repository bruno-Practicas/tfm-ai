import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { FilterBar } from './components/Layout/FilterBar';
import { CanaryIslands2D } from './components/Map3D/CanaryIslands2D';
import { KPICards } from './components/Dashboard/KPICards';
import { TouristChart } from './components/Dashboard/TouristChart';
import { OriginChart } from './components/Dashboard/OriginChart';
import { SeasonalityChart } from './components/Dashboard/SeasonalityChart';
import { OccupancyChart } from './components/Dashboard/OccupancyChart';
import { IslandComparisonTourists } from './components/Dashboard/IslandComparisonTourists';
import { IslandComparisonRevenue } from './components/Dashboard/IslandComparisonRevenue';
import { ChatPanel } from './components/Chat/ChatPanel';
import { useTourismData } from './hooks/useTourismData';
import { useIslandSelection } from './hooks/useIslandSelection';
import { ISLANDS_INFO } from './types/tourism';

function App() {
  const {
    selectedIsland,
    hoveredIsland,
    selectIsland,
    hoverIsland
  } = useIslandSelection();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const { data: filteredData, aggregatedData, islandMetrics, loading, error, years } = useTourismData(
    selectedIsland,
    selectedYear || undefined,
    selectedYear || undefined,
    selectedMonth || undefined
  );

  const selectedIslandInfo = ISLANDS_INFO.find(i => i.code === selectedIsland);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ocean-500 mx-auto"></div>
          <p className="text-volcanic-300">Cargando datos de turismo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center space-y-4">
          <p className="text-red-400 text-lg font-semibold">Error al cargar los datos</p>
          <p className="text-volcanic-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        selectedIsland={selectedIsland}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        filteredData={filteredData}
        aggregatedData={aggregatedData}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-8xl mx-auto p-6 space-y-6">
          {/* 2D Map Section */}
          <div className="card h-[500px]" data-exclude-pdf="true">
            <CanaryIslands2D
              selectedIsland={selectedIsland}
              hoveredIsland={hoveredIsland}
              onSelectIsland={selectIsland}
              onHoverIsland={hoverIsland}
            />
          </div>

          {/* Filter Bar */}
          <div data-exclude-pdf="true">
            <FilterBar
              selectedIsland={selectedIsland}
              onSelectIsland={selectIsland}
              years={years}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>

          {/* KPI Cards */}
            <KPICards
              data={aggregatedData}
              islandName={selectedIslandInfo?.name}
            />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TouristChart data={aggregatedData} />
              <OccupancyChart data={aggregatedData} />
              <OriginChart data={aggregatedData} />
              <SeasonalityChart data={aggregatedData} />
            </div>

            {/* Island Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IslandComparisonTourists islandMetrics={islandMetrics} />
              <IslandComparisonRevenue islandMetrics={islandMetrics} />
            </div>

            {/* Footer Info */}
            <div className="card text-center text-sm text-volcanic-300" data-exclude-pdf="true">
              <p>
                Fuente de Datos: Estadísticas Oficiales de Turismo de Canarias
                • TFM IA Generativa • 2025
              </p>
            </div>
        </div>
      </main>

      {/* Floating Chat Panel */}
      <ChatPanel />
    </div>
  );
}

export default App;
