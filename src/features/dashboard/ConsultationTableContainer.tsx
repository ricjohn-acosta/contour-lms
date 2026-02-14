import { ConsultationTable } from "./ConsultationTable";
import { ConsultationTableTabs } from "./ConsultationTableTabs";

export const ConsultationTableContainer = () => {
  return (
    <div className="space-y-4">
      <ConsultationTableTabs />
      <ConsultationTable />
    </div>
  );
};
