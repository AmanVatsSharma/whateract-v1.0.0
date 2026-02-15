import { SectionLoader } from "@/components/shared/section-loader";

export default function MainLoading() {
  return (
    <div className="space-y-4">
      <SectionLoader label="Preparing workspace..." />
      <SectionLoader label="Loading feature modules..." />
    </div>
  );
}
