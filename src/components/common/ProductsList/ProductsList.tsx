import { useI18n } from '../../../i18n/I18nContext';
import type { TranslationKey } from '../../../i18n/types';
import type { Product } from '../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductsList.css';

interface ProductsListProps {
  products: Product[];
  productSelectHandler?: (id: number) => void;
  loadingProductId?: number | null;
}
export const ProductsList = ({
  products,
  productSelectHandler,
  loadingProductId,
}: ProductsListProps) => {
  const { t, formatNumber } = useI18n();

  const bestProductsIds = [...products]
    .sort((a, b) => a.bestRate - b.bestRate)
    .slice(0, 1)
    .map((p) => p.id);

  const sortedProducts = [...products].sort((a, b) => {
    const aBest = bestProductsIds.includes(a.id) ? 1 : 0;
    const bBest = bestProductsIds.includes(b.id) ? 1 : 0;
    return bBest - aBest;
  });

  return (
    <div className="products-list">
      {sortedProducts.map((prod) => {
        return (
          <ProductCard
            key={prod.id}
            id={prod.id}
            type={
              bestProductsIds.includes(prod.id)
                ? t('product.card.type.best', {
                    type: t(
                      `product.card.type.${prod.type.toLowerCase()}` as TranslationKey
                    ).toLowerCase(),
                  })
                : t(
                    `product.card.type.${prod.type.toLowerCase()}` as TranslationKey
                  )
            }
            name={prod.name}
            /* We do prod.bestRate / 100 because formatNumber expects a fraction and API returns whole percentage.
             * This should be safe for our use case
             */
            rate={formatNumber(prod.bestRate / 100, {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
            selectHandler={productSelectHandler}
            isLoading={loadingProductId === prod.id}
            disabled={loadingProductId !== null}
          />
        );
      })}
    </div>
  );
};
