
import React, { useState, useRef, useCallback } from 'react';
import Map from '@/components/Map';
import MapInfoPanel from '@/components/MapInfoPanel';
import SelectedRoutePanel from '@/components/SelectedRoutePanel';
import AddSafePlaceDialog from '@/components/AddSafePlaceDialog';
import AddWaypointDialog from '@/components/AddWaypointDialog'; // Importar nuevo diálogo
import MapPointToPointPanel from '@/components/MapPointToPointPanel';
import { useToast } from '@/components/ui/use-toast';
import { mockRoutes } from '@/data/mockRoutes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useMapInteractions } from '@/hooks/useMapInteractions';

const MapPage = () => {
	const { toast } = useToast();
	const mapRef = useRef();
	const [selectedRoute, setSelectedRoute] = useState(null);
	const [showInfo, setShowInfo] = useState(true);
	const [isLocatingUser, setIsLocatingUser] = useState(false);
	const [savedRoutes, setSavedRoutes] = useLocalStorage('savedRoutes', []);

	const {
		pointsOfInterest,
		accidentMarkers,
		safePlaceMarkers,
		addAccidentMarker,
		addSafePlaceMarker,
	} = useMapMarkers();

	const {
		mode,
		isSafePlaceDialogOpen,
		pendingSafePlaceLocation,
		routePoints, // Ahora es array de {latlng, description}
		isWaypointDialogOpen,
		pendingWaypointLocation,
		toggleMode,
		handleMapClick,
		handleSaveSafePlace,
		handleSafePlaceDialogClose,
		handleSaveWaypoint,
		handleWaypointDialogClose,
		cancelRouteCreation,
		resetRouteCreation,
		setMode,
	} = useMapInteractions(addAccidentMarker, addSafePlaceMarker);

	const selectRandomRoute = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * mockRoutes.length);
		const route = mockRoutes[randomIndex];
		setSelectedRoute(route);
		toast({
			title: 'Ruta seleccionada',
			description: `${route.origin} a ${route.destination}`,
		});
		// Center map on route start
		if (mapRef.current && route.startCoords) {
			mapRef.current.setView(route.startCoords, 10);
		}
	}, [toast]);

	const handleLocateUser = useCallback(() => {
		setIsLocatingUser(true);
		if (mapRef.current) {
			mapRef.current.locateUser().finally(() => {
				setIsLocatingUser(false);
			});
		} else {
			setIsLocatingUser(false);
			toast({ title: 'Error', description: 'El mapa no está listo.', variant: 'destructive' });
		}
	}, [toast]);

	// Función para abrir ruta en Google Maps (actualizada para waypoints)
	const openRouteInGoogleMaps = useCallback((points) => { // points es el array [{latlng, description}, ...]
		if (!points || points.length < 2) {
			toast({ title: 'Error', description: 'Se necesitan al menos origen y destino.', variant: 'destructive' });
			return;
		}

		const origin = `${points[0].latlng.lat},${points[0].latlng.lng}`;
		const destination = `${points[points.length - 1].latlng.lat},${points[points.length - 1].latlng.lng}`;
		let waypointsParam = '';

		if (points.length > 2) {
			waypointsParam = points.slice(1, -1) // Todos excepto origen y destino
				.map(p => `${p.latlng.lat},${p.latlng.lng}`)
				.join('|');
		}

		let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
		if (waypointsParam) {
			url += `&waypoints=${waypointsParam}`;
		}

		window.open(url, '_blank', 'noopener,noreferrer');
	}, [toast]);


	const handleSaveCustomRoute = useCallback(() => {
		if (routePoints && routePoints.length >= 2) {
			const newRoute = {
				id: `custom-${Date.now()}`,
				// Usar descripciones para origin/destination, o coordenadas si no hay descripción
				origin: routePoints[0]?.description || `Coord: ${routePoints[0].latlng.lat.toFixed(4)}, ${routePoints[0].latlng.lng.toFixed(4)}`,
				destination: routePoints[routePoints.length - 1]?.description || `Coord: ${routePoints[routePoints.length - 1].latlng.lat.toFixed(4)}, ${routePoints[routePoints.length - 1].latlng.lng.toFixed(4)}`,
				distance: 'N/A',
				time: 'N/A',
				tolls: 'N/A',
				restrictions: `Ruta personalizada con ${routePoints.length} puntos`,
				// Guardar todos los puntos
				waypoints: routePoints.map(p => ({ // Guardar como lat/lng directamente
					lat: p.latlng.lat,
					lng: p.latlng.lng,
					description: p.description
				})),
				startCoords: [routePoints[0].latlng.lat, routePoints[0].latlng.lng], // Mantener por compatibilidad si es necesario
				endCoords: [routePoints[routePoints.length - 1].latlng.lat, routePoints[routePoints.length - 1].latlng.lng], // Mantener por compatibilidad
				avoidTolls: false,
				isCustom: true,
			};
			setSavedRoutes((prev) => [...prev, newRoute]);
			toast({
				title: 'Ruta Personalizada Guardada',
				description: `La ruta con ${routePoints.length} puntos ha sido guardada.`,
			});
			cancelRouteCreation(); // Resetear y salir del modo creación
		} else {
			toast({ title: 'Error al guardar', description: 'Necesitas al menos un origen y un destino.', variant: 'destructive' });
		}
	}, [routePoints, setSavedRoutes, toast, cancelRouteCreation]);


	const handleOpenSelectedRouteInGMaps = useCallback(() => {
		if (selectedRoute?.waypoints && selectedRoute.waypoints.length > 0) {
			// Si la ruta guardada tiene waypoints, úsalos
			const pointsForGMaps = selectedRoute.waypoints.map(wp => ({ latlng: { lat: wp.lat, lng: wp.lng } }));
			openRouteInGoogleMaps(pointsForGMaps);
		} else if (selectedRoute?.startCoords && selectedRoute?.endCoords) {
			// Compatibilidad con rutas antiguas sin waypoints array
			const pointsForGMaps = [
				{ latlng: { lat: selectedRoute.startCoords[0], lng: selectedRoute.startCoords[1] } },
				{ latlng: { lat: selectedRoute.endCoords[0], lng: selectedRoute.endCoords[1] } }
			];
			openRouteInGoogleMaps(pointsForGMaps);
		} else {
			toast({ title: 'Error', description: 'Coordenadas no disponibles.', variant: 'destructive' });
		}
	}, [selectedRoute, openRouteInGoogleMaps, toast]);

	const handleOpenCustomRouteInGMaps = useCallback(() => {
		openRouteInGoogleMaps(routePoints);
	}, [routePoints, openRouteInGoogleMaps]);


	return (
		<div className="h-full relative">
			<MapInfoPanel
				showInfo={showInfo}
				onClose={() => setShowInfo(false)}
				onSelectRandomRoute={selectRandomRoute}
				onToggleAddAccident={() => toggleMode('addAccident')}
				onToggleAddSafePlace={() => toggleMode('addSafePlace')}
				onToggleCreateRoute={() => toggleMode('createRoute')}
				onLocateUser={handleLocateUser}
				currentMode={mode}
				isLocatingUser={isLocatingUser}
			/>

			{/* Panel para ruta seleccionada (no en modo creación) */}
			{mode !== 'createRoute' && selectedRoute && (
				<SelectedRoutePanel
					selectedRoute={selectedRoute}
					onClose={() => setSelectedRoute(null)}
					onOpenInGoogleMaps={handleOpenSelectedRouteInGMaps}
				/>
			)}

			{/* Panel para creación de ruta punto a punto */}
			{mode === 'createRoute' && (
				<MapPointToPointPanel
					routePoints={routePoints}
					onSave={handleSaveCustomRoute}
					onCancel={cancelRouteCreation}
					onOpenInGoogleMaps={handleOpenCustomRouteInGMaps}
				/>
			)}

			<Map
				ref={mapRef}
				selectedRoute={selectedRoute}
				markers={pointsOfInterest}
				accidentMarkers={accidentMarkers}
				safePlaceMarkers={safePlaceMarkers}
				routeCreationPoints={routePoints} // Pasa el array completo
				onMapClick={handleMapClick}
				currentMode={mode}
			/>

			{/* Diálogos */}
			<AddSafePlaceDialog
				open={isSafePlaceDialogOpen}
				onOpenChange={handleSafePlaceDialogClose}
				onSave={handleSaveSafePlace}
			/>
			<AddWaypointDialog
				open={isWaypointDialogOpen}
				onOpenChange={handleWaypointDialogClose}
				onSave={handleSaveWaypoint}
				pointIndex={routePoints.length} // Pasamos el índice del punto que se está añadiendo
			/>
		</div>
	);
};

export default MapPage;
