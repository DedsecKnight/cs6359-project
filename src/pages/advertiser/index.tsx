import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import { advertiserTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/router";

export default function AdvertiserPage({ authorized }: { authorized: boolean }) {
  const { status } = useSession();
  if (status === "loading") return <LoadingSpinner />
  const router = useRouter();

  if (!authorized) {
    router.push("/");
    return <div></div>;
  }

  return <div className="mx-auto">
    <h1 className="text-3xl">Advertiser Page</h1>
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
  const isAdvertiser = await db.select().from(advertiserTable).where(eq(advertiserTable.id, parseInt(session!.user.id))).limit(1);
  return {
    props: {
      authorized: isAdvertiser.length > 0
    }
  };
}