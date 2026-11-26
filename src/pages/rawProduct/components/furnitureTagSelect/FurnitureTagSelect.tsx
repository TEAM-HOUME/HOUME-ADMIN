import { useState } from 'react';

import * as ui from '@styles/adminUi.css';

import { useFurnitureTagsByTypeQuery } from '../../apis/queries/useFurnitureTagsByTypeQuery';
import * as shared from '../../rawProduct.css';
import {
  formatFurnitureTagLabel,
  type SelectedFurnitureTag,
} from '../../utils/rawProductForm';
import FurnitureTypeSelect from '../furnitureTypeSelect/FurnitureTypeSelect';

interface FurnitureTagSelectProps {
  /** 이미 고른 furniture_tag. 드롭다운에서 비활성으로 보인다 */
  disabledIds?: number[];
  /** 처음 열 때 고를 가구 타입 (매핑 수정 대상의 타입) */
  initialFurnitureTypeId?: number | null;
  onSelect: (tag: SelectedFurnitureTag) => void;
}

/**
 * 가구 타입을 고르고, 그 타입에 연결된 furniture_tag를 고른다.
 * (SSR은 자동완성 입력칸에 쳐서 고르는 방식이었다)
 */
function FurnitureTagSelect({
  disabledIds = [],
  initialFurnitureTypeId = null,
  onSelect,
}: FurnitureTagSelectProps) {
  const [furnitureTypeId, setFurnitureTypeId] = useState<number | null>(
    initialFurnitureTypeId
  );
  const { data: furnitureTags, isFetching } =
    useFurnitureTagsByTypeQuery(furnitureTypeId);

  const select = (furnitureTagIdValue: string) => {
    const tag = furnitureTags?.find(
      (item) => item.furnitureTagId === Number(furnitureTagIdValue)
    );
    if (tag?.furnitureTagId === undefined) return;
    onSelect({ ...tag, furnitureTagId: tag.furnitureTagId });
  };

  const tagPlaceholder = (() => {
    if (furnitureTypeId === null) return '가구 타입을 먼저 선택하세요';
    if (isFetching) return 'Furniture Tag를 불러오는 중...';
    if (!furnitureTags || furnitureTags.length === 0) {
      return '이 가구 타입에 연결된 furniture_tag가 없습니다';
    }
    return 'Furniture Tag 선택...';
  })();

  return (
    <div className={shared.pickerRow}>
      <FurnitureTypeSelect
        label="Furniture Tag용 가구 타입"
        value={furnitureTypeId}
        onChange={setFurnitureTypeId}
      />
      <label className={ui.field}>
        Furniture Tag
        <select
          className={ui.input}
          value=""
          onChange={(e) => select(e.target.value)}
          disabled={!furnitureTags || furnitureTags.length === 0}
        >
          <option value="">{tagPlaceholder}</option>
          {furnitureTags?.map((tag) => (
            <option
              key={tag.furnitureTagId}
              value={tag.furnitureTagId}
              disabled={
                tag.furnitureTagId !== undefined &&
                disabledIds.includes(tag.furnitureTagId)
              }
            >
              {formatFurnitureTagLabel(tag)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FurnitureTagSelect;
