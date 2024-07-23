import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import { adminTable, credentialsTable, webTable, tagTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ModifyUserDialog from "@/components/admin-dashboard/ModifyUserDialog";
import DeleteUserDialog from "@/components/admin-dashboard/DeleteUserDialog";
import CreateUserDialog from "@/components/admin-dashboard/CreateUserDialog";
import ModifyWebpageDialog from "@/components/admin-dashboard/ModifyWebpageDialog";
import DeleteWebpageDialog from "@/components/admin-dashboard/DeleteWebpageDialog";
import CreateWebpageDialog from "@/components/admin-dashboard/CreateWebpageDialog";

interface AdminPageProps {
  authorized: boolean;
  users: Array<{
    id: number;
    username: string;
  }>
  webpages: Array<{
    id: number;
    url: string;
    description: string;
    tags: string[];
  }>
}

export default function AdminPage({ authorized, users, webpages }: AdminPageProps) {
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
    <div className="w-4/5 mx-auto my-5">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            Object.values(webpages).map((webpage, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{webpage.id}</TableCell>
                <TableCell className="font-medium">{webpage.url}</TableCell>
                <TableCell className="text-left">{webpage.description}</TableCell>
                <TableCell className="text-center">{webpage.tags.join(", ")}</TableCell>
                <TableCell className="flex justify-end gap-x-4">
                  <ModifyWebpageDialog
                    defaultUrl={webpage.url}
                    defaultDesc={webpage.description}
                    urlId={webpage.id}
                    defaultTags = {webpage.tags[0]}
                    onSubmit={async (urlId, url, description, tags) => {
                      const res = await fetch("/api/webpages", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "PUT",
                        body: JSON.stringify({
                          id: urlId,
                          url,
                          description,
                          tags
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to update webpage data. please try again later...");
                      }
                    }}
                  />
                  <DeleteWebpageDialog
                    urlId={webpage.id}
                    onSubmit={async (id) => {
                      const res = await fetch("/api/webpages", {
                        headers: {
                          "Content-Type": "application/json"
                        },
                        method: "DELETE",
                        body: JSON.stringify({
                          id
                        })
                      });
                      if (res.status !== 200) {
                        throw new Error("failed to delete webpage data. please try again later...");
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          }
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <CreateWebpageDialog
                onSubmit={async (url, description, tag) => {
                  const res = await fetch("/api/webpages", {
                    headers: {
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                      url, description, tag
                    })
                  });
                  if (res.status !== 200) {
                    throw new Error("failed to create webpage data. please try again later...");
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
  const web = await db.select({
    id: webTable.id,
    url: webTable.url,
    description: webTable.description,
    tags: tagTable.tagName
  }).from(webTable).leftJoin(tagTable, eq(webTable.id, tagTable.webpageId));
  const webpages = web.reduce<Record<number, {id: number, url: string, description: string, tags: string[]}>>((acc, row)=>{
    const id = row.id;
    const url = row.url;
    const description = row.description;
    const tags = row.tags;

    if (!acc[id]) {
      acc[id] = { id, url, description, tags: [] };
    }
    if (tags) {
      acc[id].tags.push(tags);
    }
    return acc;
  },
  {}
  );
  return {
    props: {
      authorized: isAdmin.length > 0,
      users,
      webpages,
    }
  };
}