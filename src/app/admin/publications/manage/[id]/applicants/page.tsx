import { ApplicantsView } from "@/views/app";

export default function ApplicantsPage({ params }: { params: { id: string } }) {
    // El Server Component extrae el ID de la URL
    const { id } = params; 

    // Y se lo pasa al Client Component para que gestione su propia carga.
    return (
        <ApplicantsView id={id} /> 
    );
}