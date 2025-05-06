
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save, X, ExternalLink, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPointToPointPanel = ({ routePoints, onSave, onCancel, onOpenInGoogleMaps }) => {
	const canSave = routePoints.length >= 2;
	const canOpenGMaps = routePoints.length >= 2;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-10 p-4 route-info-panel max-h-[40vh] overflow-y-auto"
		>
			<div className="flex justify-between items-start mb-3">
				<h3 className="font-semibold text-blue-700 flex items-center">
					<MapPin className="h-5 w-5 mr-2" />
          Crear Ruta
				</h3>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={onCancel}
					title="Cancelar creación de ruta"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			{/* Lista de puntos */}
			<div className="space-y-2 text-sm mb-4">
				{routePoints.length === 0 && (
					<p className="text-gray-500 text-center">Haz clic en el mapa para añadir el Origen.</p>
				)}
				{routePoints.map((point, index) => (
					<div key={index} className="flex items-start space-x-2">
						{index === 0 ? (
							<MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
						) : index === routePoints.length - 1 ? (
							<MapPin className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
						) : (
							<CircleDot className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
						)}
						<div>
							<span className="font-medium">
								{index === 0 ? 'Origen: ' : index === routePoints.length - 1 ? 'Destino: ' : `Punto ${index + 1}: `}
							</span>
							{point.description}
							<span className="text-xs text-gray-400 ml-1">({point.latlng.lat.toFixed(4)}, {point.latlng.lng.toFixed(4)})</span>
						</div>
					</div>
				))}
				{routePoints.length > 0 && routePoints.length < 2 && (
					<p className="text-gray-500 text-center mt-2">Haz clic para añadir el Destino.</p>
				)}
				{routePoints.length >= 2 && (
					<p className="text-gray-500 text-center mt-2">Puedes añadir más puntos intermedios o guardar la ruta.</p>
				)}
			</div>

			{/* Botones de acción */}
			<div className="flex flex-col space-y-2">
				<Button
					onClick={onSave}
					className="w-full gradient-bg hover:opacity-90"
					disabled={!canSave}
				>
					<Save className="mr-2 h-4 w-4" />
          {`Guardar Ruta (${routePoints.length} Puntos)`}
				</Button>
				<Button
					onClick={onOpenInGoogleMaps}
					disabled={!canOpenGMaps}
					variant="outline"
					size="sm"
					className="w-full border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
				>
					<ExternalLink className="mr-2 h-4 w-4" />
          Abrir en Google Maps
				</Button>
			</div>
		</motion.div>
	);
};

export default MapPointToPointPanel;
