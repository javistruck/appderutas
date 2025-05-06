
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AddWaypointDialog = ({ open, onOpenChange, onSave, pointIndex }) => {
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('Añadir Punto');

	useEffect(() => {
		if (open) {
			setDescription(''); // Reset description when opening
			if (pointIndex === 0) {
				setTitle('Descripción del Origen (Opcional)');
			} else {
				setTitle(`Descripción del Punto ${pointIndex + 1} (Intermedio/Destino)`);
			}
		}
	}, [open, pointIndex]);

	const handleSave = () => {
		onSave(description || `Punto ${pointIndex + 1}`); // Use default if empty
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
            Ingresa una breve descripción para este punto de la ruta.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
              Descripción
						</Label>
						<Input
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="col-span-3"
							placeholder={pointIndex === 0 ? 'Ej: CEDIS Principal' : 'Ej: Carga Gasolina / Entrega Parcial'}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
					<Button type="button" onClick={handleSave}>Guardar Punto</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddWaypointDialog;
