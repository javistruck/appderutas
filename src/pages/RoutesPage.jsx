
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchForm from '@/components/SearchForm';
import RouteCard from '@/components/RouteCard';
import { useToast } from '@/components/ui/use-toast';
import { filterRoutes } from '@/data/mockRoutes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from 'react-router-dom';

const filterRoutesSimulated = (params) => {
	let results = filterRoutes(params);

	if (params.avoidTolls) {
		results = results.filter(route => route.tolls === 0 || route.tolls === '0' || route.tolls === 'N/A');
		if (results.length === 0 && filterRoutes(params).length > 0) {
			const originalRoute = filterRoutes(params)[0];
			results.push({
				...originalRoute,
				id: `${originalRoute.id}-noToll`,
				tolls: 0,
				distance: Math.round(originalRoute.distance * 1.15),
				time: `${Math.round(parseInt(originalRoute.time) * 1.2)} min`,
				restrictions: `${originalRoute.restrictions || ''} (Ruta sin peajes)`.trim(),
				avoidTolls: true,
			});
		}
	} else {
		results = results.map(r => ({ ...r, avoidTolls: false }));
	}

	// Añadir parámetros completos, incluyendo descripciones, para RouteCard
	results = results.map(r => ({ ...r, searchParams: params }));

	return results;
};


const RoutesPage = () => {
	const { toast } = useToast();
	const [searchResults, setSearchResults] = useState([]);
	const [savedRoutes, setSavedRoutes] = useLocalStorage('savedRoutes', []);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = (searchParams) => {
		const results = filterRoutesSimulated(searchParams);
		setSearchResults(results);
		setHasSearched(true);

		if (results.length === 0) {
			toast({
				title: "Sin resultados",
				description: "No se encontraron rutas que coincidan con tu búsqueda.",
				variant: "destructive",
			});
		}
	};

	const handleSelectRouteForMap = (route) => {
		console.log("Seleccionada para ver en mapa:", route);
		toast({
			title: "Ver en Mapa",
			description: `Prepara la vista del mapa para la ruta ${route.origin} a ${route.destination}. (Funcionalidad pendiente)`,
		});
	};

	const handleSaveRoute = (route) => {
		if (!savedRoutes.some(r => r.id === route.id)) {
			// Guardar ruta con searchParams (incluye descripciones y avoidTolls)
			setSavedRoutes([...savedRoutes, { ...route, searchParams: route.searchParams }]);
			toast({
				title: "Ruta Guardada",
				description: `La ruta ${route.origin} a ${route.destination} ha sido guardada.`,
			});
		} else {
			toast({
				title: "Ruta ya guardada",
				description: `La ruta ${route.origin} a ${route.destination} ya está en tus guardadas.`,
			});
		}
	};

	const isRouteSaved = (routeId) => {
		return savedRoutes.some(route => route.id === routeId);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Buscar Rutas para Camiones</h1>

				<SearchForm onSearch={handleSearch} />

				{hasSearched && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mt-10"
					>
						<h2 className="text-2xl font-semibold text-blue-700 mb-6">
							{searchResults.length > 0 ? `Resultados (${searchResults.length})` : "No se encontraron rutas"}
						</h2>

						{searchResults.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{searchResults.map((route) => (
									<RouteCard
										key={route.id}
										route={route} // Contiene searchParams con descripciones
										onSelect={handleSelectRouteForMap}
										onSave={handleSaveRoute}
										isSaved={isRouteSaved(route.id)}
										showShareButton={true}
										showSaveButton={true}
									/>
								))}
							</div>
						)}
					</motion.div>
				)}

				{!hasSearched && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mt-16 text-center"
					>
						<img className="w-64 h-64 mx-auto mb-6 opacity-60" alt="Ilustración de búsqueda" src="https://images.unsplash.com/photo-1591768793355-74d04bb6608f" />
						<h3 className="text-xl text-gray-600">
							Ingresa tu origen y destino para encontrar las mejores rutas
						</h3>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default RoutesPage;
