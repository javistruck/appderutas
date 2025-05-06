
import React from 'react';
import { motion } from 'framer-motion';
import { Info, X, TrafficCone, PlusCircle, LocateFixed, MapPin } from 'lucide-react'; // Añadir MapPin
import { Button } from '@/components/ui/button';

const MapInfoPanel = ({
	showInfo,
	onClose,
	onSelectRandomRoute,
	onToggleAddAccident,
	onToggleAddSafePlace,
	onToggleCreateRoute, // Nueva prop
	onLocateUser,
	currentMode, // Nueva prop para saber el modo activo
	isLocatingUser,
}) => {
	if (!showInfo) return null;

	const getButtonVariant = (buttonMode) => {
		return currentMode === buttonMode ? 'destructive' : 'outline';
	};

	const getButtonClass = (buttonMode) => {
		switch (buttonMode) {
		case 'addAccident':
			return currentMode === buttonMode ? 'bg-red-100 text-red-700 border-red-300' : 'border-amber-300 text-amber-700 hover:bg-amber-50';
		case 'addSafePlace':
			return currentMode === buttonMode ? 'bg-green-100 text-green-700 border-green-300' : 'border-green-300 text-green-700 hover:bg-green-50';
		case 'createRoute':
			return currentMode === buttonMode ? 'bg-purple-100 text-purple-700 border-purple-300' : 'border-purple-300 text-purple-700 hover:bg-purple-50';
		default:
			return '';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
			className="absolute top-4 left-4 z-10 max-w-xs md:max-w-lg p-3 md:p-4 route-info-panel" // Aumentado max-w
		>
			<div className="flex justify-between items-start mb-2">
				<div className="flex items-center">
					<Info className="h-5 w-5 text-blue-600 mr-2" />
					<h3 className="font-semibold text-blue-700">Información del Mapa</h3>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={onClose}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
			<p className="text-xs md:text-sm text-gray-600 mb-2">
        Explora, reporta incidentes, añade lugares o crea rutas punto a punto.
			</p>
			<div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-3">
				<Button size="sm" onClick={onSelectRandomRoute}>
          Ruta Ejemplo
				</Button>
				<Button
					size="sm"
					variant={getButtonVariant('addAccident')}
					onClick={onToggleAddAccident}
					className={`flex items-center transition-colors duration-200 ${getButtonClass('addAccident')}`}
				>
					<TrafficCone className={`mr-1 h-4 w-4 ${currentMode === 'addAccident' ? 'animate-pulse' : ''}`} />
					{currentMode === 'addAccident' ? 'Cancelar' : 'Reportar Accidente'}
				</Button>
				<Button
					size="sm"
					variant={getButtonVariant('addSafePlace')}
					onClick={onToggleAddSafePlace}
					className={`flex items-center transition-colors duration-200 ${getButtonClass('addSafePlace')}`}
				>
					<PlusCircle className={`mr-1 h-4 w-4 ${currentMode === 'addSafePlace' ? 'animate-pulse' : ''}`} />
					{currentMode === 'addSafePlace' ? 'Cancelar' : 'Añadir Lugar'}
				</Button>
				<Button
					size="sm"
					variant={getButtonVariant('createRoute')}
					onClick={onToggleCreateRoute}
					className={`flex items-center transition-colors duration-200 ${getButtonClass('createRoute')}`}
				>
					<MapPin className={`mr-1 h-4 w-4 ${currentMode === 'createRoute' ? 'animate-pulse' : ''}`} />
					{currentMode === 'createRoute' ? 'Cancelar Ruta' : 'Crear Ruta'}
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={onLocateUser}
					disabled={isLocatingUser}
					className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-50"
				>
					{isLocatingUser ? (
						<div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-blue-700 border-t-transparent"></div>
					) : (
						<LocateFixed className="mr-1 h-4 w-4" />
					)}
					Ubicarme
				</Button>
			</div>
			{currentMode === 'addAccident' && (
				<p className="text-xs text-red-600 mt-2 animate-pulse">
					Haz clic en el mapa para marcar accidente
				</p>
			)}
			{currentMode === 'addSafePlace' && (
				<p className="text-xs text-green-600 mt-2 animate-pulse">
					Haz clic en el mapa para seleccionar ubicación
				</p>
			)}
			{currentMode === 'createRoute' && (
				<p className="text-xs text-purple-600 mt-2 animate-pulse">
					Haz clic para marcar Origen, luego Destino
				</p>
			)}
		</motion.div>
	);
};

export default MapInfoPanel;
