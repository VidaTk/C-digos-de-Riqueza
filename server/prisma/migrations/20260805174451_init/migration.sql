-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('aprendiz', 'admin');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Aprendiz', 'Hierro', 'Plata', 'Oro', 'Legendario');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('activo', 'vencido', 'cancelado');

-- CreateEnum
CREATE TYPE "SkoolSyncStatus" AS ENUM ('pendiente', 'sincronizado', 'error');

-- CreateEnum
CREATE TYPE "ProductCode" AS ENUM ('libro', 'curso', 'curso_con_descuento', 'asesoria');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('pendiente', 'confirmada', 'reembolsada');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('bloqueada', 'liberada', 'pagada');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('stripe', 'mercadopago');

-- CreateEnum
CREATE TYPE "MembershipPaymentStatus" AS ENUM ('pendiente', 'pagado', 'fallido', 'reembolsado');

-- CreateEnum
CREATE TYPE "FreeReason" AS ENUM ('libro_1_mes', 'curso_1_anio');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pendiente', 'en_proceso', 'completado', 'rechazado');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "estado_mx" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "clabe" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'aprendiz',
    "referred_by" TEXT,
    "promoter_code" TEXT NOT NULL,
    "rank" "Rank" NOT NULL DEFAULT 'Aprendiz',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "membership_status" "MembershipStatus" NOT NULL DEFAULT 'vencido',
    "membership_expires_at" TIMESTAMP(3),
    "skool_user_id" TEXT,
    "skool_sync_status" "SkoolSyncStatus" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "code" "ProductCode" NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "commission_l1_pct" DECIMAL(5,2) NOT NULL,
    "commission_l1_pct_tier2" DECIMAL(5,2),
    "tier2_min_monthly_sales" INTEGER,
    "commission_l2_pct" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_email" TEXT,
    "buyer_phone" TEXT,
    "promoter_id" TEXT NOT NULL,
    "upline_id" TEXT,
    "sale_date" DATE NOT NULL,
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "commission_l1_pct_applied" DECIMAL(5,2) NOT NULL,
    "commission_l1_amount" DECIMAL(10,2) NOT NULL,
    "commission_l2_amount" DECIMAL(10,2),
    "status" "SaleStatus" NOT NULL DEFAULT 'pendiente',
    "commission_release_date" DATE NOT NULL,
    "commission_status" "CommissionStatus" NOT NULL DEFAULT 'bloqueada',
    "entered_by_admin_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod",
    "transaction_id" TEXT,
    "status" "MembershipPaymentStatus" NOT NULL DEFAULT 'pendiente',
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "is_free_period" BOOLEAN NOT NULL DEFAULT false,
    "free_reason" "FreeReason",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "bank_name" TEXT NOT NULL,
    "clabe" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pendiente',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "admin_notes" TEXT,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "xp_delta" INTEGER NOT NULL,
    "related_sale_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank_thresholds" (
    "id" TEXT NOT NULL,
    "rank_name" "Rank" NOT NULL,
    "xp_required" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "rank_thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skool_sync_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skool_sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_promoter_code_key" ON "users"("promoter_code");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "sales_promoter_id_idx" ON "sales"("promoter_id");

-- CreateIndex
CREATE INDEX "sales_upline_id_idx" ON "sales"("upline_id");

-- CreateIndex
CREATE INDEX "sales_sale_date_idx" ON "sales"("sale_date");

-- CreateIndex
CREATE INDEX "membership_payments_user_id_idx" ON "membership_payments"("user_id");

-- CreateIndex
CREATE INDEX "withdrawals_user_id_idx" ON "withdrawals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "rank_thresholds_rank_name_key" ON "rank_thresholds"("rank_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_promoter_id_fkey" FOREIGN KEY ("promoter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_upline_id_fkey" FOREIGN KEY ("upline_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_entered_by_admin_id_fkey" FOREIGN KEY ("entered_by_admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_payments" ADD CONSTRAINT "membership_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_log" ADD CONSTRAINT "xp_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_log" ADD CONSTRAINT "xp_log_related_sale_id_fkey" FOREIGN KEY ("related_sale_id") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skool_sync_log" ADD CONSTRAINT "skool_sync_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
