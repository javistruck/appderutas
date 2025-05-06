
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, Truck, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 opacity-90"></div>
        <img  className="absolute inset-0 w-full h-full object-cover" alt="Carretera mexicana con camiones" src="https://images.unsplash.com/photo-1646876045300-8586ca8a3348" />
        
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Rutas para Camiones Pesados en México</h1>
            <p className="text-xl mb-8">Encuentra las mejores rutas para transporte de carga pesada, con información actualizada sobre peajes, restricciones y condiciones de carreteras.</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/routes">Buscar Rutas</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/map">Ver Mapa</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-blue-800"
          >
            Características Principales
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full glass-card border-blue-100">
                <CardHeader>
                  <Map className="h-12 w-12 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-blue-700">Mapas Interactivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Visualiza rutas en mapas interactivos con información detallada sobre carreteras, peajes y puntos de interés para transportistas.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full glass-card border-blue-100">
                <CardHeader>
                  <Truck className="h-12 w-12 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-blue-700">Rutas Especializadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Rutas optimizadas para camiones pesados, considerando altura, peso, longitud y restricciones para materiales peligrosos.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full glass-card border-blue-100">
                <CardHeader>
                  <BookMarked className="h-12 w-12 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-blue-700">Guarda tus Rutas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Guarda tus rutas favoritas para acceder rápidamente a ellas en futuros viajes, sin necesidad de buscar nuevamente.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar la mejor ruta?</h2>
            <p className="text-xl mb-8">Comienza a planificar tus viajes de manera más eficiente con nuestra aplicación especializada para transportistas.</p>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/routes">Comenzar Ahora</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
