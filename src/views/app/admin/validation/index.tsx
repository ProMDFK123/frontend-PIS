"use client";
import { Suspense } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent } from "public/src/components/ui"; 
import { handleApiError } from "public/src/lib"; 

import { useValidationView } from "./hooks/use-validation-view";
import FilterBar from "./components/filter-bar";
import ValidationRowLink from "./components/validation-row-link"; 

export default function ValidationView() {
    const { 
        pendingPublications, 
        totalCount, 
        isLoading, 
        error, 
        hasOffers,
        filters, 
        actions 
    } = useValidationView(); 

    const apiErrorDetails = error ? handleApiError(error).details : null;

    const renderContent = () => {
        if (isLoading) {
            return <div className="mt-8 text-center text-muted-foreground">Cargando publicaciones pendientes...</div>;
        }

        if (error) {
            return (
                <div className="flex justify-center items-center p-8 text-red-500 bg-red-50 border border-red-200 rounded-lg mx-5">
                    <div className="text-center">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-semibold">Error al cargar la validación</div>
                        <div className="text-sm mt-1">{apiErrorDetails}</div>
                        <Button onClick={() => actions.handleRetry()} className="mt-3 cursor-pointer">
                            Reintentar
                        </Button>
                    </div>
                </div>
            );
        }

        if (!hasOffers && totalCount === 0) {
            return (
                <Card className="col-span-full p-8 text-center text-muted-foreground">
                    <CardContent>
                        No hay publicaciones pendientes de validación.
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <section className="mt-8 grid gap-2">
                {pendingPublications.map((o) => (
                    <ValidationRowLink 
                        key={o.id} 
                        itemId={o.id}
                        item={o.item}
                    />
                ))}
            </section>
        );
    };

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <header className="mb-6">
                        <Link href="/admin/products"> 
                            <Button variant="outline" className="mb-4 cursor-pointer">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a la administración
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
                            Validación de Ofertas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {totalCount} publicaciones por revisar.
                        </p>
                    </header>

                    <FilterBar
                        text={filters.text}
                        setText={actions.setText}
                        type={filters.type as any} 
                        setType={actions.setType as any}
                        sort={filters.sort as any} 
                        setSort={actions.setSort as any}
                    />
                    
                    {renderContent()}

                </main>
            </div>
        </Suspense>
    );
}