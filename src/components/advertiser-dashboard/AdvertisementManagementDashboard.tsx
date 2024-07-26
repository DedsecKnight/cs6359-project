import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CreateAdvertisementDialog from "./CreateAdvertisementDialog";
import DeleteAdvertisementDialog from "./DeleteAdvertisementDialog";
import ModifyAdvertisementDialog from "./ModifyAdvertisementDialog";

interface AdvertisementManagementDashboardProps {
  advertisements: Array<{
    id: number;
    content: string;
  }>;
  tierList: Array<{
    id: number;
    tierName: string;
    tierPrice: number;
  }>;
  billingAccounts: Array<{
    creditCardNumber: string;
    id: number;
  }>;
}

export default function AdvertisementManagementDashboard({
  advertisements,
  tierList,
  billingAccounts,
}: AdvertisementManagementDashboardProps) {
  return (
    <>
      <h1 className="text-3xl">Advertiser Page</h1>
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
            {advertisements.map((advertisement, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {advertisement.id}
                </TableCell>
                <TableCell className="text-center">
                  {advertisement.content}
                </TableCell>
                <TableCell className="flex justify-end gap-x-4">
                  <ModifyAdvertisementDialog
                    defaultContent={advertisement.content}
                    advertisementId={advertisement.id}
                    onSubmit={async (id, content) => {
                      const res = await fetch("/api/advertisements", {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        method: "PUT",
                        body: JSON.stringify({
                          id,
                          content,
                        }),
                      });
                      if (res.status !== 200) {
                        throw new Error(
                          "failed to update advertisement data. please try again later...",
                        );
                      }
                    }}
                  />
                  <DeleteAdvertisementDialog
                    advertisementId={advertisement.id}
                    onSubmit={async (id) => {
                      const res = await fetch("/api/advertisements", {
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
                          "failed to delete advertisement data. please try again later...",
                        );
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <CreateAdvertisementDialog
                  tierList={tierList}
                  billingAccounts={billingAccounts}
                  onSubmit={async (content, tierInfo, cardInfo) => {
                    const res = await fetch("/api/advertisements", {
                      headers: {
                        "Content-Type": "application/json",
                      },
                      method: "POST",
                      body: JSON.stringify({
                        content,
                        tierInfo,
                        cardInfo,
                      }),
                    });
                    if (res.status !== 200) {
                      throw new Error(
                        "failed to create advertisement. please try again later...",
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
