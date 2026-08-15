import { OffPlanSinglePage } from "@/src/presentation/off-plan-single/OffPlanSinglePage";

type Params = Promise<{ id: string }>;

interface PageProps {
    params: Params;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <OffPlanSinglePage id={id} />;
}
