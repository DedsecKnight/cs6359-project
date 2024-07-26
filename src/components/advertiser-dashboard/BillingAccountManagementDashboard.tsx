import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteBillingAccountDialog from "./DeleteBillingAccountDialog";
import ModifyBillingAccountDialog from "./ModifyBillingAccountDialog";
import CreateBillingAccountDialog from "./CreateBillingAccountDialog";

interface BillingAccountManagementDashboardProps {
  billingAccounts: Array<{
    creditCardNumber: string;
    id: number;
  }>;
}

export default function BillingAccountManagementDashboard({
  billingAccounts,
}: BillingAccountManagementDashboardProps) {
  return (
    <>
      <h1 className="text-3xl">Billing Accounts</h1>
      <div className="w-3/5 mx-auto my-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="text-center">Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingAccounts.map((account, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{account.id}</TableCell>
                <TableCell className="text-center">
                  {account.creditCardNumber}
                </TableCell>
                <TableCell className="flex justify-end gap-x-4">
                  <ModifyBillingAccountDialog
                    defaultCreditCardNumber={account.creditCardNumber}
                    billingAccountId={account.id}
                    onSubmit={async (id, creditCardNumber) => {
                      const res = await fetch("/api/billing", {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "PUT",
                        body: JSON.stringify({
                          id,
                          creditCardNumber,
                        }),
                      });
                      if (res.status !== 200) {
                        throw new Error(
                          "failed to update billing account data. please try again later...",
                        );
                      }
                    }}
                  />
                  <DeleteBillingAccountDialog
                    billingAccountId={account.id}
                    onSubmit={async (id) => {
                      const res = await fetch("/api/billing", {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "DELETE",
                        body: JSON.stringify({
                          id,
                        }),
                      });
                      if (res.status !== 200) {
                        throw new Error(
                          "failed to delete billing account data. please try again later...",
                        );
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <CreateBillingAccountDialog
                  onSubmit={async (creditCardNumber) => {
                    const res = await fetch("/api/billing", {
                      headers: {
                        "Content-Type": "application/json",
                      },
                      method: "POST",
                      body: JSON.stringify({
                        creditCardNumber,
                      }),
                    });
                    if (res.status !== 200) {
                      throw new Error(
                        "failed to create billing account. please try again later...",
                      );
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
