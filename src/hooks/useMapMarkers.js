
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

export function useMapMarkers() {
	const { toast } = useToast();
	const [pointsOfInterest, setPointsOfInterest] = useState([
		{ position: [19.4326, -99.1332], name: 'Central de Abasto CDMX', description: 'Zona de carga y descarga para camiones' },
		{ position: [20.6597, -103.3496], name: 'Central de Carga Guadalajara', description: 'Estacionamiento y servicios para transportistas' },
		{ position: [25.6866, -100.3161], name: 'Terminal de Carga Monterrey', description: 'Área de descanso y servicios' },
		{ position: [19.1738, -96.1342], name: 'Puerto de Veracruz', description: 'Terminal de contenedores y carga' },
		{ position: [22.1565, -100.9855], name: 'Parador San Luis Potosí', description: 'Estacionamiento seguro, restaurante y duchas' },
	]);
	const [accidentMarkers, setAccidentMarkers] = useLocalStorage('accidentMarkers', []);
	const [safePlaceMarkers, setSafePlaceMarkers] = useLocalStorage('safePlaceMarkers', []);

	const addAccidentMarker = (latlng) => {
		const newAccident = {
			id: `acc-${Date.now()}`,
			lat: latlng.lat,
			lng: latlng.lng,
			timestamp: Date.now(),
		};
		setAccidentMarkers((prev) => [...prev, newAccident]);
		toast({
			title: 'Accidente reportado',
			description: 'Gracias por reportar el incidente.',
		});
	};

	const addSafePlaceMarker = (latlng, details) => {
		const newSafePlace = {
			id: `sp-${Date.now()}`,
			lat: latlng.lat,
			lng: latlng.lng,
			name: details.name,
			description: details.description,
			timestamp: Date.now(),
		};
		setSafePlaceMarkers((prev) => [...prev, newSafePlace]);
		toast({
			title: 'Lugar Seguro Añadido',
			description: `Se ha añadido "${details.name}" al mapa.`,
		});
	};

	return {
		pointsOfInterest,
		accidentMarkers,
		safePlaceMarkers,
		addAccidentMarker,
		addSafePlaceMarker,
	};
}
