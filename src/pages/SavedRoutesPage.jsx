
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Search } from 'lucide-react';
import RouteCard from '@/components/RouteCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const SavedRoutesPage = () => {
	const { toast } = useToast();
	const [savedRoutes, setSavedRoutes] = useLocalStorage('savedRoutes', []);

	const handleSelectRouteForMap = (route) => {
		if (route.isCustom) {
			toast({ title: "Vista no disponible", description: "La vista de mapa detallada no está disponible para rutas personalizadas.", variant: "destructive" });
			return;
		}
		console.log("Seleccionada para ver en mapa:", route);
		toast({
			title: "Ver en Mapa",
			description: `Prepara la vista del mapa para la ruta ${route.origin} a ${route.destination}. (Funcionalidad pendiente)`,
		});
		// Idealmente, navegar a /map y pasar el ID
	};

	const handleDeleteRoute = (routeId) => {
		const routeToDelete = savedRoutes.find(route => route.id === routeId);
		const updatedRoutes = savedRoutes.filter(route => route.id !== routeId);
		setSavedRoutes(updatedRoutes);

		const origin = routeToDelete?.waypoints ? routeToDelete.waypoints[0]?.description : routeToDelete?.origin;
		const destination = routeToDelete?.waypoints ? routeToDelete.waypoints[routeToDelete.waypoints.length - 1]?.description : routeToDelete?.destination;

		toast({
			title: "Ruta eliminada",
			description: `La ruta ${origin || ''} a ${destination || ''} ha sido eliminada.`,
		});
	};

	const handleDeleteAllRoutes = () => {
		setSavedRoutes([]);
		toast({
			title: "Rutas eliminadas",
			description: "Todas las rutas guardadas han sido eliminadas.",
		});
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex justify-between items-center mb-8 flex-wrap gap-4">
					<h1 className="text-3xl font-bold text-blue-800">Mis Rutas Guardadas</h1>

					{savedRoutes.length > 0 && (
						<Button
							variant="outline"
							className="text-red-600 border-red-200 hover:bg-red-50"
							onClick={handleDeleteAllRoutes}
						>
							<Trash2 className="mr-2 h-4 w-4" />
              Eliminar todas
						</Button>
					)}
				</div>

				{savedRoutes.length > 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{savedRoutes.map((route) => (
							<div key={route.id} className="relative group">
								<RouteCard
									route={route} // El route ya debería contener waypoints si es personalizada
									onSelect={handleSelectRouteForMap}
									onSave={() => {}} // No se guarda desde aquí
									isSaved={true}
									showShareButton={true}
									showSaveButton={false}
								/>
								<Button
									variant="ghost"
									size="sm"
									className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => handleDeleteRoute(route.id)}
									title="Eliminar ruta"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="text-center py-16"
					>
						<img className="w-64 h-64 mx-auto mb-6 opacity-60" alt="No hay rutas guardadas" src="https://images.unsplash.com/photo-1679841105770-37278b9bbd35" />
						<h3 className="text-xl text-gray-600 mb-6">
              No tienes rutas guardadas
						</h3>
						<Button asChild>
							<Link to="/routes">
								<Search className="mr-2 h-5 w-5" />
                Buscar Rutas
							</Link>
						</Button>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default SavedRoutesPage;
