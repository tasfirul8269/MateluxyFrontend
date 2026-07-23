import { HeroSection } from "@/src/presentation/home/components/HeroSection";
import { WhyChooseSection } from "@/src/presentation/property-management/components/WhyChooseSection";
import { PropertyManagementDetails } from "@/src/presentation/property-management/components/PropertyManagementDetails";
import { PropertyMapSection } from "@/src/presentation/property-management/components/PropertyMapSection";
import { PropertyContactSection } from "@/src/presentation/property-management/components/PropertyContactSection";
import { WhereNextSection } from "@/src/presentation/property-management/components/WhereNextSection";

export default function PropertyManagementPage() {
    return (
        <main>
            <HeroSection />
            <WhyChooseSection />
            <PropertyManagementDetails />
            <PropertyMapSection />
            <PropertyContactSection />
            <WhereNextSection />
        </main>
    );
}
