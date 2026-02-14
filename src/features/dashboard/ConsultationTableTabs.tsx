import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ConsultationStatusFilter = "all" | "complete" | "incomplete";

interface ConsultationTableTabsProps {
  value: ConsultationStatusFilter;
  onValueChange: (value: ConsultationStatusFilter) => void;
}

export const ConsultationTableTabs = ({
  value,
  onValueChange,
}: ConsultationTableTabsProps) => {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as ConsultationStatusFilter)}
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="complete">Completed</TabsTrigger>
        <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
