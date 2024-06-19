import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import { adminTable, credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ModifyUserDialog from "@/components/admin-dashboard/ModifyUserDialog";
import DeleteUserDialog from "@/components/admin-dashboard/DeleteUserDialog";
import CreateUserDialog from "@/components/admin-dashboard/CreateUserDialog";

interface AdminPageProps {
  authorized: boolean;
  users: Array<{
    id: number;
    username: string;
  }>
}

export default function AdminPage({ authorized, users }: AdminPageProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  if (status === "loading") return <LoadingSpinner />

  if (!authorized) {
    router.push("/");
    return <div></div>;
  }

  return <div className="mx-auto w-full relative">
    <Navbar userAuthenticated={status === "authenticated"} userIsAdmin={session!.user.role === "admin"} />
    <h1 className="text-3xl">Admin Dashboard</h1>
    <div className="w-3/5 mx-auto my-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="flex justify-end gap-x-4">
                  <ModifyUserDialog
                    defaultUsername={user.username}
                    userId={user.id}
                    onSubmit={async (userId, username, password) => {
                      const res = await fetch("/api/users", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "PUT",
                        body: JSON.stringify({
                          id: userId,
                          username,
                          password
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to update user data. please try again later...");
                      }
                    }}
                  />
                  <DeleteUserDialog
                    userId={user.id}
                    onSubmit={async (id) => {
                      const res = await fetch("/api/users", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "DELETE",
                        body: JSON.stringify({
                          id
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to delete user data. please try again later...");
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          }
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <CreateUserDialog
                onSubmit={async (username, password) => {
                  const res = await fetch("/api/users", {
                    headers: {
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                      username, password
                    })
                  });
                  if (res.status !== 200) {
                    throw new Error("failed to create user data. please try again later...");
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
  const isAdmin = await db.select().from(adminTable).where(eq(adminTable.id, parseInt(session!.user.id))).limit(1);
  const users = await db.select({
    id: credentialsTable.id,
    username: credentialsTable.username
  }).from(credentialsTable);
  return {
    props: {
      authorized: isAdmin.length > 0,
      users,
    }
  };
}