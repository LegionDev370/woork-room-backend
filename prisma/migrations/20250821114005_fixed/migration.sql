/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('business_owner', 'employee', 'admin');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "role" "public"."Roles" NOT NULL DEFAULT 'employee',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."MemberInvitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "invitation_token" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberInvitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "public"."users"("phone_number");

-- AddForeignKey
ALTER TABLE "public"."MemberInvitations" ADD CONSTRAINT "MemberInvitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
