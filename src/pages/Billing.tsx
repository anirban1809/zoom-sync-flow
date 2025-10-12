import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    id: "INV-2024-001",
    date: "Jan 1, 2024",
    amount: "$299.00",
    status: "paid",
  },
  {
    id: "INV-2023-012",
    date: "Dec 1, 2023",
    amount: "$299.00",
    status: "paid",
  },
  {
    id: "INV-2023-011",
    date: "Nov 1, 2023",
    amount: "$299.00",
    status: "paid",
  },
  {
    id: "INV-2023-010",
    date: "Oct 1, 2023",
    amount: "$299.00",
    status: "paid",
  },
];

export default function Billing() {
  return (
    <div className="pt-8 pl-8 pr-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-semibold">Billing</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your subscription and billing details
              </p>
            </div>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download All Invoices
          </Button>
        </div>

        {/* Current Plan */}
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Business Plan</CardTitle>
                <CardDescription>$299/month • Billed monthly</CardDescription>
              </div>
              <Badge className="text-base px-3 py-1">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Next billing date
                </p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  February 1, 2024
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Cancel Subscription</Button>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h4 className="font-medium">Plan includes:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Unlimited meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Advanced AI summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">All integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Custom automations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Unlimited storage</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Seats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">4</span>
                  <span className="text-muted-foreground">/ 10 seats</span>
                </div>
                <Progress value={40} className="h-2" />
                <Button variant="link" className="p-0 h-auto text-sm">
                  Add more seats
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Transcription Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">82</span>
                  <span className="text-muted-foreground">hours used</span>
                </div>
                <p className="text-sm text-muted-foreground">Resets Feb 1</p>
                <Badge variant="secondary" className="text-xs">
                  Unlimited
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">2.4</span>
                  <span className="text-muted-foreground">GB used</span>
                </div>
                <Progress value={24} className="h-2" />
                <p className="text-sm text-muted-foreground">10 GB available</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Manage your payment information
                </CardDescription>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded-lg border bg-background">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Default
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              Download past invoices and receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <Card>
          <CardHeader>
            <CardTitle>Need More?</CardTitle>
            <CardDescription>
              Upgrade your plan for additional features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Enterprise</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Custom pricing for large teams
                </p>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Extra Storage</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  $10/month per 100 GB
                </p>
                <Button variant="outline" className="w-full">
                  Add Storage
                </Button>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Premium Support</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Dedicated account manager
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
