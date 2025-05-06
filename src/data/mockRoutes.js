
export const mockRoutes = [
  {
    id: 'cdmx-gdl',
    origin: 'Ciudad de México',
    destination: 'Guadalajara',
    distance: 535,
    time: '360 min',
    tolls: 950,
    restrictions: 'Circulación limitada para doble remolque en ciertas zonas.',
    startCoords: [19.4326, -99.1332],
    endCoords: [20.6597, -103.3496],
  },
  {
    id: 'mty-ver',
    origin: 'Monterrey',
    destination: 'Veracruz',
    distance: 1050,
    time: '720 min',
    tolls: 1500,
    restrictions: null,
    startCoords: [25.6866, -100.3161],
    endCoords: [19.1738, -96.1342],
  },
  {
    id: 'slp-qro',
    origin: 'San Luis Potosí',
    destination: 'Querétaro',
    distance: 205,
    time: '150 min',
    tolls: 400,
    restrictions: 'Revisar altura máxima en túneles.',
    startCoords: [22.1565, -100.9855],
    endCoords: [20.5888, -100.3899],
  },
  {
    id: 'pue-oax',
    origin: 'Puebla',
    destination: 'Oaxaca',
    distance: 340,
    time: '240 min',
    tolls: 600,
    restrictions: 'Curvas peligrosas en zona montañosa.',
    startCoords: [19.0414, -98.2063],
    endCoords: [17.0732, -96.7266],
  },
  {
    id: 'tij-mxli',
    origin: 'Tijuana',
    destination: 'Mexicali',
    distance: 170,
    time: '120 min',
    tolls: 350,
    restrictions: 'Zona de vientos fuertes (La Rumorosa).',
    startCoords: [32.5149, -117.0382],
    endCoords: [32.6278, -115.4545],
  },
   {
    id: 'cun-mid',
    origin: 'Cancún',
    destination: 'Mérida',
    distance: 310,
    time: '210 min',
    tolls: 550,
    restrictions: 'Posibles cierres por eventos turísticos.',
    startCoords: [21.1619, -86.8515],
    endCoords: [20.9674, -89.5926],
  }
];

export const filterRoutes = (params) => {
  // Simple filter simulation based on origin/destination keywords
  // In a real app, this would call an API
  const { origin, destination, truckType, isHazardous } = params;
  let filtered = mockRoutes;

  if (origin) {
    filtered = filtered.filter(route => route.origin.toLowerCase().includes(origin.toLowerCase()));
  }
  if (destination) {
    filtered = filtered.filter(route => route.destination.toLowerCase().includes(destination.toLowerCase()));
  }

  // Placeholder for truckType and isHazardous filtering logic
  if (truckType === 'extraHeavy' || isHazardous) {
    // Example: If extra heavy or hazardous, might remove certain routes or add warnings
    filtered = filtered.map(route => ({
      ...route,
      // restrictions: `${route.restrictions || ''} Posibles restricciones por tipo de carga/vehículo.`.trim()
    }));
  }

  // Add start/end coords if missing (for demo)
  filtered = filtered.map(route => ({
    ...route,
    startCoords: route.startCoords || [19.43, -99.13], // Default CDMX
    endCoords: route.endCoords || [20.65, -103.34] // Default GDL
  }));


  return filtered;
};
