
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { TrafficCone, Utensils, MapPin, CircleDot } from 'lucide-react'; // Añadir CircleDot for waypoint
import ReactDOMServer from 'react-dom/server';

// Componente para actualizar la vista del mapa
function SetMapView({ center, zoom }) {
	const map = useMap();
	useEffect(() => {
		if (center) {
			map.setView(center, zoom || map.getZoom());
		}
	}, [center, zoom, map]);
	return null;
}

// Componente para manejar los clics en el mapa
function MapClickHandler({ onMapClick, currentMode }) {
	useMapEvents({
		click(e) {
			// Permitir click solo si estamos en un modo de adición/creación
			if (currentMode === 'addAccident' || currentMode === 'addSafePlace' || currentMode === 'createRoute') {
				onMapClick(e.latlng);
			}
		},
	});
	return null;
}

// Crear iconos personalizados
const createDivIcon = (iconComponent, colorClass = 'text-gray-800') => {
	const iconSvg = ReactDOMServer.renderToString(React.cloneElement(iconComponent, { className: colorClass, size: 32 }));
	return new L.DivIcon({
		html: `<div style="background: rgba(255,255,255,0.8); border-radius: 50%; padding: 2px; display: flex; align-items: center; justify-content: center;">${iconSvg}</div>`,
		className: 'leaflet-div-icon-custom',
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32],
	});
};

const accidentIcon = createDivIcon(<TrafficCone />, 'text-red-600');
const safePlaceIcon = createDivIcon(<Utensils />, 'text-green-600');
const originIcon = createDivIcon(<MapPin />, 'text-blue-600'); // Icono para origen
const destinationIcon = createDivIcon(<MapPin />, 'text-purple-600'); // Icono para destino
const waypointIcon = createDivIcon(<CircleDot />, 'text-orange-500'); // Icono para puntos intermedios

// Componente del Mapa principal
const MapComponent = forwardRef(({
	selectedRoute,
	markers = [],
	accidentMarkers = [],
	safePlaceMarkers = [],
	routeCreationPoints = [], // Array of { latlng, description }
	onMapClick,
	currentMode, // Modo actual
}, ref) => {
	const { toast } = useToast();
	const [mapInstance, setMapInstance] = useState(null);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [viewCenter, setViewCenter] = useState(null);

	const defaultPosition = [19.4326, -99.1332]; // Ciudad de México

	const locateUser = () => {
		return new Promise((resolve, reject) => {
			if (!mapInstance) {
				reject(new Error("Map not initialized"));
				return;
			}
			mapInstance.locate({ setView: true, maxZoom: 14 })
				.on('locationfound', (e) => {
					setCurrentPosition([e.latitude, e.longitude]);
					setViewCenter([e.latitude, e.longitude]);
					toast({ title: 'Ubicación encontrada', description: 'Mapa centrado en tu ubicación.' });
					resolve(e);
				})
				.on('locationerror', (e) => {
					console.error("Error de ubicación del mapa:", e);
					toast({ title: 'Error de ubicación', description: e.message, variant: 'destructive' });
					reject(e);
				});
		});
	};

	useImperativeHandle(ref, () => ({
		locateUser,
		getCenter: () => mapInstance?.getCenter(),
		getZoom: () => mapInstance?.getZoom(),
		setView: (center, zoom) => mapInstance?.setView(center, zoom)
	}));

	useEffect(() => {
		setIsLoading(true);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setCurrentPosition([latitude, longitude]);
					if (!viewCenter) setViewCenter([latitude, longitude]); // Centrar solo si no hay vista previa
					setIsLoading(false);
				},
				(error) => {
					console.error("Error obteniendo ubicación inicial:", error);
					if (!viewCenter) setViewCenter(defaultPosition);
					setIsLoading(false);
					toast({ title: "Error de ubicación inicial", description: "Usando ubicación predeterminada.", variant: "destructive" });
				}, { timeout: 10000 }
			);
		} else {
			if (!viewCenter) setViewCenter(defaultPosition);
			setIsLoading(false);
			toast({ title: "Geolocalización no soportada", variant: "destructive" });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getCursorClass = () => {
		if (currentMode === 'addAccident' || currentMode === 'addSafePlace' || currentMode === 'createRoute') {
			return 'cursor-crosshair';
		}
		return '';
	};

	useEffect(() => {
		if (selectedRoute?.startCoords) {
			setViewCenter(selectedRoute.startCoords);
		}
	}, [selectedRoute]);

	// Function to get the correct icon based on index and total points
	const getRoutePointIcon = (index, totalPoints) => {
		if (index === 0) return originIcon;
		if (index === totalPoints - 1) return destinationIcon;
		return waypointIcon;
	};

	return (
		<div className={`map-container ${getCursorClass()}`}>
			{isLoading && !mapInstance ? (
				<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-lg font-medium text-gray-700">Cargando mapa...</p>
					</div>
				</div>
			) : (
				<motion.div
					className="h-full w-full"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<MapContainer
						center={viewCenter || defaultPosition}
						zoom={viewCenter ? 13 : 6}
						scrollWheelZoom={true}
						className="h-full w-full"
						whenCreated={setMapInstance}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<MapClickHandler onMapClick={onMapClick} currentMode={currentMode} />

						{currentPosition && (
							<Marker position={currentPosition}>
								<Popup>Tu ubicación actual</Popup>
							</Marker>
						)}

						{markers.map((marker, index) => (
							<Marker key={`poi-${index}`} position={marker.position}>
								<Popup>
									<strong>{marker.name || 'Punto de interés'}</strong>
									{marker.description && <p>{marker.description}</p>}
								</Popup>
							</Marker>
						))}

						{accidentMarkers.map((marker) => (
							<Marker key={marker.id} position={[marker.lat, marker.lng]} icon={accidentIcon}>
								<Popup>
									<strong>Accidente reportado</strong><br />
									<small>Reportado: {new Date(marker.timestamp).toLocaleString()}</small>
								</Popup>
							</Marker>
						))}

						{safePlaceMarkers.map((marker) => (
							<Marker key={marker.id} position={[marker.lat, marker.lng]} icon={safePlaceIcon}>
								<Popup>
									<strong>{marker.name}</strong>
									<p>{marker.description}</p>
									<small>Añadido: {new Date(marker.timestamp).toLocaleString()}</small>
								</Popup>
							</Marker>
						))}

						{/* Marcadores para creación de ruta */}
						{routeCreationPoints.map((point, index) => (
							<Marker
								key={`route-point-${index}`}
								position={point.latlng}
								icon={getRoutePointIcon(index, routeCreationPoints.length)}
							>
								<Popup>
									<strong>{index === 0 ? 'Origen' : index === routeCreationPoints.length - 1 ? 'Destino' : `Punto ${index + 1}`}</strong>
									<br />{point.description}
									<br /><small>Coord: {point.latlng.lat.toFixed(4)}, {point.latlng.lng.toFixed(4)}</small>
								</Popup>
							</Marker>
						))}


						<SetMapView center={viewCenter} />

					</MapContainer>
				</motion.div>
			)}
		</div>
	);
});
MapComponent.displayName = 'MapComponent';

export default MapComponent;
