-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "provider" TEXT,
    "providerId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "token" TEXT,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imagesUrl" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "brandId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "variationId" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "token" TEXT,
    "totalAmount" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiceSeries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MiceSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyboardSeries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KeyboardSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebCamSeries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WebCamSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiceFeature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MiceFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebCamFeature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WebCamFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertifiedCompatibility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CertifiedCompatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandPreference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HandPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HandSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedScrollType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AdvancedScrollType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connectivity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Connectivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResolutionFrameRate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResolutionFrameRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorksWith" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WorksWith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyboardLayoutSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KeyboardLayoutSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyboardExtraFeature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KeyboardExtraFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductWebCamSeries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductWebCamSeries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductWebCamFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductWebCamFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductResolution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductResolution_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductWorksWith" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductWorksWith_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductColors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductColors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductMiceSeries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductMiceSeries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductKeyboardSeries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductKeyboardSeries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductMiceFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductMiceFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductCertified" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductCertified_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductHandPref" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductHandPref_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductHandSizes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductHandSizes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductScrollTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductScrollTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductConnectivity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductConnectivity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductPlatform" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductPlatform_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductKeyboardLayouts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductKeyboardLayouts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductKeyboardExtras" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductKeyboardExtras_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_token_key" ON "Cart"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_userId_key" ON "VerificationCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_userId_code_key" ON "VerificationCode"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MiceSeries_name_key" ON "MiceSeries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KeyboardSeries_name_key" ON "KeyboardSeries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebCamSeries_name_key" ON "WebCamSeries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MiceFeature_name_key" ON "MiceFeature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebCamFeature_name_key" ON "WebCamFeature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CertifiedCompatibility_name_key" ON "CertifiedCompatibility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HandPreference_name_key" ON "HandPreference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HandSize_name_key" ON "HandSize"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedScrollType_name_key" ON "AdvancedScrollType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Connectivity_name_key" ON "Connectivity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResolutionFrameRate_name_key" ON "ResolutionFrameRate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorksWith_name_key" ON "WorksWith"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KeyboardLayoutSize_name_key" ON "KeyboardLayoutSize"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KeyboardExtraFeature_name_key" ON "KeyboardExtraFeature"("name");

-- CreateIndex
CREATE INDEX "_ProductWebCamSeries_B_index" ON "_ProductWebCamSeries"("B");

-- CreateIndex
CREATE INDEX "_ProductWebCamFeatures_B_index" ON "_ProductWebCamFeatures"("B");

-- CreateIndex
CREATE INDEX "_ProductResolution_B_index" ON "_ProductResolution"("B");

-- CreateIndex
CREATE INDEX "_ProductWorksWith_B_index" ON "_ProductWorksWith"("B");

-- CreateIndex
CREATE INDEX "_ProductColors_B_index" ON "_ProductColors"("B");

-- CreateIndex
CREATE INDEX "_ProductMiceSeries_B_index" ON "_ProductMiceSeries"("B");

-- CreateIndex
CREATE INDEX "_ProductKeyboardSeries_B_index" ON "_ProductKeyboardSeries"("B");

-- CreateIndex
CREATE INDEX "_ProductMiceFeatures_B_index" ON "_ProductMiceFeatures"("B");

-- CreateIndex
CREATE INDEX "_ProductCertified_B_index" ON "_ProductCertified"("B");

-- CreateIndex
CREATE INDEX "_ProductHandPref_B_index" ON "_ProductHandPref"("B");

-- CreateIndex
CREATE INDEX "_ProductHandSizes_B_index" ON "_ProductHandSizes"("B");

-- CreateIndex
CREATE INDEX "_ProductScrollTypes_B_index" ON "_ProductScrollTypes"("B");

-- CreateIndex
CREATE INDEX "_ProductConnectivity_B_index" ON "_ProductConnectivity"("B");

-- CreateIndex
CREATE INDEX "_ProductPlatform_B_index" ON "_ProductPlatform"("B");

-- CreateIndex
CREATE INDEX "_ProductKeyboardLayouts_B_index" ON "_ProductKeyboardLayouts"("B");

-- CreateIndex
CREATE INDEX "_ProductKeyboardExtras_B_index" ON "_ProductKeyboardExtras"("B");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWebCamSeries" ADD CONSTRAINT "_ProductWebCamSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWebCamSeries" ADD CONSTRAINT "_ProductWebCamSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "WebCamSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWebCamFeatures" ADD CONSTRAINT "_ProductWebCamFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWebCamFeatures" ADD CONSTRAINT "_ProductWebCamFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "WebCamFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductResolution" ADD CONSTRAINT "_ProductResolution_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductResolution" ADD CONSTRAINT "_ProductResolution_B_fkey" FOREIGN KEY ("B") REFERENCES "ResolutionFrameRate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWorksWith" ADD CONSTRAINT "_ProductWorksWith_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductWorksWith" ADD CONSTRAINT "_ProductWorksWith_B_fkey" FOREIGN KEY ("B") REFERENCES "WorksWith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMiceSeries" ADD CONSTRAINT "_ProductMiceSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "MiceSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMiceSeries" ADD CONSTRAINT "_ProductMiceSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardSeries" ADD CONSTRAINT "_ProductKeyboardSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyboardSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardSeries" ADD CONSTRAINT "_ProductKeyboardSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMiceFeatures" ADD CONSTRAINT "_ProductMiceFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "MiceFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMiceFeatures" ADD CONSTRAINT "_ProductMiceFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCertified" ADD CONSTRAINT "_ProductCertified_A_fkey" FOREIGN KEY ("A") REFERENCES "CertifiedCompatibility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCertified" ADD CONSTRAINT "_ProductCertified_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductHandPref" ADD CONSTRAINT "_ProductHandPref_A_fkey" FOREIGN KEY ("A") REFERENCES "HandPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductHandPref" ADD CONSTRAINT "_ProductHandPref_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductHandSizes" ADD CONSTRAINT "_ProductHandSizes_A_fkey" FOREIGN KEY ("A") REFERENCES "HandSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductHandSizes" ADD CONSTRAINT "_ProductHandSizes_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductScrollTypes" ADD CONSTRAINT "_ProductScrollTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvancedScrollType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductScrollTypes" ADD CONSTRAINT "_ProductScrollTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductConnectivity" ADD CONSTRAINT "_ProductConnectivity_A_fkey" FOREIGN KEY ("A") REFERENCES "Connectivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductConnectivity" ADD CONSTRAINT "_ProductConnectivity_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductPlatform" ADD CONSTRAINT "_ProductPlatform_A_fkey" FOREIGN KEY ("A") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductPlatform" ADD CONSTRAINT "_ProductPlatform_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardLayouts" ADD CONSTRAINT "_ProductKeyboardLayouts_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyboardLayoutSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardLayouts" ADD CONSTRAINT "_ProductKeyboardLayouts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardExtras" ADD CONSTRAINT "_ProductKeyboardExtras_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyboardExtraFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductKeyboardExtras" ADD CONSTRAINT "_ProductKeyboardExtras_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
