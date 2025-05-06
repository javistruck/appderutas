
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, DollarSign, AlertTriangle, Share2, MapPin, DollarSign as DollarSignOff, FileText, ExternalLink, CircleDot } from 'lucide-react'; // Añadir CircleDot
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RouteCard = ({ route, onSelect, onSave, isSaved, showShareButton = true, showSaveButton = true }) => {
	const { toast } = useToast();
	const searchParams = route.searchParams || {};
	const avoidTolls = route.avoidTolls || searchParams.avoidTolls || false;

	// Adaptar para usar descripciones de waypoints si existen
	const origin = route.waypoints ? route.waypoints[0]?.description : route.origin;
	const destination = route.waypoints ? route.waypoints[route.waypoints.length - 1]?.description : route.destination;
	const intermediatePoints = route.waypoints ? route.waypoints.slice(1, -1) : [];

	// Verificar si hay coords (desde waypoints o start/endCoords)
	const canOpenInGMaps = (route.waypoints && route.waypoints.length >= 2) || (route.startCoords && route.endCoords);

	const handleSave = () => {
		if (onSave) {
			onSave(route);
		}
	};

	const handleShare = (type = 'route') => {
		let routeDetails = '';
		const waypointsText = intermediatePoints.length > 0
			? `\nPasando por: ${intermediatePoints.map(p => p.description).join(', ')}`
			: '';

		if (type === 'instructions') {
			routeDetails = `
¡Hola! Aquí están las indicaciones para la ruta de camión:
Origen: ${origin}
${waypointsText}
Destino: ${destination}
${avoidTolls ? 'RUTA SIN PEAJES' : ''}
(Indicaciones detalladas paso a paso no disponibles en esta versión)

${route.distance !== 'N/A' ? `Distancia: ${route.distance} km` : ''}
${route.time !== 'N/A' ? `Tiempo Estimado: ${route.time}` : ''}
${route.tolls !== 'N/A' ? `Peajes: ${route.tolls === 0 ? 'Sin peajes' : `$${route.tolls}`}` : ''}
${route.restrictions ? `Restricciones: ${route.restrictions}` : ''}

Consulta más en javis Rutas DX.
      `.trim();
		} else {
			routeDetails = `
¡Hola! Te comparto esta ruta para camión:
Origen: ${origin}
${waypointsText}
Destino: ${destination}
${route.distance !== 'N/A' ? `Distancia: ${route.distance} km` : ''}
${route.time !== 'N/A' ? `Tiempo Estimado: ${route.time}` : ''}
${route.tolls !== 'N/A' ? `Peajes: ${route.tolls === 0 ? 'Sin peajes' : `$${route.tolls}`}` : ''}
${avoidTolls ? '(Ruta sin peajes solicitada)' : ''}
${route.restrictions ? `Restricciones: ${route.restrictions}` : ''}

Puedes ver más detalles en javis Rutas DX.
      `.trim();
		}

		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(routeDetails)}`;
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

		toast({
			title: type === 'instructions' ? "Compartiendo Indicaciones" : "Compartiendo Ruta",
			description: "Se abrió WhatsApp para compartir.",
		});
	};

	const openInGoogleMaps = () => {
		if (!canOpenInGMaps) {
			toast({ title: 'Error', description: 'Coordenadas no disponibles para abrir en Google Maps.', variant: 'destructive' });
			return;
		}

		let originCoord, destinationCoord, waypointsParam = '';

		if (route.waypoints && route.waypoints.length >= 2) {
			originCoord = `${route.waypoints[0].lat},${route.waypoints[0].lng}`;
			destinationCoord = `${route.waypoints[route.waypoints.length - 1].lat},${route.waypoints[route.waypoints.length - 1].lng}`;
			if (route.waypoints.length > 2) {
				waypointsParam = route.waypoints.slice(1, -1)
					.map(p => `${p.lat},${p.lng}`)
					.join('|');
			}
		} else { // Fallback for old format
			originCoord = `${route.startCoords[0]},${route.startCoords[1]}`;
			destinationCoord = `${route.endCoords[0]},${route.endCoords[1]}`;
		}

		let url = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destinationCoord}&travelmode=driving`;
		if (waypointsParam) {
			url += `&waypoints=${waypointsParam}`;
		}
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ y: -5 }}
			className="h-full"
		>
			<Card className="h-full flex flex-col glass-card border-blue-100">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg md:text-xl text-blue-700 flex justify-between items-start">
						<span>{origin} → {destination}</span>
						<div className="flex items-center space-x-2">
							{avoidTolls && (
								<span className="text-green-600" title="Ruta sin peajes">
									<DollarSignOff size={18} />
								</span>
							)}
							{route.restrictions && !route.isCustom && (
								<span className="text-amber-500" title={`Restricciones: ${route.restrictions}`}>
									<AlertTriangle size={18} />
								</span>
							)}
						</div>
					</CardTitle>
					{/* Mostrar puntos intermedios */}
					{intermediatePoints.length > 0 && (
						<div className="text-xs text-gray-500 mt-1 flex items-start">
							<CircleDot className="mr-1 h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
							<span>Pasando por: {intermediatePoints.map(p => p.description).join(', ')}</span>
						</div>
					)}
					{/* Mostrar descripciones de origen/destino de búsqueda (si existen) */}
					{(searchParams.originDesc || searchParams.destinationDesc) && !route.isCustom && (
						<div className="text-xs text-gray-500 mt-1 flex items-start">
							<FileText className="mr-1 h-3 w-3 flex-shrink-0 mt-0.5" />
							<span>
								{searchParams.originDesc && `Origen: ${searchParams.originDesc}`}
								{searchParams.originDesc && searchParams.destinationDesc && ' | '}
								{searchParams.destinationDesc && `Destino: ${searchParams.destinationDesc}`}
							</span>
						</div>
					)}
				</CardHeader>
				<CardContent className="flex-grow space-y-2">
					<div className="flex items-center text-sm text-gray-600">
						<Truck className="mr-2 h-4 w-4 text-blue-600" />
						<span>Distancia: {route.distance} {route.distance !== 'N/A' ? 'km' : ''}</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Clock className="mr-2 h-4 w-4 text-blue-600" />
						<span>Tiempo: {route.time}</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<DollarSign className="mr-2 h-4 w-4 text-blue-600" />
						<span>Peajes: {route.tolls === 'N/A' ? 'N/A' : route.tolls === 0 ? 'Sin peajes' : `$${route.tolls}`}</span>
					</div>
					{route.restrictions && (
						<div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
							<p className="font-medium">Info Adicional:</p>
							<p>{route.restrictions}</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
					{/* Botón principal: Ver en mapa o Guardar */}
					{showSaveButton ? (
						<Button
							variant={isSaved ? "secondary" : "default"}
							size="sm"
							onClick={handleSave}
							disabled={isSaved}
							className="flex-1 sm:flex-none"
						>
							{isSaved ? "Guardada" : "Guardar Ruta"}
						</Button>
					) : (
						<Button variant="outline" size="sm" onClick={() => onSelect(route)} disabled={route.isCustom} className="flex-1 sm:flex-none">
              Ver en mapa
						</Button>
					)}

					{/* Botones secundarios */}
					<div className="flex gap-2 flex-wrap justify-center sm:justify-end">
						<Button
							variant="outline"
							size="sm"
							onClick={openInGoogleMaps}
							disabled={!canOpenInGMaps}
							className="text-green-700 border-green-200 hover:bg-green-50 disabled:opacity-50"
						>
							<ExternalLink className="mr-1 h-4 w-4" /> GMaps
						</Button>
						{showShareButton && (
							<>
								<Button variant="outline" size="sm" onClick={() => handleShare('route')} className="text-blue-600 border-blue-200 hover:bg-blue-50">
									<Share2 className="mr-1 h-4 w-4" /> Ruta
								</Button>
								<Button variant="outline" size="sm" onClick={() => handleShare('instructions')} className="text-purple-600 border-purple-200 hover:bg-purple-50">
									<MapPin className="mr-1 h-4 w-4" /> Indic.
								</Button>
							</>
						)}
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default RouteCard;
