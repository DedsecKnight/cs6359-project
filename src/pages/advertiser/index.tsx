import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/db/db";
import {
  advertisementTable,
  advertisementTierTable,
  advertiserTable,
  billingAccountTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import AdvertisementManagementDashboard from "@/components/advertiser-dashboard/AdvertisementManagementDashboard";
import BillingAccountManagementDashboard from "@/components/advertiser-dashboard/BillingAccountManagementDashboard";

interface AdvertiserPageProps {
  authorized: boolean;
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

export default function AdvertiserPage({
  authorized,
  advertisements,
  tierList,
  billingAccounts,
}: AdvertiserPageProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  if (status === "loading") return <LoadingSpinner />;

  if (!authorized) {
    router.push("/");
    return <div></div>;
  }

  return (
    <div className="mx-auto w-full relative">
      <Navbar
        userAuthenticated={status === "authenticated"}
        userIsAdmin={session!.user.role === "admin"}
      />
      <AdvertisementManagementDashboard
        billingAccounts={billingAccounts}
        tierList={tierList}
        advertisements={advertisements}
      />
      <BillingAccountManagementDashboard billingAccounts={billingAccounts} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      props: {
        authorized: false,
      },
    };
  }
  const isAdvertiser = await db
    .select()
    .from(advertiserTable)
    .where(eq(advertiserTable.credentialsId, parseInt(session!.user.id)))
    .limit(1);
  if (isAdvertiser.length === 0) {
    return {
      props: {
        authorized: false,
        advertisements: [],
      },
    };
  }
  const advertisements = await db
    .select({
      id: advertisementTable.id,
      content: advertisementTable.content,
    })
    .from(advertisementTable)
    .where(eq(advertisementTable.advertiserId, isAdvertiser[0].id));

  const tierList = await db
    .select({
      id: advertisementTierTable.id,
      tierName: advertisementTierTable.tierName,
      tierPrice: advertisementTierTable.tierPrice,
    })
    .from(advertisementTierTable);
  const billingAccounts = await db
    .select({
      id: billingAccountTable.id,
      creditCardNumber: billingAccountTable.creditCardNumber,
    })
    .from(billingAccountTable)
    .where(eq(billingAccountTable.advertiserId, isAdvertiser[0].id));
  return {
    props: {
      authorized: true,
      advertisements,
      tierList,
      billingAccounts,
    },
  };
};
