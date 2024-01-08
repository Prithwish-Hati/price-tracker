import PriceInfoCard from "@/components/PriceInfoCard";
import { getProductById } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const product: Product = await getProductById(params.id);
  if (!product) redirect("/");
  console.log(product.reviewsCount);

  return (
    <div className="flex flex-col gap-16 flex-wrap px-6 md:px-20 py-24">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="flex-grow xl:max-w-[50%] max-w-full py-16 border border-[#CDDBFF] rounded-[17px]">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF0F0] rounded-10">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />

                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount || "100"}
                </p>
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-10 py-6 border-y border-y-[#E4E4E4]">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>

              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#FBF3EA] rounded-[27px]">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "25"}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-white-200 rounded-[27px]">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount || "30"} Reviews
                  </p>
                </div>
              </div>

              <p className=" text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93% </span>{" "}
                of buyers have recommended this product.
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
              />
            </div>
          </div>

          Modal
        </div>
      </div>

      <div className="flex flex-col gap-16 border-2 border-red-500">
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image src="/assets/icons/bag.svg" alt="check" width={22} height={22} />
          <Link href="/" className="text-base text-white">Buy Now</Link>
        </button>
      </div>
    </div>
  );
};

export default ProductPage;