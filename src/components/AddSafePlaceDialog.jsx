
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AddSafePlaceDialog = ({ open, onOpenChange, onSave }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const handleSave = () => {
		if (name.trim() && description.trim()) {
			onSave({ name, description });
			setName('');
			setDescription('');
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Añadir Lugar Seguro</DialogTitle>
					<DialogDescription>
            Ingresa los detalles del lugar seguro para descansar o comer.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
              Nombre
						</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="col-span-3"
							placeholder="Ej: Parador La Curva Feliz"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
              Descripción
						</Label>
						<Input
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="col-span-3"
							placeholder="Ej: Baños limpios, comida casera"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleSave} disabled={!name.trim() || !description.trim()}>
            Guardar Lugar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddSafePlaceDialog;
