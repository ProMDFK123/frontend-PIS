"use client";

import { Suspense, useEffect } from "react";
import { AlertCircle, ArrowLeft, Settings2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui"; 
import { handleApiError } from "@/lib";
import { useManageView } from "./hooks/use-manage-view";
import PublishedCard from "./components/published-card";
import FilterBar from "./components/filter-bar";
import { NotificationBanner } from "@/components/ui";
import { useNotification } from "@/hooks/common/use-notification";
import { ManageCardSkeleton } from "./components/manage-card-skeleton"; 

export default function ManageView() {
    const {
        managedPublications, 
        totalCount,
        isLoading,
        error,
        hasOffers,
        filters,
        actions
    } = useManageView();

    const searchParams = useSearchParams();
    const router = useRouter();
    const { notification, isVisible, show, close } = useNotification();

    useEffect(() => {
        const notificationParam = searchParams.get("notification");
        if (notificationParam === "closed") {
            show("¡Publicación Cerrada!", "Ya no está visible.", "success");
            router.replace("/admin/publications/manage", { scroll: false });
        }
    }, [searchParams, show, router]);

    const apiErrorDetails = error ? handleApiError(error).details : null;

    const renderContent = () => {
        if (managedPublications === null || isLoading) {
            return (
                <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ManageCardSkeleton key={index} />
                    ))}
                </section>
            );
        }

        if (error) { 
            return (
                <div className="flex justify-center items-center p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] mx-5 text-white shadow-2xl">
                  <div className="text-center">
                    <AlertCircle className="h-10 w-10 mx-auto mb-4 text-purple-300" />
                    <div className="font-extrabold text-xl mb-2">Error de conexión</div>
                    <div className="text-white/80 mb-4">{apiErrorDetails}</div>
                    <Button onClick={() => actions.handleRetry()} className="bg-white text-purple-900 hover:bg-purple-100 rounded-full font-bold px-6">
                      Reintentar
                    </Button>
                  </div>
                </div>
            );
        }

        if (!hasOffers && totalCount === 0) {
            return (
                <div className="mt-12 p-12 text-center bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 text-white shadow-xl col-span-full">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Settings2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Sin actividad</h3>
                  <p className="text-lg text-purple-200">No hay publicaciones activas en este momento.</p>
                </div>
            );
        }

        return (
            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {managedPublications.map((o) => (
                    <PublishedCard
                        key={o.id}
                        item={o}
                        onViewDetail={actions.handleViewDetail}
                    />
                ))}
            </section>
        );
    };

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#6D5EF7]"/>}>
            <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white bg-slate-900">
                
                {/* CAMBIO CLAVE: 'fixed' en lugar de 'absolute' */}
                <div className="fixed inset-0 z-0">
                    <img 
                        src="/fondo.png" 
                        alt="Fondo UCN" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
                </div>
                
                <NotificationBanner data={notification} isVisible={isVisible} onClose={close} />

                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                    <header className="mb-10">
                        <Link href="/admin/publications"> 
                            <button className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10">
                                <ArrowLeft className="h-4 w-4" />
                                Volver al Panel
                            </button>
                        </Link>
                        
                        <div className="flex flex-col items-start gap-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg transform rotate-1">
                                <Settings2 className="w-3.5 h-3.5" /> Panel de Gestión
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg leading-tight mt-2">
                                Administrar <br className="md:hidden"/> Ofertas
                            </h1>
                            <p className="text-purple-100 text-lg md:text-xl font-medium mt-3 drop-shadow-md">
                                Actualmente hay <span className="text-yellow-300 font-black text-2xl align-middle">{totalCount}</span> publicaciones activas.
                            </p>
                        </div>
                    </header>

                    <div className="mb-8">
                        <FilterBar
                            text={filters.text}
                            setText={actions.setText}
                            type={filters.type as any}
                            setType={actions.setType as any}
                            sort={filters.sort as any}
                            setSort={actions.setSort as any}
                        />
                    </div>

                    {renderContent()}
                </main>
            </div>
        </Suspense>
    );
}