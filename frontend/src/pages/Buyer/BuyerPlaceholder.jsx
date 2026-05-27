import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function BuyerPlaceholder({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            This section is ready in the buyer sidebar. Detailed tools can be connected here as the next feature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
