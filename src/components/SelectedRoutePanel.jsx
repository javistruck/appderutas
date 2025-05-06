
import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SelectedRoutePanel = ({ selectedRoute, onClose, onOpenInGoogleMaps }) => {
	if (!selectedRoute) return null;

	const canOpenInGMaps = selectedRoute.startCoords && selectedRoute.endCoords;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md z-10 p-4 route-info-panel"
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="font-semibold text-blue-700">{selectedRoute.origin} → {selectedRoute.destination}</h3>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={onClose}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
			<div className="grid grid-cols-3 gap-2 text-sm mb-3">
				<div>
					<p className="text-gray-500">Distancia</p>
					<p className="font-medium">{selectedRoute.distance} km</p>
				</div>
				<div>
					<p className="text-gray-500">Tiempo</p>
					<p className="font-medium">{selectedRoute.time}</p>
				</div>
				<div>
					<p className="text-gray-500">Peajes</p>
					<p className="font-medium">${selectedRoute.tolls}</p>
				</div>
			</div>
			{selectedRoute.restrictions && (
				<div className="mt-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
					<p className="font-medium">Restricciones:</p>
					<p>{selectedRoute.restrictions}</p>
				</div>
			)}
			<Button
				onClick={onOpenInGoogleMaps}
				disabled={!canOpenInGMaps}
				variant="outline"
				size="sm"
				className="w-full border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
			>
				<ExternalLink className="mr-2 h-4 w-4" />
         Abrir en Google Maps
			</Button>
		</motion.div>
	);
};

export default SelectedRoutePanel;
