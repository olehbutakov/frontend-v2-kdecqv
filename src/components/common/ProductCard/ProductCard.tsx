import { CustomButton } from '../CustomButton/CustomButton';
import './ProductCard.css';
import { useI18n } from '../../../i18n/I18nContext';
import { LogoLoader } from '../LogoLoader/LogoLoader';

interface ProductCardProps {
  id: number;
  type: string;
  name: string;
  rate: string;
  selectHandler?: (id: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ProductCard = ({
  id,
  type,
  name,
  rate,
  selectHandler,
  disabled,
  isLoading,
}: ProductCardProps) => {
  const { t } = useI18n();

  return (
    <div className="product-card">
      <div className="product-info">
        <div className="product-type">{type}</div>
        <div className="product-name">{name}</div>
        <div className="product-rate">{rate}</div>
      </div>
      <div className="product-actions">
        <CustomButton
          onClick={selectHandler ? () => selectHandler(id) : undefined}
          disabled={disabled}
        >
          {isLoading ? (
            <span className="button-loader">
              <LogoLoader />
            </span>
          ) : (
            t('product.card.button.text')
          )}
        </CustomButton>
      </div>
    </div>
  );
};
