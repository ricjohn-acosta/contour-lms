import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ConsultationTableTabs = () => {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
