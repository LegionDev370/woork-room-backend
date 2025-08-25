/*
  Warnings:

  - You are about to drop the `MemberInvitations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MemberInvitations" DROP CONSTRAINT "MemberInvitations_invited_by_user_id_fkey";

-- DropTable
DROP TABLE "public"."MemberInvitations";

-- CreateTable
CREATE TABLE "public"."member_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "invitation_token" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_invitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."member_invitations" ADD CONSTRAINT "member_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
