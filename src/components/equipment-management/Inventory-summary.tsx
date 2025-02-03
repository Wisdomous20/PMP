import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventorySummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-center">
            Total Equipment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-2xl font-bold">250</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-center">
            Available
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-2xl font-bold">180</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-center">
            In Use
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-2xl font-bold">60</div>
        </CardContent>
      </Card>
    </div>
  );
}
