
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useMapInteractions(addAccidentMarker, addSafePlaceMarker) {
	const { toast } = useToast();
	const [mode, setMode] = useState('view'); // 'view', 'addAccident', 'addSafePlace', 'createRoute'
	const [isSafePlaceDialogOpen, setIsSafePlaceDialogOpen] = useState(false);
	const [pendingSafePlaceLocation, setPendingSafePlaceLocation] = useState(null);

	// State for route creation
	const [routePoints, setRoutePoints] = useState([]); // Array of { latlng, description }
	const [isWaypointDialogOpen, setIsWaypointDialogOpen] = useState(false);
	const [pendingWaypointLocation, setPendingWaypointLocation] = useState(null);


	const toggleMode = (newMode) => {
		setMode((currentMode) => {
			if (currentMode === newMode) {
				toast({ title: `Modo ${getModeTitle(currentMode)} Desactivado` });
				if (currentMode === 'createRoute') resetRouteCreation(); // Reset if toggling off createRoute
				return 'view'; // Toggle off if clicking the same mode button
			} else {
				toast({
					title: `Modo ${getModeTitle(newMode)} Activado`,
					description: getModeDescription(newMode),
				});
				if (currentMode === 'createRoute') resetRouteCreation(); // Reset if switching from createRoute
				if (newMode === 'createRoute') setRoutePoints([]); // Clear points when activating createRoute
				return newMode;
			}
		});
	};

	const getModeTitle = (modeName) => {
		switch (modeName) {
		case 'addAccident': return 'Añadir Accidente';
		case 'addSafePlace': return 'Añadir Lugar Seguro';
		case 'createRoute': return 'Crear Ruta Punto a Punto';
		default: return 'Vista';
		}
	};

	const getModeDescription = (modeName) => {
		switch (modeName) {
		case 'addAccident': return 'Haz clic en el mapa para marcar la ubicación.';
		case 'addSafePlace': return 'Haz clic en el mapa para seleccionar la ubicación.';
		case 'createRoute': return 'Haz clic en el mapa para añadir Origen, Puntos Intermedios y Destino.';
		default: return '';
		}
	};

	const handleMapClick = (latlng) => {
		if (mode === 'addAccident') {
			addAccidentMarker(latlng);
			setMode('view'); // Deactivate mode after adding
		} else if (mode === 'addSafePlace') {
			setPendingSafePlaceLocation(latlng);
			setIsSafePlaceDialogOpen(true);
			// Keep mode active until dialog is closed/saved
		} else if (mode === 'createRoute') {
			setPendingWaypointLocation(latlng);
			setIsWaypointDialogOpen(true);
			// Mode remains active, point added after dialog confirmation
		}
	};

	const handleSaveSafePlace = (details) => {
		if (pendingSafePlaceLocation) {
			addSafePlaceMarker(pendingSafePlaceLocation, details);
			setPendingSafePlaceLocation(null);
			setMode('view'); // Deactivate mode after saving
		}
		setIsSafePlaceDialogOpen(false);
	};

	const handleSafePlaceDialogClose = () => {
		setIsSafePlaceDialogOpen(false);
		setPendingSafePlaceLocation(null);
		// Optionally deactivate mode if dialog is closed without saving
		// setMode('view');
	};

	const handleSaveWaypoint = (description) => {
		if (pendingWaypointLocation) {
			setRoutePoints(prev => [...prev, { latlng: pendingWaypointLocation, description }]);
			setPendingWaypointLocation(null);
			const pointType = routePoints.length === 0 ? 'Origen' : `Punto ${routePoints.length + 1}`;
			toast({ title: `${pointType} añadido`, description: 'Puedes añadir más puntos o finalizar la ruta.' });
		}
		setIsWaypointDialogOpen(false);
	};

	const handleWaypointDialogClose = () => {
		setIsWaypointDialogOpen(false);
		setPendingWaypointLocation(null);
	};

	const resetRouteCreation = () => {
		setRoutePoints([]);
		setPendingWaypointLocation(null);
		setIsWaypointDialogOpen(false);
	};

	const cancelRouteCreation = () => {
		resetRouteCreation();
		setMode('view');
		toast({ title: 'Creación de Ruta Cancelada' });
	};


	return {
		mode,
		isSafePlaceDialogOpen,
		pendingSafePlaceLocation,
		// Route creation specific states and handlers
		routePoints,
		isWaypointDialogOpen,
		pendingWaypointLocation,
		// Functions
		toggleMode,
		handleMapClick,
		handleSaveSafePlace,
		handleSafePlaceDialogClose,
		handleSaveWaypoint,
		handleWaypointDialogClose,
		cancelRouteCreation,
		resetRouteCreation,
		setMode, // Expose setMode for direct control if needed
	};
}
