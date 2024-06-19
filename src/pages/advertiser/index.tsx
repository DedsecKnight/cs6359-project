import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import { advertisementTable, advertiserTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateAdvertisementDialog from "@/components/advertiser-dashboard/CreateAdvertisementDialog";
import ModifyAdvertisementDialog from "@/components/advertiser-dashboard/ModifyAdvertisementDialog";
import DeleteAdvertisementDialog from "@/components/advertiser-dashboard/DeleteAdvertisementDialog";

interface AdvertiserPageProps {
  authorized: boolean;
  advertisements: Array<{
    id: number;
    content: string;
  }>
}

export default function AdvertiserPage({ authorized, advertisements }: AdvertiserPageProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  if (status === "loading") return <LoadingSpinner />

  if (!authorized) {
    router.push("/");
    return <div></div>;
  }

  return <div className="mx-auto w-full relative">
    <Navbar userAuthenticated={status === "authenticated"} userIsAdmin={session!.user.role === "admin"} />
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
          {
            advertisements.map((advertisement, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{advertisement.id}</TableCell>
                <TableCell className="text-center">{advertisement.content}</TableCell>
                <TableCell className="flex justify-end gap-x-4">
                  <ModifyAdvertisementDialog
                    defaultContent={advertisement.content}
                    advertisementId={advertisement.id}
                    onSubmit={async (id, content) => {
                      const res = await fetch("/api/advertisements", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "PUT",
                        body: JSON.stringify({
                          id, content
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to update advertisement data. please try again later...");
                      }
                    }}
                  />
                  <DeleteAdvertisementDialog
                    advertisementId={advertisement.id}
                    onSubmit={async (id) => {
                      const res = await fetch("/api/advertisements", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "DELETE",
                        body: JSON.stringify({
                          id
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to delete advertisement data. please try again later...");
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          }
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <CreateAdvertisementDialog
                onSubmit={async (content) => {
                  const res = await fetch("/api/advertisements", {
                    headers: {
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                      content
                    })
                  });
                  if (res.status !== 200) {
                    throw new Error("failed to create advertisement. please try again later...");
                  }
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      props: {
        authorized: false
      }
    }
  }
  const isAdvertiser = await db.select().from(advertiserTable).where(eq(advertiserTable.credentialsId, parseInt(session!.user.id))).limit(1);
  if (isAdvertiser.length === 0) {
    return {
      props: {
        authorized: false,
        advertisements: []
      }
    };
  }
  const advertisements = await db.select({
    id: advertisementTable.id,
    content: advertisementTable.content
  }).from(advertisementTable).where(eq(advertisementTable.advertiserId, isAdvertiser[0].id));
  return {
    props: {
      authorized: true,
      advertisements,
    }
  }
}