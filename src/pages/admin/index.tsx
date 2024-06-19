import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import { adminTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default function AdminPage({ authorized }: { authorized: boolean }) {
  const { status } = useSession();
  if (status === "loading") return <LoadingSpinner />
  const router = useRouter();

  if (!authorized) {
    router.push("/");
    return <div></div>;
  }

  return <div className="mx-auto">
    <h1 className="text-3xl">Admin Page</h1>
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
  return {
    props: {
      authorized: isAdmin.length > 0
    }
  };
}