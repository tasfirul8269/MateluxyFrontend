import { PropertyDetailsPage } from "@/src/presentation/property-details/PropertyDetailsPage";

type Params = Promise<{ id: string }>;

interface PageProps {
    params: Params;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <PropertyDetailsPage id={id} />;
}
