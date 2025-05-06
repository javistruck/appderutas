
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, LocateFixed, DollarSign as DollarSignOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const SearchForm = ({ onSearch }) => {
	const { toast } = useToast();
	const [origin, setOrigin] = useState('');
	const [originDesc, setOriginDesc] = useState(''); // Nuevo estado descripción origen
	const [destination, setDestination] = useState('');
	const [destinationDesc, setDestinationDesc] = useState(''); // Nuevo estado descripción destino
	const [truckType, setTruckType] = useState('standard');
	const [isHazardous, setIsHazardous] = useState(false);
	const [avoidTolls, setAvoidTolls] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLocating, setIsLocating] = useState(false);

	const handleLocateOrigin = () => {
		setIsLocating(true);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setOrigin(`Mi Ubicación (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
					setIsLocating(false);
					toast({ title: 'Ubicación encontrada', description: 'Se usó tu ubicación actual como origen.' });
				},
				(error) => {
					console.error('Error obteniendo ubicación:', error);
					setIsLocating(false);
					toast({ title: 'Error de ubicación', description: 'No se pudo obtener tu ubicación actual.', variant: 'destructive' });
				}, { timeout: 10000 }
			);
		} else {
			setIsLocating(false);
			toast({ title: 'Geolocalización no soportada', description: 'Tu navegador no soporta geolocalización.', variant: 'destructive' });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!origin || !destination) {
			toast({ title: 'Campos requeridos', description: 'Por favor ingresa origen y destino.', variant: 'destructive' });
			return;
		}
		setIsLoading(true);
		setTimeout(() => {
			onSearch({
				origin,
				originDesc, // Incluir descripción origen
				destination,
				destinationDesc, // Incluir descripción destino
				truckType,
				isHazardous,
				avoidTolls
			});
			setIsLoading(false);
			toast({ title: 'Búsqueda completada', description: `Mostrando rutas de ${origin} a ${destination}` });
		}, 1500);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-4xl mx-auto p-6 rounded-xl glass-card"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="origin" className="text-blue-700">Origen</Label>
						<div className="flex items-center space-x-2">
							<Input id="origin" placeholder="Ciudad o localidad de origen" value={origin} onChange={(e) => setOrigin(e.target.value)} className="border-blue-200 focus:border-blue-500 flex-grow" />
							<Button type="button" variant="outline" size="icon" onClick={handleLocateOrigin} disabled={isLocating} title="Usar mi ubicación actual" className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-shrink-0">
								{isLocating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div> : <LocateFixed className="h-5 w-5" />}
							</Button>
						</div>
						<Label htmlFor="originDesc" className="text-sm text-gray-500">Descripción Origen (Opcional)</Label>
						<Input id="originDesc" placeholder="Ej: Puerta 5, Andén 3" value={originDesc} onChange={(e) => setOriginDesc(e.target.value)} className="border-gray-200 focus:border-blue-500" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="destination" className="text-blue-700">Destino</Label>
						<Input id="destination" placeholder="Ciudad o localidad de destino" value={destination} onChange={(e) => setDestination(e.target.value)} className="border-blue-200 focus:border-blue-500" />
						<Label htmlFor="destinationDesc" className="text-sm text-gray-500">Descripción Destino (Opcional)</Label>
						<Input id="destinationDesc" placeholder="Ej: CEDIS Norte, Bodega 10" value={destinationDesc} onChange={(e) => setDestinationDesc(e.target.value)} className="border-gray-200 focus:border-blue-500" />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
					<div className="space-y-2">
						<Label htmlFor="truck-type" className="text-blue-700">Tipo de camión</Label>
						<select id="truck-type" value={truckType} onChange={(e) => setTruckType(e.target.value)} className="w-full h-10 px-3 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
							<option value="standard">Estándar (Hasta 3.5 ton)</option>
							<option value="medium">Mediano (3.5 - 10 ton)</option>
							<option value="heavy">Pesado (10 - 30 ton)</option>
							<option value="extraHeavy">Extra pesado (30+ ton)</option>
						</select>
					</div>
					<div className="flex items-center space-x-2 pb-2">
						<Checkbox id="hazardous" checked={isHazardous} onCheckedChange={setIsHazardous} className="h-5 w-5" />
						<Label htmlFor="hazardous" className="flex items-center text-amber-600 cursor-pointer">
							<AlertTriangle className="mr-1 h-5 w-5" /> Material Peligroso
						</Label>
					</div>
					<div className="flex items-center space-x-2 pb-2">
						<Checkbox id="avoid-tolls" checked={avoidTolls} onCheckedChange={setAvoidTolls} className="h-5 w-5" />
						<Label htmlFor="avoid-tolls" className="flex items-center text-gray-600 cursor-pointer">
							<DollarSignOff className="mr-1 h-5 w-5" /> Evitar Peajes
						</Label>
					</div>
				</div>

				<Button type="submit" className="w-full gradient-bg hover:opacity-90 transition-opacity" disabled={isLoading}>
					{isLoading ? (
						<><div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> Buscando rutas...</>
					) : (
						<><Search className="mr-2 h-5 w-5" /> Buscar Rutas</>
					)}
				</Button>
			</form>
		</motion.div>
	);
};

export default SearchForm;
